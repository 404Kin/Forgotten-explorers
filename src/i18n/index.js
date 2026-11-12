// i18n loader. English ships in the main bundle (always available, so t() never has to wait);
// other languages load on demand. A missing key or a missing language file falls back to English.
import en from './locales/en.json';
import {LANGUAGES,DEFAULT_LANG,STORAGE_KEY} from './languages.js';
import {translate,pickLanguage} from './translate.js';

// Lazy glob: a language file that does not exist yet is simply not in this map (no build error).
// A language can come in several files that are merged: locales/<code>.json (the main file), ./<code>.json (the team put one
// here too, which used to be ignored so Bangla never loaded), locales/<code>.<part>.json (extra parts) and the game's own
// i18n/<code>.<part>.json. The plain <code>.json files are merged last, so the translators' text always wins.
const files=import.meta.glob(['./locales/*.json','./*.json','../games/**/i18n/*.json','!./locales/en.json','!./**/en.json']);
const partsFor=code=>Object.keys(files)
  .filter(p=>{const f=p.split('/').pop();return f===`${code}.json`||f.startsWith(`${code}.`)})
  .sort((a,b)=>(a.split('/').pop()===`${code}.json`)-(b.split('/').pop()===`${code}.json`));
const dicts={en};const subs=new Set();let lang=DEFAULT_LANG;const warned=new Set();
const enabled=()=>LANGUAGES.filter(l=>l.enabled);

export const getLang=()=>lang;
export const getDir=()=>LANGUAGES.find(l=>l.code===lang)?.dir||'ltr';
export const languages=()=>enabled();
export const onLangChange=fn=>(subs.add(fn),()=>subs.delete(fn));

/** t('hub.hello',{rank}) : UI text. Logs a missing key once (dev help) and shows the English text instead. */
export function t(key,vars){
  if(import.meta.env?.DEV&&!(key in en)&&!warned.has(key)){warned.add(key);console.warn('[i18n] missing key in en.json:',key)}
  return translate(dicts,lang===DEFAULT_LANG?[DEFAULT_LANG]:[lang,DEFAULT_LANG],key,vars);
}
/** tx(key, fallbackText) : content that lives in src/data. A translation overrides it when present. */
export const tx=(key,fallback,vars)=>translate(dicts,lang===DEFAULT_LANG?[DEFAULT_LANG]:[lang,DEFAULT_LANG],key,vars,fallback);

const loadedFonts=new Set();
function loadFont(url){if(!url||loadedFonts.has(url))return;loadedFonts.add(url);const l=document.createElement('link');l.rel='stylesheet';l.href=url;document.head.appendChild(l)}

function apply(){const L=LANGUAGES.find(l=>l.code===lang);const r=document.documentElement;r.lang=lang;r.dir=L?.dir||'ltr';loadFont(L?.font);document.title=t('app.title')}

/** Switch language. Returns the language actually used (English if the file failed to load). */
export async function setLang(code){
  const L=enabled().find(l=>l.code===code)||enabled()[0];
  if(!dicts[L.code]){
    const parts=partsFor(L.code);
    try{dicts[L.code]=Object.assign({},...(await Promise.all(parts.map(async p=>(await files[p]()).default))))}
    catch{/* offline or bad file: keep English */}
    if(!parts.length)delete dicts[L.code];
  }
  lang=dicts[L.code]?L.code:DEFAULT_LANG;
  try{localStorage.setItem(STORAGE_KEY,L.code)}catch{}
  apply();subs.forEach(f=>f(lang));return lang;
}

// Start-up: apply the saved/browser language without blocking the first render.
(function init(){let saved=null;try{saved=localStorage.getItem(STORAGE_KEY)}catch{}
  const first=pickLanguage(enabled().map(l=>l.code),saved,typeof navigator!=='undefined'?navigator.languages:[],DEFAULT_LANG);
  apply();if(first!==DEFAULT_LANG)setLang(first)})();
