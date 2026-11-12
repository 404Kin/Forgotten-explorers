// node src/games/LunarLander/LunarLander.check.mjs  : can a careful pilot win every level on every difficulty? does idle always crash?
import assert from 'node:assert/strict';
import {buildWorld,rng,createTerrain,createLander,step,windAt,LEVELS,DIFFICULTIES} from './physics.js';
function run(levelId,diff,seed,pilot){const w=buildWorld(levelId,diff),r=rng(seed),t=createTerrain(r,w),s=createLander(r,w);let n=0;while(s.status==='fly'&&n++<60*180)step(s,1/60,pilot(s,w,t),w,t);return{s,w,t}}
const idle=()=>({});
// A sensible pilot: aim for the pad with gentle tilts, brake late and only as much as needed (no wasted fuel), keep below the safe speed.
const careful=(s,w,t)=>{const cx=t.pad.x+t.pad.w/2,dx=cx-s.x,want=Math.max(-.3,Math.min(.3,dx*.004-s.vx*.014)),h=470-22-s.y,net=w.thrust-w.gravity;
  const stopDist=s.vy>0?(s.vy*s.vy)/(2*Math.max(1,net)):0;
  return{left:s.angle>want+.06,right:s.angle<want-.06,thrust:s.vy>w.safeVy*.85||stopDist>=h*.72}};
let checks=0;const ok=(name,fn)=>{fn();checks++;console.log('  ok  ',name)};
console.log('careful pilot, 40 seeds per cell (landed / 40):');
const table={};
for(const l of LEVELS)for(const d of DIFFICULTIES){let wins=0;for(let seed=1;seed<=40;seed++)if(run(l.id,d.id,seed,careful).s.status==='landed')wins++;table[`${l.id} / ${d.id}`]=wins}
console.table(table);
ok('every level and difficulty can be won (>= 55% for a simple bot; level 3 is meant to be the hardest)',()=>{for(const [k,v] of Object.entries(table))assert.ok(v>=22,k+' only '+v+'/40')});
ok('doing nothing always crashes',()=>{for(const l of LEVELS)for(const d of DIFFICULTIES)assert.equal(run(l.id,d.id,3,idle).s.status,'crashed')});
ok('harder difficulty falls faster',()=>{const f=d=>run('moon',d,5,idle).s.time;assert.ok(f('easy')>f('medium')&&f('medium')>f('hard'),`${f('easy').toFixed(1)}s > ${f('medium').toFixed(1)}s > ${f('hard').toFixed(1)}s`)});
ok('fuel and limits shrink with difficulty; only Hard has wind',()=>{const e=buildWorld('moon','easy'),m=buildWorld('moon','medium'),h=buildWorld('moon','hard');
  assert.ok(e.startFuel>m.startFuel&&m.startFuel>h.startFuel);assert.ok(e.safeVy>m.safeVy&&m.safeVy>h.safeVy);assert.equal(e.wind+m.wind,0);assert.ok(h.wind>0&&Math.abs(windAt(h,2))>0)});
ok('level 3 has a narrower pad than level 1',()=>{assert.ok(buildWorld('ridge','easy').padW<buildWorld('moon','easy').padW)});
ok('wind pushes the ship sideways on Hard',()=>{const w=buildWorld('moon','hard'),r=rng(2),t=createTerrain(r,w),s=createLander(r,w);s.vx=0;s.time=2;step(s,.5,{},w,t);assert.ok(Math.abs(s.vx)>1,'vx='+s.vx)});
console.log(`\n${checks} checks passed`);
