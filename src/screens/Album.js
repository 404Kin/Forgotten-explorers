import {MISSIONS} from '../data/missions.js';
import {badges} from '../data/badges.js';
import {cardHTML} from '../components/Card.js';
import {get,update,level,levelProgress,reset} from '../state/store.js';
import {t} from '../i18n/index.js';
import {rankLabel} from '../i18n/format.js';
import {localBadge} from '../i18n/content.js';
import {certificate} from '../utils/certificate.js';
export default{name:'album',
mount(el){const s=get(),B=badges(MISSIONS).map(localBadge),all=s.collected.length>=MISSIONS.length;
el.innerHTML=`<div class="wrap"><div class="hero"><span class="mono">${t('album.kicker')}</span><h1>${rankLabel(s)}</h1><p>${t('album.level',{level:level(s)+1,xp:s.xp,streak:s.streak})}</p><span class="bar" style="max-width:320px;margin:0 auto"><i style="width:${levelProgress(s)*100}%"></i></span></div>
<div class="sec"><h2>${t('album.patches')}</h2><span class="mono">${s.badges.length}/${B.length}</span></div><div class="patches">${B.map(b=>`<div class="patch ${s.badges.includes(b.id)?'':'lock'}"><i>${b.icon}</i><b>${b.name}</b><br><small>${b.desc}</small></div>`).join('')}</div>
<div class="sec"><h2>${t('album.collection')}</h2><span class="mono">${s.collected.length}/${MISSIONS.length} ${t('album.woken')}</span></div><div class="grid">${MISSIONS.map(m=>cardHTML(m,{collected:s.collected.includes(m.n)}).replace('class="card"',s.collected.includes(m.n)?'class="card"':'class="card lock"')).join('')}</div>
<div class="sec"><h2>${t('album.certificate')}</h2></div><div class="panel" style="color:var(--k)"><p>${all?t('album.certDone'):t('album.certLocked',{n:MISSIONS.length})}</p><input class="in" id="nm" placeholder="${t('album.namePlaceholder')}" aria-label="${t('album.namePlaceholderLabel')}" value="${s.name}" maxlength="28"> <button class="btn" id="cert" ${all?'':'disabled style="opacity:.5"'}>${t('album.download')}</button></div>
<footer class="credit">${t('credit.text')} ${t('credit.disclaimer')}<br><button class="btn sm alt" id="rs" style="margin-top:12px">${t('album.reset')}</button></footer></div>`;
el.querySelector('#nm').oninput=e=>update(S=>{S.name=e.target.value});el.querySelector('#cert').onclick=()=>certificate(get().name,rankLabel(get()),get().xp);
el.querySelector('#rs').onclick=()=>{if(confirm(t('album.resetConfirm'))){reset();location.reload()}}},unmount(){}};
