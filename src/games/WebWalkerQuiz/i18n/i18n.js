// Adapter: this game used to ship its own i18n. It now reads the app's single translation system (src/i18n),
// so there is one language switcher, one en.json for P1 to translate, and Bangla/RTL come for free.
// All of the game's text lives under the "ww." prefix in src/i18n/locales/*.json.
import {t as appT,getLang,setLang,languages,onLangChange,getDir} from '../../../i18n/index.js';

export function createI18n() {
  return {
    t: (key, params) => appT(`ww.${key}`, params),
    getLocale: getLang,
    getDirection: getDir,
    languages: () => languages().map((l) => ({ code: l.code, name: l.label })),
    setLocale(code) {
      setLang(code);
      return true;
    },
    onChange: onLangChange,
    addLocale() {},
  };
}
