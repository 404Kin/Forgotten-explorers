// Match each robot's picture with its name card. Teaches names + launch years.
import {MISSIONS} from '../data/missions.js';
import {shuffle} from '../utils/dom.js';
import {addXP,update} from '../state/store.js';
import {sfx} from '../services/audio.js';
import {t} from '../i18n/index.js';
import {inkFor} from '../components/contrast.js';
export default{name:'memory',
mount(el){const start=()=>{const pick=shuffle(MISSIONS).slice(0,6);const tiles=shuffle(pick.flatMap(m=>[{m,t:'art'},{m,t:'name'}]));let open=[],matched=0,moves=0,lock=false;
el.innerHTML=`<div class="wrap"><a class="btn sm alt" href="#/play"><span aria-hidden="true">←</span> ${t('game.back')}</a><div class="hero"><h1>${t('game.memory')}</h1><p id="mv" aria-live="polite">${t('memory.sub',{moves:0})}</p></div><div class="mem" id="bd"></div></div>`;const bd=el.querySelector('#bd');
tiles.forEach((tl,i)=>{const b=document.createElement('button');b.className='tileM back';b.textContent='?';b.setAttribute('aria-label',t('memory.hidden'));b.onclick=()=>{if(lock||b.dataset.open)return;sfx.tap();b.dataset.open=1;b.classList.remove('back');b.style.background=tl.m.c;b.style.color=inkFor(tl.m.c,tl.m.k);b.innerHTML=tl.t==='art'?`<svg viewBox="0 0 200 200">${tl.m.ch()}</svg>`:`${tl.m.n}<br><small>${tl.m.y}</small>`;open.push([b,tl]);
if(open.length===2){moves++;el.querySelector('#mv').textContent=t('memory.sub',{moves});const[[b1,t1],[b2,t2]]=open;open=[];if(t1.m===t2.m&&t1.t!==t2.t){matched++;sfx.good();if(matched===6){const xp=Math.max(10,70-moves*3);sfx.win();update(S=>{S.stats.memory++});addXP(xp,t('memory.xpReason'));const p=document.createElement('div');p.className='panel';p.style.cssText='margin:20px auto;max-width:420px;text-align:center';p.innerHTML=`<h2>🎉 ${t('memory.won')}</h2><p>${t('memory.result',{moves,xp})}</p><button class="btn" id="ag">${t('common.playAgain')}</button>`;el.querySelector('.wrap').appendChild(p);p.querySelector('#ag').onclick=start}}
else{lock=true;setTimeout(()=>{[b1,b2].forEach(x=>{delete x.dataset.open;x.className='tileM back';x.style.background='';x.style.color='';x.textContent='?'});lock=false},800)}}};bd.appendChild(b)})};start()},unmount(){}};
