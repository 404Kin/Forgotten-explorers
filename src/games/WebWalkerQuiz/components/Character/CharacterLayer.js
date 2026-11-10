import { h } from '../../utils/dom.js';
import { prefersReducedMotion } from '../../utils/motion.js';
import {
  runAnimation,
  wait,
  lerp,
  lerpPoint,
  easeInOut,
  easeOut,
  easeOutBack,
  smoothstep,
  clamp01,
} from '../../utils/animate.js';
import { createCharacter } from './Character.js';
import { createTether } from './Tether.js';
import {
  arcPoint,
  leanAngle,
  floatAwayPoint,
  attachPoint,
  driftDirection,
  unit,
} from './motion.js';

const FALLBACK = { w: 72, h: 86 };
const LANDING_SCALE = 0.8;
/** Portion of the swing path covered before a wrong answer's tether snaps. */
const SNAP_AT = 0.62;

const restart = (el, cls) => {
  el.classList.remove('ws-fade-in', 'ws-fade-out');
  void el.offsetWidth;
  el.classList.add(cls);
};

/**
 * Owns the astronaut and the tether and choreographs them:
 *   hang(el) -> swingTo(target, { correct }) -> hang(el) for the next question.
 * Pure path maths lives in motion.js; this file only applies it to the DOM.
 */
