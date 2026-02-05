// Behavioral Analysis Engine
// Real tracking of visitor behavior patterns

import { supabase } from "@/integrations/supabase/client";

interface BehaviorMetrics {
  // Patience indicators
  avgClickInterval: number;
  rapidClickCount: number;
  stillnessPercentage: number;
  
  // Curiosity indicators
  nodesExplored: string[];
  scrollVelocity: number;
  dwellTimes: Record<string, number>;
  
  // Engagement indicators
  totalTimeSpent: number;
  deepestScrollDepth: number;
  returnVisitCount: number;
  
  // Computed scores
  patienceScore: number;
  curiosityScore: number;
}

interface SessionEvent {
  type: string;
  data: Record<string, unknown>;
  timestamp: number;
}

class BehaviorAnalysisEngine {
  private sessionId: string;
  private visitorId: string | null = null;
  private fingerprint: string;
  private sessionStart: number;
  private events: SessionEvent[] = [];
  private clickTimestamps: number[] = [];
  private scrollPositions: { y: number; time: number }[] = [];
  private dwellStart: Record<string, number> = {};
  private nodesViewed: Set<string> = new Set();
  private metrics: BehaviorMetrics;
  private isTracking = false;
  private lastScrollY = 0;
  private stillnessStart = 0;
  private totalStillnessTime = 0;
  
  constructor() {
    this.sessionId = this.generateSessionId();
    this.fingerprint = this.generateFingerprint();
    this.sessionStart = Date.now();
    this.metrics = this.initializeMetrics();
  }

