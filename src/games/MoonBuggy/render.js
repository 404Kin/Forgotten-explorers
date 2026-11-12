// Canvas drawing only (no game rules). Sticker style: thick dark outlines and flat colours, like the rest of the app.
// `night` (0 day .. 1 night) changes sky, ground, stars, outlines and lights smoothly. At night every shape gets a LIGHT rim,
// because the dark outline that works by day would vanish against a dark ground.
import {VIEW} from './tracks.js';
import {terrainY} from './physics.js';

const INK='#14122b',RIM='#b9c6ff',{w:W,h:H,buggyScreenX:BX}=VIEW;

/** Mix two #rrggbb colours (t = 0 gives a, t = 1 gives b). Pure. */
export function mix(a,b,t){
  const p=c=>[1,3,5].map(i=>parseInt(c.slice(i,i+2),16)),A=p(a),B=p(b);
  return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('');
}
const outline=(ctx,night,w=3)=>{ctx.lineWidth=w;ctx.strokeStyle=mix(INK,RIM,night);ctx.lineJoin='round';ctx.stroke()};

export function makeBackdrop(seed=1){
  const rnd=(()=>{let a=seed;return()=>(a=(a*16807)%2147483647)/2147483647})();
  return{stars:Array.from({length:90},()=>({x:rnd()*W*2,y:rnd()*H*.62,r:rnd()*1.5+.5}))};
}

function sky(ctx,track,bg,cam,reduced,t,night){
  const g=ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,mix(track.sky[0],track.nightSky[0],night));g.addColorStop(1,mix(track.sky[1],track.nightSky[1],night));
  ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#fff';
  for(const s of bg.stars){
    const x=((s.x-cam*.05)%(W*2)+W*2)%(W*2);
    if(x<W){const base=.05+.95*night;   /* stars are almost invisible by day */ ctx.globalAlpha=reduced?base:base*(.6+.4*Math.sin(t*2+s.x));ctx.fillRect(x,s.y,s.r+night*.6,s.r+night*.6)}
  }
  ctx.globalAlpha=1;
  // Sky decoration. Earth (Moon levels) stays up all night; the Sun sinks and fades as the night comes.
  const sunX=track.decor==='earth'?170:520;
  ctx.globalAlpha=Math.max(0,1-night*1.1);
  ctx.beginPath();ctx.arc(sunX,70+night*120,track.decor==='earth'?22:18,0,7);ctx.fillStyle='#ffd34e';ctx.fill();outline(ctx,night);ctx.globalAlpha=1;
  if(track.decor==='earth'){
    ctx.beginPath();ctx.arc(520,70,26,0,7);ctx.fillStyle='#4fa8ff';ctx.fill();outline(ctx,night);
    ctx.beginPath();ctx.arc(512,64,9,0,7);ctx.fillStyle='#58c27d';ctx.fill();
  }
}

function farHills(ctx,track,cam,night){
  ctx.beginPath();ctx.moveTo(0,H);
  for(let x=0;x<=W;x+=16)ctx.lineTo(x,VIEW.groundY-34-26*Math.sin((x+cam*.3)/130)-14*Math.sin((x+cam*.3)/53));
  ctx.lineTo(W,H);ctx.fillStyle=mix(track.far,'#1a1d3f',night*.7);ctx.fill();
}

function ground(ctx,track,world,cam,night){
  ctx.beginPath();ctx.moveTo(0,H);
  for(let x=0;x<=W+8;x+=8)ctx.lineTo(x,terrainY(track,world,cam+x));
  ctx.lineTo(W+8,H);ctx.closePath();
  // The ground gets darker at night but never as dark as the sky behind it, and its edge gets a light line.
  ctx.fillStyle=mix(track.ground,'#2c3160',night*.62);ctx.fill();outline(ctx,night);
  ctx.fillStyle='#0003';
  for(let i=0;i<24;i++){const wx=Math.floor((cam+i*61)/61)*61+((i*37)%50);const sx=wx-cam;if(sx>0&&sx<W)ctx.fillRect(sx,terrainY(track,world,wx)+14+(i*13)%40,5,3)}
}

/**
 * Shadows: as the sun goes down they stretch (up to 4x) away from it, then fade once the light is gone.
 * `dusk` (0..1) is the first half of the change, `night` the whole change.
 */
function shadow(ctx,x,y,w,len,alpha){
  if(alpha<=0)return;
  ctx.globalAlpha=alpha;ctx.fillStyle='#0b0b20';
  ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+w,y);ctx.lineTo(x+w+len,y+3);ctx.lineTo(x+len*.4,y+5);ctx.closePath();ctx.fill();ctx.globalAlpha=1;
}
const shadowLen=(night,base)=>base*(1+3*Math.min(1,night*1.6));   // longest around dusk
const shadowAlpha=night=>Math.max(0,.45*(1-Math.max(0,(night-.55)/.45)));

function rock(ctx,x,y,w,h,night){
  ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+w*.15,y-h*.8);ctx.lineTo(x+w*.5,y-h);ctx.lineTo(x+w*.9,y-h*.7);ctx.lineTo(x+w,y);ctx.closePath();
  ctx.fillStyle=mix('#5b5b7a','#8f95c4',night);ctx.fill();outline(ctx,night);
  ctx.beginPath();ctx.moveTo(x+w*.5,y-h);ctx.lineTo(x+w*.9,y-h*.7);ctx.lineTo(x+w*.6,y-h*.45);ctx.closePath();ctx.fillStyle=mix('#7c7ca0','#b9c0ee',night);ctx.fill();
}

