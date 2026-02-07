import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseVisitorClassificationOptions {
  visitorId?: string;
  enabled?: boolean;
  onLevelChange?: (newLevel: string, previousLevel: string) => void;
}

export function useVisitorClassification({ 
  visitorId, 
  enabled = true,
  onLevelChange 
}: UseVisitorClassificationOptions) {
  
  const checkClassification = useCallback(async () => {
    if (!visitorId || !enabled) return;

    try {
      const { data, error } = await supabase.functions.invoke('apex-classifier', {
        body: { visitorId },
      });

      if (error) {
        console.error('Classification error:', error);
        return;
      }

      if (data?.levelChanged && onLevelChange) {
        onLevelChange(data.currentLevel, data.previousLevel);
      }

      return data;
    } catch (err) {
      console.error('Failed to check classification:', err);
    }
  }, [visitorId, enabled, onLevelChange]);

  // Check classification on mount and periodically
  useEffect(() => {
    if (!visitorId || !enabled) return;

    // Initial check
    checkClassification();

    // Check every 30 seconds while active
    const interval = setInterval(checkClassification, 30000);

    return () => clearInterval(interval);
  }, [visitorId, enabled, checkClassification]);

  return { checkClassification };
}
