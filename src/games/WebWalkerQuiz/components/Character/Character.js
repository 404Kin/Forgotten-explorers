import { h, fromMarkup, uniqueId } from '../../utils/dom.js';
import './Character.css';

export const POSES = Object.freeze(['hanging', 'swinging', 'landing', 'winning', 'falling']);

const art = (id) => `
<svg class="ws-zip-svg" viewBox="0 0 100 120" focusable="false" aria-hidden="true">
  <defs>
    <radialGradient id="${id}-visor" cx="35%" cy="30%" r="80%">
      <stop offset="0" stop-color="#5bc0ff"/><stop offset="1" stop-color="#14206b"/>
    </radialGradient>
    <linearGradient id="${id}-suit" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#cdd6ff"/>
    </linearGradient>
  </defs>
  <circle cx="50" cy="6" r="4.5" fill="none" stroke="#7df9ff" stroke-width="2.5"/>
  <rect x="27" y="58" width="46" height="34" rx="10" fill="#8f9cf0"/>
  <g class="z-leg-l" style="transform-origin:43px 90px">
    <rect x="37.5" y="88" width="11" height="22" rx="5.5" fill="url(#${id}-suit)"/>
    <rect x="35.5" y="104" width="15" height="9" rx="4.5" fill="#ffa94d"/>
  </g>
  <g class="z-leg-r" style="transform-origin:57px 90px">
    <rect x="51.5" y="88" width="11" height="22" rx="5.5" fill="url(#${id}-suit)"/>
    <rect x="49.5" y="104" width="15" height="9" rx="4.5" fill="#ffa94d"/>
  </g>
  <g class="z-arm-l" style="transform-origin:36px 66px">
    <rect x="30.5" y="62" width="11" height="26" rx="5.5" fill="url(#${id}-suit)"/>
    <circle cx="36" cy="89" r="6" fill="#ffa94d"/>
  </g>
  <g class="z-arm-r" style="transform-origin:64px 66px">
    <rect x="58.5" y="62" width="11" height="26" rx="5.5" fill="url(#${id}-suit)"/>
    <circle cx="64" cy="89" r="6" fill="#ffa94d"/>
  </g>
  <rect x="31" y="58" width="38" height="36" rx="13" fill="url(#${id}-suit)"/>
  <rect x="40" y="66" width="20" height="11" rx="4" fill="#4aa3ff"/>
  <circle cx="45" cy="71.5" r="2" fill="#ff6b6b"/><circle cx="52" cy="71.5" r="2" fill="#4ade80"/>
  <rect x="34" y="84" width="32" height="5" rx="2.5" fill="#ff6b6b"/>
  <circle cx="50" cy="34" r="27" fill="url(#${id}-suit)" stroke="#b9c6ff" stroke-width="2.5"/>
  <ellipse cx="50" cy="36" rx="20" ry="16" fill="url(#${id}-visor)" stroke="#7df9ff" stroke-width="1.6"/>
  <ellipse cx="41" cy="29" rx="6" ry="3" fill="#fff" opacity=".55" transform="rotate(-25 41 29)"/>
  <g class="z-face z-face-calm">
    <circle cx="43.5" cy="35" r="2.6" fill="#fff"/><circle cx="56.5" cy="35" r="2.6" fill="#fff"/>
    <path d="M45 43 Q50 47 55 43" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>
  </g>
  <g class="z-face z-face-happy">
    <path d="M40 37 Q43.5 31 47 37 M53 37 Q56.5 31 60 37" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <path d="M42.5 42 Q50 53 57.5 42 Z" fill="#fff"/>
    <circle cx="37.5" cy="41" r="2.6" fill="#ff9ab3" opacity=".7"/><circle cx="62.5" cy="41" r="2.6" fill="#ff9ab3" opacity=".7"/>
  </g>
  <g class="z-face z-face-oops">
    <circle cx="43" cy="35" r="4.6" fill="#fff"/><circle cx="57" cy="35" r="4.6" fill="#fff"/>
    <circle cx="44.2" cy="36" r="1.8" fill="#14206b"/><circle cx="55.8" cy="36" r="1.8" fill="#14206b"/>
    <ellipse cx="50" cy="45" rx="3.4" ry="4" fill="#14206b" stroke="#fff" stroke-width="1.4"/>
    <path d="M39 27 L46 29 M61 27 L54 29" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
    <path d="M67 20 q4 6 0 9 q-4 -3 0 -9z" fill="#7df9ff"/>
  </g>
</svg>`;

/**
 * Original astronaut mascot. The element is positioned by CharacterLayer; this
 * component only owns the artwork and which pose it is showing.
 */
export function createCharacter({ name, t }) {
  const el = h('div', {
    class: 'ws-zip',
    role: 'img',
    'aria-label': t('character.label', { name }),
    'data-pose': 'hanging',
  });
  el.append(fromMarkup(art(uniqueId('zip'))));

  return {
    el,
    setPose(pose) {
      if (!POSES.includes(pose)) throw new RangeError(`Unknown pose: ${pose}`);
      el.dataset.pose = pose;
    },
    getPose: () => el.dataset.pose,
  };
}
