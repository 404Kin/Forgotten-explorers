// "Why did we leave it there?" Content comes from src/data/whyLeft.json (P1). Until it exists we use placeholderWhyLeft.json and say so.
// Shape:  { sections:[ {id, icon, title, text, sources:[url], robotIds?:[id], robotStatus?:"silent|talking|left_behind", needsFactCheck?:bool} ] }
import './WhyLeft.css';
import {t,tx} from '../../i18n/index.js';
import {MISSIONS} from '../../data/missions.js';
import {statusOf} from '../../services/api.js';
import {inkFor} from '../../components/contrast.js';
import {loadInto} from '../../components/StateView/StateView.js';
import {creditFooterHTML} from '../../components/CreditFooter/CreditFooter.js';

const real=import.meta.glob('../../data/whyLeft.json');
async function load(){
  const f=real['../../data/whyLeft.json'];
  return f?{...(await f()).default,isPlaceholder:false}:{...(await import('./placeholderWhyLeft.json')).default,isPlaceholder:true};
}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/** Robots a section talks about: explicit ids and/or everyone with a given status. */
const robotsFor=s=>MISSIONS.filter(m=>(s.robotIds||[]).includes(m.id)||(s.robotStatus&&statusOf(m)===s.robotStatus));

function render(data,box){
  const draft=data.isPlaceholder||data.sections.some(s=>s.needsFactCheck);
  box.innerHTML=(draft?`<p class="panel wl-note" role="note">${t('whyLeft.draftNote')}</p>`:'')+
    data.sections.map(s=>{
      const robots=robotsFor(s);
      return `<section class="panel wl-sec" aria-labelledby="wl-${esc(s.id)}"><h2 id="wl-${esc(s.id)}"><span aria-hidden="true">${esc(s.icon||'🌌')}</span> ${esc(tx(`whyLeft.${s.id}.title`,s.title))}</h2>`+
        `<p>${esc(tx(`whyLeft.${s.id}.text`,s.text))}</p>`+
        (robots.length?`<p class="mono">${t('whyLeft.robots')}</p><div class="chips">${robots.map(m=>`<a class="chip" href="#/mission/${m.id}" style="background:${m.c};color:${inkFor(m.c,m.k)}">${esc(m.n)}</a>`).join('')}</div>`:'')+
        `<p class="wl-src mono">${t('whyLeft.sources')}: `+((s.sources||[]).length?s.sources.map(u=>`<a href="${esc(u)}" target="_blank" rel="noopener">${esc(new URL(u).hostname)}</a>`).join(' · '):t('whyLeft.noSources'))+`</p></section>`;
    }).join('');
}

export default{name:'whyleft',
mount(el){
  el.innerHTML=`<div class="wrap"><a class="btn sm alt" href="#/hub"><span aria-hidden="true">←</span> ${t('common.explore')}</a><div class="hero"><span class="mono">${t('whyLeft.kicker')}</span><h1>${t('whyLeft.title')}</h1><p>${t('whyLeft.intro')}</p></div><div id="wlbox"></div>${creditFooterHTML()}</div>`;
  loadInto(el.querySelector('#wlbox'),load,{render,isEmpty:d=>!d?.sections?.length,empty:{messageKey:'whyLeft.empty'}});
},unmount(){}};
