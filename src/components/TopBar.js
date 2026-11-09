import {get,subscribe,levelProgress} from '../state/store.js';
import {t,onLangChange} from '../i18n/index.js';
import {rankLabel} from '../i18n/format.js';
import {createLanguageSwitcher} from './LanguageSwitcher/LanguageSwitcher.js';
// [route, translation key, tab-bar icon]. Labels are keys so the menu follows the language.
const NAV=[['/map','nav.map','🗺'],['/hub','nav.explore','🧭'],['/quiz','nav.quiz','🧠'],['/play','nav.play','🎮'],['/album','nav.album','📖']];
export function mountChrome(){const top=document.getElementById('topbar'),tab=document.getElementById('tabbar');
const draw=()=>{const s=get();top.innerHTML=`<a class="brand" href="#/hub"><i></i><span>${t('brand.line1')}<br>${t('brand.line2')}</span></a><nav class="dnav" aria-label="${t('nav.label')}">${NAV.map(([p,k])=>`<a href="#${p}" data-p="${p}">${t(k)}</a>`).join('')}</nav><a class="rank" href="#/album"><b>${rankLabel(s)}</b><span class="bar"><i style="width:${levelProgress(s)*100}%"></i></span><small>${t('topbar.stats',{xp:s.xp,streak:s.streak})}</small></a>`;
top.insertBefore(createLanguageSwitcher(),top.querySelector('.rank'));
tab.setAttribute('aria-label',t('nav.label'));tab.innerHTML=NAV.map(([p,k,e])=>`<a href="#${p}" data-p="${p}"><span aria-hidden="true">${e}</span>${t(k)}</a>`).join('');mark()};
const mark=()=>document.querySelectorAll('[data-p]').forEach(a=>a.classList.toggle('on',location.hash.startsWith('#'+a.dataset.p)));
subscribe(draw);addEventListener('hashchange',mark);
// Language change: redraw the menu and re-run the current route so every screen is rebuilt in the new language
// (router.js is not ours to edit, so we reuse its hashchange listener).
onLangChange(()=>{draw();dispatchEvent(new HashChangeEvent('hashchange'))});draw()}
