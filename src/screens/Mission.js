import {MISSIONS} from '../data/missions.js';
import {QUIZ} from '../data/quiz.js';
import {cardHTML} from '../components/Card.js';
import {missionImages,imgTag} from '../services/nasaImages.js';
import {lightbox} from '../components/Modal.js';
import {runQuiz} from '../games/QuizEngine.js';
import {get,update,addXP,collect} from '../state/store.js';
import {fKm,fTime} from '../utils/dom.js';
import {speak,stopSpeak,sfx} from '../services/audio.js';
import {go} from '../router/router.js';
let stop;
export default{name:'mission',
mount(el,{id}){const m=MISSIONS.find(x=>x.id===id);if(!m)return go('/hub');const r=m.real;let imgs=[];
el.innerHTML=`<div class="wrap"><a class="btn sm alt" href="#/world/${m.w}">← Back to map</a>
<div class="mtitle"><h1>${m.n}</h1><div><div class="mono">${r.name} · ${r.status}</div><div>${m.t}</div></div></div>
<div class="mhero skel" id="mh"></div>
<div class="mgrid" style="margin-top:18px"><div>${cardHTML(m,{tag:'div',collected:get().collected.includes(m.n)})}</div><div><div class="tabs"><button class="chip on" data-t="story">📖 Story</button><button class="chip" data-t="data">📊 Real data</button><button class="chip" data-t="photos">📷 NASA photos</button><button class="chip" data-t="quiz">🧠 Quiz</button></div><div class="panel" id="tb"></div></div></div></div>`;
const hero=el.querySelector('#mh');
missionImages(m).then(list=>{imgs=list;if(list[0]){hero.classList.remove('skel');hero.innerHTML=`${imgTag(list[0])}<div class="cap"><b>${list[0].title}</b><br>Credit: ${list[0].credit} · <a href="${list[0].link}" target="_blank" rel="noopener">NASA Image Library</a></div>`}else{hero.classList.remove('skel');hero.style.background=m.c;hero.innerHTML=`<svg viewBox="0 0 200 200" style="height:240px;display:block;margin:auto">${m.ch()}</svg><div class="cap">NASA photos load when you are online.</div>`}if(tab==='photos')show('photos')});
let tab='story';const tb=el.querySelector('#tb');
function show(t){tab=t;stopSpeak();stop?.();el.querySelectorAll('.tabs .chip').forEach(c=>c.classList.toggle('on',c.dataset.t===t));
if(t==='story'){tb.innerHTML=m.p.map(([h,x])=>`<div class="pg"><h3>${h}</h3><p>${x}</p></div>`).join('')+`<button class="btn sm alt" id="rd">🔊 Read aloud</button> <button class="btn sm" id="rm">${get().read.includes(m.n)?'✓ Read':'I read it! +20 XP'}</button>`;
tb.querySelector('#rd').onclick=()=>speak(m.p.map(p=>p.join('. ')).join(' '));tb.querySelector('#rm').onclick=e=>{if(!get().read.includes(m.n)){update(S=>S.read.push(m.n));addXP(20,'for reading');e.target.textContent='✓ Read'}}}
if(t==='data'){const L=[['Launched',r.launchDate],['Arrived',`${r.arrivalDate}. ${r.arrivalEvent}`],['Where',r.location],['Coordinates',r.coordinates],['Distance from Earth',fKm(r.distanceKm)],['A message takes',fTime(r.lightSeconds)],['Speed',r.speedKmS+' km every second'],['Status',r.status]];tb.innerHTML=`<p class="mono">Source: project mission dataset (relics.json)</p><ul class="dl">${L.map(([a,b])=>`<li><b>${a}</b>${b}</li>`).join('')}</ul>`}
if(t==='photos'){tb.innerHTML=imgs.length?`<div class="gal">${imgs.map((i,n)=>`<figure data-n="${n}">${imgTag(i)}</figure>`).join('')}</div><p class="mono">Tap a photo. Images: NASA and partners via the NASA Image and Video Library.</p>`:'<p>No photos yet. Check your internet, or add exact IDs in data/nasaQueries.js (PINNED).</p>';tb.onclick=e=>{const f=e.target.closest('figure');if(f)lightbox(imgs[+f.dataset.n])}}
if(t==='quiz'){const qs=[...QUIZ.filter(q=>q.m===m.n),{q:m.q[0],o:m.q.slice(1),e:''}].slice(0,4);stop=runQuiz(tb,qs,{lives:2,time:20,onEnd:res=>{tb.innerHTML=`<div class="stars">${'⭐'.repeat(res.stars)||'🙂'}</div><h2 style="text-align:center">${res.passed?`You woke up ${m.n}!`:'Almost there!'}</h2><p style="text-align:center">${res.correct}/${res.total} correct · +${res.xp} XP</p><div style="text-align:center"><button class="btn" id="rt">Try again</button></div>`;update(S=>{S.stats.correct+=res.correct;S.stats.answered+=res.total});if(res.xp)addXP(res.xp,'quiz');if(res.passed&&collect(m.n)){sfx.win();addXP(30,`for waking ${m.n}`)}tb.querySelector('#rt').onclick=()=>show('quiz')}})}}
el.querySelectorAll('.tabs .chip').forEach(c=>c.onclick=()=>show(c.dataset.t));show('story')},
unmount(){stop?.();stopSpeak()}};
