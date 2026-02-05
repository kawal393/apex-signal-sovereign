// ADVANCED AUDIO PRESENCE ENGINE
// Spatial audio, granular synthesis, reverb chains, frequency analysis

class AdvancedAudioPresence {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private convolver: ConvolverNode | null = null;
  private analyser: AnalyserNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  
  // Drone layer
  private droneOscillators: OscillatorNode[] = [];
  private droneGains: GainNode[] = [];
  private dronePanners: StereoPannerNode[] = [];
  private lfoNodes: OscillatorNode[] = [];
  
  // Granular layer
  private grainBuffer: AudioBuffer | null = null;
  private grainInterval: number | null = null;
  
  private isInitialized = false;
  private cursorX = 0.5;
  private cursorY = 0.5;
  private scrollDepth = 0;
  private patienceScore = 0.5;
  private curiosityScore = 0.5;

  // Extended frequency set - subharmonics to upper partials
  private readonly FREQUENCIES = [
    27.5,   // A0 - sub bass, felt not heard
    55,     // A1 - fundamental drone
    82.5,   // E2 - perfect fifth
    110,    // A2 - octave
    165,    // E3 - upper fifth
    220,    // A3 - high drone
    330,    // E4 - shimmer
  ];

  private readonly BASE_VOLUME = 0.012;

