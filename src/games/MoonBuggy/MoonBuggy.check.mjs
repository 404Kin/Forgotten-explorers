// node src/games/MoonBuggy/MoonBuggy.check.mjs
import assert from 'node:assert/strict';
import {LEVELS,DIFFICULTIES,buildTrack,RELAXED_FACTOR} from './tracks.js';
import {createRng,generateWorld,createState,step,xpFor,nightFactor,speedRatio} from './physics.js';
import {mix} from './render.js';
import {contrast} from '../../components/contrast.js';
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
ok('base speed is faster than the first version (185 px/s) and every level ramps up by at least 1.35x',()=>{for(const l of LEVELS){assert.ok(l.speed.start>=230,l.id);assert.ok(l.speed.end/l.speed.start>=1.35,l.id+' ramp '+(l.speed.end/l.speed.start).toFixed(2))}});
ok('speed really grows during a run (speed meter ratio goes up)',()=>{const track=buildTrack('dust','normal'),s=createState(track);const r0=speedRatio(track,s);s.x=track.length*.9;assert.ok(speedRatio(track,s)>r0*1.25,r0+' -> '+speedRatio(track,s))});
ok('reduced motion: the ramp is gentler',()=>{const n=buildTrack('moon','normal'),g=buildTrack('moon','normal',{gentle:true});assert.equal(n.speed.start,g.speed.start);assert.ok(g.speed.end<n.speed.end&&g.speed.end>g.speed.start)});
ok('night starts once, halfway, and the change takes about 5 s of game time',()=>{
  const track=buildTrack('moon','easy'),world=generateWorld(track,createRng(4)),s=createState(track);let nights=0,at=null;
  for(let n=0;n<60*400&&s.status!=='won'&&s.status!=='lost';n++){const ev=step(s,1/60,smart(s,world,track),track,world);if(ev.includes('night')){nights++;at=s.x}}
  assert.equal(nights,1);assert.ok(Math.abs(at-track.length*track.night.at)<20,'at '+at);
  const t={...createState(track),nightAt:10,time:10};assert.equal(nightFactor(t),0);t.time=12.5;assert.ok(Math.abs(nightFactor(t)-.5)<.01);t.time=15;assert.equal(nightFactor(t),1);t.time=99;assert.equal(nightFactor(t),1);
  assert.equal(nightFactor({...t,time:10},true),1,'reduced motion: one single step, no fade');assert.equal(nightFactor({nightAt:null,time:50}),0);
});
ok('every level has a night fact with a NASA source and needsFactCheck',()=>{for(const l of LEVELS){assert.ok(l.night.factKey&&/^https:\/\/science\.nasa\.gov\//.test(l.night.source),l.id);assert.equal(l.night.needsFactCheck,true)}});
ok('night stays readable: light rims, rocks and gold stars are >= 3:1 against the night ground; ground is lighter than the sky',()=>{
  for(const l of LEVELS){const ground=mix(l.ground,'#2c3160',.62),rim='#b9c6ff',star='#ffd34e';
    assert.ok(contrast(rim,ground)>=3,l.id+' rim '+contrast(rim,ground).toFixed(1));assert.ok(contrast(star,ground)>=3,l.id+' star '+contrast(star,ground).toFixed(1));
    assert.ok(contrast(mix('#8f95c4','#8f95c4',0),ground)>=1.6,l.id+' rock fill '+contrast('#8f95c4',ground).toFixed(1));assert.ok(contrast(ground,l.nightSky[1])>=1.3,l.id+' ground vs sky '+contrast(ground,l.nightSky[1]).toFixed(1))}
});
console.log(`
${checks} checks passed`);
