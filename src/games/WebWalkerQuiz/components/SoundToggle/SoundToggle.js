import { h, fromMarkup } from '../../utils/dom.js';

const ICON_ON = `<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false"><path d="M3 9v6h4l5 4V5L7 9H3z" fill="currentColor"/><path d="M15 8.5a5 5 0 0 1 0 7M17.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
const ICON_OFF = `<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false"><path d="M3 9v6h4l5 4V5L7 9H3z" fill="currentColor"/><path d="M16 9l6 6M22 9l-6 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>`;

/** Mute button. The icon shape (waves vs cross) and label both change. */
export function createSoundToggle({ t, sound }) {
  const button = h('button', {
    class: 'ws-btn ws-btn--ghost',
    type: 'button',
    onClick: () => sound.toggleMuted(),
  });
  const render = () => {
    const muted = sound.isMuted();
    const label = muted ? t('hud.unmute') : t('hud.mute');
    button.setAttribute('aria-label', label);
    button.title = label;
    button.replaceChildren(fromMarkup(muted ? ICON_OFF : ICON_ON));
  };
  render();
  const off = sound.onChange(render);
  return { el: button, refresh: render, destroy: off };
}
