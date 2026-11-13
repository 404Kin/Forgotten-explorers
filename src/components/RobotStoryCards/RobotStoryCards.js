// Two cards on the robot page: "How I worked" and "What I discovered".
// Text comes from src/data/robotStories.json (P1, checked text with sources). Until a robot has an entry there, the card shows
// a PLACEHOLDER taken from text that already exists in the project data (missionDetails.js), clearly labelled "Draft".
// Shape of the real file (ask P1):
//   { "<robotId>": { "howIWorked": {"text":"...","sources":["https://..."],"needsFactCheck":false},
//                    "whatIDiscovered": {"text":"...","sources":["https://..."],"needsFactCheck":false} } }
import './RobotStoryCards.css';
import {t,tx} from '../../i18n/index.js';
import {MISSION_DETAILS} from '../../data/missionDetails.js';
import {loadInto} from '../StateView/StateView.js';

const real=import.meta.glob('../../data/robotStories.json');
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let cache;
async function realStories(){
  if(cache!==undefined)return cache;
  const load=real['../../data/robotStories.json'];
  try{cache=load?(await load()).default:null}catch{cache=null}
  return cache;
}

/** A card is a DRAFT unless its entry has sources and says it has been fact-checked (needsFactCheck:false). Pure. */
export const isDraft=entry=>!entry||entry.needsFactCheck!==false||!(entry.sources&&entry.sources.length);

/** PLACEHOLDER until P1 sends checked text: reuse the robot's existing hardware / science text, marked as draft. */
export function placeholderFor(robot,part){
  const d=MISSION_DETAILS[robot.legacyId]?.storyLine;
  const src=part==='howIWorked'?d?.hardware:d?.science;
  if(src?.desc)return{text:src.desc,title:src.title,sources:[],needsFactCheck:true,placeholder:true};
  // Robots without hand-written details: use the record (P1's draft). "How I worked" = the job page; "What I discovered" = the fun fact.
  const rec=robot.record,text=part==='howIWorked'?rec?.story?.[1]?.text:rec?.kidFact;
  return text?{text,sources:[],needsFactCheck:true,placeholder:true}:null;
}

/** The two cards' data for one robot id. Each part: {text,sources,draft,placeholder}. Pure given the loaded file. */
export function storyFor(robot,file){
  const robotId=robot.id,out={};
  for(const part of ['howIWorked','whatIDiscovered']){
    const entry=file?.[robotId]?.[part]||null,use=entry||placeholderFor(robot,part);
    out[part]=use?{...use,draft:isDraft(entry),placeholder:!entry}:{text:'',sources:[],draft:true,placeholder:true,empty:true};
  }
  return out;
}

function render(robotId,stories,box){
  box.innerHTML=`<div class="rsc-grid">`+[['howIWorked','🛠','robotStory.how'],['whatIDiscovered','🔭','robotStory.discovered']].map(([part,icon,key])=>{
    const s=stories[part],text=s.empty?t('robotStory.missing'):tx(`robotStory.${robotId}.${part}`,s.text);
    return `<article class="panel rsc-card"><h2><span aria-hidden="true">${icon}</span> ${t(key)}${s.draft?` <span class="rsc-draft">${t('robotStory.draft')}</span>`:''}</h2>`+
      `<p>${esc(text)}</p>`+
      (s.draft?`<p class="rsc-note mono">${t('robotStory.draftNote')}</p>`:'')+
      ((s.sources||[]).length?`<p class="rsc-src mono">${t('robotStory.sources')}: ${s.sources.map(u=>`<a href="${esc(u)}" target="_blank" rel="noopener">${esc(new URL(u).hostname)}</a>`).join(' · ')}</p>`:'')+
      `</article>`}).join('')+`</div>`;
}

export function mountRobotStoryCards(el,robot){
  loadInto(el,async()=>storyFor(robot,await realStories()),{compact:true,isEmpty:()=>false,render:(stories,box)=>render(robot.id,stories,box)});
}
