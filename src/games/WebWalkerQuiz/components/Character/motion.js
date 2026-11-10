import { lerp, easeOut } from '../../utils/animate.js';

/** Position along a swinging arc from `from` to `to`; bulges downward like a pendulum. */
export function arcPoint(from, to, t, sagFactor = 0.22, maxSag = 90) {
  const dist = Math.hypot(to.x - from.x, to.y - from.y);
  const sag = Math.min(dist * sagFactor, maxSag);
  return { x: lerp(from.x, to.x, t), y: lerp(from.y, to.y, t) + sag * Math.sin(Math.PI * t) };
}

/** Degrees of body tilt while swinging: leans into the move, upright at both ends. */
export function leanAngle(from, to, t, maxDeg = 24) {
  const dir = Math.sign(to.x - from.x) || 1;
  return dir * maxDeg * Math.sin(Math.PI * t);
}

export function unit(dx, dy) {
  const len = Math.hypot(dx, dy);
  return len === 0 ? { x: 0, y: -1 } : { x: dx / len, y: dy / len };
}

/** Drifting away in zero gravity: keeps the swing direction, rises a little, wobbles. */
export function floatAwayPoint(origin, dir, t, distance) {
  const e = easeOut(t);
  return {
    x: origin.x + dir.x * distance * e + Math.sin(t * Math.PI * 3) * 8,
    y: origin.y + dir.y * distance * e - distance * 0.35 * e,
  };
}

/** Where the tether hook ends up after rotating the character about its centre. */
export function attachPoint(center, rotDeg, distance) {
  const r = (rotDeg * Math.PI) / 180;
  return { x: center.x + distance * Math.sin(r), y: center.y - distance * Math.cos(r) };
}

/** Drift direction for a floating-away character: sideways with the swing, always upward. */
export function driftDirection(from, to, fallbackSign = 1) {
  const dir = unit(to.x - from.x, to.y - from.y);
  const x = Math.abs(dir.x) < 0.35 ? fallbackSign * 0.7 : dir.x;
  return unit(x, Math.min(dir.y, 0) - 0.4);
}
