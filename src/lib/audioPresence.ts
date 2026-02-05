// WebAudio Generative Presence
// A living audio layer - low drone, responsive tones, cursor-aware presence

class AudioPresenceEngine {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private droneOscillators: OscillatorNode[] = [];
  private droneGains: GainNode[] = [];
  private lfoNodes: OscillatorNode[] = [];
  private isInitialized = false;
  private cursorX = 0.5;
  private cursorY = 0.5;
  private scrollDepth = 0;

  // Base frequencies for the drone - low, felt more than heard
  private readonly DRONE_FREQUENCIES = [55, 82.5, 110, 165]; // A1, E2, A2, E3 - perfect fifths
  private readonly BASE_VOLUME = 0.015; // Very subtle

  async initialize(): Promise<boolean> {
    if (this.isInitialized) return true;

    try {
      this.audioContext = new AudioContext();
      
      // Master gain for overall volume control
      this.masterGain = this.audioContext.createGain();
      this.masterGain.gain.value = 0;
      this.masterGain.connect(this.audioContext.destination);

      // Create drone oscillators
      this.DRONE_FREQUENCIES.forEach((freq, i) => {
        if (!this.audioContext || !this.masterGain) return;

        // Main oscillator
        const osc = this.audioContext.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq;

        // Individual gain for this oscillator
        const gain = this.audioContext.createGain();
        gain.gain.value = this.BASE_VOLUME / (i + 1); // Lower frequencies louder

        // LFO for subtle movement
        const lfo = this.audioContext.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 0.05 + (i * 0.02); // Very slow modulation
        
        const lfoGain = this.audioContext.createGain();
        lfoGain.gain.value = freq * 0.002; // Subtle pitch wobble
        
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        
        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        lfo.start();

        this.droneOscillators.push(osc);
        this.droneGains.push(gain);
        this.lfoNodes.push(lfo);
      });

      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('AudioPresence: Failed to initialize', error);
      return false;
    }
  }

  // Fade in the presence
  fadeIn(duration: number = 3): void {
    if (!this.masterGain || !this.audioContext) return;
    
    this.masterGain.gain.cancelScheduledValues(this.audioContext.currentTime);
    this.masterGain.gain.setValueAtTime(
      this.masterGain.gain.value,
      this.audioContext.currentTime
    );
    this.masterGain.gain.linearRampToValueAtTime(
      1,
      this.audioContext.currentTime + duration
    );
  }

  // Fade out
  fadeOut(duration: number = 2): void {
    if (!this.masterGain || !this.audioContext) return;
    
    this.masterGain.gain.cancelScheduledValues(this.audioContext.currentTime);
    this.masterGain.gain.setValueAtTime(
      this.masterGain.gain.value,
      this.audioContext.currentTime
    );
    this.masterGain.gain.linearRampToValueAtTime(
      0,
      this.audioContext.currentTime + duration
    );
  }

  // Update based on cursor position - subtle frequency modulation
  updateCursor(x: number, y: number): void {
    if (!this.audioContext || !this.isInitialized) return;
    
    this.cursorX = x;
    this.cursorY = y;
    
    // Modulate frequencies based on cursor position
    this.droneOscillators.forEach((osc, i) => {
      const baseFreq = this.DRONE_FREQUENCIES[i];
      // Subtle pitch shift based on cursor (±2%)
      const pitchShift = 1 + (x - 0.5) * 0.02;
      osc.frequency.setTargetAtTime(
        baseFreq * pitchShift,
        this.audioContext!.currentTime,
        0.5
      );
    });

    // Modulate volumes based on vertical position
    this.droneGains.forEach((gain, i) => {
      const baseVol = this.BASE_VOLUME / (i + 1);
      // Louder toward bottom of screen
      const volMod = 0.8 + y * 0.4;
      gain.gain.setTargetAtTime(
        baseVol * volMod,
        this.audioContext!.currentTime,
        0.3
      );
    });
  }

  // Update based on scroll depth - deeper = different harmonic content
  updateScrollDepth(depth: number): void {
    if (!this.audioContext || !this.isInitialized) return;
    
    this.scrollDepth = depth;
    
    // As you go deeper, add more harmonic richness
    this.droneGains.forEach((gain, i) => {
      const baseVol = this.BASE_VOLUME / (i + 1);
      // Higher harmonics become more present as you scroll
      const depthMod = i < 2 ? 1 : 1 + depth * 0.5;
      gain.gain.setTargetAtTime(
        baseVol * depthMod,
        this.audioContext!.currentTime,
        1
      );
    });
  }

  // Trigger a threshold tone - when crossing between sections
  playThresholdTone(intensity: number = 0.5): void {
    if (!this.audioContext || !this.masterGain) return;

    // Create a brief, ethereal tone
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.type = 'sine';
    osc.frequency.value = 440 * (1 + this.scrollDepth * 0.5); // A4, higher as you go deeper
    
    gain.gain.value = 0;
    gain.gain.setTargetAtTime(0.02 * intensity, this.audioContext.currentTime, 0.1);
    gain.gain.setTargetAtTime(0, this.audioContext.currentTime + 0.3, 0.5);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start();
    osc.stop(this.audioContext.currentTime + 2);
  }

  // Trigger impatience response - discordant, uncomfortable
  playImpatienceResponse(): void {
    if (!this.audioContext || !this.masterGain) return;

    // Brief dissonant cluster
    const frequencies = [220, 233, 247]; // Close semitones - uncomfortable
    
    frequencies.forEach((freq, i) => {
      const osc = this.audioContext!.createOscillator();
      const gain = this.audioContext!.createGain();
      
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      gain.gain.value = 0;
      gain.gain.setTargetAtTime(0.008, this.audioContext!.currentTime + i * 0.05, 0.05);
      gain.gain.setTargetAtTime(0, this.audioContext!.currentTime + 0.3, 0.2);
      
      osc.connect(gain);
      gain.connect(this.masterGain!);
      
      osc.start();
      osc.stop(this.audioContext!.currentTime + 1);
    });
  }

  // Trigger approval tone - harmonious, warm
  playApprovalTone(): void {
    if (!this.audioContext || !this.masterGain) return;

    // Major triad - pleasant
    const frequencies = [220, 277.2, 330]; // A major
    
    frequencies.forEach((freq, i) => {
      const osc = this.audioContext!.createOscillator();
      const gain = this.audioContext!.createGain();
      
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      gain.gain.value = 0;
      gain.gain.setTargetAtTime(0.015, this.audioContext!.currentTime + i * 0.1, 0.1);
      gain.gain.setTargetAtTime(0, this.audioContext!.currentTime + 0.8, 0.5);
      
      osc.connect(gain);
      gain.connect(this.masterGain!);
      
      osc.start();
      osc.stop(this.audioContext!.currentTime + 2);
    });
  }

  // Clean up
  destroy(): void {
    this.droneOscillators.forEach(osc => osc.stop());
    this.lfoNodes.forEach(lfo => lfo.stop());
    this.audioContext?.close();
    this.isInitialized = false;
  }

  isReady(): boolean {
    return this.isInitialized;
  }
}

// Singleton instance
export const audioPresence = new AudioPresenceEngine();
