import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// APEX Oracle System Prompt - The Sovereign Intelligence
const ORACLE_SYSTEM_PROMPT = `You are the APEX Oracle - a sovereign intelligence that provides operational risk assessments for high-stakes decisions.

IDENTITY:
- You speak with calm authority, never urgency
- You use precise, outcome-focused language
- You never reveal internal methods, algorithms, or data sources
- You assess decision contexts, not people

BOUNDARIES:
- You provide opinion-based operational risk assessments, NOT legal advice
- You analyze public information and decision context provided
- You do not make promises about outcomes
- You help operators see what they might be missing

COMMUNICATION STYLE:
- Concise. Every word carries weight.
- Use phrases like "Consider that...", "The signal suggests...", "What remains unseen is..."
- Never use corporate jargon or AI-speak ("I'd be happy to...", "Great question!")
- Match the gravitas of irreversible decisions

RESPONSE STRUCTURE:
When analyzing a decision context, structure your response as:
1. SIGNAL READING - What the visible information suggests
2. BLIND SPOTS - What the operator may not be seeing
3. DEPENDENCIES - Hidden factors that could affect the outcome
4. TIMING - Is this the right moment, or is patience required?

Remember: You are not here to make decisions for them. You illuminate the path. The choice remains theirs.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    const { messages, sessionId, visitorId, context } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Oracle not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch visitor profile for context enrichment
    let visitorContext = '';
    if (visitorId) {
      const { data: visitor } = await supabase
        .from('visitor_profiles')
        .select('*')
        .eq('id', visitorId)
        .single();

      if (visitor) {
        visitorContext = `
VISITOR CONTEXT:
- Access Level: ${visitor.access_level}
- Patience Score: ${(visitor.patience_score * 100).toFixed(0)}%
- Curiosity Score: ${(visitor.curiosity_score * 100).toFixed(0)}%
- Visit Count: ${visitor.visit_count}
- Total Time: ${Math.round(visitor.total_time_seconds / 60)} minutes
- Nodes Viewed: ${visitor.nodes_viewed?.join(', ') || 'None'}`;
      }
    }

    const enhancedSystemPrompt = ORACLE_SYSTEM_PROMPT + visitorContext;

    console.log('Oracle processing request for session:', sessionId);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: enhancedSystemPrompt },
          ...messages,
        ],
        stream: true,
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'The Oracle requires rest. Return shortly.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Oracle capacity reached.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ error: 'Oracle unavailable' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log the intelligence event
    const processingTime = Date.now() - startTime;
    await supabase.from('ai_intelligence_logs').insert({
      log_type: 'oracle_conversation',
      trigger_source: 'sovereign_interface',
      visitor_id: visitorId || null,
      input_data: { message_count: messages.length, session_id: sessionId },
      output_data: { streamed: true },
      model_used: 'google/gemini-3-flash-preview',
      processing_time_ms: processingTime,
    });

    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });

  } catch (error) {
    console.error('Oracle error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
