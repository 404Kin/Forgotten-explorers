// Pure game rules (no DOM, no canvas), so they are easy to unit-test: terrain, track generation, one physics step.
import {VIEW,LIVES,RELAXED_FACTOR} from './tracks.js';

/** Small seeded random numbers so a track is the same for a given seed. */
export function createRng(seed){let a=seed>>>0;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const between=(rng,[lo,hi])=>lo+rng()*(hi-lo);

/** Lay out rocks, craters and stars along the track. Stars float over obstacles, so jumping is rewarded. */
export function generateWorld(track,rng){
  const rocks=[],craters=[],stars=[];let x=520;
  while(x<track.length-400){
    const roll=rng();
    if(roll<.5){const w=between(rng,track.rock.w),h=between(rng,track.rock.h);rocks.push({x,w,h});
      for(let i=0;i<3;i++)stars.push({x:x+w/2-40+i*40,h:62+Math.sin(i/2*Math.PI)*34,taken:false})}
    else if(roll<.82){const w=between(rng,track.crater.w);craters.push({x:x+w/2,w,depth:track.crater.depth});
      for(let i=0;i<3;i++)stars.push({x:x-0+i*(w/2),h:60+Math.sin(i/2*Math.PI)*38,taken:false})}
    else stars.push({x,h:20,taken:false},{x:x+46,h:20,taken:false});
    x+=between(rng,track.obstacleGap)+track.rock.w[1];
  }
  return{rocks,craters,stars};
}

/** Height of the ground at x (smaller y = higher). Gentle hills plus a smooth bowl inside each crater. */
export function craterDip(craters,x){
  let dip=0;
  for(const c of craters){const d=(x-c.x)/(c.w/2);if(d>-1&&d<1)dip+=c.depth*(1-d*d)}
  return dip;
}
export const hillY=(track,x)=>VIEW.groundY+track.hills*(Math.sin(x/110)+.5*Math.sin(x/47));
export const terrainY=(track,world,x)=>hillY(track,x)+craterDip(world.craters,x);

export function createState(){
  return{status:'ready',x:0,y:VIEW.groundY,vy:0,grounded:true,lives:LIVES,stars:0,time:0,invuln:0,jumpBuffer:0,angle:0,relaxed:false};
}

// Relaxed mode slows time, not the jump shape: gravity scales with k^2 and jump speed with k, so the jump covers the SAME ground
// distance at any speed. (Slowing only the speed would make wide rocks almost impossible to clear.)
const timeScale=s=>s.relaxed?RELAXED_FACTOR:1;
const speedAt=(track,s)=>{const p=Math.min(1,s.x/track.length);return(track.speed.start+(track.speed.end-track.speed.start)*p)*(s.relaxed?RELAXED_FACTOR:1)};

/**
 * Advance the race by dt seconds. `jump` = player pressed jump this frame. Mutates and returns the events
 * that happened, so the UI can play sounds / announce: 'jump' | 'star' | 'crash' | 'won' | 'lost'.
 */
export function step(s,dt,jump,track,world){
  const events=[];
  if(s.status==='ready'){if(jump){s.status='run'}else return events}
  if(s.status!=='run')return events;

  s.time+=dt;s.invuln=Math.max(0,s.invuln-dt);
  // A jump pressed a moment too early still counts (kid-friendly timing).
  s.jumpBuffer=jump?.12:Math.max(0,s.jumpBuffer-dt);
  s.x+=speedAt(track,s)*dt;

  const k=timeScale(s);
  if(s.jumpBuffer>0&&s.grounded){s.vy=-track.jump*k;s.grounded=false;s.jumpBuffer=0;events.push('jump')}
  s.vy+=track.gravity*k*k*dt;s.y+=s.vy*dt;
  const gy=terrainY(track,world,s.x);
  if(s.y>=gy){s.y=gy;s.vy=0;s.grounded=true}else s.grounded=false;
  s.angle=Math.atan2(terrainY(track,world,s.x+18)-terrainY(track,world,s.x-18),36);

  const crash=(afterX)=>{if(s.invuln>0)return;s.lives--;s.invuln=1.6;s.x=afterX;s.y=terrainY(track,world,s.x);s.vy=0;s.grounded=true;events.push('crash')};

  // Driving (not flying) into a crater bowl = crash; the buggy restarts just after it.
  if(s.grounded&&craterDip(world.craters,s.x)>track.crater.depth*.4){
    const c=world.craters.find(k=>Math.abs(s.x-k.x)<k.w/2);crash(c?c.x+c.w/2+30:s.x+60);
  }
  for(const r of world.rocks){
    const overlap=s.x+26>r.x&&s.x-26<r.x+r.w;
    // Buggy "feet" must be below the rock top to hit it: jumping high enough clears it.
    if(overlap&&s.y>terrainY(track,world,r.x)-r.h+4){crash(r.x+r.w+34);break}
  }
  for(const st of world.stars){
    if(st.taken)continue;
    if(Math.abs(s.x-st.x)<30&&Math.abs((s.y-18)-(terrainY(track,world,st.x)-st.h))<36){st.taken=true;s.stars++;events.push('star')}
  }
  if(s.lives<=0){s.status='lost';events.push('lost')}
  else if(s.x>=track.length){s.status='won';events.push('won')}
  return events;
}

/** XP for a finished race. Winning always pays more than losing. Stars are capped so a long track cannot give more than a level of XP. */
export const xpFor=(s)=>s.status==='won'?20+Math.min(20,Math.round(s.stars/3))+s.lives*5:3+Math.min(10,Math.round(s.stars/5));
