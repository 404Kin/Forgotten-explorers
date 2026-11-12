// Soft Landing rules: no DOM, no canvas (easy to test). Units: pixels and seconds.
// Tuned to be SLOW and forgiving for young players: a gentle pull, a lander that straightens itself,
// wide safe limits, and plenty of fuel. (The first version fell about 3x faster and needed expert timing.)
export const VIEW={w:360,h:520,groundY:470};
export const FEET=22; // distance from the ship's centre to its feet (the ship is drawn 1.2x bigger so it is easy to see)

import {DIFFICULTIES,LEVELS,WORLD_BASE} from './config.js';
export {DIFFICULTIES,LEVELS};

/** The numbers for one run: the level's planet, adjusted by the chosen difficulty. Pure. */
export function buildWorld(levelId,difficultyId){
  const level=LEVELS.find(l=>l.id===levelId)||LEVELS[0],d=DIFFICULTIES.find(x=>x.id===difficultyId)||DIFFICULTIES[0],base=WORLD_BASE[level.world];
  return{...base,id:level.id,level,gravity:base.gravity*d.gravity,safeVy:base.safeVy*d.limit,safeVx:base.safeVx*d.limit,safeAngle:base.safeAngle*d.limit,
    wind:d.wind,startFuel:d.fuel,padW:level.pad,rough:level.rough};
}

/** Small seeded random numbers: a run is reproducible for tests. */
export const rng=seed=>{let a=seed>>>0;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}};

export function createTerrain(random,world){
  const padW=world.padW,padX=40+random()*(VIEW.w-80-padW);const pts=[];
  for(let x=0;x<=VIEW.w+20;x+=20)pts.push([x,(x>=padX-20&&x<=padX+padW+20)?VIEW.groundY:VIEW.groundY-random()*world.rough]);
  return{pts,pad:{x:padX,w:padW}};
}
export function groundY(terrain,x){
  const {pad,pts}=terrain;if(x>=pad.x&&x<=pad.x+pad.w)return VIEW.groundY;
  const i=Math.min(pts.length-2,Math.max(0,Math.floor(x/20))),a=pts[i],b=pts[i+1];return a[1]+(b[1]-a[1])*((x-a[0])/20);
}

export const createLander=(random,world)=>({x:60+random()*(VIEW.w-120),y:70,vx:(random()-.5)*24,vy:0,angle:0,fuel:world.startFuel,status:'fly',thrusting:false,time:0});

/**
 * Advance dt seconds. input = {left,right,thrust}. Returns 'landed' | 'crashed' | null.
 * Sets s.status and s.result when the lander touches the ground.
 */
export function step(s,dt,input,world,terrain){
  if(s.status!=='fly')return null;
  s.time+=dt;
  if(input.left)s.angle-=world.turn*dt;if(input.right)s.angle+=world.turn*dt;
  // Stabilizer: with no steering the lander slowly straightens up by itself, so "upright" is easy to keep.
  if(!input.left&&!input.right)s.angle-=Math.sign(s.angle)*Math.min(Math.abs(s.angle),world.stabilize*dt);
  s.angle=Math.max(-1.2,Math.min(1.2,s.angle));
  s.thrusting=Boolean(input.thrust)&&s.fuel>0;
  s.vy+=world.gravity*dt;
  if(s.thrusting){s.vx+=Math.sin(s.angle)*world.thrust*dt;s.vy-=Math.cos(s.angle)*world.thrust*dt;s.fuel=Math.max(0,s.fuel-world.fuelBurn*dt)}
  // Wind (Hard): slow gusts that change direction, so the ship needs gentle corrections.
  if(world.wind)s.vx+=windAt(world,s.time)*dt;
  s.vx*=1-.25*dt; // gentle sideways drag (kind to beginners; keeps the lander from drifting off for ever)
  s.x+=s.vx*dt;s.y+=s.vy*dt;
  if(s.x<14||s.x>VIEW.w-14){s.vx*=-.4;s.x=Math.max(14,Math.min(VIEW.w-14,s.x))}
  if(s.y<20){s.y=20;s.vy=Math.max(0,s.vy)} // ceiling
  const gy=groundY(terrain,s.x);
  if(s.y+FEET>=gy){s.y=gy-FEET;s.result=judge(s,world,terrain);s.status=s.result.ok?'landed':'crashed';return s.status}
  return null;
}

/** Why did it land or crash? reason is one of: ok | tooFast | tilted | sideways | missedPad. */
export function judge(s,world,terrain){
  const onPad=s.x>terrain.pad.x&&s.x<terrain.pad.x+terrain.pad.w;
  const vy=Math.abs(s.vy),vx=Math.abs(s.vx),tilt=Math.abs(s.angle);
  let reason='ok';
  if(!onPad)reason='missedPad';else if(vy>world.safeVy)reason='tooFast';else if(tilt>world.safeAngle)reason='tilted';else if(vx>world.safeVx)reason='sideways';
  const ok=reason==='ok';
  // Stars: 1 for landing, +1 for a very gentle touch, +1 for fuel left over.
  const stars=ok?1+(vy<world.safeVy*.55?1:0)+(s.fuel>=world.startFuel*.45?1:0):0;
  return{ok,reason,stars,fuel:Math.round(s.fuel)};
}

/** Speed state for the HUD: 'slow' (good), 'careful', 'fast' (too fast to land). Ratio uses the world's safe speed. */
export function speedState(s,world){const r=Math.max(0,s.vy)/world.safeVy;return{ratio:r,state:r<.6?'slow':r<=1?'careful':'fast'}}
export const tiltState=(s,world)=>Math.abs(s.angle)<=world.safeAngle?'upright':'tilted';

export const xpFor=result=>result.ok?20+result.stars*5:3;

/** Current wind push in px/s² (negative = to the left). Used by the physics and by the HUD arrow. */
export const windAt=(world,time)=>world.wind?world.wind*Math.sin(time*.8):0;
