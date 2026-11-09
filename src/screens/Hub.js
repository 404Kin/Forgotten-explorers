import {MISSIONS,WORLDS} from '../data/missions.js';
import {FEATURED_QUERIES} from '../data/nasaQueries.js';
import {cardHTML} from '../components/Card.js';
import {createPlanetPicker} from '../three/PlanetPicker.js';
import {searchImages,imgTag} from '../services/nasaImages.js';
import {lightbox} from '../components/Modal.js';
import {get} from '../state/store.js';
import {renderState,loadInto} from '../components/StateView/StateView.js';
import {ApiError} from '../services/api.js';
import {t} from '../i18n/index.js';
import {rankLabel} from '../i18n/format.js';
import {worldName} from '../i18n/content.js';
import {go} from '../router/router.js';
let pk,imgs=[];
export default{name:'hub',
mount(el){const s=get();let f='all';
el.innerHTML=`<div class="wrap"><div class="hero"><span class="mono">${t('hub.kicker')}</span><h1>${t('hub.hello',{rank:rankLabel(s)})}</h1><p>${t('hub.sub')}</p><p><a class="btn sm" href="#/map">🗺 ${t('hub.openMap')}</a></p></div><div id="pw"></div>
<div class="tiles"><a class="tile" href="#/quiz" style="background:var(--mint)"><span>🧠</span><b>${t('game.quiz')}</b>${t('hub.tile.quiz')}</a><a class="tile" href="#/play/lander" style="background:var(--gold)"><span>🛬</span><b>${t('game.lander')}</b>${t('hub.tile.lander')}</a><a class="tile" href="#/play/memory" style="background:var(--pink)"><span>🃏</span><b>${t('game.memory')}</b>${t('hub.tile.memory')}</a><a class="tile" href="#/timeline" style="background:var(--lav)"><span>🕰</span><b>${t('game.timeline')}</b>${t('hub.tile.timeline')}</a></div>
<div class="sec"><h2>${t('hub.archive')}</h2><span class="mono">${t('hub.realPhotos')}</span></div><div class="photos" id="ph"></div>
<div class="sec"><h2>${t('hub.allExplorers')}</h2><div class="chips" id="fl"><button class="chip on" data-f="all">${t('common.all')}</button>${Object.entries(WORLDS).map(([k,w])=>`<button class="chip" data-f="${k}">${w.emoji} ${worldName(k)}</button>`).join('')}</div></div><div class="grid" id="gr"></div></div>`;
const draw=()=>{el.querySelector('#gr').innerHTML=MISSIONS.filter(m=>f==='all'||m.w===f).map(m=>cardHTML(m,{collected:get().collected.includes(m.n)})).join('')};draw();
el.querySelector('#fl').onclick=e=>{const b=e.target.closest('[data-f]');if(!b)return;f=b.dataset.f;el.querySelectorAll('#fl .chip').forEach(c=>c.classList.toggle('on',c===b));draw()};
// WebGL can be missing or blocked: show the shared error state (with Retry) instead of an empty box.
const pw=el.querySelector('#pw');const boot3d=()=>{pw.innerHTML='<canvas id="pl" role="img" aria-label="'+t('hub.sub')+'"></canvas><span class="pn"></span><span class="pn"></span><span class="pn"></span>';
try{pk=createPlanetPicker(pw.querySelector('#pl'),[...pw.querySelectorAll('.pn')],k=>go('/world/'+k))}catch{pk=null;renderState(pw,'error',{messageKey:'state.webgl',onRetry:boot3d})}};boot3d();
const q=FEATURED_QUERIES[Math.random()*FEATURED_QUERIES.length|0];
// searchImages() answers [] when the network fails, so an empty list means "could not load" here, not "no photos exist".
loadInto(el.querySelector('#ph'),async()=>{const list=await searchImages(q,8);if(!list.length)throw new ApiError('NETWORK','no photos');return list},{
render:(list,ph)=>{imgs=list;ph.innerHTML=list.map((i,n)=>`<figure data-n="${n}">${imgTag(i)}<figcaption><b>${i.title}</b><br><small>${i.credit}</small></figcaption></figure>`).join('');ph.onclick=e=>{const fg=e.target.closest('figure');if(fg)lightbox(imgs[+fg.dataset.n])}},
error:{messageKey:'hub.noPhotos'},compact:true})},
unmount(){pk?.dispose()}};