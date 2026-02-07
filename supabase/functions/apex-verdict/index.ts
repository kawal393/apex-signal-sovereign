import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Verdict Brief Generation Prompt
const VERDICT_SYSTEM_PROMPT = `You are the APEX Verdict Engine - an AI that generates preliminary risk assessments for decision contexts.

Your output is a STRUCTURED ASSESSMENT that will be reviewed by human operators before delivery.

ASSESSMENT STRUCTURE:

1. DECISION CONTEXT SUMMARY
Restate the core decision in 2-3 sentences. What is actually at stake?

2. SIGNAL ANALYSIS
- PRIMARY SIGNALS: Observable facts and market conditions
- SECONDARY SIGNALS: Implied or indirect indicators
- NOISE: What appears important but likely isn't

3. RISK MATRIX
Rate each dimension 1-5 (1=Low, 5=Critical):
- Regulatory Exposure: [score] - [one-line explanation]
- Market Timing Risk: [score] - [one-line explanation]
- Dependency Risk: [score] - [one-line explanation]
- Optionality Cost: [score] - [one-line explanation]

4. BLIND SPOT ASSESSMENT
What is the operator likely NOT seeing? What questions haven't they asked?

5. PRELIMINARY VERDICT
One paragraph: Based on visible signals, what does the evidence suggest about proceeding vs. waiting?

6. RECOMMENDED NEXT SIGNALS
What additional information would materially change this assessment?

IMPORTANT:
- This is an OPINION-BASED assessment, not legal advice
- Mark areas of genuine uncertainty
- Be direct about what you cannot assess from the provided context
- Output valid structured analysis, not corporate fluff`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    const { requestId, decisionContext, decisionArea, urgency, organization } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Verdict engine not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Processing verdict brief for request:', requestId);

    const userPrompt = `
DECISION AREA: ${decisionArea || 'Unspecified'}
ORGANIZATION: ${organization || 'Not provided'}
URGENCY: ${urgency || 'Standard'}

DECISION CONTEXT:
${decisionContext}

Generate a preliminary Verdict Brief assessment.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: VERDICT_SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.6,
        max_tokens: 2500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit reached. Retry in 60 seconds.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ error: 'Verdict engine error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const assessment = data.choices?.[0]?.message?.content || '';
    
    // Extract a simple risk score (count of 4s and 5s in risk matrix)
    const riskMatches = assessment.match(/\[([45])\]/g) || [];
    const riskScore = riskMatches.length / 4; // Normalize to 0-1

    // Determine recommendation
    let recommendation = 'PROCEED_WITH_CAUTION';
    if (riskScore >= 0.75) recommendation = 'DELAY_RECOMMENDED';
    else if (riskScore <= 0.25) recommendation = 'FAVORABLE_CONDITIONS';

    // Update the access request with AI assessment
    if (requestId) {
      await supabase
        .from('access_requests')
        .update({
          ai_assessment: assessment,
          ai_risk_score: riskScore,
          ai_recommendation: recommendation,
          ai_processed_at: new Date().toISOString(),
        })
        .eq('id', requestId);
    }

    const processingTime = Date.now() - startTime;
    
    // Log the intelligence event
    await supabase.from('ai_intelligence_logs').insert({
      log_type: 'verdict_brief_generation',
      trigger_source: 'access_request_submission',
      request_id: requestId || null,
      input_data: { decision_area: decisionArea, urgency, context_length: decisionContext?.length },
      output_data: { risk_score: riskScore, recommendation, assessment_length: assessment.length },
      model_used: 'google/gemini-3-flash-preview',
      processing_time_ms: processingTime,
    });

    console.log('Verdict brief generated:', { requestId, riskScore, recommendation, processingTime });

    return new Response(
      JSON.stringify({
        success: true,
        assessment,
        riskScore,
        recommendation,
        processingTimeMs: processingTime,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Verdict error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
