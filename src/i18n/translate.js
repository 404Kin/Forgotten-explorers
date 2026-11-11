// Pure translation logic (no DOM, no fetch) so it is easy to unit-test later.
// Lookup order: current language -> English -> optional fallback text -> the key itself.

/** Replace {name} placeholders. Unknown placeholders are left visible so mistakes are easy to spot. */
export const interpolate=(text,vars)=>vars?text.replace(/\{(\w+)\}/g,(m,k)=>(k in vars?vars[k]:m)):text;

/**
 * @param {Record<string,Record<string,string>>} dicts  loaded dictionaries by language code
 * @param {string[]} chain  language codes to try in order, e.g. ['bn','en']
 */
export function translate(dicts,chain,key,vars,fallback){
  for(const lang of chain){const v=dicts[lang]?.[key];if(typeof v==='string'&&v!=='')return interpolate(v,vars)}
  return interpolate(fallback!==undefined?String(fallback):key,vars);
}

/** Pick the best enabled language: saved choice first, then the browser language, then the default. */
export function pickLanguage(codes,saved,browserList,fallback){
  if(saved&&codes.includes(saved))return saved;
  for(const b of browserList||[]){const c=String(b).toLowerCase().split('-')[0];if(codes.includes(c))return c}
  return fallback;
}
