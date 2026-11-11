// Language picker. A native <select> is keyboard + screen-reader friendly and works on every phone.
import './LanguageSwitcher.css';
import {t,languages,getLang,setLang} from '../../i18n/index.js';

export function createLanguageSwitcher(){
  const wrap=document.createElement('label');wrap.className='langsel';
  // Visible globe is decoration; the name for screen readers comes from the translated aria-label.
  wrap.innerHTML=`<span aria-hidden="true">🌐</span><select aria-label="${t('language.label')}">${languages().map(l=>`<option value="${l.code}" lang="${l.code}"${l.code===getLang()?' selected':''}>${l.label}</option>`).join('')}</select>`;
  wrap.querySelector('select').onchange=e=>setLang(e.target.value);
  return wrap;
}
