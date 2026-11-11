import './styles/base.css';
import { resolveConfig } from './config/env.js';
import { createI18n } from './i18n/i18n.js';
import { createStorage, createProgressStore } from './services/storage.js';
import { createErrorHandler } from './services/errors.js';
import { createSoundManager } from './components/SoundManager/SoundManager.js';
import { createGame } from './app/Game.js';

/**
 * Mount the quiz into any element. Give it a dedicated container: the game styles
 * that element (it becomes the full-height game root).
 *
 * @param {string|HTMLElement} target  selector or element
 * @param {object} [options]  overrides for src/config/game.config.js
 *   (title, characterName, hearts, questionCount, colors, locale, ...) plus
 *   `onGameEnd({ score, won, correct, total })` runs once when a game finishes.
 * @returns {{ destroy(): void, restart(): void, setLocale(code: string): void }}
 */
export function mountGame(target, options = {}) {
  const root = typeof target === 'string' ? document.querySelector(target) : target;
  if (!root) throw new Error(`mountGame: target not found (${String(target)})`);

  const i18n = createI18n();
  // The title is UI text, so it comes from the translation file, not from game.config.js.
  const { onGameEnd, embedded = false, ...configOptions } = options;
  const config = resolveConfig({ title: i18n.t('title'), ...configOptions });
  const storage = createStorage(config.storage.prefix);
  const progress = createProgressStore(storage);
  const settings = progress.getSettings();
  const errors = createErrorHandler();

  const sound = createSoundManager({
    volume: config.sound.volume,
    muted: settings.muted ?? !config.sound.enabledByDefault,
    onMutedChange: (muted) => progress.saveSettings({ muted }),
  });

  root.classList.add(config.rootClass);
  // Inside the host app the game sits under the top bar, so it must not claim the full screen height.
  if (embedded) root.classList.add('ws-embedded');
  for (const [name, value] of Object.entries(config.colors)) {
    root.style.setProperty(`--ws-${name}`, value);
  }
  root.setAttribute('role', 'region');

  const game = createGame({ root, config, i18n, progress, sound, errors, onGameEnd });
  game.boot();

  // The animated backdrop is decorative, so it loads after the first paint.
  let background = null;
  let destroyed = false;
  import('./components/Background/Background.js').then(({ createBackground }) => {
    if (destroyed) return;
    background = createBackground({ root });
    root.prepend(background.el);
  });

  return {
    destroy() {
      destroyed = true;
      game.destroy();
      background?.destroy();
      root.classList.remove(config.rootClass, 'ws-embedded');
    },
    restart: game.restart,
    setLocale: game.setLocale,
  };
}
