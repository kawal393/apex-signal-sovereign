import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Rate limiting: max 20 requests per minute per IP (classifier is lightweight)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 20;
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute

function checkRateLimit(identifier: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX - entry.count };
}

// Access Level Thresholds
const THRESHOLDS = {
  ACKNOWLEDGED: {
    patience_score: 0.6,
    curiosity_score: 0.5,
    total_time_seconds: 180, // 3 minutes
    visit_count: 2,
  },
  INNER_CIRCLE: {
    patience_score: 0.8,
    curiosity_score: 0.7,
    total_time_seconds: 600, // 10 minutes
    visit_count: 5,
    nodes_viewed_min: 3,
  },
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Rate limiting check
  const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                   req.headers.get('cf-connecting-ip') || 
                   'unknown';
  
  const rateCheck = checkRateLimit(clientIP);
  if (!rateCheck.allowed) {
    console.warn(`Rate limit exceeded for IP: ${clientIP}`);
    return new Response(
      JSON.stringify({ error: 'Rate limit exceeded. Retry in 60 seconds.' }),
      { 
        status: 429, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'X-RateLimit-Remaining': '0',
          'Retry-After': '60'
        } 
      }
    );
  }

  const startTime = Date.now();

  try {
    const body = await req.json();
    const { visitorId, behavioralData } = body;

    // Input validation
    if (!visitorId || typeof visitorId !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Visitor ID required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(visitorId)) {
      return new Response(
        JSON.stringify({ error: 'Invalid visitor ID format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch current visitor profile
    const { data: visitor, error: fetchError } = await supabase
      .from('visitor_profiles')
      .select('*')
      .eq('id', visitorId)
      .single();

    if (fetchError || !visitor) {
      console.error('Visitor not found:', visitorId);
      return new Response(
        JSON.stringify({ error: 'Visitor not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const currentLevel = visitor.access_level;
    let newLevel = currentLevel;
    let levelChanged = false;
    let reason = '';

    // Calculate eligibility for ACKNOWLEDGED
    if (currentLevel === 'observer') {
      const meetsAcknowledged = 
        visitor.patience_score >= THRESHOLDS.ACKNOWLEDGED.patience_score &&
        visitor.curiosity_score >= THRESHOLDS.ACKNOWLEDGED.curiosity_score &&
        visitor.total_time_seconds >= THRESHOLDS.ACKNOWLEDGED.total_time_seconds &&
        visitor.visit_count >= THRESHOLDS.ACKNOWLEDGED.visit_count;

      if (meetsAcknowledged) {
        newLevel = 'acknowledged';
        levelChanged = true;
        reason = `Thresholds met: patience=${visitor.patience_score.toFixed(2)}, curiosity=${visitor.curiosity_score.toFixed(2)}, time=${visitor.total_time_seconds}s, visits=${visitor.visit_count}`;
      }
    }

    // Calculate eligibility for INNER_CIRCLE
    if (currentLevel === 'acknowledged') {
      const nodesViewed = visitor.nodes_viewed?.length || 0;
      const meetsInnerCircle = 
        visitor.patience_score >= THRESHOLDS.INNER_CIRCLE.patience_score &&
        visitor.curiosity_score >= THRESHOLDS.INNER_CIRCLE.curiosity_score &&
        visitor.total_time_seconds >= THRESHOLDS.INNER_CIRCLE.total_time_seconds &&
        visitor.visit_count >= THRESHOLDS.INNER_CIRCLE.visit_count &&
        nodesViewed >= THRESHOLDS.INNER_CIRCLE.nodes_viewed_min;

      if (meetsInnerCircle) {
        newLevel = 'inner_circle';
        levelChanged = true;
        reason = `Inner Circle thresholds met: patience=${visitor.patience_score.toFixed(2)}, curiosity=${visitor.curiosity_score.toFixed(2)}, nodes=${nodesViewed}`;
      }
    }

    // Update visitor profile if level changed
    if (levelChanged) {
      const { error: updateError } = await supabase
        .from('visitor_profiles')
        .update({ 
          access_level: newLevel,
          updated_at: new Date().toISOString(),
        })
        .eq('id', visitorId);

      if (updateError) {
        console.error('Failed to update visitor level:', updateError);
      }

      console.log(`Visitor ${visitorId} promoted: ${currentLevel} -> ${newLevel}`);
    }

    const processingTime = Date.now() - startTime;

    // Log the classification event
    await supabase.from('ai_intelligence_logs').insert({
      log_type: 'visitor_classification',
      trigger_source: 'behavioral_threshold',
      visitor_id: visitorId,
      input_data: {
        patience_score: visitor.patience_score,
        curiosity_score: visitor.curiosity_score,
        total_time_seconds: visitor.total_time_seconds,
        visit_count: visitor.visit_count,
        nodes_viewed: visitor.nodes_viewed,
      },
      output_data: {
        previous_level: currentLevel,
        new_level: newLevel,
        level_changed: levelChanged,
        reason,
      },
      processing_time_ms: processingTime,
    });

    return new Response(
      JSON.stringify({
        success: true,
        previousLevel: currentLevel,
        currentLevel: newLevel,
        levelChanged,
        reason: levelChanged ? reason : 'No threshold crossed',
        thresholds: THRESHOLDS,
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'X-RateLimit-Remaining': String(rateCheck.remaining)
        } 
      }
    );

  } catch (error) {
    console.error('Classifier error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
