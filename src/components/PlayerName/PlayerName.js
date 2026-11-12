// The player's name: asked once on the cover, shown on the dashboard, editable from there and from the Album.
// It is only saved on this device (localStorage), never sent anywhere, and the screen says so.
import './PlayerName.css';
import {t} from '../../i18n/index.js';
import {get,update} from '../../state/store.js';

export const MAX_NAME=20;
/** Trim, collapse spaces, drop characters that could break the page, cap the length. Pure, so it is easy to test. */
export const cleanName=s=>String(s??'').replace(/[<>&"'`]/g,'').replace(/\s+/g,' ').trim().slice(0,MAX_NAME);
export const playerName=()=>cleanName(get().name);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/** Small form: label + input + Save. onSave(name) runs after the name is stored. */
export function createNameForm({onSave,onSkip,submitKey='name.save',autofocus=false}={}){
  const f=document.createElement('form');f.className='namef';f.noValidate=true;
  f.innerHTML=`<label class="namef-l" for="namef-in">${t('name.label')}</label>`+
    `<div class="namef-row"><input id="namef-in" class="in" type="text" maxlength="${MAX_NAME}" autocomplete="nickname" value="${esc(playerName())}" placeholder="${t('name.placeholder')}">`+
    `<button type="submit" class="btn">${t(submitKey)}</button>${onSkip?`<button type="button" class="btn alt namef-skip">${t('name.skip')}</button>`:''}</div>`+
    `<p class="namef-note mono">${t('name.privacy')}</p>`;
  const input=f.querySelector('input');
  f.onsubmit=e=>{e.preventDefault();const n=cleanName(input.value);update(S=>{S.name=n});onSave?.(n)};
  f.querySelector('.namef-skip')?.addEventListener('click',()=>onSkip());
  if(autofocus)setTimeout(()=>input.focus(),50);
  return f;
}