function star(ctx,x,y,r,spin,night){
  ctx.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5+spin,rr=i%2?r*.45:r;ctx.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr)}ctx.closePath();
  if(night>.3){ctx.shadowColor='#ffd34e';ctx.shadowBlur=10*night}   // collectible stars glow at night so they stay easy to see
  ctx.fillStyle='#ffd34e';ctx.fill();ctx.shadowBlur=0;outline(ctx,night,2.5);
}

function flag(ctx,x,y,t,reduced,night){
  ctx.fillStyle='#fff';ctx.fillRect(x,y-110,5,110);outline(ctx,night,2);
  ctx.beginPath();const wave=reduced?0:Math.sin(t*5)*3;
  ctx.moveTo(x+5,y-110);ctx.lineTo(x+62,y-104+wave);ctx.lineTo(x+5,y-80);ctx.closePath();ctx.fillStyle='#fc3d21';ctx.fill();outline(ctx,night,2);
}

function wheel(ctx,x,y,r,spin,night){
  ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fillStyle='#2a2a40';ctx.fill();outline(ctx,night,3);
  ctx.beginPath();ctx.arc(x,y,r*.45,0,7);ctx.fillStyle='#d9dcf2';ctx.fill();
  ctx.beginPath();for(let i=0;i<3;i++){const a=spin+i*2.094;ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(a)*r*.9,y+Math.sin(a)*r*.9)}ctx.strokeStyle=INK;ctx.lineWidth=2;ctx.stroke();
}

/** Headlights: two soft cones on the ground ahead of the rover. They switch on as the light fades. */
function headlights(ctx,s,night){
  const a=Math.max(0,(night-.25)/.75);if(a<=0)return;
  ctx.save();ctx.translate(BX,s.y);ctx.rotate(s.angle);
  const g=ctx.createLinearGradient(30,-14,260,-6);g.addColorStop(0,`rgba(255,246,190,${.55*a})`);g.addColorStop(1,'rgba(255,246,190,0)');
  ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(30,-18);ctx.lineTo(270,-48);ctx.lineTo(270,22);ctx.lineTo(30,-6);ctx.closePath();ctx.fill();
  ctx.fillStyle=`rgba(255,250,210,${a})`;ctx.beginPath();ctx.arc(31,-14,4.5,0,7);ctx.fill();   // the lamp itself
  ctx.restore();
}

function buggy(ctx,s,t,reduced,night){
  // Blink while invulnerable. Reduced motion: a steady lower opacity instead of flashing.
  if(s.invuln>0)ctx.globalAlpha=reduced?.55:(Math.floor(t*12)%2?.35:1);
  ctx.save();ctx.translate(BX,s.y);ctx.rotate(s.angle);
  const spin=s.x/12;
  ctx.beginPath();ctx.moveTo(-30,-12);ctx.lineTo(-26,-30);ctx.lineTo(24,-30);ctx.lineTo(32,-12);ctx.closePath();ctx.fillStyle='#f2c240';ctx.fill();outline(ctx,night);
  ctx.beginPath();ctx.arc(2,-34,13,Math.PI,0);ctx.fillStyle='#e9f6ff';ctx.fill();outline(ctx,night);       // dome
  ctx.fillStyle=INK;ctx.fillRect(-3,-41,3,5);ctx.fillRect(6,-41,3,5);                                        // eyes
  ctx.beginPath();ctx.moveTo(-26,-30);ctx.lineTo(-34,-52);outline(ctx,night,2.5);ctx.beginPath();ctx.arc(-34,-53,3,0,7);ctx.fillStyle='#fc3d21';ctx.fill();   // antenna
  wheel(ctx,-20,-9,11,spin,night);wheel(ctx,22,-9,11,spin,night);
  ctx.restore();ctx.globalAlpha=1;
}

export function draw(ctx,{track,world,state,backdrop,dust,reduced,t,night=0}){
  const cam=state.x-BX;
  sky(ctx,track,backdrop,cam,reduced,t,night);farHills(ctx,track,cam,night);ground(ctx,track,world,cam,night);
  for(const c of world.craters){const sx=c.x-cam;if(sx>-80&&sx<W+80){ctx.beginPath();ctx.ellipse(sx,terrainY(track,world,c.x)-c.depth*.35,c.w*.3,5,0,0,7);ctx.fillStyle='#0004';ctx.fill()}}
  for(const r of world.rocks){const sx=r.x-cam;if(sx>-80&&sx<W+20){const gy=terrainY(track,world,r.x);shadow(ctx,sx+r.w*.5,gy,r.w*.6,shadowLen(night,r.h*.9),shadowAlpha(night));rock(ctx,sx,gy,r.w,r.h,night)}}
  for(const st of world.stars){if(st.taken)continue;const sx=st.x-cam;if(sx>-20&&sx<W+20)star(ctx,sx,terrainY(track,world,st.x)-st.h+(reduced?0:Math.sin(t*3+st.x)*3),11,reduced?0:t,night)}
  flag(ctx,track.length-cam,terrainY(track,world,track.length),t,reduced,night);
  // The rover's own shadow, stretching behind it as the sun sets.
  shadow(ctx,BX-30,state.grounded?state.y:terrainY(track,world,state.x),52,shadowLen(night,12),shadowAlpha(night)*.9);
  headlights(ctx,state,night);
  ctx.fillStyle='#fff6';for(const d of dust){ctx.globalAlpha=d.life;ctx.beginPath();ctx.arc(d.x-cam,d.y,3+(1-d.life)*4,0,7);ctx.fill()}ctx.globalAlpha=1;
  buggy(ctx,state,t,reduced,night);
}
