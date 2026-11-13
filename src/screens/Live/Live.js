// Still Talking tracker: which spacecraft are sending messages to Earth, how far away they are, how long a message takes.
// Data: getDsn() + getDistances() from services/api.js. Without the API both fall back to a saved snapshot, and the label says so.
import './Live.css';
import {t} from '../../i18n/index.js';
import {MISSIONS} from '../../robots/index.js';
import {getDsn,getDistances} from '../../services/api.js';
import {localRobot} from '../../i18n/content.js';
import {formatKm,formatTime} from '../../i18n/format.js';
import {loadInto} from '../../components/StateView/StateView.js';
import {liveLabelHTML} from '../../components/LiveLabel/LiveLabel.js';
import {statusBadgeHTML} from '../../components/StatusBadge/StatusBadge.js';
import {creditFooterHTML} from '../../components/CreditFooter/CreditFooter.js';

const REFRESH_MS=60000; // the server caches DSN for about a minute, so asking more often gives nothing new
let timer=null;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

async function load(){
  const dsn=await getDsn();
  const ids=dsn.data.map(d=>d.robotId);
  const dist=ids.length?await getDistances(ids):{data:[],source:dsn.source};
  return{dsn,dist};
}

function render({dsn,dist},box){
  const byId=Object.fromEntries(dist.data.map(d=>[d.robotId,d]));
  box.innerHTML=
    `<p class="live-head">${liveLabelHTML({source:dsn.source,asOf:dsn.asOf})}</p>`+
    `<ul class="live-list">${dsn.data.map(row=>{
      const m=MISSIONS.find(x=>x.id===row.robotId);if(!m)return '';
      const L=localRobot(m),d=byId[row.robotId];
      return `<li class="panel live-item"><div class="live-top"><a href="#/mission/${m.id}"><b>${esc(m.n)}</b></a>${statusBadgeHTML('talking')}</div><p>${esc(L.t)}</p>`+
        (row.dish?`<p class="mono">${t('live.dish',{dish:esc(row.dish)})}</p>`:'')+
        (d?.distanceKm!=null?`<p><b>${t('live.distance')}:</b> ${formatKm(d.distanceKm)}</p>`:'')+
        (d?.lightSeconds!=null?`<p><b>${t('live.lightTime')}:</b> ${formatTime(d.lightSeconds)}</p>`:'')+
        // The snapshot label only appears next to numbers. A robot with no numbers shows no label (it would look unfinished).
        (d&&(d.distanceKm!=null||d.lightSeconds!=null)?`<p>${liveLabelHTML({source:d.source,asOf:d.asOf})}</p>`:'')+`</li>`}).join('')}</ul>`;
}

export default{name:'live',
mount(el){
  el.innerHTML=`<div class="wrap"><a class="btn sm alt" href="#/hub"><span aria-hidden="true">←</span> ${t('common.explore')}</a><div class="hero"><span class="mono">${t('live.kicker')}</span><h1>${t('live.title')}</h1><p>${t('live.intro')}</p><p class="panel live-focus">${t('live.focus')}</p><p><a class="btn" href="#/hub">${t('live.toAbandoned')}</a></p></div><div id="livebox" aria-live="polite"></div>${creditFooterHTML()}</div>`;
  const box=el.querySelector('#livebox');
  const opts={render,isEmpty:r=>!r.dsn.data.length,empty:{messageKey:'live.empty'}};
  loadInto(box,load,opts);
  // Quiet refresh: re-ask without flashing the "loading" state again.
  timer=setInterval(async()=>{try{const r=await load();if(box.isConnected&&r.dsn.data.length)render(r,box)}catch{/* keep showing the last good numbers */}},REFRESH_MS);
},
unmount(){clearInterval(timer);timer=null}};
