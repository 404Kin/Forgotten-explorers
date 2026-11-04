import {get,subscribe,rank,levelProgress} from '../state/store.js';
const NAV=[['/map','Map','🗺'],['/hub','Explore','🧭'],['/quiz','Quiz','🧠'],['/play','Play','🎮'],['/album','Album','📖']];
export function mountChrome(){const top=document.getElementById('topbar'),tab=document.getElementById('tabbar');
const draw=()=>{const s=get();top.innerHTML=`<a class="brand" href="#/hub"><i></i><span>FORGOTTEN<br>EXPLORERS</span></a><nav class="dnav">${NAV.map(([p,l])=>`<a href="#${p}" data-p="${p}">${l}</a>`).join('')}</nav><a class="rank" href="#/album"><b>${rank(s)}</b><span class="bar"><i style="width:${levelProgress(s)*100}%"></i></span><small>${s.xp} XP · 🔥${s.streak}</small></a>`;tab.innerHTML=NAV.map(([p,l,e])=>`<a href="#${p}" data-p="${p}"><span>${e}</span>${l}</a>`).join('');mark()};
const mark=()=>document.querySelectorAll('[data-p]').forEach(a=>a.classList.toggle('on',location.hash.startsWith('#'+a.dataset.p)));
subscribe(draw);addEventListener('hashchange',mark);draw()}