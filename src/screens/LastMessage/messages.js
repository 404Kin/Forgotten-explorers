// Where Last Message text comes from.
// 1) src/data/lastMessages.json (P1, real text)   2) PLACEHOLDER built from the robot's own story page.
// Shape of the real file (ask P1):  { "<robotId>": { lines:[{id,text,poetic,startSec?,source?}], audio:{en:"audio/last-message/x.en.mp3",bn:null}, credit? } }
// poetic:true = a line written to feel like the robot speaking, NOT a real quote. Real quotes must carry `source`.
import {MISSIONS} from '../../robots/index.js';
import {tx} from '../../i18n/index.js';

// Lazy glob: no build error while P1's file does not exist yet.
const real=import.meta.glob('../../data/lastMessages.json');

let cache;
async function realData(){
  if(cache!==undefined)return cache;
  const load=real['../../data/lastMessages.json'];
  cache=load?(await load()).default:null;return cache;
}

// PLACEHOLDER until P1 sends the real first-person text. Line 1 is the robot's existing "Right now" story page
// (already first person, from src/data/missions.js, so no new facts). Line 2 is a generic goodbye marked poetic.
function placeholderFor(m){
  const last=m.p[m.p.length-1];
  return{placeholder:true,audio:null,lines:[
    {id:'right-now',text:last[1],poetic:false},
    {id:'goodbye',text:m.a?'PLACEHOLDER: I am still here, sending my hello across the dark.':'PLACEHOLDER: Good night, Earth. I will rest under the stars.',poetic:true}
  ]};
}

/** Message for one robot id, lines already translated where a translation key exists. */
export async function getMessage(robotId){
  const m=MISSIONS.find(x=>x.id===robotId);if(!m)return null;
  const data=await realData();
  const entry=data?.[robotId]?{...data[robotId],placeholder:false}:placeholderFor(m);
  return{...entry,robot:m,
    lines:entry.lines.map(l=>({...l,text:tx(`lastMessage.${robotId}.${l.id}`,l.text)}))};
}

export const robotsWithMessages=()=>MISSIONS;
