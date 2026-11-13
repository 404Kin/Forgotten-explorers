// ONE list of robots for the whole app. It merges two sources that used to be separate:
//   - src/data/missions.js       : 11 hand-made robots (art, colours, story pages). Their nicknames (EAGLE, OPPY ...) and saved progress stay the same.
//   - src/data/robotRecords.json : P1's 24 checked-style records (status, dates, coordinates, sources, why left, quiz).
// Every record becomes a robot; a record that matches a hand-made robot reuses its art and text, the others get generic art
// and their own record text. The shape is the same as the old MISSIONS entries, so every screen keeps working.
import {MISSIONS as HAND_MADE,WORLDS,INTRO} from '../data/missions.js';
import RECORDS from '../data/robotRecords.json';
import {rover,lander} from '../art/robots.js';

const K='#14122b';
// Hand-made robot -> record id, only where the ids differ.
const RECORD_ID={EAGLE:'apollo-11-descent-stage',VIKRAM:'chandrayaan-3-vikram',PERSY:'perseverance-mars-2020'};
// Nicknames for records that have no hand-made robot (short, shown on cards and map pins).
const NICK={'apollo-12-descent-stage':'APOLLO 12','apollo-14-descent-stage':'APOLLO 14','apollo-15-descent-stage':'APOLLO 15','apollo-16-descent-stage':'APOLLO 16','apollo-17-descent-stage':'APOLLO 17',
  'apollo-15-lunar-rover':'ROVER 15','apollo-16-lunar-rover':'ROVER 16','apollo-17-lunar-rover':'ROVER 17','surveyor-3':'SURVEYOR','sojourner':'SOJOURNER','viking-1-lander':'VIKING 1','viking-2-lander':'VIKING 2','ingenuity':'INGENUITY'};
// Look of generated robots. Colours differ so cards are easy to tell apart.
const LOOK={
  'apollo-12-descent-stage':{c:'#e8d9a8',g:'☾',art:()=>lander({c:'#f4c04a',arm:0})},'apollo-14-descent-stage':{c:'#e1d3f2',g:'☾',art:()=>lander({c:'#f4c04a',arm:0})},
  'apollo-15-descent-stage':{c:'#cfe8d8',g:'☾',art:()=>lander({c:'#f4c04a',arm:0})},'apollo-16-descent-stage':{c:'#f6d6c2',g:'☾',art:()=>lander({c:'#f4c04a',arm:0})},
  'apollo-17-descent-stage':{c:'#d4def7',g:'☾',art:()=>lander({c:'#f4c04a',arm:0})},
  'apollo-15-lunar-rover':{c:'#cfe3ff',g:'◎',art:()=>rover({c:'#f1f1f8'})},'apollo-16-lunar-rover':{c:'#ffe3b8',g:'◎',art:()=>rover({c:'#f1f1f8'})},'apollo-17-lunar-rover':{c:'#d7f0c8',g:'◎',art:()=>rover({c:'#f1f1f8'})},
  'surveyor-3':{c:'#c6f0e0',g:'✚',art:()=>lander({c:'#e9e9f4',round:1})},'sojourner':{c:'#f5c6a5',g:'♦',art:()=>rover({c:'#fbe9c8',panel:1})},
  'viking-1-lander':{c:'#e6c8ff',g:'❖',art:()=>lander({c:'#fff6e8',round:1,arm:1})},'viking-2-lander':{c:'#ffd0e0',g:'❖',art:()=>lander({c:'#fff6e8',round:1,arm:1})},
  'ingenuity':{c:'#ffe0b0',g:'✺',art:()=>rover({c:'#fff',heli:1})}
};
const WORLD={moon:'moon',mars:'mars',deep_space:'deep'};
// Record status -> the ids the rest of the app (status badge, filters) uses.
const STATUS={left_behind:'left_behind',silent:'silent',still_talking:'talking'};

const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
/** "1967-04-17" -> "April 17, 1967" (also accepts "1967-04" and "1967"). Pure. */
export function prettyDate(iso){
  if(!iso)return '';
  const [y,m,d]=String(iso).split('-');
  return m?(d?`${MONTHS[+m-1]} ${+d}, ${y}`:`${MONTHS[+m-1]} ${y}`):y;
}
const firstSentence=(s,max=84)=>{const one=String(s).split(/(?<=[.!?])\s/)[0];if(one.length<=max)return one;const cut=one.slice(0,max-1),sp=cut.lastIndexOf(' ');return cut.slice(0,sp>40?sp:max-1).trimEnd()+'…'};
const coords=r=>r.lat==null?'':`${Math.abs(r.lat)}° ${r.lat<0?'S':'N'}, ${Math.abs(r.lon)}° ${r.lon<0?'W':'E'}`;

function fromRecord(r){
  const look=LOOK[r.id]||{c:'#d9dcf2',g:'•',art:()=>lander({c:'#e9e9f4'})};
  return{
    n:NICK[r.id]||r.id.toUpperCase(),t:firstSentence(r.kidFact),w:WORLD[r.world]||'deep',y:+String(r.arrivalDate).slice(0,4),a:r.status==='still_talking'?1:0,
    c:look.c,k:K,g:look.g,ch:look.art,
    p:r.story.map(s=>[s.title,s.text]),
    // quiz format used by the games: [question, right answer, wrong answers...] (the data keeps the right answer first)
    q:[r.quiz[0].q,...r.quiz[0].options],
    real:{name:r.name,launchDate:prettyDate(r.launchDate),arrivalDate:prettyDate(r.arrivalDate),arrivalEvent:'',location:r.world==='moon'?'The Moon':r.world==='mars'?'Mars':'Deep space',
      coordinates:coords(r),lat:r.lat,lon:r.lon,distanceKm:null,lightSeconds:null,speedKmS:null,status:''}
  };
}

/** Every robot, in record order. Same fields as the old MISSIONS plus: id (record id), legacyId, record, status, sources. */
export const ROBOTS=RECORDS.map((rec,index)=>{
  const legacy=HAND_MADE.find(h=>(RECORD_ID[h.n]||h.id)===rec.id);
  const base=legacy?{...legacy,legacyId:legacy.id}:fromRecord(rec);
  return{...base,index,id:rec.id,legacyId:base.legacyId||rec.id,record:rec,status:STATUS[rec.status]||'silent',sources:rec.sources,agency:rec.agency};
});
export const ROBOT_COUNT=ROBOTS.length;
export const robotById=id=>ROBOTS.find(r=>r.id===id)||null;
export{WORLDS,INTRO};
