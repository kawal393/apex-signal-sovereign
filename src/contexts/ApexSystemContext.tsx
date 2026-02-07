import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { advancedAudioPresence } from '@/lib/audioPresenceAdvanced';
import { behaviorEngine } from '@/lib/behaviorEngine';
import { consequenceEngine } from '@/lib/consequenceEngine';

interface ApexSystemContextType {
  // Audio
  isAudioEnabled: boolean;
  enableAudio: () => Promise<void>;
  disableAudio: () => void;
  
  // Behavior
  patienceScore: number;
  curiosityScore: number;
  isReturningVisitor: boolean;
  returnCount: number;
  
  // Consequences
  isDelayed: boolean;
  delayRemaining: number;
  warning: string | null;
  isRestricted: boolean;
  status: 'observer' | 'acknowledged' | 'considered';
  
  // Visitor
  visitorId: string | undefined;
  
  // Actions
  trackNodeFocus: (nodeId: string) => void;
  trackNodeBlur: (nodeId: string) => void;
  playThresholdTone: () => void;
  
  // State
  isInitialized: boolean;
}

const ApexSystemContext = createContext<ApexSystemContextType | null>(null);

export function ApexSystemProvider({ children }: { children: ReactNode }) {
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [patienceScore, setPatienceScore] = useState(0.5);
  const [curiosityScore, setCuriosityScore] = useState(0.5);
  const [isReturningVisitor, setIsReturningVisitor] = useState(false);
  const [returnCount, setReturnCount] = useState(1);
  const [isDelayed, setIsDelayed] = useState(false);
  const [delayRemaining, setDelayRemaining] = useState(0);
  const [warning, setWarning] = useState<string | null>(null);
  const [isRestricted, setIsRestricted] = useState(false);
  const [status, setStatus] = useState<'observer' | 'acknowledged' | 'considered'>('observer');
  const [visitorId, setVisitorId] = useState<string | undefined>(undefined);

  // Initialize engines
  useEffect(() => {
    const init = async () => {
      await behaviorEngine.initialize();
      consequenceEngine.initialize();
      
      // Update state from engines
      const metrics = behaviorEngine.getMetrics();
      setPatienceScore(metrics.patienceScore);
      setCuriosityScore(metrics.curiosityScore);
      setIsReturningVisitor(behaviorEngine.isReturningVisitor());
      setReturnCount(behaviorEngine.getReturnCount());
      
      // Get visitor ID from behavior engine
      const vid = behaviorEngine.getVisitorId?.() || localStorage.getItem('apex_visitor_id') || undefined;
      setVisitorId(vid);
      
      setIsInitialized(true);
    };
    
    init();
    
    // Subscribe to consequence changes
    const unsubscribe = consequenceEngine.subscribe((state) => {
      setIsDelayed(state.isDelayed);
      setWarning(state.warningMessage);
      setIsRestricted(state.accessRestricted);
      setStatus(state.currentStatus);
    });
    
    // Update metrics periodically
    const metricsInterval = setInterval(() => {
      const metrics = behaviorEngine.getMetrics();
      setPatienceScore(metrics.patienceScore);
      setCuriosityScore(metrics.curiosityScore);
    }, 5000);
    
    // Update delay remaining
    const delayInterval = setInterval(() => {
      setDelayRemaining(consequenceEngine.getDelayRemaining());
    }, 100);
    
    return () => {
      unsubscribe();
      clearInterval(metricsInterval);
      clearInterval(delayInterval);
    };
  }, []);

  const enableAudio = useCallback(async () => {
    const success = await advancedAudioPresence.initialize();
    if (success) {
      advancedAudioPresence.fadeIn(4);
      setIsAudioEnabled(true);
    }
  }, []);

  const disableAudio = useCallback(() => {
    advancedAudioPresence.fadeOut(2);
    setIsAudioEnabled(false);
  }, []);

  const trackNodeFocus = useCallback((nodeId: string) => {
    behaviorEngine.trackNodeFocus(nodeId);
  }, []);

  const trackNodeBlur = useCallback((nodeId: string) => {
    behaviorEngine.trackNodeBlur(nodeId);
  }, []);

  const playThresholdTone = useCallback(() => {
    if (isAudioEnabled) {
      advancedAudioPresence.playThresholdTone(0.5);
    }
  }, [isAudioEnabled]);

  // Update audio based on cursor
  useEffect(() => {
    if (!isAudioEnabled) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      advancedAudioPresence.updateCursor(x, y);
    };
    
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const depth = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      advancedAudioPresence.updateScrollDepth(depth);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isAudioEnabled]);

  return (
    <ApexSystemContext.Provider
      value={{
        isAudioEnabled,
        enableAudio,
        disableAudio,
        patienceScore,
        curiosityScore,
        isReturningVisitor,
        returnCount,
        isDelayed,
        delayRemaining,
        warning,
        isRestricted,
        status,
        visitorId,
        trackNodeFocus,
        trackNodeBlur,
        playThresholdTone,
        isInitialized,
      }}
    >
      {children}
    </ApexSystemContext.Provider>
  );
}

export function useApexSystem() {
  const context = useContext(ApexSystemContext);
  if (!context) {
    throw new Error('useApexSystem must be used within ApexSystemProvider');
  }
  return context;
}
