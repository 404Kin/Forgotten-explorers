// Canvas drawing only (no game rules). Sticker style: thick dark outlines and flat colours, like the rest of the app.
import {VIEW} from './tracks.js';
import {terrainY} from './physics.js';

const INK='#14122b',{w:W,h:H,buggyScreenX:BX}=VIEW;
const outline=(ctx,w=3)=>{ctx.lineWidth=w;ctx.strokeStyle=INK;ctx.lineJoin='round';ctx.stroke()};

export function makeBackdrop(seed=1){
  const rnd=(()=>{let a=seed;return()=>(a=(a*16807)%2147483647)/2147483647})();
  return{stars:Array.from({length:70},()=>({x:rnd()*W*2,y:rnd()*H*.62,r:rnd()*1.5+.5}))};
}

function sky(ctx,track,bg,cam,reduced,t){
  const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,track.sky[0]);g.addColorStop(1,track.sky[1]);ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#fff';
  for(const s of bg.stars){const x=((s.x-cam*.05)%(W*2)+W*2)%(W*2);if(x<W){ctx.globalAlpha=reduced?.8:.5+.5*Math.sin(t*2+s.x);ctx.fillRect(x,s.y,s.r,s.r)}}
  ctx.globalAlpha=1;
  // Decoration in the sky: Earth over the Moon, a small Sun over Mars. Both are just friendly shapes.
  if(track.decor==='earth'){ctx.beginPath();ctx.arc(520,70,26,0,7);ctx.fillStyle='#4fa8ff';ctx.fill();outline(ctx);ctx.beginPath();ctx.arc(512,64,9,0,7);ctx.fillStyle='#58c27d';ctx.fill()}
  else{ctx.beginPath();ctx.arc(520,70,18,0,7);ctx.fillStyle='#ffd34e';ctx.fill();outline(ctx)}
}

function farHills(ctx,track,cam){
  ctx.beginPath();ctx.moveTo(0,H);
  for(let x=0;x<=W;x+=16)ctx.lineTo(x,VIEW.groundY-34-26*Math.sin((x+cam*.3)/130)-14*Math.sin((x+cam*.3)/53));
  ctx.lineTo(W,H);ctx.fillStyle=track.far;ctx.fill();
}

function ground(ctx,track,world,cam){
  ctx.beginPath();ctx.moveTo(0,H);
  for(let x=0;x<=W+8;x+=8)ctx.lineTo(x,terrainY(track,world,cam+x));
  ctx.lineTo(W+8,H);ctx.closePath();ctx.fillStyle=track.ground;ctx.fill();outline(ctx);
  // Speckles so the ground does not look flat while moving.
  ctx.fillStyle='#0003';
  for(let i=0;i<24;i++){const wx=Math.floor((cam+i*61)/61)*61+((i*37)%50);const sx=wx-cam;if(sx>0&&sx<W){ctx.fillRect(sx,terrainY(track,world,wx)+14+(i*13)%40,5,3)}}
}

function rock(ctx,x,y,w,h){
  ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+w*.15,y-h*.8);ctx.lineTo(x+w*.5,y-h);ctx.lineTo(x+w*.9,y-h*.7);ctx.lineTo(x+w,y);ctx.closePath();
  ctx.fillStyle='#5b5b7a';ctx.fill();outline(ctx);
  ctx.beginPath();ctx.moveTo(x+w*.5,y-h);ctx.lineTo(x+w*.9,y-h*.7);ctx.lineTo(x+w*.6,y-h*.45);ctx.closePath();ctx.fillStyle='#7c7ca0';ctx.fill();
}

function star(ctx,x,y,r,spin){
  ctx.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5+spin,rr=i%2?r*.45:r;ctx.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr)}ctx.closePath();
  ctx.fillStyle='#ffd34e';ctx.fill();outline(ctx,2.5);
}

function flag(ctx,x,y,t,reduced){
  ctx.fillStyle='#fff';ctx.fillRect(x,y-110,5,110);outline(ctx,2);
  ctx.beginPath();const wave=reduced?0:Math.sin(t*5)*3;
  ctx.moveTo(x+5,y-110);ctx.lineTo(x+62,y-104+wave);ctx.lineTo(x+5,y-80);ctx.closePath();ctx.fillStyle='#fc3d21';ctx.fill();outline(ctx,2);
}

function wheel(ctx,x,y,r,spin){
  ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fillStyle='#2a2a40';ctx.fill();outline(ctx,3);
  ctx.beginPath();ctx.arc(x,y,r*.45,0,7);ctx.fillStyle='#d9dcf2';ctx.fill();
  ctx.beginPath();for(let i=0;i<3;i++){const a=spin+i*2.094;ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(a)*r*.9,y+Math.sin(a)*r*.9)}ctx.strokeStyle=INK;ctx.lineWidth=2;ctx.stroke();
}

function buggy(ctx,s,t,reduced){
  // Blink while invulnerable. Reduced motion: a steady lower opacity instead of flashing.
  if(s.invuln>0)ctx.globalAlpha=reduced?.55:(Math.floor(t*12)%2?.35:1);
  ctx.save();ctx.translate(BX,s.y);ctx.rotate(s.angle);
  const spin=s.x/12;
  ctx.beginPath();ctx.moveTo(-30,-12);ctx.lineTo(-26,-30);ctx.lineTo(24,-30);ctx.lineTo(32,-12);ctx.closePath();ctx.fillStyle='#f2c240';ctx.fill();outline(ctx);
  ctx.beginPath();ctx.arc(2,-34,13,Math.PI,0);ctx.fillStyle='#e9f6ff';ctx.fill();outline(ctx);       // dome
  ctx.fillStyle=INK;ctx.fillRect(-3,-41,3,5);ctx.fillRect(6,-41,3,5);                                    // eyes
  ctx.beginPath();ctx.moveTo(-26,-30);ctx.lineTo(-34,-52);outline(ctx,2.5);ctx.beginPath();ctx.arc(-34,-53,3,0,7);ctx.fillStyle='#fc3d21';ctx.fill();   // antenna
  wheel(ctx,-20,-9,11,spin);wheel(ctx,22,-9,11,spin);
  ctx.restore();ctx.globalAlpha=1;
}

export function draw(ctx,{track,world,state,backdrop,dust,reduced,t}){
  const cam=state.x-BX;
  sky(ctx,track,backdrop,cam,reduced,t);farHills(ctx,track,cam);ground(ctx,track,world,cam);
  for(const c of world.craters){const sx=c.x-cam;if(sx>-80&&sx<W+80){ctx.beginPath();ctx.ellipse(sx,terrainY(track,world,c.x)-c.depth*.35,c.w*.3,5,0,0,7);ctx.fillStyle='#0004';ctx.fill()}}
  for(const r of world.rocks){const sx=r.x-cam;if(sx>-60&&sx<W+20)rock(ctx,sx,terrainY(track,world,r.x),r.w,r.h)}
  for(const st of world.stars){if(st.taken)continue;const sx=st.x-cam;if(sx>-20&&sx<W+20)star(ctx,sx,terrainY(track,world,st.x)-st.h+(reduced?0:Math.sin(t*3+st.x)*3),11,reduced?0:t)}
  flag(ctx,track.length-cam,terrainY(track,world,track.length),t,reduced);
  ctx.fillStyle='#fff6';for(const d of dust){ctx.globalAlpha=d.life;ctx.beginPath();ctx.arc(d.x-cam,d.y,3+(1-d.life)*4,0,7);ctx.fill()}ctx.globalAlpha=1;
  buggy(ctx,state,t,reduced);
}
