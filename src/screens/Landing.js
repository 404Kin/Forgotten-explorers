import {COVER_SVG} from '../art/cover.js';
import {INTRO} from '../data/missions.js';
import {go} from '../router/router.js';
import {speak,stopSpeak} from '../services/audio.js';
import {t} from '../i18n/index.js';
import {introLines} from '../i18n/content.js';
import {createLanguageSwitcher} from '../components/LanguageSwitcher/LanguageSwitcher.js';
export default{name:'landing',
mount(el){document.body.classList.add('landing');el.innerHTML=`<div id="cover">${COVER_SVG}<div id="ttl"><span>◇</span><small><u></u>${t('landing.the')}<u></u></small><b>${t('landing.line1')}<br>${t('landing.line2')}</b><u class="ln"></u><i>${t('landing.tagline')}</i><span>▿</span></div><button id="begin" class="btn alt">${t('landing.begin')}</button><div id="bub" class="panel" style="display:none"><p id="bt"></p><button id="bn" class="btn">${t('landing.next')}</button></div></div>`;
const LINES=introLines(INTRO);const sw=createLanguageSwitcher();sw.classList.add('landing-lang');el.querySelector('#cover').appendChild(sw);
const g=el.querySelector('#sts');for(let i=0;i<40;i++){const c=document.createElementNS('http://www.w3.org/2000/svg','circle');c.setAttribute('cx',Math.random()*400);c.setAttribute('cy',Math.random()*300);c.setAttribute('r',Math.random()*1.6+.6);c.setAttribute('fill','#fff');c.setAttribute('class','tw');c.style.animationDelay=Math.random()*3+'s';g.appendChild(c)}
let i=0;const line=()=>{el.querySelector('#bt').textContent=LINES[i];el.querySelector('#bn').textContent=i<LINES.length-1?t('landing.next'):t('landing.go');speak(LINES[i])};
el.querySelector('#begin').onclick=()=>{el.querySelector('#begin').style.display='none';el.querySelector('#ttl').style.display='none';el.querySelector('#bub').style.display='block';line()};
el.querySelector('#bn').onclick=()=>{if(i<LINES.length-1){i++;line()}else go('/map')}},
unmount(){document.body.classList.remove('landing');stopSpeak()}};