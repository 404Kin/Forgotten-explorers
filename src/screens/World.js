import {MISSIONS,WORLDS} from '../data/missions.js';
import {chapter} from '../art/chapters.js';
import {cardHTML} from '../components/Card.js';
import {createWorldMap} from '../three/WorldMap.js';
import {get} from '../state/store.js';
import {go} from '../router/router.js';
import {speak,stopSpeak} from '../services/audio.js';
import {t} from '../i18n/index.js';
import {worldName} from '../i18n/content.js';
let map;
export default{name:'world',
mount(el,{k}){const W=WORLDS[k];if(!W)return go('/hub');const c0=chapter(k),c={...c0,a:t(`chapter.${k}.a`),b:t(`chapter.${k}.b`),line:t(`chapter.${k}.line`)};
el.innerHTML=`<section id="chap"><svg id="chsvg" viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${c.svg}</svg><div id="cht"><small>${c.a}</small><b>${c.b}</b></div><div id="chb"><p id="chp">${c.line}</p><button class="btn" id="go">${t('world.start')}</button></div><a class="btn sm alt" href="#/hub" style="position:absolute;top:calc(env(safe-area-inset-top,0px) + 8px);left:10px"><span aria-hidden="true">←</span> ${t('world.back')}</a></section>
<div class="wrap" id="wm"><div class="hero"><span class="mono">${t('world.kicker')}</span><h1>${worldName(k)}</h1><p>${k==='deep'?t('world.helpDeep'):t('world.helpGlobe')}</p></div><div id="wmap"><canvas id="wc"></canvas></div><div id="strip"></div></div>`;
el.querySelector('#wm').style.display='none';speak(c.a+' '+c.b+'. '+c.line);
el.querySelector('#go').onclick=()=>{stopSpeak();el.querySelector('#chap').remove();el.querySelector('#wm').style.display='block';const ms=MISSIONS.filter(m=>m.w===k);
el.querySelector('#strip').innerHTML=ms.map(m=>cardHTML(m,{collected:get().collected.includes(m.n)})).join('');
map=createWorldMap(el.querySelector('#wmap'),el.querySelector('#wc'),k,ms,m=>go('/mission/'+m.id))}},
unmount(){map?.dispose();map=null;stopSpeak()}};
