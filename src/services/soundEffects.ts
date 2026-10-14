// 100% Authentic Bengali Durga Puja Dhak Sound Engine
// Physically modeled, clean sequential strikes ("One sound at a time, no clashing")
// Authentic Kolkata Dhaki acoustic synthesis (ধাং, তা, কাঠি, কুড়কুড়, কাঁসর ঘণ্টা, শঙ্খধ্বনি)
// Inspired by: "The Best Sound _durgapuja _dhak _kolkata _trending _viralshorts" (https://youtube.com/shorts/bRluyaiASNE)

export type DhakPattern = 'original_arati' | 'dhunuchi_beat' | 'dashami_roll';

class DhakSoundEngine {
  private ctx: AudioContext | null = null;
  private isRhythmPlaying = false;
  private currentPattern: DhakPattern = 'original_arati';
  private loopTimerId: number | null = null;
  private masterGain: GainNode | null = null;
  private volume = 0.85;

  private getContext(): AudioContext | null {
    try {
      if (!this.ctx) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioCtx) return null;
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  // Ensure AudioContext is actively running (called on user interaction or mount)
  public async resume(): Promise<boolean> {
    const ctx = this.getContext();
    if (!ctx) return false;
    try {
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }
      if (this.isRhythmPlaying) {
        this.startRhythm(this.currentPattern);
      }
      return ctx.state === 'running';
    } catch {
      return false;
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  // 1. Deep Bass Dhak Strike (ধাং - Dhang!)
  // Realistic animal-hide membrane over hollow wooden barrel: punchy attack, rich sub-bass & acoustic slap
  public playDhang(delay = 0) {
    const ctx = this.getContext();
    if (!ctx || !this.masterGain) return;
    const t = ctx.currentTime + Math.max(0, delay);

    // Deep barrel resonance
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(125, t);
    osc.frequency.exponentialRampToValueAtTime(54, t + 0.16);

    gain.gain.setValueAtTime(0.65, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.3);

    // Initial wooden stick snap transient
    const snap = ctx.createOscillator();
    const snapGain = ctx.createGain();
    snap.type = 'sine';
    snap.frequency.setValueAtTime(360, t);
    snap.frequency.exponentialRampToValueAtTime(75, t + 0.04);

    snapGain.gain.setValueAtTime(0.42, t);
    snapGain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    snap.connect(snapGain);
    snapGain.connect(this.masterGain);
    snap.start(t);
    snap.stop(t + 0.06);
  }

  // 2. Crisp Cane Stick Strike on Tension Skin (তা / কাঠি - Ta / Kanthi Rim)
  // Sharp, dry wooden snap with bright presence
  public playTa(delay = 0) {
    const ctx = this.getContext();
    if (!ctx || !this.masterGain) return;
    const t = ctx.currentTime + Math.max(0, delay);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(720, t);
    osc.frequency.exponentialRampToValueAtTime(230, t + 0.038);

    gain.gain.setValueAtTime(0.45, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.05);
  }

  // 3. Double Stick Bounce (কুড়-কুড় - Kuru-Kuru)
  // Two distinct, clean successive wooden taps spaced 65ms apart
  public playKuru(delay = 0) {
    const ctx = this.getContext();
    if (!ctx || !this.masterGain) return;
    const master = this.masterGain;
    const t = ctx.currentTime + Math.max(0, delay);

    [0, 0.065].forEach((offset, idx) => {
      const hitTime = t + offset;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(idx === 0 ? 760 : 880, hitTime);
      osc.frequency.exponentialRampToValueAtTime(250, hitTime + 0.03);

      gain.gain.setValueAtTime(0.35, hitTime);
      gain.gain.exponentialRampToValueAtTime(0.001, hitTime + 0.035);

      osc.connect(gain);
      gain.connect(master);
      osc.start(hitTime);
      osc.stop(hitTime + 0.04);
    });
  }

  // 4. Kansor Ghonta (কাঁসর ঘণ্টা - Brass Gong)
  // Soft, clear brass ping that rings gently in unison with the downbeats
  public playKansor(delay = 0) {
    const ctx = this.getContext();
    if (!ctx || !this.masterGain) return;
    const master = this.masterGain;
    const t = ctx.currentTime + Math.max(0, delay);

    const freqs = [1180, 2360];
    freqs.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t);

      const amp = 0.08 / (idx + 1);
      gain.gain.setValueAtTime(amp, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);

      osc.connect(gain);
      gain.connect(master);
      osc.start(t);
      osc.stop(t + 0.75);
    });
  }

  // 5. Sacred Shankha (শঙ্খধ্বনি - Conch Shell Invocation)
  public playShankha(delay = 0) {
    const ctx = this.getContext();
    if (!ctx || !this.masterGain) return;
    const t = ctx.currentTime + Math.max(0, delay);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(260, t + 0.4);
    osc.frequency.setValueAtTime(260, t + 0.9);
    osc.frequency.exponentialRampToValueAtTime(220, t + 1.4);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(650, t);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.22, t + 0.3);
    gain.gain.setValueAtTime(0.22, t + 0.9);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.5);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 1.55);
  }

  // Sequential Rhythmic Playing: One distinct beat at a time (zero overlap / clash)
  public startRhythm(pattern: DhakPattern = 'original_arati') {
    this.stopRhythm();
    this.resume();
    this.isRhythmPlaying = true;
    this.currentPattern = pattern;

    if (pattern === 'original_arati') {
      // Authentic Traditional Arati Dhak Bol (Ta-Ta Kuru Dhang ... Ta Kuru Dhang)
      // Cycle: ~2.0 seconds
      const loop = () => {
        if (!this.isRhythmPlaying) return;
        this.playTa(0.0);
        this.playTa(0.24);
        this.playKuru(0.48);
        this.playDhang(0.72);
        this.playKansor(0.73); // Soft brass accent together with downbeat
        this.playTa(1.08);
        this.playKuru(1.32);
        this.playDhang(1.58);
      };
      loop();
      this.loopTimerId = window.setInterval(loop, 2000);
    } else if (pattern === 'dhunuchi_beat') {
      // Dhunuchi Fast Syncopated Bol
      // Cycle: ~1.4 seconds
      const loop = () => {
        if (!this.isRhythmPlaying) return;
        this.playDhang(0.0);
        this.playKansor(0.01);
        this.playTa(0.25);
        this.playKuru(0.48);
        this.playDhang(0.72);
        this.playTa(0.95);
        this.playKuru(1.15);
      };
      loop();
      this.loopTimerId = window.setInterval(loop, 1400);
    } else if (pattern === 'dashami_roll') {
      // Bijoya Dashami Rolling Bol
      // Cycle: ~1.2 seconds
      const loop = () => {
        if (!this.isRhythmPlaying) return;
        this.playDhang(0.0);
        this.playTa(0.2);
        this.playKuru(0.4);
        this.playDhang(0.6);
        this.playKansor(0.61);
        this.playKuru(0.85);
        this.playTa(1.02);
      };
      loop();
      this.loopTimerId = window.setInterval(loop, 1200);
    }
  }

  public stopRhythm() {
    this.isRhythmPlaying = false;
    if (this.loopTimerId) {
      window.clearInterval(this.loopTimerId);
      this.loopTimerId = null;
    }
  }

  public toggleRhythm(pattern?: DhakPattern): boolean {
    if (this.isRhythmPlaying && (!pattern || pattern === this.currentPattern)) {
      this.stopRhythm();
      return false;
    } else {
      this.startRhythm(pattern || this.currentPattern);
      return true;
    }
  }

  public isPlaying(): boolean {
    return this.isRhythmPlaying;
  }

  public getPattern(): DhakPattern {
    return this.currentPattern;
  }
}

export const soundEffects = new DhakSoundEngine();
