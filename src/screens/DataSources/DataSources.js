// Data Sources screen. The list comes from src/data/sources.json (P1). Until that file exists we use placeholderSources.json,
// and the screen says so. Nothing about datasets or credits is written in this file.
import './DataSources.css';
import {t,tx} from '../../i18n/index.js';
import {loadInto} from '../../components/StateView/StateView.js';
import {creditFooterHTML} from '../../components/CreditFooter/CreditFooter.js';
import {PINNED} from '../../data/nasaQueries.js';

// Lazy glob: if P1's file is not there yet this is simply empty (no build error).
const real=import.meta.glob('../../data/sources.json');
const placeholder=()=>import('./placeholderSources.json');

async function loadSources(){
  const load=real['../../data/sources.json'];
  if(load)return{...(await load()).default,isPlaceholder:false};
  return{...(await placeholder()).default,isPlaceholder:true};
}

const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const link=(url,text)=>url?`<a href="${esc(url)}" target="_blank" rel="noopener">${esc(text)}</a>`:esc(text);

/** Pinned NASA photos are listed straight from nasaQueries.js, so the credit list can never drift from what we show. */
// PINNED maps a robot to one id or a list of ids (the data file changed shape once), so accept both.
const pinnedCredits=()=>Object.entries(PINNED).flatMap(([robot,ids])=>[].concat(ids).filter(Boolean).map(id=>({robot,id,url:`https://images.nasa.gov/details/${encodeURIComponent(id)}`})));

function render(data,box){
  const stateLabel=s=>s?`<span class="mono ds-state">${t('sources.state.'+s)}</span>`:'';
  const pins=pinnedCredits(),own=data.photoCredits||[],people=data.credits||[];
  box.innerHTML=
    (data.isPlaceholder?`<p class="panel ds-note" role="note">${t('sources.placeholderNote')}</p>`:'')+
    `<section aria-labelledby="ds-h-data"><div class="sec"><h2 id="ds-h-data">${t('sources.datasets')}</h2></div><ul class="ds-list">`+
    data.datasets.map(d=>`<li class="panel ds-item"><h3>${link(d.url,d.name)}</h3><p class="mono">${esc(d.provider||'')} ${stateLabel(d.state)}</p>`+
      `<p><b>${t('sources.usedFor')}:</b> ${esc(tx(`source.${d.id}.usedFor`,d.usedFor))}</p></li>`).join('')+`</ul></section>`+
    `<section aria-labelledby="ds-h-photo"><div class="sec"><h2 id="ds-h-photo">${t('sources.photoCredits')}</h2></div><p>${t('sources.photoNote')}</p>`+
    ((own.length||pins.length)?`<p>${t('sources.pinnedIntro')}</p><ul class="ds-plain">`+
      own.map(p=>`<li>${link(p.url,p.title)}${p.credit?` · ${esc(p.credit)}`:''}</li>`).join('')+
      pins.map(p=>`<li>${link(p.url,t('sources.pinned',{robot:p.robot,id:p.id}))}</li>`).join('')+`</ul>`:'')+`</section>`+
    (people.length?`<section aria-labelledby="ds-h-cred"><div class="sec"><h2 id="ds-h-cred">${t('sources.credits')}</h2></div><ul class="ds-plain">`+
      people.map(c=>`<li>${link(c.url,c.name)}${c.role?` · ${esc(c.role)}`:''}</li>`).join('')+`</ul></section>`:'')+
    `<section class="panel ds-disclaimer" aria-labelledby="ds-h-disc"><h2 id="ds-h-disc">${t('sources.disclaimerTitle')}</h2><p>${t('credit.disclaimer')}</p></section>`;
}

export default{name:'sources',
mount(el){
  el.innerHTML=`<div class="wrap"><div class="hero"><span class="mono">${t('sources.kicker')}</span><h1>${t('sources.title')}</h1><p>${t('sources.intro')}</p></div><div id="dsbox"></div>${creditFooterHTML({link:false})}</div>`;
  loadInto(el.querySelector('#dsbox'),loadSources,{render,isEmpty:d=>!d?.datasets?.length,empty:{messageKey:'sources.empty'}});
},
unmount(){}};
