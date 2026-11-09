import {MISSIONS,WORLDS} from '../data/missions.js';
import {FEATURED_QUERIES} from '../data/nasaQueries.js';
import {cardHTML} from '../components/Card.js';
import {createPlanetPicker} from '../three/PlanetPicker.js';
import {searchImages,imgTag} from '../services/nasaImages.js';
import {lightbox} from '../components/Modal.js';
import {get} from '../state/store.js';
import {t} from '../i18n/index.js';
import {rankLabel} from '../i18n/format.js';
import {worldName} from '../i18n/content.js';
import {go} from '../router/router.js';
let pk,imgs=[];
export default{name:'hub',
mount(el){const s=get();let f='all';
el.innerHTML=`<div class="wrap"><div class="hero"><span class="mono">${t('hub.kicker')}</span><h1>${t('hub.hello',{rank:rankLabel(s)})}</h1><p>${t('hub.sub')}</p><p><a class="btn sm" href="#/map">🗺 ${t('hub.openMap')}</a></p></div><div id="pw"><canvas id="pl"></canvas><span class="pn"></span><span class="pn"></span><span class="pn"></span></div>
<div class="tiles"><a class="tile" href="#/quiz" style="background:var(--mint)"><span>🧠</span><b>${t('game.quiz')}</b>${t('hub.tile.quiz')}</a><a class="tile" href="#/play/lander" style="background:var(--gold)"><span>🛬</span><b>${t('game.lander')}</b>${t('hub.tile.lander')}</a><a class="tile" href="#/play/memory" style="background:var(--pink)"><span>🃏</span><b>${t('game.memory')}</b>${t('hub.tile.memory')}</a><a class="tile" href="#/timeline" style="background:var(--lav)"><span>🕰</span><b>${t('game.timeline')}</b>${t('hub.tile.timeline')}</a></div>
<div class="sec"><h2>${t('hub.archive')}</h2><span class="mono">${t('hub.realPhotos')}</span></div><div class="photos" id="ph">${'<figure class="skel" style="min-height:220px"></figure>'.repeat(3)}</div>
<div class="sec"><h2>${t('hub.allExplorers')}</h2><div class="chips" id="fl"><button class="chip on" data-f="all">${t('common.all')}</button>${Object.entries(WORLDS).map(([k,w])=>`<button class="chip" data-f="${k}">${w.emoji} ${worldName(k)}</button>`).join('')}</div></div><div class="grid" id="gr"></div></div>`;
const draw=()=>{el.querySelector('#gr').innerHTML=MISSIONS.filter(m=>f==='all'||m.w===f).map(m=>cardHTML(m,{collected:get().collected.includes(m.n)})).join('')};draw();
el.querySelector('#fl').onclick=e=>{const b=e.target.closest('[data-f]');if(!b)return;f=b.dataset.f;el.querySelectorAll('#fl .chip').forEach(c=>c.classList.toggle('on',c===b));draw()};
pk=createPlanetPicker(el.querySelector('#pl'),[...el.querySelectorAll('.pn')],k=>go('/world/'+k));
const q=FEATURED_QUERIES[Math.random()*FEATURED_QUERIES.length|0];searchImages(q,8).then(list=>{imgs=list;const ph=el.querySelector('#ph');if(!ph)return;ph.innerHTML=list.length?list.map((i,n)=>`<figure data-n="${n}">${imgTag(i)}<figcaption><b>${i.title}</b><br><small>${i.credit}</small></figcaption></figure>`).join(''):`<p class="mono">${t('hub.noPhotos')}</p>`;ph.onclick=e=>{const fg=e.target.closest('figure');if(fg)lightbox(imgs[+fg.dataset.n])}})},
unmount(){pk?.dispose()}};