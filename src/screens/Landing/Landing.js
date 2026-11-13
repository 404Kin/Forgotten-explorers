// Cover: a quiet night sky, a lonely rover on the horizon, one story line, one Begin button.
// Flow is unchanged: cover -> (name) -> Pip's lines -> map. "Start here" tour and guide sound stay on the cover. "Skip intro" goes straight to Explore.
// Everything is CSS + one small inline SVG (no images), so the first paint is fast. Original artwork and text.
import './Landing.css';
import {INTRO} from '../../robots/index.js';
import {go} from '../../router/router.js';
import {speak,stopSpeak} from '../../services/audio.js';
import {t} from '../../i18n/index.js';
import {introLines} from '../../i18n/content.js';
import {createLanguageSwitcher} from '../../components/LanguageSwitcher/LanguageSwitcher.js';
import {createGuideSoundPanel} from '../../components/GuideSound/GuideSound.js';
import {createTourButton} from '../../components/JudgeTour/JudgeTour.js';
import {createNameForm,playerName} from '../../components/PlayerName/PlayerName.js';

const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
/** CSS box-shadow list of n small stars at random spots (vw/vh units), so a star layer is ONE element. */
export const starShadow=(n,rnd=Math.random)=>Array.from({length:n},()=>`${(rnd()*100).toFixed(1)}vw ${(rnd()*100).toFixed(1)}vh #fff`).join(',');

// The rover: simple flat shapes in two dark tones. The light on its mast is the only thing that blinks.
const HORIZON=`<div class="glow" aria-hidden="true"></div><div class="ground" aria-hidden="true"></div>`+
  `<svg class="rover" viewBox="0 0 60 50" role="img" aria-label="__ALT__"><g fill="#0b0e24"><rect x="2" y="24" width="44" height="12" rx="3"/><rect x="8" y="18" width="26" height="8" rx="2"/>`+
  `<circle cx="10" cy="40" r="6"/><circle cx="24" cy="40" r="6"/><circle cx="38" cy="40" r="6"/><rect x="36" y="6" width="2.5" height="14"/><rect x="30" y="2" width="14" height="5" rx="2"/>`+
  `<circle class="blink" cx="43" cy="4" r="2.6" fill="#ff6b5b"/></g></svg>`;

export default{name:'landing',
mount(el){
  document.body.classList.add('landing');
  const calm=reduced(),story=t('landing.story');
  el.innerHTML=`<div id="night" class="night">`+
    `<div class="stars s1" aria-hidden="true"></div><div class="stars s2" aria-hidden="true"></div><div class="stars s3" aria-hidden="true"></div>`+
    HORIZON.replace('__ALT__',t('landing.rover'))+
    `<div class="intro" id="intro"><p class="eyebrow">${t('landing.eyebrow')}</p><h1 class="intro-title">${t('landing.line1')} ${t('landing.line2')}</h1>`+
      `<p class="intro-story"><span class="sr-only">${story}</span><span class="typed" aria-hidden="true"></span><span class="caret" aria-hidden="true"></span></p>`+
      `<div class="intro-actions"><button type="button" id="intro-begin" class="btn">${t('landing.begin')}</button></div></div>`+
    `<button type="button" class="intro-skip" id="intro-skip">${t('landing.skip')}</button>`+
    `<div id="bub" class="panel" style="display:none"><p id="bt"></p><button id="bn" class="btn">${t('landing.next')}</button></div></div>`;
  const root=el.querySelector('#night');
  // Star layers: three depths drifting at different slow speeds (parallax). Reduced motion: they simply stay still.
  [['.s1',70],['.s2',36],['.s3',16]].forEach(([q,n])=>{root.querySelector(q).style.boxShadow=starShadow(n)});
  const sw=createLanguageSwitcher();if(sw){sw.classList.add('landing-lang');root.appendChild(sw)}
  const gsp=createGuideSoundPanel();gsp.classList.add('landing-sound');root.appendChild(gsp);
  const tour=createTourButton({id:'tour-landing'});tour.classList.add('landing-tour');root.appendChild(tour);

  // The story line types itself (a calm ~2 s). Reduced motion: it is simply there.
  const typed=root.querySelector('.typed');let timer=0;
  if(calm){typed.textContent=story;root.querySelector('.caret').remove()}
  else{let i=0;const type=()=>{typed.textContent=story.slice(0,++i);if(i<story.length)timer=setTimeout(type,42);else root.querySelector('.caret')?.classList.add('done')};timer=setTimeout(type,800)}

  let LINES=introLines(INTRO),i=0;
  const line=()=>{root.querySelector('#bt').textContent=LINES[i];root.querySelector('#bn').textContent=i<LINES.length-1?t('landing.next'):t('landing.go');speak(LINES[i])};
  // Personal touch: the first time, Pip asks for the player's name (it can be skipped). Pip then uses it in the first line.
  const startStory=()=>{const n=playerName();LINES=n?[t('landing.hi',{name:n}),...introLines(INTRO)]:introLines(INTRO);root.querySelector('#bub').style.display='block';line()};
  root.querySelector('#intro-begin').onclick=()=>{clearTimeout(timer);root.querySelector('#intro').style.display='none';
    if(playerName())return startStory();
    const box=document.createElement('div');box.id='nbox';box.className='panel';box.innerHTML=`<h2>${t('name.title')}</h2>`;
    const next=()=>{box.remove();startStory()};
    box.appendChild(createNameForm({autofocus:true,submitKey:'name.continue',onSave:next,onSkip:next}));root.appendChild(box)};
  root.querySelector('#bn').onclick=()=>{if(i<LINES.length-1){i++;line()}else go('/map')};
  // Skip intro: straight to Explore (the name can still be added there).
  root.querySelector('#intro-skip').onclick=()=>{clearTimeout(timer);stopSpeak();go('/hub')};
  root._timer=()=>clearTimeout(timer);
},
unmount(){document.body.classList.remove('landing');stopSpeak()}};
