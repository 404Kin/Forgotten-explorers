import {MISSIONS} from '../data/missions.js';
import {renderState} from '../components/StateView/StateView.js';
import {t} from '../i18n/index.js';
export default{name:'timeline',mount(el){const L=[...MISSIONS].sort((a,b)=>new Date(a.real.arrivalDate)-new Date(b.real.arrivalDate));
if(!L.length)return renderState(el,'empty',{actionHref:'#/hub'});
el.innerHTML=`<div class="wrap"><div class="hero"><span class="mono">${t('timeline.kicker')}</span><h1>${t('game.timeline')}</h1><p>${t('timeline.sub')}</p></div><div class="tl" style="margin-top:24px">${L.map(m=>`<a class="ev" href="#/mission/${m.id}"><b>${m.real.arrivalDate.slice(-4)}</b> <span style="color:${m.c}">●</span> <strong>${m.n}</strong><div>${m.real.name}: ${m.real.arrivalEvent}</div><div class="mono">${m.real.location}</div></a>`).join('')}</div></div>`},unmount(){}};
