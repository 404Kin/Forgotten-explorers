// Simple lightbox for NASA photos.
import {t} from '../i18n/index.js';
export function lightbox(img){const m=document.getElementById('modal');const opener=document.activeElement;m.innerHTML=`<div class="lb" role="dialog" aria-modal="true" aria-label="${img.title.replace(/"/g,'')}"><button class="x" aria-label="${t('common.close')}">✖</button><img src="${img.medium}" alt="${img.title}" onerror="this.onerror=null;this.src='${img.thumb}'"><p><b>${img.title}</b><br>${img.desc?img.desc+'…<br>':''}<small>${t('modal.credit',{credit:img.credit})} · ${img.date||''} · <a href="${img.link}" target="_blank" rel="noopener">${t('modal.openLibrary')}</a></small></p></div>`;m.classList.add('on');
// Keyboard: focus moves into the dialog, Esc closes it, and focus returns to the photo that opened it.
const close=()=>{m.classList.remove('on');m.innerHTML='';document.removeEventListener('keydown',onKey);opener?.focus?.()};
const onKey=e=>{if(e.key==='Escape')close()};document.addEventListener('keydown',onKey);
m.onclick=e=>{if(e.target===m||e.target.classList.contains('x'))close()};m.querySelector('.x').focus()}