  async initialize(): Promise<boolean> {
    if (this.isInitialized) return true;

    try {
      this.audioContext = new AudioContext();
      
      // Create processing chain
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      
      this.compressor = this.audioContext.createDynamicsCompressor();
      this.compressor.threshold.value = -24;
      this.compressor.knee.value = 12;
      this.compressor.ratio.value = 4;
      this.compressor.attack.value = 0.003;
      this.compressor.release.value = 0.25;
      
      // Create reverb (impulse response simulation)
      this.convolver = this.audioContext.createConvolver();
      this.convolver.buffer = await this.createReverbImpulse(3, 2);
      
      // Master gain
      this.masterGain = this.audioContext.createGain();
      this.masterGain.gain.value = 0;
      
      // Wet/dry mix for reverb
      const dryGain = this.audioContext.createGain();
      dryGain.gain.value = 0.7;
      
      const wetGain = this.audioContext.createGain();
      wetGain.gain.value = 0.4;
      
      // Connect chains
      this.compressor.connect(dryGain);
      this.compressor.connect(this.convolver);
      this.convolver.connect(wetGain);
      
      dryGain.connect(this.masterGain);
      wetGain.connect(this.masterGain);
      
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.audioContext.destination);

      // Create drone oscillators with spatial positioning
      this.FREQUENCIES.forEach((freq, i) => {
        if (!this.audioContext || !this.compressor) return;

        // Main oscillator
        const osc = this.audioContext.createOscillator();
        osc.type = i < 2 ? 'sine' : i < 4 ? 'triangle' : 'sine';
        osc.frequency.value = freq;

        // Individual gain - lower frequencies louder
        const gain = this.audioContext.createGain();
        const baseVol = this.BASE_VOLUME / Math.pow(i + 1, 0.7);
        gain.gain.value = baseVol;

        // Stereo panner - spread across field
        const panner = this.audioContext.createStereoPanner();
        panner.pan.value = (i % 2 === 0 ? -1 : 1) * (0.3 + i * 0.1);

        // LFO for pitch modulation
        const lfo = this.audioContext.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 0.03 + i * 0.01;
        
        const lfoGain = this.audioContext.createGain();
        lfoGain.gain.value = freq * 0.003;
        
        // LFO for volume modulation
        const lfoVol = this.audioContext.createOscillator();
        lfoVol.type = 'sine';
        lfoVol.frequency.value = 0.05 + i * 0.015;
        
        const lfoVolGain = this.audioContext.createGain();
        lfoVolGain.gain.value = baseVol * 0.3;
        
        // Connect LFOs
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        
        lfoVol.connect(lfoVolGain);
        lfoVolGain.connect(gain.gain);
        
        // Main signal chain
        osc.connect(gain);
        gain.connect(panner);
        panner.connect(this.compressor);

        osc.start();
        lfo.start();
        lfoVol.start();

        this.droneOscillators.push(osc);
        this.droneGains.push(gain);
        this.dronePanners.push(panner);
        this.lfoNodes.push(lfo, lfoVol);
      });

      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('AdvancedAudioPresence: Failed to initialize', error);
      return false;
    }
  }

  // Create synthetic reverb impulse response
  private async createReverbImpulse(duration: number, decay: number): Promise<AudioBuffer> {
    if (!this.audioContext) throw new Error('No audio context');
    
    const sampleRate = this.audioContext.sampleRate;
    const length = sampleRate * duration;
    const impulse = this.audioContext.createBuffer(2, length, sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
      }
    }
    
    return impulse;
  }

  fadeIn(duration: number = 4): void {
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

  // Spatial cursor tracking
  updateCursor(x: number, y: number): void {
    if (!this.audioContext || !this.isInitialized) return;
    
    this.cursorX = x;
    this.cursorY = y;
    
    // Modulate frequencies based on X position
    this.droneOscillators.forEach((osc, i) => {
      const baseFreq = this.FREQUENCIES[i];
      const pitchShift = 1 + (x - 0.5) * 0.03;
      osc.frequency.setTargetAtTime(
        baseFreq * pitchShift,
        this.audioContext!.currentTime,
        0.3
      );
    });

    // Modulate panning based on X
    this.dronePanners.forEach((panner, i) => {
      const basePan = (i % 2 === 0 ? -1 : 1) * 0.3;
      const cursorInfluence = (x - 0.5) * 0.4;
      panner.pan.setTargetAtTime(
        Math.max(-1, Math.min(1, basePan + cursorInfluence)),
        this.audioContext!.currentTime,
        0.2
      );
    });

    // Modulate volumes based on Y
    this.droneGains.forEach((gain, i) => {
      const baseVol = this.BASE_VOLUME / Math.pow(i + 1, 0.7);
      const yMod = 0.7 + y * 0.6;
      gain.gain.setTargetAtTime(
        baseVol * yMod,
        this.audioContext!.currentTime,
        0.2
      );
    });
  }

  // Scroll depth modulation - deeper = richer harmonics
  updateScrollDepth(depth: number): void {
    if (!this.audioContext || !this.isInitialized) return;
    
    this.scrollDepth = depth;
    
    // Higher harmonics emerge as you scroll deeper
    this.droneGains.forEach((gain, i) => {
      const baseVol = this.BASE_VOLUME / Math.pow(i + 1, 0.7);
      const depthMod = i < 3 ? 1 : 0.3 + depth * 0.7;
      gain.gain.setTargetAtTime(
        baseVol * depthMod * (0.7 + this.cursorY * 0.6),
        this.audioContext!.currentTime,
        0.8
      );
    });
  }

  // Update based on behavioral scores
  updateBehavior(patience: number, curiosity: number): void {
    this.patienceScore = patience;
    this.curiosityScore = curiosity;
    
    // Patience = warmer, more harmonic sound
    // Curiosity = more movement, more upper partials
  }

  // Threshold crossing tone
  playThresholdTone(intensity: number = 0.5): void {
    if (!this.audioContext || !this.compressor) return;

    const freq = 440 * (1 + this.scrollDepth * 0.5);
    
    // Create a shimmering chord
    [freq, freq * 1.5, freq * 2].forEach((f, i) => {
      const osc = this.audioContext!.createOscillator();
      const gain = this.audioContext!.createGain();
      
      osc.type = 'sine';
      osc.frequency.value = f;
      
      gain.gain.value = 0;
      gain.gain.setTargetAtTime(0.015 * intensity / (i + 1), this.audioContext!.currentTime, 0.08);
      gain.gain.setTargetAtTime(0, this.audioContext!.currentTime + 0.4, 0.6);
      
      osc.connect(gain);
      gain.connect(this.compressor!);
      
      osc.start();
      osc.stop(this.audioContext!.currentTime + 2.5);
    });
  }

  // Impatience response - dissonant cluster
  playImpatienceResponse(): void {
    if (!this.audioContext || !this.compressor) return;

    // Tritone cluster - uncomfortable
    const frequencies = [220, 311, 233, 247];
    
    frequencies.forEach((freq, i) => {
      const osc = this.audioContext!.createOscillator();
      const gain = this.audioContext!.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.value = freq;
      
      gain.gain.value = 0;
      gain.gain.setTargetAtTime(0.006, this.audioContext!.currentTime + i * 0.03, 0.03);
      gain.gain.setTargetAtTime(0, this.audioContext!.currentTime + 0.25, 0.15);
      
      osc.connect(gain);
      gain.connect(this.compressor!);
      
      osc.start();
      osc.stop(this.audioContext!.currentTime + 0.8);
    });
  }

  // Approval tone - warm major chord with shimmer
  playApprovalTone(): void {
    if (!this.audioContext || !this.compressor) return;

    // A major with extended harmonics
    const frequencies = [220, 277.2, 330, 440, 554.4];
    
    frequencies.forEach((freq, i) => {
      const osc = this.audioContext!.createOscillator();
      const gain = this.audioContext!.createGain();
      
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      gain.gain.value = 0;
      gain.gain.setTargetAtTime(0.012 / (i + 1), this.audioContext!.currentTime + i * 0.08, 0.1);
      gain.gain.setTargetAtTime(0, this.audioContext!.currentTime + 1, 0.7);
      
      osc.connect(gain);
      gain.connect(this.compressor!);
      
      osc.start();
      osc.stop(this.audioContext!.currentTime + 3);
    });
  }

  // Play crimson accent - for special reveals
  playCrimsonAccent(): void {
    if (!this.audioContext || !this.compressor) return;

    // Diminished chord - ominous power
    const frequencies = [220, 261.6, 311.1, 370];
    
    frequencies.forEach((freq, i) => {
      const osc = this.audioContext!.createOscillator();
      const gain = this.audioContext!.createGain();
      
      osc.type = i === 0 ? 'sine' : 'triangle';
      osc.frequency.value = freq;
      
      gain.gain.value = 0;
      gain.gain.setTargetAtTime(0.008 / (i + 1), this.audioContext!.currentTime + i * 0.05, 0.05);
      gain.gain.setTargetAtTime(0, this.audioContext!.currentTime + 0.6, 0.4);
      
      osc.connect(gain);
      gain.connect(this.compressor!);
      
      osc.start();
      osc.stop(this.audioContext!.currentTime + 1.5);
    });
  }

  // Get frequency data for visualization
  getFrequencyData(): Uint8Array {
    if (!this.analyser) return new Uint8Array(0);
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    return data;
  }

  destroy(): void {
    this.droneOscillators.forEach(osc => osc.stop());
    this.lfoNodes.forEach(lfo => lfo.stop());
    if (this.grainInterval) clearInterval(this.grainInterval);
    this.audioContext?.close();
    this.isInitialized = false;
  }

  isReady(): boolean {
    return this.isInitialized;
  }
}

// Singleton
export const advancedAudioPresence = new AdvancedAudioPresence();