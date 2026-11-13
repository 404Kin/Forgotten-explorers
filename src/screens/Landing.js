import {COVER_SVG} from '../art/cover.js';
import {INTRO} from '../robots/index.js';
import {go} from '../router/router.js';
import {speak,stopSpeak} from '../services/audio.js';
import {t} from '../i18n/index.js';
import {introLines} from '../i18n/content.js';
import {createLanguageSwitcher} from '../components/LanguageSwitcher/LanguageSwitcher.js';
import {createTourButton} from '../components/JudgeTour/JudgeTour.js';
import {createNameForm,playerName} from '../components/PlayerName/PlayerName.js';
export default{name:'landing',
mount(el){document.body.classList.add('landing');el.innerHTML=`<div id="cover">${COVER_SVG}<div id="ttl"><span>◇</span><small><u></u>${t('landing.the')}<u></u></small><b>${t('landing.line1')}<br>${t('landing.line2')}</b><u class="ln"></u><i>${t('landing.tagline')}</i><span>▿</span></div><button id="begin" class="btn alt">${t('landing.begin')}</button><div id="bub" class="panel" style="display:none"><p id="bt"></p><button id="bn" class="btn">${t('landing.next')}</button></div></div>`;
let LINES=introLines(INTRO);const sw=createLanguageSwitcher();if(sw){sw.classList.add('landing-lang');el.querySelector('#cover').appendChild(sw)}const tour=createTourButton({id:'tour-landing'});tour.classList.add('landing-tour');el.querySelector('#cover').appendChild(tour);
const g=el.querySelector('#sts');for(let i=0;i<40;i++){const c=document.createElementNS('http://www.w3.org/2000/svg','circle');c.setAttribute('cx',Math.random()*400);c.setAttribute('cy',Math.random()*300);c.setAttribute('r',Math.random()*1.6+.6);c.setAttribute('fill','#fff');c.setAttribute('class','tw');c.style.animationDelay=Math.random()*3+'s';g.appendChild(c)}
let i=0;const line=()=>{el.querySelector('#bt').textContent=LINES[i];el.querySelector('#bn').textContent=i<LINES.length-1?t('landing.next'):t('landing.go');speak(LINES[i])};
// Personal touch: the first time, Pip asks for the player's name (it can be skipped). Pip then uses it in the first line.
const startStory=()=>{const n=playerName();LINES=n?[t('landing.hi',{name:n}),...introLines(INTRO)]:introLines(INTRO);el.querySelector('#bub').style.display='block';line()};
el.querySelector('#begin').onclick=()=>{el.querySelector('#begin').style.display='none';el.querySelector('#ttl').style.display='none';
  if(playerName())return startStory();
  const box=document.createElement('div');box.id='nbox';box.className='panel';box.innerHTML=`<h2>${t('name.title')}</h2>`;
  const next=()=>{box.remove();startStory()};
  box.appendChild(createNameForm({autofocus:true,submitKey:'name.continue',onSave:next,onSkip:next}));el.querySelector('#cover').appendChild(box)};
el.querySelector('#bn').onclick=()=>{if(i<LINES.length-1){i++;line()}else go('/map')}},
unmount(){document.body.classList.remove('landing');stopSpeak()}};