/**
 * NEON GRID — procedural audio.
 *
 * Everything is synthesised at runtime with the Web Audio API: no samples, no
 * downloads, no licensing questions. There is a small FX bank for gameplay
 * events, a pitch-shifting ghost siren that tightens as the maze empties, and
 * an original synthwave backing track (bass, arp, pad, drums) sequenced by a
 * look-ahead scheduler.
 */

const NOTE = (semitonesFromA4) => 440 * Math.pow(2, semitonesFromA4 / 12);

/** Chord progression in A minor: Am - F - C - G, two bars each. */
const PROGRESSION = [
  { root: -12, chord: [0, 3, 7], name: 'Am' },
  { root: -16, chord: [0, 4, 7], name: 'F' },
  { root: -21, chord: [0, 4, 7], name: 'C' },
  { root: -14, chord: [0, 4, 7], name: 'G' },
];

const BPM = 104;
const STEP = 60 / BPM / 4; // sixteenth notes

export function createAudio() {
  let ctx = null;
  let master = null;
  let musicGain = null;
  let fxGain = null;
  let sirenGain = null;
  let reverbSend = null;
  let siren = null;
  let enabled = true;
  let musicOn = true;
  let started = false;

  let step = 0;
  let nextStepTime = 0;
  let schedulerTimer = null;
  let intensity = 0; // 0..1, rises with level / danger

  function makeReverb(context, seconds = 2.1, decay = 2.4) {
    const rate = context.sampleRate;
    const length = Math.floor(rate * seconds);
    const buffer = context.createBuffer(2, length, rate);
    for (let ch = 0; ch < 2; ch++) {
      const data = buffer.getChannelData(ch);
      for (let i = 0; i < length; i++) {
        const t = i / length;
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, decay);
      }
    }
    const convolver = context.createConvolver();
    convolver.buffer = buffer;
    return convolver;
  }

  function ensure() {
    if (ctx) return ctx;
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();

    master = ctx.createGain();
    master.gain.value = 0.85;

    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14;
    comp.knee.value = 22;
    comp.ratio.value = 5;
    comp.attack.value = 0.004;
    comp.release.value = 0.22;

    master.connect(comp);
    comp.connect(ctx.destination);

    const reverb = makeReverb(ctx);
    reverbSend = ctx.createGain();
    reverbSend.gain.value = 0.3;
    reverbSend.connect(reverb);
    const wet = ctx.createGain();
    wet.gain.value = 0.42;
    reverb.connect(wet);
    wet.connect(master);

    musicGain = ctx.createGain();
    musicGain.gain.value = 0.34;
    musicGain.connect(master);
    musicGain.connect(reverbSend);

    fxGain = ctx.createGain();
    fxGain.gain.value = 0.7;
    fxGain.connect(master);
    fxGain.connect(reverbSend);

    sirenGain = ctx.createGain();
    sirenGain.gain.value = 0;
    sirenGain.connect(master);

    return ctx;
  }

  /* ------------------------------------------------------------------ helpers */

  function blip({ freq = 440, to = null, type = 'square', dur = 0.1, gain = 0.25, delay = 0, dest = null, detune = 0 }) {
    if (!ctx || !enabled) return;
    const t0 = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (to !== null) osc.frequency.exponentialRampToValueAtTime(Math.max(20, to), t0 + dur);
    if (detune) osc.detune.value = detune;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + Math.min(0.012, dur * 0.25));
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g);
    g.connect(dest ?? fxGain);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  function noiseHit({ dur = 0.12, gain = 0.2, filter = 3200, delay = 0, type = 'highpass' }) {
    if (!ctx || !enabled) return;
    const t0 = ctx.currentTime + delay;
    const length = Math.max(1, Math.floor(ctx.sampleRate * dur));
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length);
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const bq = ctx.createBiquadFilter();
    bq.type = type;
    bq.frequency.value = filter;
    const g = ctx.createGain();
    g.gain.setValueAtTime(gain, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(bq);
    bq.connect(g);
    g.connect(fxGain);
    src.start(t0);
  }

  /* -------------------------------------------------------------------- siren */

  function startSiren() {
    if (!ctx || siren) return;
    const oscA = ctx.createOscillator();
    oscA.type = 'sawtooth';
    const oscB = ctx.createOscillator();
    oscB.type = 'square';
    oscB.detune.value = 7;

    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 2.6;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 34;
    lfo.connect(lfoGain);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 900;
    filter.Q.value = 6;

    lfoGain.connect(oscA.frequency);
    lfoGain.connect(oscB.frequency);
    oscA.connect(filter);
    oscB.connect(filter);
    filter.connect(sirenGain);

    oscA.frequency.value = 190;
    oscB.frequency.value = 95;
    oscA.start();
    oscB.start();
    lfo.start();
    siren = { oscA, oscB, lfo, filter };
  }

  /* ------------------------------------------------------------------- music */

  function scheduleStep(s, time) {
    const bar = Math.floor(s / 16) % (PROGRESSION.length * 2);
    const prog = PROGRESSION[Math.floor(bar / 2) % PROGRESSION.length];
    const sixteenth = s % 16;

    // Bass: root on the beat with an octave lift, filtered saw.
    if (sixteenth % 4 === 0) {
      const oct = sixteenth === 8 ? 12 : 0;
      const f = NOTE(prog.root + oct - 12);
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.value = f;
      const sub = ctx.createOscillator();
      sub.type = 'triangle';
      sub.frequency.value = f / 2;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(240 + intensity * 900, time);
      filter.frequency.exponentialRampToValueAtTime(160, time + STEP * 3.4);
      filter.Q.value = 5;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, time);
      g.gain.linearRampToValueAtTime(0.3, time + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, time + STEP * 3.6);
      osc.connect(filter);
      sub.connect(filter);
      filter.connect(g);
      g.connect(musicGain);
      osc.start(time);
      sub.start(time);
      osc.stop(time + STEP * 4);
      sub.stop(time + STEP * 4);
    }

    // Arp: sixteenth-note pluck climbing the chord.
    const arpIndex = sixteenth % 8;
    if (arpIndex % 2 === 0) {
      const degree = prog.chord[(arpIndex / 2) % prog.chord.length];
      const oct = arpIndex >= 4 ? 12 : 0;
      const osc = ctx.createOscillator();
      osc.type = 'square';
      osc.frequency.value = NOTE(prog.root + degree + oct + 12);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, time);
      g.gain.linearRampToValueAtTime(0.075 + intensity * 0.05, time + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, time + STEP * 1.6);
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1400 + intensity * 1600;
      filter.Q.value = 1.6;
      osc.connect(filter);
      filter.connect(g);
      g.connect(musicGain);
      osc.start(time);
      osc.stop(time + STEP * 2);
    }

    // Pad: long stacked chord at the top of each bar.
    if (sixteenth === 0) {
      for (const degree of prog.chord) {
        for (const det of [-6, 6]) {
          const osc = ctx.createOscillator();
          osc.type = 'sawtooth';
          osc.frequency.value = NOTE(prog.root + degree);
          osc.detune.value = det;
          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.value = 1100;
          const g = ctx.createGain();
          g.gain.setValueAtTime(0.0001, time);
          g.gain.linearRampToValueAtTime(0.028, time + 0.35);
          g.gain.linearRampToValueAtTime(0.02, time + STEP * 12);
          g.gain.exponentialRampToValueAtTime(0.0001, time + STEP * 16);
          osc.connect(filter);
          filter.connect(g);
          g.connect(musicGain);
          osc.start(time);
          osc.stop(time + STEP * 16.2);
        }
      }
    }

    // Drums: four-on-the-floor kick, snare on the backbeat, hats on eighths.
    if (sixteenth % 4 === 0) {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, time);
      osc.frequency.exponentialRampToValueAtTime(46, time + 0.14);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.34, time);
      g.gain.exponentialRampToValueAtTime(0.0001, time + 0.2);
      osc.connect(g);
      g.connect(musicGain);
      osc.start(time);
      osc.stop(time + 0.22);
    }
    if (sixteenth === 4 || sixteenth === 12) {
      const length = Math.floor(ctx.sampleRate * 0.16);
      const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      const bq = ctx.createBiquadFilter();
      bq.type = 'bandpass';
      bq.frequency.value = 1900;
      bq.Q.value = 0.9;
      const g = ctx.createGain();
      g.gain.value = 0.19;
      src.connect(bq);
      bq.connect(g);
      g.connect(musicGain);
      src.start(time);
    }
    if (sixteenth % 2 === 0) {
      const length = Math.floor(ctx.sampleRate * 0.05);
      const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 3);
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      const bq = ctx.createBiquadFilter();
      bq.type = 'highpass';
      bq.frequency.value = 7800;
      const g = ctx.createGain();
      g.gain.value = sixteenth % 4 === 0 ? 0.05 : 0.09;
      src.connect(bq);
      bq.connect(g);
      g.connect(musicGain);
      src.start(time);
    }
  }

  function runScheduler() {
    if (!ctx) return;
    const lookahead = 0.22;
    while (nextStepTime < ctx.currentTime + lookahead) {
      if (musicOn && enabled) scheduleStep(step, nextStepTime);
      step = (step + 1) % (16 * PROGRESSION.length * 2);
      nextStepTime += STEP;
    }
  }

  /* --------------------------------------------------------------------- API */

  const api = {
    get ready() {
      return !!ctx && ctx.state === 'running';
    },
    get enabled() {
      return enabled;
    },
    get musicOn() {
      return musicOn;
    },

    /** Must be called from a user gesture (required on iOS). */
    async unlock() {
      const c = ensure();
      if (!c) return false;
      if (c.state === 'suspended') {
        try {
          await c.resume();
        } catch {
          return false;
        }
      }
      if (!started) {
        started = true;
        startSiren();
        nextStepTime = c.currentTime + 0.1;
        schedulerTimer = setInterval(runScheduler, 40);
      }
      return true;
    },

    setEnabled(on) {
      enabled = on;
      if (master) master.gain.value = on ? 0.85 : 0;
    },
    toggle() {
      api.setEnabled(!enabled);
      return enabled;
    },
    setMusic(on) {
      musicOn = on;
      if (musicGain) musicGain.gain.value = on ? 0.34 : 0;
    },

    /** 0..1 — drives filter brightness and arp energy. */
    setIntensity(v) {
      intensity = Math.max(0, Math.min(1, v));
    },

    /** Ghost siren: level 0..1 pitch, mode 'normal' | 'fright' | 'retreat' | 'off'. */
    setSiren(mode, progress = 0) {
      if (!ctx || !siren) return;
      const t = ctx.currentTime;
      const target = { normal: 0.1, fright: 0.13, retreat: 0.11, off: 0 }[mode] ?? 0;
      sirenGain.gain.setTargetAtTime(enabled ? target : 0, t, 0.08);
      if (mode === 'off') return;
      if (mode === 'fright') {
        siren.lfo.frequency.setTargetAtTime(9.5, t, 0.1);
        siren.oscA.frequency.setTargetAtTime(260, t, 0.1);
        siren.oscB.frequency.setTargetAtTime(130, t, 0.1);
        siren.filter.frequency.setTargetAtTime(1500, t, 0.1);
      } else if (mode === 'retreat') {
        siren.lfo.frequency.setTargetAtTime(16, t, 0.1);
        siren.oscA.frequency.setTargetAtTime(520, t, 0.1);
        siren.oscB.frequency.setTargetAtTime(260, t, 0.1);
        siren.filter.frequency.setTargetAtTime(2400, t, 0.1);
      } else {
        siren.lfo.frequency.setTargetAtTime(2.2 + progress * 5.5, t, 0.15);
        siren.oscA.frequency.setTargetAtTime(180 + progress * 150, t, 0.15);
        siren.oscB.frequency.setTargetAtTime(90 + progress * 75, t, 0.15);
        siren.filter.frequency.setTargetAtTime(800 + progress * 900, t, 0.15);
      }
    },

    /* -------------------------------------------------------------- one-shots */

    waka(alt) {
      // Two alternating chirps make the classic munch rhythm.
      blip({ freq: alt ? 300 : 210, to: alt ? 140 : 95, type: 'square', dur: 0.075, gain: 0.16 });
      blip({ freq: alt ? 600 : 420, to: alt ? 280 : 190, type: 'triangle', dur: 0.06, gain: 0.07 });
    },
    energizer() {
      for (let i = 0; i < 6; i++) {
        blip({
          freq: 200 + i * 90,
          to: 260 + i * 120,
          type: 'sawtooth',
          dur: 0.14,
          gain: 0.13,
          delay: i * 0.045,
        });
      }
      noiseHit({ dur: 0.4, gain: 0.14, filter: 900, type: 'lowpass' });
    },
    ghostEaten(chain) {
      const base = 260 * Math.pow(1.16, Math.max(0, chain - 1));
      for (let i = 0; i < 5; i++) {
        blip({
          freq: base * Math.pow(1.26, i),
          type: 'square',
          dur: 0.09,
          gain: 0.2,
          delay: i * 0.05,
        });
      }
    },
    fruit() {
      blip({ freq: 880, type: 'triangle', dur: 0.16, gain: 0.2 });
      blip({ freq: 1320, type: 'sine', dur: 0.3, gain: 0.15, delay: 0.06 });
      blip({ freq: 1760, type: 'sine', dur: 0.4, gain: 0.09, delay: 0.12 });
    },
    death() {
      if (!ctx || !enabled) return;
      const t0 = ctx.currentTime;
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(680, t0);
      osc.frequency.exponentialRampToValueAtTime(48, t0 + 1.3);
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 18;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 45;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2400, t0);
      filter.frequency.exponentialRampToValueAtTime(220, t0 + 1.3);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.3, t0);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.45);
      osc.connect(filter);
      filter.connect(g);
      g.connect(fxGain);
      osc.start(t0);
      lfo.start(t0);
      osc.stop(t0 + 1.5);
      lfo.stop(t0 + 1.5);
    },
    extraLife() {
      [0, 4, 7, 12].forEach((s, i) =>
        blip({ freq: NOTE(s + 12), type: 'triangle', dur: 0.22, gain: 0.2, delay: i * 0.09 })
      );
    },
    levelClear() {
      for (let i = 0; i < 10; i++) {
        blip({
          freq: 240 + i * 110,
          to: 300 + i * 130,
          type: 'square',
          dur: 0.12,
          gain: 0.16,
          delay: i * 0.07,
        });
      }
    },
    gameOver() {
      [0, -3, -7, -12, -17].forEach((s, i) =>
        blip({ freq: NOTE(s), type: 'sawtooth', dur: 0.4, gain: 0.22, delay: i * 0.19 })
      );
    },
    ready() {
      [0, 7, 12].forEach((s, i) =>
        blip({ freq: NOTE(s + 12), type: 'square', dur: 0.15, gain: 0.18, delay: i * 0.13 })
      );
    },
    ui() {
      blip({ freq: 720, to: 1100, type: 'square', dur: 0.05, gain: 0.12 });
    },

    dispose() {
      if (schedulerTimer) clearInterval(schedulerTimer);
      if (ctx) ctx.close();
    },
  };

  return api;
}
