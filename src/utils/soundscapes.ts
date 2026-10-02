export type SoundscapeType = 'fireplace' | 'rain' | 'garden_birds' | 'vinyl';

class SoundscapeEngine {
  private ctx: AudioContext | null = null;
  private currentType: SoundscapeType | null = null;
  private isPlaying = false;
  private masterGain: GainNode | null = null;
  private activeNodes: (AudioNode | number)[] = [];
  private birdIntervalId: number | null = null;
  private crackleIntervalId: number | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(volume: number) {
    if (this.masterGain && this.ctx) {
      // smooth ramp
      this.masterGain.gain.setTargetAtTime(Math.max(0, Math.min(1, volume)), this.ctx.currentTime, 0.05);
    }
  }

  public stop() {
    if (this.birdIntervalId) {
      window.clearInterval(this.birdIntervalId);
      this.birdIntervalId = null;
    }
    if (this.crackleIntervalId) {
      window.clearInterval(this.crackleIntervalId);
      this.crackleIntervalId = null;
    }

    this.activeNodes.forEach(item => {
      if (typeof item !== 'number') {
        try {
          if ('stop' in item && typeof (item as AudioScheduledSourceNode).stop === 'function') {
            (item as AudioScheduledSourceNode).stop();
          }
          item.disconnect();
        } catch {
          // ignore disconnect errors
        }
      }
    });
    this.activeNodes = [];
    this.isPlaying = false;
    this.currentType = null;
  }

  public play(type: SoundscapeType, volume = 0.3) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    if (this.isPlaying && this.currentType === type) {
      return;
    }

    this.stop();
    this.currentType = type;
    this.isPlaying = true;
    this.setVolume(volume);

