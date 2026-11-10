import { SOUNDS } from './sounds.js';

/**
 * Plays synthesized effects. The AudioContext is created lazily on first play
 * (browsers require a user gesture). Mute state is reported via onMutedChange
 * so the caller can persist it.
 */
export function createSoundManager({
  volume = 0.35,
  muted = false,
  onMutedChange = () => {},
  contextFactory = () => {
    const Ctor = globalThis.AudioContext ?? globalThis.webkitAudioContext;
    return Ctor ? new Ctor() : null;
  },
} = {}) {
  let ctx = null;
  let master = null;
  let noiseBuffer = null;
  const listeners = new Set([onMutedChange]);

  function ensureContext() {
    if (ctx) return ctx;
    try {
      ctx = contextFactory();
      if (!ctx) return null;
      master = ctx.createGain();
      master.gain.value = volume;
      master.connect(ctx.destination);
    } catch {
      ctx = null;
    }
    return ctx;
  }

  function noise(c) {
    if (!noiseBuffer) {
      noiseBuffer = c.createBuffer(1, c.sampleRate, c.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    }
    return noiseBuffer;
  }

  function schedule(c, step, now) {
    const t0 = now + step.start;
    const t1 = t0 + step.dur;
    const amp = c.createGain();
    amp.gain.setValueAtTime(0.0001, t0);
    amp.gain.exponentialRampToValueAtTime(step.gain, t0 + Math.min(0.02, step.dur / 3));
    amp.gain.exponentialRampToValueAtTime(0.0001, t1);

    let source;
    if (step.noise) {
      source = c.createBufferSource();
      source.buffer = noise(c);
      const filter = c.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(step.from, t0);
      filter.frequency.exponentialRampToValueAtTime(step.to ?? step.from, t1);
      source.connect(filter).connect(amp);
    } else {
      source = c.createOscillator();
      source.type = step.type;
      source.frequency.setValueAtTime(step.from, t0);
      if (step.to) source.frequency.exponentialRampToValueAtTime(step.to, t1);
      source.connect(amp);
    }
    amp.connect(master);
    source.start(t0);
    source.stop(t1 + 0.05);
  }

  return {
    isMuted: () => muted,
    setMuted(value) {
      muted = Boolean(value);
      listeners.forEach((fn) => fn(muted));
    },
    toggleMuted() {
      this.setMuted(!muted);
      return muted;
    },
    /** Subscribe to mute changes (used by every SoundToggle on screen). */
    onChange(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    /** Returns true if the sound was actually scheduled. */
    play(name) {
      const recipe = SOUNDS[name];
      if (muted || !recipe) return false;
      const c = ensureContext();
      if (!c) return false;
      try {
        if (c.state === 'suspended') c.resume?.();
        recipe.forEach((step) => schedule(c, step, c.currentTime));
        return true;
      } catch {
        return false;
      }
    },
  };
}
