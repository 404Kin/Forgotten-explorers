import {MISSIONS} from '../data/missions.js';
import {badges} from '../data/badges.js';
import {cardHTML} from '../components/Card.js';
import {get,update,rank,level,levelProgress,reset} from '../state/store.js';
import {certificate} from '../utils/certificate.js';
export default{name:'album',
mount(el){const s=get(),B=badges(MISSIONS),all=s.collected.length>=MISSIONS.length;
el.innerHTML=`<div class="wrap"><div class="hero"><span class="mono">Explorer passport</span><h1>${rank(s)}</h1><p>Level ${level(s)+1} · ${s.xp} XP · 🔥 ${s.streak}-day streak</p><span class="bar" style="max-width:320px;margin:0 auto"><i style="width:${levelProgress(s)*100}%"></i></span></div>
<div class="sec"><h2>Mission patches</h2><span class="mono">${s.badges.length}/${B.length}</span></div><div class="patches">${B.map(b=>`<div class="patch ${s.badges.includes(b.id)?'':'lock'}"><i>${b.icon}</i><b>${b.name}</b><br><small>${b.desc}</small></div>`).join('')}</div>
<div class="sec"><h2>Collection</h2><span class="mono">${s.collected.length}/${MISSIONS.length} woken</span></div><div class="grid">${MISSIONS.map(m=>cardHTML(m,{collected:s.collected.includes(m.n)}).replace('class="card"',s.collected.includes(m.n)?'class="card"':'class="card lock"')).join('')}</div>
<div class="sec"><h2>Certificate</h2></div><div class="panel" style="color:var(--k)"><p>${all?'You woke up every explorer! Print your certificate.':'Wake up all 11 explorers to unlock your certificate.'}</p><input class="in" id="nm" placeholder="Your name" value="${s.name}" maxlength="28"> <button class="btn" id="cert" ${all?'':'disabled style="opacity:.5"'}>Download certificate</button></div>
<footer class="credit">Photos and mission data: NASA and partners (NASA Image and Video Library). This app is an independent educational project and is not affiliated with or endorsed by NASA.<br><button class="btn sm alt" id="rs" style="margin-top:12px">Reset my progress</button></footer></div>`;
el.querySelector('#nm').oninput=e=>update(S=>{S.name=e.target.value});el.querySelector('#cert').onclick=()=>certificate(get().name,rank(get()),get().xp);
el.querySelector('#rs').onclick=()=>{if(confirm('Delete all progress?')){reset();location.reload()}}},unmount(){}};
