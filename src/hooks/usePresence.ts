import { useState, useEffect } from 'react';

interface PresenceData {
  city: string;
  time: string;
  timeOfDay: 'night' | 'dawn' | 'day' | 'dusk';
  isReturning: boolean;
  visitCount: number;
}

const STORAGE_KEY = 'apex_presence';

export function usePresence(): PresenceData {
  const [presence, setPresence] = useState<PresenceData>({
    city: 'Unknown',
    time: '',
    timeOfDay: 'night',
    isReturning: false,
    visitCount: 1,
  });

  useEffect(() => {
    // Get timezone-based city approximation
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const cityFromTimezone = timezone.split('/').pop()?.replace(/_/g, ' ') || 'Unknown';
    
    // Get local time
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    
    // Determine time of day for atmosphere
    let timeOfDay: PresenceData['timeOfDay'] = 'day';
    if (hours >= 22 || hours < 5) timeOfDay = 'night';
    else if (hours >= 5 && hours < 7) timeOfDay = 'dawn';
    else if (hours >= 17 && hours < 22) timeOfDay = 'dusk';
    
    // Check for returning visitor
    let isReturning = false;
    let visitCount = 1;
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        isReturning = true;
        visitCount = (data.visitCount || 0) + 1;
      }
      
      // Store visit
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        visitCount,
        lastVisit: Date.now(),
      }));
    } catch {
      // localStorage unavailable
    }
    
    setPresence({
      city: cityFromTimezone,
      time: timeString,
      timeOfDay,
      isReturning,
      visitCount,
    });
  }, []);

  return presence;
}
