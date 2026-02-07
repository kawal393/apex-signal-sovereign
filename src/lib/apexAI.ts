import { supabase } from '@/integrations/supabase/client';

export interface VerdictBriefRequest {
  requestId?: string;
  decisionContext: string;
  decisionArea: string;
  urgency?: string;
  organization?: string;
}

export interface VerdictBriefResponse {
  success: boolean;
  assessment?: string;
  riskScore?: number;
  recommendation?: 'PROCEED_WITH_CAUTION' | 'DELAY_RECOMMENDED' | 'FAVORABLE_CONDITIONS';
  processingTimeMs?: number;
  error?: string;
}

export async function generateVerdictBrief(request: VerdictBriefRequest): Promise<VerdictBriefResponse> {
  try {
    const { data, error } = await supabase.functions.invoke('apex-verdict', {
      body: request,
    });

    if (error) {
      console.error('Verdict generation error:', error);
      return { success: false, error: error.message };
    }

    return data;
  } catch (err) {
    console.error('Failed to generate verdict brief:', err);
    return { success: false, error: 'Failed to connect to verdict engine' };
  }
}

export async function classifyVisitor(visitorId: string): Promise<{
  success: boolean;
  currentLevel?: string;
  levelChanged?: boolean;
  reason?: string;
  error?: string;
}> {
  try {
    const { data, error } = await supabase.functions.invoke('apex-classifier', {
      body: { visitorId },
    });

    if (error) {
      console.error('Classification error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, ...data };
  } catch (err) {
    console.error('Failed to classify visitor:', err);
    return { success: false, error: 'Failed to connect to classifier' };
  }
}