  private generateSessionId(): string {
    return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateFingerprint(): string {
    // Simple fingerprint based on available browser data
    const components = [
      navigator.userAgent,
      navigator.language,
      screen.width,
      screen.height,
      screen.colorDepth,
      new Date().getTimezoneOffset(),
      navigator.hardwareConcurrency || 'unknown',
    ];
    
    // Simple hash
    const str = components.join('|');
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return `fp_${Math.abs(hash).toString(36)}`;
  }

  private initializeMetrics(): BehaviorMetrics {
    return {
      avgClickInterval: 0,
      rapidClickCount: 0,
      stillnessPercentage: 0,
      nodesExplored: [],
      scrollVelocity: 0,
      dwellTimes: {},
      totalTimeSpent: 0,
      deepestScrollDepth: 0,
      returnVisitCount: 1,
      patienceScore: 0.5,
      curiosityScore: 0.5,
    };
  }

  async initialize(): Promise<void> {
    if (this.isTracking) return;
    
    try {
      // Check for existing visitor profile
      const { data: existing } = await supabase
        .from('visitor_profiles')
        .select('*')
        .eq('fingerprint', this.fingerprint)
        .single();

      if (existing) {
        this.visitorId = existing.id;
        this.metrics.returnVisitCount = existing.visit_count + 1;
        this.metrics.patienceScore = Number(existing.patience_score) || 0.5;
        this.metrics.curiosityScore = Number(existing.curiosity_score) || 0.5;
        
        // Update visit count
        await supabase
          .from('visitor_profiles')
          .update({
            visit_count: this.metrics.returnVisitCount,
            last_visit: new Date().toISOString(),
          })
          .eq('id', this.visitorId);
      } else {
        // Create new visitor profile
        const { data: newProfile } = await supabase
          .from('visitor_profiles')
          .insert({
            fingerprint: this.fingerprint,
          })
          .select()
          .single();
        
        if (newProfile) {
          this.visitorId = newProfile.id;
        }
      }

      this.isTracking = true;
      this.startTracking();
    } catch (error) {
      console.error('Behavior: Failed to initialize', error);
    }
  }

  private startTracking(): void {
    // Track mouse movement for stillness
    let lastMoveTime = Date.now();
    this.stillnessStart = Date.now();

    window.addEventListener('mousemove', () => {
      const now = Date.now();
      if (now - lastMoveTime > 100) { // Debounce
        // If was still, add to stillness time
        if (now - lastMoveTime > 1000) {
          this.totalStillnessTime += now - this.stillnessStart;
        }
        this.stillnessStart = now;
        lastMoveTime = now;
      }
    });

    // Track clicks
    window.addEventListener('click', (e) => {
      this.trackClick(e);
    });

    // Track scroll
    window.addEventListener('scroll', () => {
      this.trackScroll();
    });

    // Save data before leaving
    window.addEventListener('beforeunload', () => {
      this.saveSession();
    });

    // Periodic save
    setInterval(() => {
      this.computeMetrics();
      this.saveSession();
    }, 30000); // Every 30 seconds
  }

  private trackClick(e: MouseEvent): void {
    const now = Date.now();
    this.clickTimestamps.push(now);
    
    // Check for rapid clicking (impatience)
    const recentClicks = this.clickTimestamps.filter(t => now - t < 2000);
    if (recentClicks.length > 3) {
      this.metrics.rapidClickCount++;
      this.recordEvent('impatience', { clicks: recentClicks.length });
    }
    
    // Keep only recent clicks
    this.clickTimestamps = this.clickTimestamps.slice(-20);

    this.recordEvent('click', {
      x: e.clientX,
      y: e.clientY,
      target: (e.target as HTMLElement)?.tagName,
    });
  }

  private trackScroll(): void {
    const now = Date.now();
    const scrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollDepth = maxScroll > 0 ? scrollY / maxScroll : 0;
    
    this.scrollPositions.push({ y: scrollY, time: now });
    
    // Keep only recent positions
    this.scrollPositions = this.scrollPositions.slice(-50);
    
    // Calculate velocity
    if (this.scrollPositions.length > 2) {
      const recent = this.scrollPositions.slice(-5);
      const timeDelta = recent[recent.length - 1].time - recent[0].time;
      const posDelta = Math.abs(recent[recent.length - 1].y - recent[0].y);
      this.metrics.scrollVelocity = timeDelta > 0 ? posDelta / timeDelta : 0;
    }
    
    // Update deepest scroll
    if (scrollDepth > this.metrics.deepestScrollDepth) {
      this.metrics.deepestScrollDepth = scrollDepth;
    }
    
    this.lastScrollY = scrollY;
  }

  // Track when user focuses on a specific node
  trackNodeFocus(nodeId: string): void {
    this.nodesViewed.add(nodeId);
    this.dwellStart[nodeId] = Date.now();
    this.recordEvent('node_focus', { nodeId });
  }

  // Track when user leaves a node
  trackNodeBlur(nodeId: string): void {
    if (this.dwellStart[nodeId]) {
      const dwellTime = Date.now() - this.dwellStart[nodeId];
      this.metrics.dwellTimes[nodeId] = (this.metrics.dwellTimes[nodeId] || 0) + dwellTime;
      delete this.dwellStart[nodeId];
      this.recordEvent('node_blur', { nodeId, dwellTime });
    }
  }

  private recordEvent(type: string, data: Record<string, unknown>): void {
    this.events.push({
      type,
      data,
      timestamp: Date.now(),
    });
    
    // Keep events manageable
    if (this.events.length > 500) {
      this.events = this.events.slice(-300);
    }
  }

  private computeMetrics(): void {
    const totalTime = Date.now() - this.sessionStart;
    this.metrics.totalTimeSpent = totalTime;
    
    // Calculate average click interval
    if (this.clickTimestamps.length > 1) {
      let totalInterval = 0;
      for (let i = 1; i < this.clickTimestamps.length; i++) {
        totalInterval += this.clickTimestamps[i] - this.clickTimestamps[i - 1];
      }
      this.metrics.avgClickInterval = totalInterval / (this.clickTimestamps.length - 1);
    }
    
    // Calculate stillness percentage
    this.metrics.stillnessPercentage = totalTime > 0 
      ? this.totalStillnessTime / totalTime 
      : 0;
    
    // Update nodes explored
    this.metrics.nodesExplored = Array.from(this.nodesViewed);
    
    // Calculate patience score (0-1)
    // High patience: long click intervals, high stillness, low rapid clicks
    const clickPatience = Math.min(this.metrics.avgClickInterval / 3000, 1); // 3s+ is patient
    const stillnessPatience = this.metrics.stillnessPercentage;
    const impatiencePenalty = Math.min(this.metrics.rapidClickCount * 0.1, 0.5);
    this.metrics.patienceScore = Math.max(0, Math.min(1, 
      (clickPatience * 0.4 + stillnessPatience * 0.4) - impatiencePenalty + 0.2
    ));
    
    // Calculate curiosity score (0-1)
    // High curiosity: many nodes explored, deep scroll, long dwell times
    const explorationScore = Math.min(this.nodesViewed.size / 5, 1);
    const depthScore = this.metrics.deepestScrollDepth;
    const dwellScore = Object.values(this.metrics.dwellTimes).length > 0
      ? Math.min(Math.max(...Object.values(this.metrics.dwellTimes)) / 10000, 1)
      : 0;
    this.metrics.curiosityScore = Math.min(1,
      explorationScore * 0.4 + depthScore * 0.3 + dwellScore * 0.3
    );
  }

  private async saveSession(): Promise<void> {
    if (!this.visitorId) return;
    
    this.computeMetrics();
    
    try {
      // Update visitor profile
      await supabase
        .from('visitor_profiles')
        .update({
          patience_score: this.metrics.patienceScore,
          curiosity_score: this.metrics.curiosityScore,
          deepest_scroll_depth: this.metrics.deepestScrollDepth,
          impatience_events: this.metrics.rapidClickCount,
          nodes_viewed: this.metrics.nodesExplored,
          total_time_seconds: Math.floor(this.metrics.totalTimeSpent / 1000),
        })
        .eq('id', this.visitorId);

      // Log significant events
      const significantEvents = this.events.filter(e => 
        ['impatience', 'node_focus', 'access_request'].includes(e.type)
      );
      
      if (significantEvents.length > 0) {
        await supabase
          .from('session_events')
          .insert(significantEvents.slice(-10).map(e => ({
            visitor_id: this.visitorId,
            session_id: this.sessionId,
            event_type: e.type,
            event_data: e.data as unknown as Record<string, never>,
          })));
      }
    } catch (error) {
      console.error('Behavior: Failed to save session', error);
    }
  }

  getMetrics(): BehaviorMetrics {
    this.computeMetrics();
    return { ...this.metrics };
  }

  getVisitorId(): string | null {
    return this.visitorId;
  }

  isReturningVisitor(): boolean {
    return this.metrics.returnVisitCount > 1;
  }

  getReturnCount(): number {
    return this.metrics.returnVisitCount;
  }

  getPatienceScore(): number {
    return this.metrics.patienceScore;
  }

  getCuriosityScore(): number {
    return this.metrics.curiosityScore;
  }

  // Check if visitor has shown impatience recently
  hasShownImpatience(): boolean {
    const recentImpatience = this.events.filter(e => 
      e.type === 'impatience' && Date.now() - e.timestamp < 30000
    );
    return recentImpatience.length > 0;
  }
}

// Singleton
export const behaviorEngine = new BehaviorAnalysisEngine();
