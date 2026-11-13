// The story order of a robot page (for the abandoned robots first):
//   Meet me (photo + 3D) -> What I was built to do -> How I worked -> What I discovered -> Why I was left there -> Last Message -> Quick quiz -> Next explorer
// Photo, 3D and the "How I worked / What I discovered" cards are separate components; this file draws the other parts.
// Text comes from the robot data first. Anything without a checked source shows a "Draft" label.
import './RobotFlow.css';
import {t,tx} from '../../i18n/index.js';
import {MISSION_DETAILS} from '../../data/missionDetails.js';
import {nextRobot} from '../../robots/stats.js';
import {MISSIONS} from '../../robots/index.js';
import {getMessage} from '../../screens/LastMessage/messages.js';

const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const draftLabel=()=>`<span class="rsc-draft">${t('robotStory.draft')}</span>`;
/** A record is a draft until P1 clears needsReview. Pure. */
export const isDraftRobot=robot=>robot.record?.needsReview!==false;
const sources=robot=>(robot.sources||[]).length?`<p class="rf-src mono">${t('robotStory.sources')}: ${robot.sources.map(u=>`<a href="${esc(u)}" target="_blank" rel="noopener">${esc(new URL(u).hostname.replace(/^www\./,''))}</a>`).join(' · ')}</p>`:'';
const section=(icon,titleKey,body,robot,extra='')=>`<section class="panel rf-sec"><h2><span aria-hidden="true">${icon}</span> ${t(titleKey)}${isDraftRobot(robot)?' '+draftLabel():''}</h2>${body}${isDraftRobot(robot)?`<p class="rsc-note mono">${t('robotStory.draftNote')}</p>`:''}${extra}</section>`;

/** "What I was built to do": only the hand-written purpose. The record's "job" page is not a purpose (it repeats the fun fact), so without one this part says "coming soon" with a Draft label. */
export function builtToDoText(robot){
  return MISSION_DETAILS[robot.legacyId]?.purpose||'';
}

export function mountFlowTop(el,robot){
  const text=builtToDoText(robot);
  el.innerHTML=text?section('🎯','flow.built',`<p>${esc(tx(`flow.${robot.id}.built`,text))}</p>`,robot,sources(robot))
    :`<section class="panel rf-sec"><h2><span aria-hidden="true">🎯</span> ${t('flow.built')} ${draftLabel()}</h2><p>${t('robotStory.missing')}</p><p class="rsc-note mono">${t('robotStory.draftNote')}</p></section>`;
}

export async function mountFlowBottom(el,robot,{onQuiz}){
  const abandoned=robot.status!=='talking';
  let html='';
  // Why I was left there (only for robots that were left behind or went silent)
  const why=robot.record?.whyLeft;
  if(abandoned&&why)html+=section('🪧','flow.why',`<p>${esc(tx(`flow.${robot.id}.why`,why))}</p>`,robot,sources(robot));
  el.innerHTML=html+`<div id="rf-last"></div>`+
    `<section class="panel rf-sec rf-quiz"><h2><span aria-hidden="true">🧠</span> ${t('flow.quick')}</h2><p>${t('flow.quickText',{name:esc(robot.n)})}</p><button type="button" class="btn" id="rf-quizbtn">${t('flow.quickBtn')}</button></section>`;
  el.querySelector('#rf-quizbtn').onclick=onQuiz;
  // Last Message: first-person lines. Lines written to feel like the robot speaking are labelled "poetic".
  try{
    const msg=await getMessage(robot.id);
    if(!msg||!el.isConnected)return;
    const lines=msg.lines.slice(0,3);
    el.querySelector('#rf-last').innerHTML=`<section class="panel rf-sec"><h2><span aria-hidden="true">💌</span> ${t('flow.last')}${msg.placeholder?' '+draftLabel():''}</h2>`+
      `<ul class="rf-lines">${lines.map(l=>`<li>${esc(l.text)}${l.poetic?` <span class="lm-poetic">${t('lastMessage.poetic')}</span>`:''}</li>`).join('')}</ul>`+
      `${msg.placeholder?`<p class="rsc-note mono">${t('lastMessage.placeholderNote')}</p>`:''}<p><a class="btn sm" href="#/last-message/${esc(robot.id)}">${t('flow.lastMore')}</a></p></section>`;
  }catch{/* the page still works without this section */}
}

export function mountNextExplorer(el,robot){
  const next=nextRobot(MISSIONS,robot.id);
  el.innerHTML=next?`<div class="rf-next"><a class="btn" href="#/mission/${esc(next.id)}">${t('flow.next',{name:esc(next.n)})} <span aria-hidden="true">→</span></a></div>`:'';
}
