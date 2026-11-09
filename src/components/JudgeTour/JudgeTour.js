// "Start here": a skippable 60-second guided tour. No login, nothing blocks the app (the card is not modal),
// everything works with the keyboard: Tab to the buttons, Enter to press, Esc to skip, Left/Right arrows inside the card.
import './JudgeTour.css';
import {t,onLangChange} from '../../i18n/index.js';
import {go} from '../../router/router.js';
import {TOUR_STEPS,TOUR_STORAGE_KEY} from './steps.js';
import {readySteps,move,progress} from './tourLogic.js';

let card=null,steps=[],index=0,hl=null,offLang=null;

const reduceMotion=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const remember=()=>{try{localStorage.setItem(TOUR_STORAGE_KEY,'done')}catch{}};

/** Wait for a screen to draw its target after navigation; give up quietly after `ms` (the step text still works). */
function waitFor(selector,ms=2500){
  return new Promise(resolve=>{
    const found=()=>document.querySelector(selector);
    if(found())return resolve(found());
    const t0=Date.now(),timer=setInterval(()=>{const el=found();if(el||Date.now()-t0>ms){clearInterval(timer);resolve(el||null)}},100);
  });
}

function clearHighlight(){hl?.classList.remove('tour-hl');hl=null}

function render(){
  const s=steps[index],p=progress(index,steps.length),last=index===steps.length-1;
  card.innerHTML=`<div class="tour-bar" aria-hidden="true"><i style="width:${p.percent}%"></i></div>`+
    `<p class="mono tour-step">${t('tour.progress',{n:p.n,total:p.total})}</p>`+
    `<h2 id="tour-title" tabindex="-1">${t(`tour.step.${s.id}.title`)}</h2><p>${t(`tour.step.${s.id}.text`)}</p>`+
    `<div class="tour-actions"><button type="button" class="btn sm alt" data-a="skip">${t('tour.skip')}</button>`+
    `${index>0?`<button type="button" class="btn sm alt" data-a="back">${t('tour.back')}</button>`:''}`+
    `<button type="button" class="btn sm" data-a="next">${last?t('tour.finish'):t('tour.next')}</button></div>`;
  card.setAttribute('aria-label',t('tour.label'));
}

async function show(i){
  index=i;clearHighlight();render();
  const s=steps[index];
  // Only navigate when needed, so the Language step does not reload the page the user is already on.
  if(location.hash.slice(1)!==s.route)go(s.route);
  const el=s.target?await waitFor(s.target):null;
  if(!card||steps[index]!==s)return; // tour ended or moved on while we waited
  if(el){hl=el;el.classList.add('tour-hl');el.scrollIntoView({block:'center',behavior:reduceMotion()?'auto':'smooth'})}
  card.querySelector('#tour-title')?.focus({preventScroll:true});
}

function onKey(e){
  if(e.key==='Escape'){e.preventDefault();stopTour();return}
  if(!card?.contains(e.target))return; // never steal arrows from the language <select> or the map
  if(e.key==='ArrowRight')step(1);else if(e.key==='ArrowLeft')step(-1);else return;
  e.preventDefault();
}

function step(dir){const n=move(index,dir,steps.length);if(n===-1)return stopTour();show(n)}

export function stopTour(){
  if(!card)return;
  clearHighlight();document.removeEventListener('keydown',onKey,true);offLang?.();offLang=null;
  const opener=card.dataset.opener;card.remove();card=null;remember();
  document.getElementById(opener||'')?.focus?.();
}

export function startTour(opener){
  if(card)return;
  steps=readySteps(TOUR_STEPS);if(!steps.length)return;
  card=document.createElement('section');card.className='tour-card panel';card.setAttribute('role','dialog');
  card.setAttribute('aria-modal','false');card.setAttribute('aria-labelledby','tour-title');
  if(opener?.id)card.dataset.opener=opener.id;
  card.addEventListener('click',e=>{const a=e.target.closest('[data-a]')?.dataset.a;if(a==='skip')stopTour();else if(a==='back')step(-1);else if(a==='next')step(1)});
  document.body.appendChild(card);document.addEventListener('keydown',onKey,true);
  // A language change re-draws the card text (the screen behind it is rebuilt by the app).
  offLang=onLangChange(()=>{if(card){render();setTimeout(()=>{const s=steps[index];if(s?.target){const el=document.querySelector(s.target);if(el){clearHighlight();hl=el;el.classList.add('tour-hl')}}},150)}});
  show(0);
}

/** The "Start here" button. Used on the cover and in the top bar; `compact` hides the words on small screens. */
export function createTourButton({id='tour-open',compact=false}={}){
  const b=document.createElement('button');b.type='button';b.id=id;b.className='tourbtn btn sm'+(compact?' compact':'');
  b.setAttribute('aria-label',t('tour.startLong'));
  b.innerHTML=`<span aria-hidden="true">▶</span><span class="tour-label">${t('tour.start')}</span>`;
  b.onclick=()=>startTour(b);
  return b;
}
