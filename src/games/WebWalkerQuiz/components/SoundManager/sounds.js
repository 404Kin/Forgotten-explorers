/**
 * Sound recipes as data. Each step is a synthesized tone or noise burst:
 *  type: oscillator wave | noise: true for filtered noise
 *  from/to: frequency glide in Hz (noise: filter sweep) · start/dur in seconds · gain 0..1
 * No audio files are shipped; everything is generated with the Web Audio API.
 */
export const SOUNDS = Object.freeze({
  click: [{ type: 'square', from: 700, to: 520, start: 0, dur: 0.07, gain: 0.35 }],
  whoosh: [{ noise: true, from: 250, to: 2600, start: 0, dur: 0.55, gain: 0.7 }],
  chime: [
    { type: 'sine', from: 523.25, start: 0, dur: 0.3, gain: 0.5 },
    { type: 'sine', from: 659.25, start: 0.1, dur: 0.3, gain: 0.5 },
    { type: 'sine', from: 783.99, start: 0.2, dur: 0.3, gain: 0.5 },
    { type: 'sine', from: 1046.5, start: 0.3, dur: 0.6, gain: 0.5 },
  ],
  snap: [
    { noise: true, from: 3000, to: 800, start: 0, dur: 0.09, gain: 1 },
    { type: 'sawtooth', from: 900, to: 160, start: 0, dur: 0.16, gain: 0.35 },
  ],
  oops: [
    { type: 'triangle', from: 440, to: 170, start: 0, dur: 0.45, gain: 0.55 },
    { type: 'triangle', from: 330, to: 110, start: 0.3, dur: 0.55, gain: 0.55 },
  ],
});
