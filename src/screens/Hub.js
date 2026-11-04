import {MISSIONS,WORLDS} from '../data/missions.js';
import {FEATURED_QUERIES} from '../data/nasaQueries.js';
import {cardHTML} from '../components/Card.js';
import {createPlanetPicker} from '../three/PlanetPicker.js';
import {searchImages,imgTag} from '../services/nasaImages.js';
import {lightbox} from '../components/Modal.js';
import {get,rank} from '../state/store.js';
import {go} from '../router/router.js';
let pk,imgs=[];
export default{name:'hub',
mount(el){const s=get();let f='all';
el.innerHTML=`<div class="wrap"><div class="hero"><span class="mono">Mission control</span><h1>Hello, ${rank(s)}!</h1><p>Tap a planet to start exploring.</p><p><a class="btn sm" href="#/map">🗺 Open the Solar System map</a></p></div><div id="pw"><canvas id="pl"></canvas><span class="pn"></span><span class="pn"></span><span class="pn"></span></div>
<div class="tiles"><a class="tile" href="#/quiz" style="background:var(--mint)"><span>🧠</span><b>Mission Quiz</b>Earn XP and streaks</a><a class="tile" href="#/play/lander" style="background:var(--gold)"><span>🛬</span><b>Soft Landing</b>Land a robot gently</a><a class="tile" href="#/play/memory" style="background:var(--pink)"><span>🃏</span><b>Memory Match</b>Match robots and names</a><a class="tile" href="#/timeline" style="background:var(--lav)"><span>🕰</span><b>Timeline</b>1969 until today</a></div>
<div class="sec"><h2>From NASA’s archive</h2><span class="mono">Real photos</span></div><div class="photos" id="ph">${'<figure class="skel" style="min-height:220px"></figure>'.repeat(3)}</div>
<div class="sec"><h2>All explorers</h2><div class="chips" id="fl"><button class="chip on" data-f="all">All</button>${Object.entries(WORLDS).map(([k,w])=>`<button class="chip" data-f="${k}">${w.emoji} ${w.name}</button>`).join('')}</div></div><div class="grid" id="gr"></div></div>`;
const draw=()=>{el.querySelector('#gr').innerHTML=MISSIONS.filter(m=>f==='all'||m.w===f).map(m=>cardHTML(m,{collected:get().collected.includes(m.n)})).join('')};draw();
el.querySelector('#fl').onclick=e=>{const b=e.target.closest('[data-f]');if(!b)return;f=b.dataset.f;el.querySelectorAll('#fl .chip').forEach(c=>c.classList.toggle('on',c===b));draw()};
pk=createPlanetPicker(el.querySelector('#pl'),[...el.querySelectorAll('.pn')],k=>go('/world/'+k));
const q=FEATURED_QUERIES[Math.random()*FEATURED_QUERIES.length|0];searchImages(q,8).then(list=>{imgs=list;const ph=el.querySelector('#ph');if(!ph)return;ph.innerHTML=list.length?list.map((i,n)=>`<figure data-n="${n}">${imgTag(i)}<figcaption><b>${i.title}</b><br><small>${i.credit}</small></figcaption></figure>`).join(''):'<p class="mono">Connect to the internet to see NASA photos.</p>';ph.onclick=e=>{const fg=e.target.closest('figure');if(fg)lightbox(imgs[+fg.dataset.n])}})},
unmount(){pk?.dispose()}};