export function createCharacterLayer({ name, t, timing, reducedMotion = prefersReducedMotion }) {
  const character = createCharacter({ name, t });
  const tether = createTether();
  const el = h('div', { class: 'ws-layer' }, tether.el, character.el);

  let anim = null;
  let epoch = 0;
  let view = { anchorEl: null, anchor: null, center: null, rot: 0, landing: null };

  const size = () => ({
    w: character.el.offsetWidth || FALLBACK.w,
    h: character.el.offsetHeight || FALLBACK.h,
  });

  const rel = (node) => {
    const base = el.getBoundingClientRect();
    const r = node.getBoundingClientRect();
    const left = r.left - base.left;
    const top = r.top - base.top;
    return { left, top, bottom: top + r.height, cx: left + r.width / 2, cy: top + r.height / 2 };
  };

  const cancel = () => {
    anim?.cancel();
    anim = null;
  };

  const hookOf = (node) => {
    const r = rel(node);
    return { x: r.cx, y: r.bottom - 2 };
  };

  const restCenter = (anchor) => {
    const { h: ph } = size();
    return { x: anchor.x, y: anchor.y + ph * 0.3 + ph * 0.45 };
  };

  function put(center, rot = 0, scale = 1, opacity = 1) {
    const { w, h: ph } = size();
    character.el.style.transform = `translate(${center.x - w / 2}px, ${center.y - ph / 2}px) rotate(${rot}deg) scale(${scale})`;
    character.el.style.opacity = String(opacity);
    view.center = center;
    view.rot = rot;
  }

  function draw(anchor, center, rot, scale = 1, slack = 0) {
    tether.draw(anchor, attachPoint(center, rot, size().h * 0.45 * scale), slack);
  }

  /** Position for the current resting state (also used after a resize). */
  function layoutRest() {
    if (view.landing) {
      const d = rel(view.landing.dock);
      const b = rel(view.landing.box);
      const center = { x: d.cx, y: d.cy };
      view.anchor = { x: d.cx, y: b.top + 1 };
      put(center, 0, LANDING_SCALE);
      draw(view.anchor, center, 0, LANDING_SCALE, 2);
    } else if (view.anchorEl) {
      view.anchor = hookOf(view.anchorEl);
      const center = restCenter(view.anchor);
      put(center);
      draw(view.anchor, center, 0, 1, 4);
    }
  }

  const resizeObserver =
    typeof ResizeObserver === 'function'
      ? new ResizeObserver(() => {
          if (!anim) layoutRest();
        })
      : null;
  resizeObserver?.observe(el);

  return {
    el,
    character,

    /** Starts a new question: Zip drops down from the question box on the tether. */
    async hang(anchorEl) {
      cancel();
      const my = ++epoch;
      view = { anchorEl, anchor: hookOf(anchorEl), center: null, rot: 0, landing: null };
      tether.reset();
      character.setPose('hanging');
      const rest = restCenter(view.anchor);

      if (reducedMotion()) {
        layoutRest();
        restart(character.el, 'ws-fade-in');
        restart(tether.el, 'ws-fade-in');
        return;
      }
      const start = { x: rest.x, y: view.anchor.y - size().h * 0.2 };
      // Position immediately so an answer in the first frame still has somewhere to swing from.
      put(start);
      draw(view.anchor, start, 0, 1, 10);
      anim = runAnimation(450, (p) => {
        const center = lerpPoint(start, rest, easeOutBack(p));
        put(center);
        draw(view.anchor, center, 0, 1, (1 - p) * 10);
      });
      await anim.promise;
      if (my === epoch) layoutRest();
    },

    /**
     * Swing to an answer box. Correct: land and cheer. Wrong: the tether snaps and Zip
     * tumbles away. Resolves once the outcome is clear enough to show the fact card.
     */
    async swingTo({ dock, box }, { correct, onLand, onSnap } = {}) {
      cancel();
      const my = ++epoch;
      if (!view.center) layoutRest();
      const start = view.center;
      const from = view.anchor;
      const d = rel(dock);
      const target = { x: d.cx, y: d.cy };
      const landAnchor = { x: d.cx, y: rel(box).top + 1 };
      const { h: ph } = size();
      view.landing = correct ? { dock, box } : null;

      if (reducedMotion()) return reducedOutcome({ correct, target, landAnchor, onLand, onSnap });

      character.setPose('swinging');

      if (correct) {
        anim = runAnimation(timing.swing, (p) => {
          const e = easeInOut(p);
          const pos = arcPoint(start, target, e);
          const rot = leanAngle(start, target, e);
          put(pos, rot, lerp(1, LANDING_SCALE, smoothstep(0.6, 1, p)));
          draw(lerpPoint(from, landAnchor, smoothstep(0.7, 1, p)), pos, rot, 1, (1 - p) * 6);
        });
        if (!(await anim.promise) || my !== epoch) return false;
        view.anchor = landAnchor;
        put(target, 0, LANDING_SCALE);
        draw(landAnchor, target, 0, LANDING_SCALE, 2);
        character.setPose('landing');
        onLand?.(target);
        await wait(timing.landSettle);
        if (my !== epoch) return false;
        character.setPose('winning');
        return true;
      }

      // Wrong answer: swing part way, snap, then tumble off.
      anim = runAnimation(timing.snapSwing, (p) => {
        const e = easeInOut(p) * SNAP_AT;
        const pos = arcPoint(start, target, e);
        const rot = leanAngle(start, target, e);
        put(pos, rot);
        draw(from, pos, rot, 1, 0);
      });
      if (!(await anim.promise) || my !== epoch) return false;

      const hook = attachPoint(view.center, view.rot, ph * 0.45);
      const snapPoint = lerpPoint(from, hook, 0.55);
      onSnap?.(snapPoint);
      character.setPose('falling');
      tether.hide();

      const origin = view.center;
      const spin = (target.x >= start.x ? 1 : -1) * 640;
      const dir = driftDirection(start, target, origin.x > rel(el).cx ? 1 : -1);
      const distance = Math.max(180, el.clientWidth * 0.35);
      const rot0 = view.rot;
      let ready;
      const early = new Promise((resolve) => (ready = resolve));

      anim = runAnimation(timing.float, (p) => {
        const pos = floatAwayPoint(origin, dir, p, distance);
        const rot = rot0 + spin * easeOut(p);
        const scale = lerp(1, 0.55, p);
        put(pos, rot, scale, 1 - smoothstep(0.6, 1, p));
        const retract = easeOut(clamp01(p / 0.35));
        tether.drawCut(
          0,
          from,
          lerpPoint(snapPoint, from, retract),
          1 - smoothstep(0.4, 1, p),
          14 * (1 - retract),
        );
        const hookNow = attachPoint(pos, rot, ph * 0.45 * scale);
        const trailDir = unit(-dir.x, -dir.y);
        const trail = {
          x: hookNow.x + trailDir.x * 46 * (1 - p),
          y: hookNow.y + trailDir.y * 46 * (1 - p),
        };
        tether.drawCut(1, hookNow, trail, 1 - smoothstep(0, 0.7, p), 6);
        if (p >= 0.55) ready(true);
      });
      anim.promise.then(() => ready(true));
      return early;
    },

    destroy() {
      cancel();
      epoch++;
      resizeObserver?.disconnect();
      el.remove();
    },
  };

  async function reducedOutcome({ correct, target, landAnchor, onLand, onSnap }) {
    if (correct) {
      view.anchor = landAnchor;
      put(target, 0, LANDING_SCALE);
      draw(landAnchor, target, 0, LANDING_SCALE, 2);
      character.setPose('winning');
      restart(character.el, 'ws-fade-in');
      onLand?.(target);
      await wait(250);
      return true;
    }
    onSnap?.(view.anchor);
    tether.hide();
    character.setPose('falling');
    restart(character.el, 'ws-fade-out');
    await wait(450);
    return true;
  }
}
