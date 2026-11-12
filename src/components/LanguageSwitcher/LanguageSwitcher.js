// Language picker. A native <select> is keyboard + screen-reader friendly and works on every phone.
import './LanguageSwitcher.css';
import {t,languages,getLang,setLang} from '../../i18n/index.js';

/** Returns null when only one language is enabled: a picker with one choice would only confuse people. */
export function createLanguageSwitcher(){
  if(languages().length<2)return null;
  const wrap=document.createElement('label');wrap.className='langsel';
  // Visible globe is decoration; the name for screen readers comes from the translated aria-label.
  wrap.innerHTML=`<span aria-hidden="true">🌐</span><select aria-label="${t('language.label')}">${languages().map(l=>`<option value="${l.code}" lang="${l.code}"${l.code===getLang()?' selected':''}>${l.label}</option>`).join('')}</select>`;
  // If the chosen language could not load (offline, missing file) the app stays in English, so put the picker back to match.
  const select=wrap.querySelector('select');
  select.onchange=async e=>{const used=await setLang(e.target.value);if(used!==e.target.value)select.value=used};
  return wrap;
}
