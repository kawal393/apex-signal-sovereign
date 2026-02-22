// APEX Scheduler - Proactive Intelligence Engine
// Runs on a schedule to generate insights, re-engage visitors, and analyze thresholds

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-cron-secret',
};

// Rate limiting: max 2 manual invocations per hour to prevent abuse
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 2;
const RATE_LIMIT_WINDOW_MS = 3600000; // 1 hour

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

// Thresholds for tier promotion
const THRESHOLDS = {
  ACKNOWLEDGED: { 
    patience_score: 0.6, 
    curiosity_score: 0.5, 
    total_time_seconds: 180,
    visit_count: 2 
  },
  INNER_CIRCLE: { 
    patience_score: 0.8, 
    curiosity_score: 0.7, 
    total_time_seconds: 600,
    nodes_viewed_min: 3 
  },
};

// Calculate promotion probability for a visitor
function calculatePromotionProbability(profile: any): number {
  if (profile.access_level === 'considered') return 1.0;
  
  const target = profile.access_level === 'observer' 
    ? THRESHOLDS.ACKNOWLEDGED 
    : THRESHOLDS.INNER_CIRCLE;
  
  const patienceProgress = Math.min(1, (profile.patience_score || 0) / target.patience_score);
  const curiosityProgress = Math.min(1, (profile.curiosity_score || 0) / target.curiosity_score);
  const timeProgress = Math.min(1, (profile.total_time_seconds || 0) / target.total_time_seconds);
  const visitProgress = profile.access_level === 'observer' 
    ? Math.min(1, (profile.visit_count || 0) / (target as any).visit_count)
    : 1;
  
  return (patienceProgress * 0.3 + curiosityProgress * 0.3 + timeProgress * 0.25 + visitProgress * 0.15);
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Check for cron secret header (for automated cron jobs)
  const cronSecret = Deno.env.get('CRON_SECRET');
  const providedSecret = req.headers.get('x-cron-secret');
  const isCronJob = cronSecret && providedSecret === cronSecret;

  // If not a cron job, apply rate limiting
  if (!isCronJob) {
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('cf-connecting-ip') || 
                     'unknown';
    
    const rateCheck = checkRateLimit(clientIP);
    if (!rateCheck.allowed) {
      console.warn(`Scheduler rate limit exceeded for IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Scheduler can only be invoked 2 times per hour manually.' }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'X-RateLimit-Remaining': '0',
            'Retry-After': '3600'
          } 
        }
      );
    }
  }

  console.log('[apex-scheduler] Starting scheduled intelligence cycle', isCronJob ? '(cron)' : '(manual)');

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const results = {
      staleVisitorsProcessed: 0,
      thresholdAlertsGenerated: 0,
      promotionProbabilitiesUpdated: 0,
      errors: [] as string[],
    };

    // 1. Find stale "acknowledged" visitors (haven't visited in 7+ days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    
    const { data: staleVisitors, error: staleError } = await supabase
      .from('visitor_profiles')
      .select('*')
      .eq('access_level', 'acknowledged')
      .lt('last_visit', sevenDaysAgo)
      .limit(50);

    if (staleError) {
      console.error('[apex-scheduler] Error fetching stale visitors:', staleError);
      results.errors.push(`Stale visitors query: ${staleError.message}`);
    } else if (staleVisitors && staleVisitors.length > 0) {
      console.log(`[apex-scheduler] Found ${staleVisitors.length} stale acknowledged visitors`);
      
      for (const visitor of staleVisitors) {
        // Check if we already generated an insight for this visitor recently
        const { data: existingInsight } = await supabase
          .from('scheduled_insights')
          .select('id')
          .eq('target_visitor_id', visitor.id)
          .eq('insight_type', 're_engagement')
          .eq('delivered', false)
          .single();

        if (!existingInsight) {
          const nodesViewed = visitor.nodes_viewed || [];
          const content = nodesViewed.length > 0
            ? `The nodes you observed (${nodesViewed.slice(0, 3).join(', ')}) have evolved. New signals await.`
            : 'The infrastructure has shifted since your last presence. New patterns emerge.';

          const { error: insertError } = await supabase
            .from('scheduled_insights')
            .insert({
              insight_type: 're_engagement',
              target_visitor_id: visitor.id,
              content,
              metadata: {
                last_visit: visitor.last_visit,
                patience_score: visitor.patience_score,
                nodes_viewed: nodesViewed,
              },
            });

          if (insertError) {
            results.errors.push(`Re-engagement insert: ${insertError.message}`);
          } else {
            results.staleVisitorsProcessed++;
          }
        }
      }
    }

    // 2. Find visitors approaching promotion thresholds
    const { data: nearThresholdVisitors, error: thresholdError } = await supabase
      .from('visitor_profiles')
      .select('*')
      .in('access_level', ['observer', 'acknowledged'])
      .limit(100);

    if (thresholdError) {
      console.error('[apex-scheduler] Error fetching near-threshold visitors:', thresholdError);
      results.errors.push(`Threshold query: ${thresholdError.message}`);
    } else if (nearThresholdVisitors) {
      for (const visitor of nearThresholdVisitors) {
        const probability = calculatePromotionProbability(visitor);
        
        // Update promotion probability
        const { error: updateError } = await supabase
          .from('visitor_profiles')
          .update({ promotion_probability: probability })
          .eq('id', visitor.id);

        if (updateError) {
          results.errors.push(`Probability update: ${updateError.message}`);
        } else {
          results.promotionProbabilitiesUpdated++;
        }

        // Generate threshold alert if close to promotion (70-95%)
        if (probability >= 0.7 && probability < 0.95) {
          const { data: existingAlert } = await supabase
            .from('scheduled_insights')
            .select('id')
            .eq('target_visitor_id', visitor.id)
            .eq('insight_type', 'threshold_alert')
            .eq('delivered', false)
            .single();

          if (!existingAlert) {
            const nextTier = visitor.access_level === 'observer' ? 'Acknowledged' : 'Inner Circle';
            
            const { error: alertError } = await supabase
              .from('scheduled_insights')
              .insert({
                insight_type: 'threshold_alert',
                target_visitor_id: visitor.id,
                content: `Approaching ${nextTier} threshold. Current probability: ${Math.round(probability * 100)}%`,
                metadata: {
                  current_level: visitor.access_level,
                  target_level: nextTier.toLowerCase().replace(' ', '_'),
                  probability,
                  metrics: {
                    patience: visitor.patience_score,
                    curiosity: visitor.curiosity_score,
                    time: visitor.total_time_seconds,
                  },
                },
              });

            if (alertError) {
              results.errors.push(`Threshold alert: ${alertError.message}`);
            } else {
              results.thresholdAlertsGenerated++;
            }
          }
        }
      }
    }

    // 3. Generate signal digest for Inner Circle members
    const { data: innerCircle, error: icError } = await supabase
      .from('visitor_profiles')
      .select('id')
      .eq('access_level', 'considered')
      .limit(50);

    if (!icError && innerCircle && innerCircle.length > 0) {
      // Get recent node signals
      const { data: recentSignals } = await supabase
        .from('node_signals')
        .select('*')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(10);

      if (recentSignals && recentSignals.length > 0) {
        const signalSummary = recentSignals
          .slice(0, 5)
          .map(s => `${s.node_name}: ${s.signal_type}`)
          .join(' | ');

        for (const member of innerCircle) {
          const { data: existingDigest } = await supabase
            .from('scheduled_insights')
            .select('id')
            .eq('target_visitor_id', member.id)
            .eq('insight_type', 'signal_digest')
            .gte('generated_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
            .single();

          if (!existingDigest) {
            await supabase
              .from('scheduled_insights')
              .insert({
                insight_type: 'signal_digest',
                target_visitor_id: member.id,
                content: `24h Signal Digest: ${signalSummary}`,
                metadata: {
                  signal_count: recentSignals.length,
                  signals: recentSignals.slice(0, 5),
                },
              });
          }
        }
      }
    }

    // Log the intelligence cycle
    await supabase.from('ai_intelligence_logs').insert({
      log_type: 'scheduled_cycle',
      trigger_source: 'apex-scheduler',
      input_data: {
        timestamp: new Date().toISOString(),
        stale_visitors_found: staleVisitors?.length || 0,
        near_threshold_found: nearThresholdVisitors?.length || 0,
        is_cron: isCronJob,
      },
      output_data: results,
    });

    console.log('[apex-scheduler] Cycle complete:', results);

    return new Response(JSON.stringify({
      success: true,
      results,
      timestamp: new Date().toISOString(),
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[apex-scheduler] Fatal error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: (error as Error).message,
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