    switch (type) {
      case 'fireplace':
        this.startFireplace();
        break;
      case 'rain':
        this.startRain();
        break;
      case 'garden_birds':
        this.startGardenBirds();
        break;
      case 'vinyl':
        this.startVinyl();
        break;
    }
  }

  private createPinkNoiseBuffer(seconds = 3): AudioBuffer {
    if (!this.ctx) throw new Error('No context');
    const bufferSize = this.ctx.sampleRate * seconds;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }
    return buffer;
  }

  private startFireplace() {
    if (!this.ctx || !this.masterGain) return;

    // Continuous low hearth rumble
    const noiseBuffer = this.createPinkNoiseBuffer(4);
    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const lowpass = this.ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(220, this.ctx.currentTime);

    const hearthGain = this.ctx.createGain();
    hearthGain.gain.setValueAtTime(0.8, this.ctx.currentTime);

    noiseSource.connect(lowpass);
    lowpass.connect(hearthGain);
    hearthGain.connect(this.masterGain);
    noiseSource.start();

    this.activeNodes.push(noiseSource, lowpass, hearthGain);

    // Random crackle and ember pops
    this.crackleIntervalId = window.setInterval(() => {
      if (!this.ctx || !this.masterGain || !this.isPlaying) return;
      if (Math.random() > 0.4) return;

      const burstOsc = this.ctx.createOscillator();
      const burstGain = this.ctx.createGain();
      const burstFilter = this.ctx.createBiquadFilter();

      burstFilter.type = 'bandpass';
      burstFilter.frequency.setValueAtTime(800 + Math.random() * 1200, this.ctx.currentTime);
      burstFilter.Q.setValueAtTime(3 + Math.random() * 4, this.ctx.currentTime);

      const now = this.ctx.currentTime;
      burstGain.gain.setValueAtTime(0.01, now);
      burstGain.gain.exponentialRampToValueAtTime(0.08 + Math.random() * 0.12, now + 0.005);
      burstGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04 + Math.random() * 0.06);

      burstOsc.frequency.setValueAtTime(100 + Math.random() * 600, now);
      burstOsc.connect(burstFilter);
      burstFilter.connect(burstGain);
      burstGain.connect(this.masterGain);

      burstOsc.start(now);
      burstOsc.stop(now + 0.12);
    }, 140);
  }

  private startRain() {
    if (!this.ctx || !this.masterGain) return;

    const noiseBuffer = this.createPinkNoiseBuffer(5);
    const source = this.ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    // Filter to sound like soft soothing rain on leaves
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(950, this.ctx.currentTime);

    // Highpass to eliminate heavy thumps
    const hpFilter = this.ctx.createBiquadFilter();
    hpFilter.type = 'highpass';
    hpFilter.frequency.setValueAtTime(180, this.ctx.currentTime);

    // Subtle gentle swell LFO
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(180, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const rainGain = this.ctx.createGain();
    rainGain.gain.setValueAtTime(0.85, this.ctx.currentTime);

    source.connect(filter);
    filter.connect(hpFilter);
    hpFilter.connect(rainGain);
    rainGain.connect(this.masterGain);

    source.start();
    lfo.start();

    this.activeNodes.push(source, filter, hpFilter, lfo, lfoGain, rainGain);
  }

  private startGardenBirds() {
    if (!this.ctx || !this.masterGain) return;

    // Soft morning breeze foundation
    const noiseBuffer = this.createPinkNoiseBuffer(4);
    const breeze = this.ctx.createBufferSource();
    breeze.buffer = noiseBuffer;
    breeze.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(350, this.ctx.currentTime);
    filter.Q.setValueAtTime(0.8, this.ctx.currentTime);

    const breezeGain = this.ctx.createGain();
    breezeGain.gain.setValueAtTime(0.2, this.ctx.currentTime);

    breeze.connect(filter);
    filter.connect(breezeGain);
    breezeGain.connect(this.masterGain);
    breeze.start();

    this.activeNodes.push(breeze, filter, breezeGain);

    // Periodic melodious songbird chirps
    const chirpPitches = [1800, 2100, 2450, 2700, 3100, 3400];
    this.birdIntervalId = window.setInterval(() => {
      if (!this.ctx || !this.masterGain || !this.isPlaying) return;
      if (Math.random() > 0.45) return;

      const basePitch = chirpPitches[Math.floor(Math.random() * chirpPitches.length)];
      const now = this.ctx.currentTime;
      const count = 2 + Math.floor(Math.random() * 3);

      for (let i = 0; i < count; i++) {
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();
        const noteTime = now + i * 0.08 + Math.random() * 0.02;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(basePitch + (Math.random() * 300 - 150), noteTime);
        osc.frequency.exponentialRampToValueAtTime(basePitch + 400 + Math.random() * 200, noteTime + 0.04);
        osc.frequency.exponentialRampToValueAtTime(basePitch + 100, noteTime + 0.07);

        noteGain.gain.setValueAtTime(0.001, noteTime);
        noteGain.gain.linearRampToValueAtTime(0.05, noteTime + 0.015);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.07);

        osc.connect(noteGain);
        noteGain.connect(this.masterGain);

        osc.start(noteTime);
        osc.stop(noteTime + 0.08);
      }
    }, 1800);
  }

  private startVinyl() {
    if (!this.ctx || !this.masterGain) return;

    // Warm turntable 50Hz hum
    const humOsc = this.ctx.createOscillator();
    humOsc.type = 'triangle';
    humOsc.frequency.setValueAtTime(55, this.ctx.currentTime);

    const humGain = this.ctx.createGain();
    humGain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    humOsc.connect(humGain);
    humGain.connect(this.masterGain);
    humOsc.start();

    // Vintage dust hiss
    const noiseBuffer = this.createPinkNoiseBuffer(3);
    const hiss = this.ctx.createBufferSource();
    hiss.buffer = noiseBuffer;
    hiss.loop = true;

    const hissFilter = this.ctx.createBiquadFilter();
    hissFilter.type = 'bandpass';
    hissFilter.frequency.setValueAtTime(1400, this.ctx.currentTime);
    hissFilter.Q.setValueAtTime(1.2, this.ctx.currentTime);

    const hissGain = this.ctx.createGain();
    hissGain.gain.setValueAtTime(0.15, this.ctx.currentTime);

    hiss.connect(hissFilter);
    hissFilter.connect(hissGain);
    hissGain.connect(this.masterGain);
    hiss.start();

    this.activeNodes.push(humOsc, humGain, hiss, hissFilter, hissGain);

    // Subtle needle tick
    this.crackleIntervalId = window.setInterval(() => {
      if (!this.ctx || !this.masterGain || !this.isPlaying) return;
      if (Math.random() > 0.35) return;

      const tick = this.ctx.createOscillator();
      const tickGain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      tick.type = 'square';
      tick.frequency.setValueAtTime(1200 + Math.random() * 800, now);
      tickGain.gain.setValueAtTime(0.03, now);
      tickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015);

      tick.connect(tickGain);
      tickGain.connect(this.masterGain);
      tick.start(now);
      tick.stop(now + 0.02);
    }, 280);
  }

  public getStatus() {
    return {
      isPlaying: this.isPlaying,
      currentType: this.currentType,
    };
  }
}

export const soundscapes = new SoundscapeEngine();
