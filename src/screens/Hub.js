import {MISSIONS,WORLDS} from '../robots/index.js';
import {FEATURED_QUERIES} from '../data/nasaQueries.js';
import {cardHTML} from '../components/Card.js';
import {searchImages,imgTag} from '../services/nasaImages.js';
import {lightbox} from '../components/Modal.js';
import {get} from '../state/store.js';
import {createFilters,applyFilters} from '../components/Filters/Filters.js';
import {STATUSES,STATUS_IDS} from '../components/StatusBadge/StatusBadge.js';
import {statusOf,ApiError} from '../services/api.js';
import {creditFooterHTML} from '../components/CreditFooter/CreditFooter.js';
import {renderState,loadInto} from '../components/StateView/StateView.js';
import {t} from '../i18n/index.js';
import {rankLabel} from '../i18n/format.js';
import {createNameForm,playerName} from '../components/PlayerName/PlayerName.js';
import {level,levelProgress} from '../state/store.js';
import {go} from '../router/router.js';
let pk,imgs=[];
export default{name:'hub',
mount(el){const s=get();
el.innerHTML=`<div class="wrap"><div class="hero"><span class="mono">${t('hub.kicker')}</span><div id="me"></div><p>${t('hub.sub')}</p><p><a class="btn sm" href="#/map">🗺 ${t('hub.openMap')}</a></p></div><div id="pw"></div>
<div class="tiles"><a class="tile" href="#/quiz" style="background:var(--mint)"><span>🧠</span><b>${t('game.quiz')}</b>${t('hub.tile.quiz')}</a><a class="tile" href="#/play/lander" style="background:var(--gold)"><span>🛬</span><b>${t('game.lander')}</b>${t('hub.tile.lander')}</a><a class="tile" href="#/play/memory" style="background:var(--pink)"><span>🃏</span><b>${t('game.memory')}</b>${t('hub.tile.memory')}</a><a class="tile" href="#/last-message" style="background:var(--pink)"><span>💌</span><b>${t('game.lastMessage')}</b>${t('hub.tile.lastMessage')}</a><a class="tile" href="#/live" style="background:var(--mint)"><span>📡</span><b>${t('live.title')}</b>${t('hub.tile.live')}</a><a class="tile" href="#/why" style="background:var(--cream)"><span>❓</span><b>${t('whyLeft.title')}</b>${t('hub.tile.why')}</a><a class="tile" href="#/timeline" style="background:var(--lav)"><span>🕰</span><b>${t('game.timeline')}</b>${t('hub.tile.timeline')}</a></div>
<div class="sec"><h2>${t('hub.archive')}</h2><span class="mono">${t('hub.realPhotos')}</span></div><div class="photos" id="ph"></div>
<div class="sec"><h2>${t('hub.allExplorers')}</h2></div><div id="fl"></div><p class="mono" id="cnt" role="status" aria-live="polite"></p><div class="grid" id="gr"></div>${creditFooterHTML()}</div>`;
// Personal dashboard card: name, rank, XP bar. The name is asked on the cover; here it can be added or changed.
const me=el.querySelector('#me');
const drawMe=(editing=false)=>{const st=get(),n=playerName();
  if(editing){me.innerHTML='<div class="panel hub-me hub-form"></div>';const f=createNameForm({submitKey:'name.save',onSave:()=>drawMe(false),onSkip:()=>drawMe(false)});me.firstChild.appendChild(f);f.querySelector('input').focus();return}
  // No name yet (skipped on the cover): a friendly welcome with one button, not a big form.
  if(!n){me.innerHTML=`<div class="panel hub-me"><span class="hub-av" aria-hidden="true">?</span><div><h1>${t('hub.welcome')}</h1><p class="hub-rank">${t('hub.rankLine',{rank:rankLabel(st),xp:st.xp})}</p><span class="bar"><i style="width:${levelProgress(st)*100}%"></i></span></div><button type="button" class="btn sm" id="chn">✏️ ${t('name.add')}</button></div>`;me.querySelector('#chn').onclick=()=>drawMe(true);return}
  me.innerHTML=`<div class="panel hub-me"><span class="hub-av" aria-hidden="true">${n[0].toUpperCase()}</span><div><h1>${t('hub.helloName',{name:n.replace(/[&<>"]/g,'')})}</h1><p class="hub-rank">${t('hub.rankLine',{rank:rankLabel(st),xp:st.xp})}</p><span class="bar"><i style="width:${levelProgress(st)*100}%"></i></span></div><button type="button" class="btn sm alt" id="chn">✏️ ${t('name.change')}</button></div>`;
  me.querySelector('#chn').onclick=()=>drawMe(true)};
drawMe();
// World + status filters (shared Filters component). Status comes from statusOf(): PLACEHOLDER until P1 gives status.
const GROUPS=[{id:'world',labelKey:'filter.world',options:Object.keys(WORLDS).map(k=>({value:k,labelKey:`world.${k}.short`,icon:WORLDS[k].emoji}))},
{id:'status',labelKey:'filter.status',options:STATUS_IDS.map(id=>({value:id,labelKey:STATUSES[id].labelKey,icon:STATUSES[id].icon}))}];
const GETTERS={world:m=>m.w,status:statusOf};
const gr=el.querySelector('#gr'),cnt=el.querySelector('#cnt');
const draw=values=>{const list=applyFilters(MISSIONS,values,GETTERS);cnt.textContent=t('filter.count',{n:list.length});
if(!list.length)renderState(gr,'empty',{messageKey:'filter.noMatch',retryKey:'filter.clear',onRetry:()=>filters.set({world:'all',status:'all'})});
else gr.innerHTML=list.map(m=>cardHTML(m,{collected:get().collected.includes(m.n)})).join('')};
const filters=createFilters(el.querySelector('#fl'),GROUPS,draw);draw(filters.get());
// WebGL can be missing or blocked: show the shared error state (with Retry) instead of an empty box.
const pw=el.querySelector('#pw');const boot3d=async()=>{pw.innerHTML='<canvas id="pl" role="img" aria-label="'+t('hub.sub')+'"></canvas><button type="button" class="pn"></button><button type="button" class="pn"></button><button type="button" class="pn"></button>';
try{const {createPlanetPicker}=await import('../three/PlanetPicker.js');if(!pw.isConnected)return;pk=createPlanetPicker(pw.querySelector('#pl'),[...pw.querySelectorAll('.pn')],k=>go('/world/'+k))}catch{pk=null;renderState(pw,'error',{messageKey:'state.webgl',onRetry:boot3d})}};boot3d();
const q=FEATURED_QUERIES[Math.random()*FEATURED_QUERIES.length|0];
// searchImages() answers [] when the network fails, so an empty list means "could not load" here, not "no photos exist".
loadInto(el.querySelector('#ph'),async()=>{const list=await searchImages(q,8);if(!list.length)throw new ApiError('NETWORK','no photos');return list},{
render:(list,ph)=>{imgs=list;ph.innerHTML=list.map((i,n)=>`<figure data-n="${n}">${imgTag(i)}<figcaption><b>${i.title}</b><br><small>${i.credit}</small></figcaption></figure>`).join('');ph.onclick=e=>{const fg=e.target.closest('figure');if(fg)lightbox(imgs[+fg.dataset.n])}},
error:{messageKey:'hub.noPhotos'},compact:true})},
unmount(){pk?.dispose()}};