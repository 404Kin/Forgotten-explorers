// Data Sources screen. Everything on it comes from src/data/sources.json (built by build-sources.mjs from the robot records,
// the 3D model config and a check of every link). Nothing about datasets, credits or URLs is written in this file.
import './DataSources.css';
import {t,getLang} from '../../i18n/index.js';
import {loadInto} from '../../components/StateView/StateView.js';
import {creditFooterHTML} from '../../components/CreditFooter/CreditFooter.js';
import {statusBadgeHTML} from '../../components/StatusBadge/StatusBadge.js';

const load=()=>import('../../data/sources.json').then(m=>m.default);
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const link=(url,text)=>url?`<a href="${esc(url)}" target="_blank" rel="noopener">${esc(text||url)}</a>`:esc(text);
const day=iso=>{const d=new Date(iso);return Number.isNaN(d.getTime())?esc(iso):new Intl.DateTimeFormat(getLang(),{dateStyle:'medium'}).format(d)};
/** Record status ids -> the ids the status badge uses. */
const BADGE={left_behind:'left_behind',silent:'silent',still_talking:'talking'};
const STATUS_FILTERS=['all','left_behind','silent','still_talking'];

/** Pure: which robots match the search text and the status filter. */
export function filterRobots(robots,{text='',status='all'}={}){
  const q=text.trim().toLowerCase();
  return robots.filter(r=>(status==='all'||r.status===status)&&(!q||r.name.toLowerCase().includes(q)||r.id.includes(q)||r.sources.some(s=>s.host.includes(q))));
}

function robotCard(r){
  const src=r.sources.length?`<ul class="ds-plain">${r.sources.map(s=>`<li>${link(s.url,s.url.replace(/^https?:\/\/(www\.)?/,'').slice(0,70))} <span class="mono">${esc(s.host)}</span></li>`).join('')}</ul>`:`<p>${t('sources.noSources')}</p>`;
  return `<details class="panel ds-robot" data-id="${esc(r.id)}"><summary><span class="ds-rname">${esc(r.name)}</span> ${statusBadgeHTML(BADGE[r.status])}${r.needsReview?` <span class="ds-draft">${t('robotStory.draft')}</span>`:''}</summary>`+
    `<h4>${t('sources.robotSources')}</h4>${src}`+
    `<h4>${t('sources.robotPhoto')}</h4><p>${r.photo?`${esc(r.photo.credit)} · ${link(r.photo.pageUrl,'images.nasa.gov/details/'+r.photo.nasaId)}`:t('sources.none')}</p>`+
    `<h4>${t('sources.robotModel')}</h4><p>${r.model.kind==='nasa'?`${t('model.nasa')}: ${esc(r.model.title)}. ${t('model.credit',{credit:esc(r.model.credit),title:esc(r.model.title)})} ${link(r.model.source,t('model.source'))}`:`🎨 ${t('model.artist')}`}</p></details>`;
}

function render(data,box){
  const f=data.facts;
  box.innerHTML=
    `<section class="panel ds-disclaimer" aria-labelledby="ds-h-disc"><h2 id="ds-h-disc">${t('sources.disclaimerTitle')}</h2><p>${t('credit.disclaimer')}</p></section>`+
    `<section aria-labelledby="ds-h-data"><div class="sec"><h2 id="ds-h-data">${t('sources.datasets')}</h2></div><ul class="ds-list">`+
      data.datasets.map(d=>`<li class="panel ds-item"><h3>${link(d.url,d.name)}</h3><p class="mono">${esc(d.provider)} <span class="ds-state">${t('sources.state.'+d.state)}</span></p>`+
        `<p><b>${t('sources.usedFor')}:</b> ${esc(d.usedFor)}</p><p><b>${t('sources.where')}:</b> ${esc(d.where)}</p>${d.apiUrl?`<p>${link(d.apiUrl)}</p>`:''}`+
        `${d.note?`<p class="ds-note2">${esc(d.note)}</p>`:''}<p class="mono">${t('sources.lastChecked',{date:day(d.lastChecked)})}</p></li>`).join('')+`</ul>`+
      `<p class="panel ds-where"><b>${t('sources.notUsedTitle')}</b> ${esc(data.notUsed)}</p></section>`+
    `<section class="panel ds-check" aria-labelledby="ds-h-check"><h2 id="ds-h-check">${t('sources.howTitle')}</h2><ul>`+
      `<li>${t('sources.how1')}</li><li>${t('sources.how2',{n:f.needsReview,total:f.records})}</li><li>${t('sources.how3',{date:day(data.lastChecked),ok:f.sourcesListed,fixed:f.fixed,bad:f.unverified})}</li><li>${t('sources.how4')}</li></ul></section>`+
    `<section aria-labelledby="ds-h-robots"><div class="sec"><h2 id="ds-h-robots">${t('sources.byRobot')}</h2><span class="mono" id="ds-count" role="status" aria-live="polite"></span></div>`+
      `<div class="ds-tools"><label for="ds-q" class="mono">${t('sources.search')}</label><input id="ds-q" class="in" type="search" autocomplete="off" placeholder="${t('sources.searchPlaceholder')}">`+
      `<div class="chips" role="group" aria-label="${t('filter.status')}">${STATUS_FILTERS.map(s=>`<button type="button" class="chip${s==='all'?' on':''}" data-s="${s}" aria-pressed="${s==='all'}">${s==='all'?t('common.all'):t('status.'+s)}</button>`).join('')}</div></div>`+
      `<div id="ds-robots" class="ds-robots"></div></section>`+
    `<section class="panel" aria-labelledby="ds-h-cred"><h2 id="ds-h-cred">${t('sources.credits')}</h2><ul class="ds-plain">`+
      data.libraries.map(l=>`<li>${link(l.url,l.name)} · ${esc(l.license)} · ${esc(l.usedFor)}</li>`).join('')+data.fonts.map(l=>`<li>${link(l.url,l.name)} · ${esc(l.license)} · ${esc(l.usedFor)}</li>`).join('')+`<li>${esc(data.sound.text)}</li></ul></section>`;
  const list=box.querySelector('#ds-robots'),count=box.querySelector('#ds-count'),q=box.querySelector('#ds-q');let status='all';
  const draw=()=>{const rows=filterRobots(data.robots,{text:q.value,status});count.textContent=t('sources.showing',{n:rows.length,total:data.robots.length});
    list.innerHTML=rows.length?rows.map(robotCard).join(''):`<p class="panel">${t('sources.noMatch')}</p>`};
  q.oninput=draw;
  box.querySelector('.ds-tools .chips').onclick=e=>{const b=e.target.closest('[data-s]');if(!b)return;status=b.dataset.s;
    box.querySelectorAll('.ds-tools [data-s]').forEach(x=>{const on=x===b;x.classList.toggle('on',on);x.setAttribute('aria-pressed',on)});draw()};
  draw();
}

export default{name:'sources',
mount(el){
  el.innerHTML=`<div class="wrap"><div class="hero"><span class="mono">${t('sources.kicker')}</span><h1>${t('sources.title')}</h1><p>${t('sources.intro')}</p></div><div id="dsbox"></div>${creditFooterHTML({link:false})}</div>`;
  loadInto(el.querySelector('#dsbox'),load,{render,isEmpty:d=>!d?.datasets?.length,empty:{messageKey:'sources.empty'}});
},
unmount(){}};
