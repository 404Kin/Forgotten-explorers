// Drawing only. Sticker style: thick dark outlines, flat friendly colours.
import {VIEW,groundY} from './physics.js';
const INK='#14122b',{w:W,h:H}=VIEW;
const line=(c,w=3)=>{c.lineWidth=w;c.strokeStyle=INK;c.lineJoin='round';c.lineCap='round';c.stroke()};

export function makeBackdrop(){
  const r=(()=>{let a=11;return()=>(a=(a*16807)%2147483647)/2147483647})();
  return{stars:Array.from({length:60},()=>({x:r()*W,y:r()*H*.7,s:r()*1.8+.5,p:r()*6}))};
}

function sky(c,world,bg,t,reduced){
  const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,world.sky[0]);g.addColorStop(1,world.sky[1]);c.fillStyle=g;c.fillRect(0,0,W,H);
  c.fillStyle='#fff';
  for(const s of bg.stars){c.globalAlpha=reduced?.8:.45+.5*Math.sin(t*2+s.p);c.fillRect(s.x,s.y,s.s,s.s)}
  c.globalAlpha=1;
  if(world.deco==='earth'){c.beginPath();c.arc(298,86,28,0,7);c.fillStyle='#4fa8ff';c.fill();line(c);c.beginPath();c.arc(289,79,10,0,7);c.fillStyle='#58c27d';c.fill();c.beginPath();c.arc(306,96,7,0,7);c.fill()}
  else{c.beginPath();c.arc(298,86,20,0,7);c.fillStyle='#ffd34e';c.fill();line(c)}
}

function ground(c,world,terrain){
  c.beginPath();c.moveTo(0,H);for(const [x,y] of terrain.pts)c.lineTo(x,y);c.lineTo(W+20,H);c.closePath();c.fillStyle=world.ground;c.fill();line(c);
  c.fillStyle='#0003';for(let i=0;i<10;i++){const x=(i*37+15)%W;c.beginPath();c.ellipse(x,groundY(terrain,x)+22+(i*11)%26,9,3,0,0,7);c.fill()}
}

function pad(c,terrain,t,reduced){
  const {x,w}=terrain.pad,y=VIEW.groundY;
  c.fillStyle='#ffd34e';c.fillRect(x,y-6,w,10);c.strokeStyle=INK;c.lineWidth=3;c.strokeRect(x,y-6,w,10);
  c.fillStyle=INK;for(let i=0;i<w;i+=16)c.fillRect(x+i+4,y-4,8,6);                 // hazard stripes
  const on=reduced||Math.floor(t*2)%2===0;c.fillStyle=on?'#fc3d21':'#7a2a22';
  [x+2,x+w-2].forEach(px=>{c.beginPath();c.arc(px,y-12,4,0,7);c.fill()});
  // Bouncing arrow tells a beginner exactly where to go.
  const bob=reduced?0:Math.sin(t*4)*5;c.beginPath();c.moveTo(x+w/2,y-26+bob);c.lineTo(x+w/2-12,y-46+bob);c.lineTo(x+w/2+12,y-46+bob);c.closePath();c.fillStyle='#ffd34e';c.fill();line(c,2.5);
}

function lander(c,s,t,reduced,exploded){
  if(exploded)return;
  c.save();c.translate(s.x,s.y);c.rotate(s.angle);c.scale(1.2,1.2);
  if(s.thrusting){const f=reduced?1:.8+Math.random()*.5;
    c.beginPath();c.moveTo(-7,14);c.lineTo(0,14+34*f);c.lineTo(7,14);c.closePath();c.fillStyle='#ff7a2e';c.fill();
    c.beginPath();c.moveTo(-4,14);c.lineTo(0,14+18*f);c.lineTo(4,14);c.closePath();c.fillStyle='#ffe066';c.fill()}
  c.beginPath();c.moveTo(-12,8);c.lineTo(-22,20);c.moveTo(12,8);c.lineTo(22,20);line(c,3);               // legs
  c.beginPath();c.moveTo(-26,20);c.lineTo(-18,20);c.moveTo(18,20);c.lineTo(26,20);line(c,3);               // feet
  c.beginPath();c.arc(0,0,16,0,7);c.fillStyle='#f2c240';c.fill();line(c);                                 // body
  c.beginPath();c.arc(0,-3,9,Math.PI,0);c.fillStyle='#e9f6ff';c.fill();line(c,2.5);                       // window
  c.fillStyle=INK;c.beginPath();c.arc(-3,-5,1.8,0,7);c.arc(3,-5,1.8,0,7);c.fill();                        // friendly eyes
  c.beginPath();c.moveTo(0,-16);c.lineTo(0,-26);line(c,2.5);c.beginPath();c.arc(0,-27,3,0,7);c.fillStyle='#fc3d21';c.fill();
  c.restore();
}

export function draw(c,{world,terrain,s,bg,particles,t,reduced}){
  sky(c,world,bg,t,reduced);ground(c,world,terrain);pad(c,terrain,t,reduced);
  for(const p of particles){c.globalAlpha=Math.max(0,p.life);c.fillStyle=p.color;c.beginPath();c.arc(p.x,p.y,p.r,0,7);c.fill()}c.globalAlpha=1;
  lander(c,s,t,reduced,s.status==='crashed');
}
