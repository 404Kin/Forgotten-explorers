// Tiny global store with localStorage persistence: XP, collection, badges, stats, streak.
import {XP_PER_LEVEL,RANKS} from '../config.js';
import {MISSIONS} from '../data/missions.js';
import {badges} from '../data/badges.js';
import {toast} from '../components/Toast.js';
const KEY='fe2.save';
const def={name:'',xp:0,collected:[],read:[],badges:[],streak:0,lastDay:'',stats:{correct:0,answered:0,bestQuiz:0,lander:0,memory:0}};
let S=load();const subs=new Set();
function load(){let v={};try{v=JSON.parse(localStorage.getItem(KEY)||'{}')}catch{}const s={...def,...v,stats:{...def.stats,...(v.stats||{})}};const t=new Date().toDateString(),y=new Date(Date.now()-864e5).toDateString();if(s.lastDay!==t){s.streak=s.lastDay===y?s.streak+1:1;s.lastDay=t}return s}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch{}};
export const get=()=>S;
export const subscribe=f=>(subs.add(f),()=>subs.delete(f));
export const level=s=>Math.floor(s.xp/XP_PER_LEVEL);
export const rank=s=>RANKS[Math.min(level(s),RANKS.length-1)];
export const levelProgress=s=>(s.xp%XP_PER_LEVEL)/XP_PER_LEVEL;
function commit(){const B=badges(MISSIONS);B.forEach(b=>{if(!S.badges.includes(b.id)&&b.test(S)){S.badges.push(b.id);toast(`Badge unlocked: ${b.icon} ${b.name}`,'badge')}});save();subs.forEach(f=>f(S))}
export function update(fn){fn(S);commit()}
export function addXP(n,why=''){const before=level(S);S.xp+=n;toast(`+${n} XP ${why}`);if(level(S)>before)toast(`Level up! You are now a ${rank(S)} 🎉`,'badge');commit()}
export function collect(nick){if(S.collected.includes(nick))return false;S.collected.push(nick);commit();return true}
export function reset(){S={...def,stats:{...def.stats}};commit()}
commit();
