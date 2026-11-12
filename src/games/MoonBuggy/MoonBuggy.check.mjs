// node src/games/MoonBuggy/MoonBuggy.check.mjs
import assert from 'node:assert/strict';
import {LEVELS,DIFFICULTIES,buildTrack,RELAXED_FACTOR} from './tracks.js';
import {createRng,generateWorld,createState,step,xpFor} from './physics.js';
let checks=0;const ok=(name,fn)=>{fn();checks++;console.log('  ok  ',name)};
function run(levelId,diff,seed,bot,relaxed=false){
  const track=buildTrack(levelId,diff),world=generateWorld(track,createRng(seed)),s=createState(track);s.relaxed=relaxed;let n=0;
  while(s.status!=='won'&&s.status!=='lost'&&n++<60*400)step(s,1/60,bot(s,world,track),track,world);
  return{s,world,track};
}
const never=s=>s.status==='ready';
// Jumps so that the middle of the jump (highest point) is over the middle of the next rock or crater.
const smart=(s,w,track)=>{
  if(s.status==='ready')return true;
  const k=s.relaxed?RELAXED_FACTOR:1,p=Math.min(1,s.x/track.length),speed=(track.speed.start+(track.speed.end-track.speed.start)*p)*k;
  const halfAir=(track.jump*k/(track.gravity*k*k))*speed;           // distance covered in half of a jump
  const centers=[...w.rocks.map(r=>r.x+r.w/2),...w.craters.map(c=>c.x)].filter(x=>x-halfAir>s.x-speed/60);
  const next=Math.min(...centers);return (s.grounded||s.coyote>0)&&s.x>=next-halfAir;
};
ok('levels get longer and faster each time',()=>{for(let i=1;i<LEVELS.length;i++){assert.ok(LEVELS[i].length>LEVELS[i-1].length,'length '+i);assert.ok(LEVELS[i].speed.start>LEVELS[i-1].speed.start,'start speed '+i);assert.ok(LEVELS[i].speed.end>LEVELS[i-1].speed.end,'top speed '+i)}});
ok('Hard is faster, busier and has fewer lives than Easy',()=>{const e=buildTrack('moon','easy'),h=buildTrack('moon','hard');assert.ok(h.speed.start>e.speed.start);assert.ok(h.obstacleGap[0]<e.obstacleGap[0]);assert.ok(h.lives<e.lives)});
ok('no crater is too wide to jump over at top speed (every level)',()=>{for(const l of LEVELS){const air=(2*l.jump/l.gravity)*l.speed.end*.9;assert.ok(air>l.crater.w[1]*1.4,l.id+' air '+Math.round(air))}});
ok('doing nothing loses on every level and difficulty',()=>{for(const l of LEVELS)for(const d of DIFFICULTIES)assert.equal(run(l.id,d.id,1,never).s.status,'lost')});
console.log('\nsimple bot, 12 seeds per cell (won / 12):');const table={};
for(const l of LEVELS)for(const d of DIFFICULTIES){let w=0;for(let seed=1;seed<=12;seed++)if(run(l.id,d.id,seed,smart).s.status==='won')w++;table[`${l.id} / ${d.id}`]=w}
console.table(table);
ok('every level can be won by a simple bot (>= 6 of 12)',()=>{for(const [k,v] of Object.entries(table))assert.ok(v>=6,k+' '+v)});
ok('relaxed mode is still winnable',()=>{assert.equal(run('moon','normal',3,smart,true).s.status,'won')});
ok('winning pays more XP than losing',()=>{const w=run('moon','easy',3,smart).s,l=run('moon','easy',3,never).s;assert.ok(xpFor(w)>xpFor(l))});
console.log(`\n${checks} checks passed`);
