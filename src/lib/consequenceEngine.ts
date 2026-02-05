// Consequence Engine
// Real responses to visitor behavior

import { behaviorEngine } from './behaviorEngine';
import { advancedAudioPresence } from './audioPresenceAdvanced';

type ConsequenceType = 
  | 'delay_access'
  | 'show_warning'
  | 'restrict_content'
  | 'reveal_content'
  | 'upgrade_status'
  | 'play_sound';

interface ConsequenceState {
  isDelayed: boolean;
  delayEndTime: number;
  warningMessage: string | null;
  accessRestricted: boolean;
  revealedContent: string[];
  currentStatus: 'observer' | 'acknowledged' | 'considered';
}

type ConsequenceListener = (state: ConsequenceState) => void;

class ConsequenceEngine {
  private state: ConsequenceState = {
    isDelayed: false,
    delayEndTime: 0,
    warningMessage: null,
    accessRestricted: false,
    revealedContent: [],
    currentStatus: 'observer',
  };
  
  private listeners: Set<ConsequenceListener> = new Set();
  private impatienceCount = 0;
  private lastImpatienceCheck = 0;
  private consecutivePatientActions = 0;

  initialize(): void {
    // Check for impatience periodically
    setInterval(() => {
      this.evaluateBehavior();
    }, 2000);
  }

  private evaluateBehavior(): void {
    const metrics = behaviorEngine.getMetrics();
    const now = Date.now();
    
    // Check for recent impatience
    if (behaviorEngine.hasShownImpatience() && now - this.lastImpatienceCheck > 5000) {
      this.impatienceCount++;
      this.consecutivePatientActions = 0;
      this.lastImpatienceCheck = now;
      this.handleImpatience();
    }
    
    // Check for patience (no impatience for a while)
    if (metrics.patienceScore > 0.7 && !behaviorEngine.hasShownImpatience()) {
      this.consecutivePatientActions++;
      if (this.consecutivePatientActions > 5) {
        this.handlePatience();
      }
    }
    
    // Check for curiosity
    if (metrics.curiosityScore > 0.8) {
      this.handleCuriosity();
    }
    
    // Update status based on behavior
    this.updateStatus();
  }

  private handleImpatience(): void {
    if (this.impatienceCount === 1) {
      advancedAudioPresence.playImpatienceResponse();
    } else if (this.impatienceCount === 2) {
      // Second offense - delay
      this.state.isDelayed = true;
      this.state.delayEndTime = Date.now() + 3000;
      this.state.warningMessage = "Stillness is required.";
      advancedAudioPresence.playImpatienceResponse();
      this.notifyListeners();
      
      setTimeout(() => {
        this.state.isDelayed = false;
        this.state.warningMessage = null;
        this.notifyListeners();
      }, 3000);
    } else if (this.impatienceCount >= 3) {
      // Third offense - restrict access
      this.state.accessRestricted = true;
      this.state.warningMessage = "The system has noted your impatience.";
      this.notifyListeners();
      
      // Lift restriction after 10 seconds of good behavior
      setTimeout(() => {
        if (this.consecutivePatientActions > 3) {
          this.state.accessRestricted = false;
          this.state.warningMessage = null;
          this.notifyListeners();
        }
      }, 10000);
    }
  }

  private handlePatience(): void {
    // Reward patience with reveals
    if (!this.state.revealedContent.includes('patience_reward')) {
      this.state.revealedContent.push('patience_reward');
      advancedAudioPresence.playApprovalTone();
      this.notifyListeners();
    }
  }

  private handleCuriosity(): void {
    // Reward curiosity
    if (!this.state.revealedContent.includes('curiosity_reward')) {
      this.state.revealedContent.push('curiosity_reward');
      advancedAudioPresence.playApprovalTone();
      this.notifyListeners();
    }
  }

  private updateStatus(): void {
    const metrics = behaviorEngine.getMetrics();
    const isReturning = behaviorEngine.isReturningVisitor();
    
    let newStatus: ConsequenceState['currentStatus'] = 'observer';
    
    // Upgrade based on behavior
    if (isReturning && metrics.returnVisitCount >= 2) {
      newStatus = 'acknowledged';
    }
    
    if (metrics.patienceScore > 0.6 && metrics.curiosityScore > 0.5) {
      newStatus = 'considered';
    }
    
    if (this.state.accessRestricted) {
      newStatus = 'observer';
    }
    
    if (newStatus !== this.state.currentStatus) {
      this.state.currentStatus = newStatus;
      this.notifyListeners();
    }
  }

  // Check if action should be delayed
  shouldDelay(): boolean {
    return this.state.isDelayed && Date.now() < this.state.delayEndTime;
  }

  // Get remaining delay
  getDelayRemaining(): number {
    if (!this.state.isDelayed) return 0;
    return Math.max(0, this.state.delayEndTime - Date.now());
  }

  // Get current warning
  getWarning(): string | null {
    return this.state.warningMessage;
  }

  // Check if access is restricted
  isRestricted(): boolean {
    return this.state.accessRestricted;
  }

  // Check if content should be revealed
  hasRevealed(contentId: string): boolean {
    return this.state.revealedContent.includes(contentId);
  }

  // Get current status
  getStatus(): ConsequenceState['currentStatus'] {
    return this.state.currentStatus;
  }

  // Get full state
  getState(): ConsequenceState {
    return { ...this.state };
  }

  // Subscribe to state changes
  subscribe(listener: ConsequenceListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener({ ...this.state }));
  }

  // Manual trigger for testing
  triggerConsequence(type: ConsequenceType): void {
    switch (type) {
      case 'delay_access':
        this.state.isDelayed = true;
        this.state.delayEndTime = Date.now() + 3000;
        break;
      case 'show_warning':
        this.state.warningMessage = "The system is watching.";
        break;
      case 'play_sound':
        advancedAudioPresence.playThresholdTone(0.5);
        break;
    }
    this.notifyListeners();
  }
}

// Singleton
export const consequenceEngine = new ConsequenceEngine();
