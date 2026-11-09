import {MISSIONS} from '../data/missions.js';
import {QUIZ} from '../data/quiz.js';
import {cardHTML} from '../components/Card.js';
import {missionImages,imgTag} from '../services/nasaImages.js';
import {lightbox} from '../components/Modal.js';
import {runQuiz} from '../games/QuizEngine.js';
import {get,update,addXP,collect} from '../state/store.js';
import {formatKm,formatTime,num} from '../i18n/format.js';
import {t} from '../i18n/index.js';
import {statusBadgeHTML} from '../components/StatusBadge/StatusBadge.js';
import {statusOf} from '../services/api.js';
import {renderState,loadInto} from '../components/StateView/StateView.js';
import {localRobot,localQuiz} from '../i18n/content.js';
import {speak,stopSpeak,sfx} from '../services/audio.js';
import {go} from '../router/router.js';
let stop;
export default{name:'mission',
mount(el,{id}){const m0=MISSIONS.find(x=>x.id===id);if(!m0)return renderState(el,'empty',{messageKey:'state.notFound',actionHref:'#/hub'});const m=localRobot(m0),r=m.real;let imgs=[];
el.innerHTML=`<div class="wrap"><a class="btn sm alt" href="#/world/${m.w}"><span aria-hidden="true">←</span> ${t('mission.back')}</a>
<div class="mtitle"><h1>${m.n}</h1><div><div class="mono">${r.name} · ${r.status}</div><div>${m.t}</div><div style="margin-top:6px">${statusBadgeHTML(statusOf(m0))}</div></div></div>
<div class="mhero" id="mh"></div>
<div class="mgrid" style="margin-top:18px"><div>${cardHTML(m,{tag:'div',collected:get().collected.includes(m.n)})}</div><div><div class="tabs"><button class="chip on" data-t="story">📖 ${t('mission.tab.story')}</button><button class="chip" data-t="data">📊 ${t('mission.tab.data')}</button><button class="chip" data-t="photos">📷 ${t('mission.tab.photos')}</button><button class="chip" data-t="quiz">🧠 ${t('mission.tab.quiz')}</button></div><div class="panel" id="tb"></div></div></div></div>`;
const hero=el.querySelector('#mh');
let loaded=false; // false until the photo request finishes, so the Photos tab can say "loading" instead of "no photos"
// Photos load in the hero box; a missing picture is not an error, so we fall back to our own robot art.
const loadPhotos=()=>loadInto(hero,()=>missionImages(m),{isEmpty:()=>false,compact:true,render:list=>{loaded=true;imgs=list;
if(list[0]){hero.style.background='';hero.innerHTML=`${imgTag(list[0])}<div class="cap"><b>${list[0].title}</b><br>${t('mission.credit',{credit:list[0].credit})} · <a href="${list[0].link}" target="_blank" rel="noopener">${t('mission.nasaLibrary')}</a></div>`}
else{hero.style.background=m.c;hero.innerHTML=`<svg viewBox="0 0 200 200" role="img" aria-label="${m.n}" style="height:240px;display:block;margin:auto">${m.ch()}</svg><div class="cap">${t('mission.offlineCaption')}</div>`}
if(tab==='photos')show('photos')}});
let tab='story';const tb=el.querySelector('#tb');loadPhotos();
function show(tabName){tab=tabName;stopSpeak();stop?.();el.querySelectorAll('.tabs .chip').forEach(c=>c.classList.toggle('on',c.dataset.t===tabName));
if(tabName==='story'){tb.innerHTML=m.p.map(([h,x])=>`<div class="pg"><h3>${h}</h3><p>${x}</p></div>`).join('')+`<button class="btn sm alt" id="rd">🔊 ${t('mission.readAloud')}</button> <button class="btn sm" id="rm">${get().read.includes(m.n)?'✓ '+t('mission.read'):t('mission.markRead')}</button>`;
tb.querySelector('#rd').onclick=()=>speak(m.p.map(p=>p.join('. ')).join(' '));tb.querySelector('#rm').onclick=e=>{if(!get().read.includes(m.n)){update(S=>S.read.push(m.n));addXP(20,t('xp.reading'));e.target.textContent='✓ '+t('mission.read')}}}
if(tabName==='data'){const L=[['launched',r.launchDate],['arrived',`${r.arrivalDate}. ${r.arrivalEvent}`],['where',r.location],['coordinates',r.coordinates],['distance',formatKm(r.distanceKm)],['message',formatTime(r.lightSeconds)],['speed',t('unit.kmPerSecond',{n:num(r.speedKmS,1)})],['status',r.status]];tb.innerHTML=`<p class="mono">${t('mission.dataSource')}</p><ul class="dl">${L.map(([a,b])=>`<li><b>${t('mission.data.'+a)}</b>${b}</li>`).join('')}</ul>`}
if(tabName==='photos'){if(!loaded)renderState(tb,'loading',{compact:true});
else if(!imgs.length)renderState(tb,'empty',{messageKey:'mission.noPhotos',compact:true,onRetry:()=>{renderState(tb,'loading',{compact:true});loadPhotos()}});
else tb.innerHTML=`<div class="gal">${imgs.map((i,n)=>`<figure data-n="${n}" tabindex="0" role="button" aria-label="${i.title.replace(/"/g,'')}">${imgTag(i)}</figure>`).join('')}</div><p class="mono">${t('mission.photosHelp')}</p>`;
tb.onclick=e=>{const f=e.target.closest('figure');if(f)lightbox(imgs[+f.dataset.n])};
// Photos are focusable: Enter or Space opens them, same as a click.
tb.onkeydown=e=>{if(e.key!=='Enter'&&e.key!==' ')return;const f=e.target.closest('figure');if(f){e.preventDefault();lightbox(imgs[+f.dataset.n])}}}
if(tabName==='quiz'){const qs=[...localQuiz(QUIZ).filter(q=>q.m===m.n),{q:m.q[0],o:m.q.slice(1),e:''}].slice(0,4);stop=runQuiz(tb,qs,{lives:2,time:20,onEnd:res=>{tb.innerHTML=`<div class="stars">${'⭐'.repeat(res.stars)||'🙂'}</div><h2 style="text-align:center">${res.passed?t('mission.woke',{name:m.n}):t('mission.almost')}</h2><p style="text-align:center">${t('quiz.score',{correct:res.correct,total:res.total,xp:res.xp})}</p><div style="text-align:center"><button class="btn" id="rt">${t('common.tryAgain')}</button></div>`;update(S=>{S.stats.correct+=res.correct;S.stats.answered+=res.total});if(res.xp)addXP(res.xp,t('xp.quiz'));if(res.passed&&collect(m.n)){sfx.win();addXP(30,t('xp.waking',{name:m.n}))}tb.querySelector('#rt').onclick=()=>show('quiz')}})}}
el.querySelectorAll('.tabs .chip').forEach(c=>c.onclick=()=>show(c.dataset.t));show('story')},
unmount(){stop?.();stopSpeak()}};
