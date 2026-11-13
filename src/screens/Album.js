// Explorer passport: who you are, how to wake up explorers, your collection, patches and certificate.
// Waking up an explorer = pass its quiz. This screen explains that in plain steps and gives every sleeping explorer a Wake up button.
import {MISSIONS} from '../robots/index.js';
import {badges} from '../data/badges.js';
import {cardHTML} from '../components/Card.js';
import {get,update,level,levelProgress,reset} from '../state/store.js';
import {certificate} from '../utils/certificate.js';
import {certificateProgress} from '../components/Certificate/rules.js';
import {t} from '../i18n/index.js';
import {rankLabel} from '../i18n/format.js';
import {localBadge} from '../i18n/content.js';
import {creditFooterHTML} from '../components/CreditFooter/CreditFooter.js';
import {createNameForm,playerName} from '../components/PlayerName/PlayerName.js';

const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

export default{name:'album',
mount(el){
  const s=get(),B=badges(MISSIONS).map(localBadge),{woken,total,left,unlocked:all}=certificateProgress(s.collected,MISSIONS);
  const name=playerName(),next=MISSIONS.find(m=>!s.collected.includes(m.n));
  el.innerHTML=
    `<div class="wrap">`+
    // ---- passport
    `<div class="hero"><span class="mono">${t('album.kicker')}</span><h1>${name?esc(name):rankLabel(s)}</h1><p>${name?`${rankLabel(s)} · `:''}${t('album.level',{level:level(s)+1,xp:s.xp,streak:s.streak})}</p><span class="bar" style="max-width:320px;margin:0 auto"><i style="width:${levelProgress(s)*100}%"></i></span></div>`+
    // ---- how to wake up (the part players were missing)
    `<section class="panel al-guide" aria-labelledby="alg"><h2 id="alg">${t('album.guide.title')}</h2><p>${t('album.guide.intro')}</p>`+
      `<ol class="al-steps">${['1','2','3'].map((n,i)=>`<li><span class="al-n" aria-hidden="true">${['😴','📖','🧠'][i]}</span><span><b>${t('album.guide.'+n+'.title')}</b>${t('album.guide.'+n+'.text',{need:2})}</span></li>`).join('')}</ol>`+
      (next?`<p style="text-align:center;margin:14px 0 0"><a class="btn" href="#/mission/${next.id}" data-wake="1">😴 ${t('album.guide.cta',{name:esc(next.n)})}</a></p>`:`<p class="al-done">🎉 ${t('album.guide.allDone')}</p>`)+
    `</section>`+
    // ---- collection
    `<div class="sec"><h2>${t('album.collection')}</h2><span class="mono">${t('album.progress',{n:woken,total})}</span></div>`+
    `<span class="bar" role="progressbar" aria-label="${t('album.collection')}" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${woken}" style="margin-bottom:14px"><i style="width:${woken/total*100}%"></i></span>`+
    `<div class="grid al-grid">${MISSIONS.map(m=>{const awake=s.collected.includes(m.n);
      return `<div class="al-item">${cardHTML(m,{collected:awake}).replace('class="card"',awake?'class="card"':'class="card lock"')}`+
        `<a class="btn sm ${awake?'alt':''}" href="#/mission/${m.id}" ${awake?'':'data-wake="1"'}>${awake?'✓ '+t('album.awake'):'😴 '+t('album.wake')}</a></div>`}).join('')}</div>`+
    // ---- patches
    `<div class="sec"><h2>${t('album.patches')}</h2><span class="mono">${s.badges.length}/${B.length}</span></div>`+
    `<div class="patches">${B.map(b=>{const on=s.badges.includes(b.id);return `<div class="patch ${on?'':'lock'}"><i aria-hidden="true">${b.icon}</i><b>${b.name}</b><br><small>${b.desc}</small><br><small class="pst">${on?'✓ '+t('album.unlocked'):'🔒 '+t('album.locked')}</small></div>`}).join('')}</div>`+
    // ---- certificate
    `<div class="sec"><h2>${t('album.certificate')}</h2></div><div class="panel al-cert" style="color:var(--k)">`+
      `<p><b>${all?t('album.certDone'):t('album.certLocked',{n:total,left})}</b></p>`+
      `<p class="mono">${t('album.progress',{n:woken,total})}</p><span class="bar" role="progressbar" aria-label="${t('album.certificate')}" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${woken}"><i style="width:${woken/total*100}%"></i></span>`+
      `<div id="nameform"></div>`+
      `<p style="margin:12px 0 0"><button class="btn" id="cert" ${all?'':'disabled aria-disabled="true"'}>${t('album.download')}</button>${all?'':` <span class="al-why">${t('album.certWhy')}</span>`}</p></div>`+
    `${creditFooterHTML()}<p style="text-align:center"><button class="btn sm alt" id="rs">${t('album.reset')}</button></p></div>`;

  el.querySelector('#nameform').appendChild(createNameForm({submitKey:'name.save',onSave:()=>{
    // Redraw so the heading and the top bar show the new name at once.
    el.innerHTML='';this.mount(el)}}));
  // "Wake up" buttons open the robot's page straight on its quiz tab.
  el.querySelectorAll('[data-wake]').forEach(a=>a.addEventListener('click',()=>{try{sessionStorage.setItem('fe2.openTab','quiz')}catch{}}));
  el.querySelector('#cert').onclick=()=>{if(all)certificate(playerName(),rankLabel(get()),get().xp)};
  el.querySelector('#rs').onclick=()=>{if(confirm(t('album.resetConfirm'))){reset();location.reload()}};
},unmount(){}};
