// Soft-landing game. Hold the buttons (or arrow keys / space) to steer and thrust. Land gently on the gold pad!
import {addXP,update} from '../state/store.js';
import {sfx} from '../services/audio.js';
const W=360,H=520,WORLDS={moon:{g:.035,name:'Moon',sky:'#0b1030',gr:'#9a9ab8'},mars:{g:.055,name:'Mars',sky:'#3b1717',gr:'#b5452a'}};
let raf,off=[];
export default{name:'lander',
mount(el){let wk='moon';const menu=()=>{el.innerHTML=`<div class="wrap"><a class="btn sm alt" href="#/play">← Games</a><div class="hero"><h1>Soft Landing</h1><p>Land gently on the gold pad. Slow and upright wins!</p></div><div class="tiles" style="max-width:520px;margin:18px auto">${Object.entries(WORLDS).map(([k,w])=>`<button class="tile" data-k="${k}" style="background:${k==='moon'?'#d5d5e6':'#f0b79c'}"><span>${k==='moon'?'🌙':'🔴'}</span><b>${w.name}</b>${k==='moon'?'Easy · low gravity':'Harder · more gravity'}</button>`).join('')}</div></div>`;el.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{wk=b.dataset.k;play()})};
function play(){const wd=WORLDS[wk];el.innerHTML=`<div class="wrap"><a class="btn sm alt" href="#/play">← Games</a><div class="gamebox"><canvas width="${W}" height="${H}"></canvas><div id="res" class="panel" style="display:none;position:absolute;inset:auto 12px 12px;text-align:center"></div></div><div class="ctl"><button class="btn alt" id="bl">⬅️</button><button class="btn" id="bt">🔥</button><button class="btn alt" id="br">➡️</button></div></div>`;
const c=el.querySelector('canvas'),x=c.getContext('2d'),K={l:0,r:0,t:0};
const pts=[];const padW=80,padX=40+Math.random()*(W-160);for(let i=0;i<=W/20;i++){const px=i*20;pts.push([px,H-50-(px>=padX-20&&px<=padX+padW+20?0:Math.random()*55)])}
const gy=px=>{if(px>=padX&&px<=padX+padW)return H-50;const i=Math.min(pts.length-2,Math.max(0,px/20|0)),a=pts[i],b=pts[i+1];return a[1]+(b[1]-a[1])*((px-a[0])/20)};
pts.forEach(p=>{if(p[0]>=padX&&p[0]<=padX+padW)p[1]=H-50});
const s={x:40+Math.random()*280,y:50,vx:(Math.random()-.5)*.8,vy:0,a:0,f:100,done:false};
const bind=(id,k)=>{const b=el.querySelector(id);['pointerdown'].forEach(e=>b.addEventListener(e,ev=>{ev.preventDefault();K[k]=1}));['pointerup','pointerleave','pointercancel'].forEach(e=>b.addEventListener(e,()=>K[k]=0))};bind('#bl','l');bind('#br','r');bind('#bt','t');
const kd=e=>{if(e.key==='ArrowLeft')K.l=1;if(e.key==='ArrowRight')K.r=1;if(e.key===' '||e.key==='ArrowUp'){K.t=1;e.preventDefault()}},ku=e=>{if(e.key==='ArrowLeft')K.l=0;if(e.key==='ArrowRight')K.r=0;if(e.key===' '||e.key==='ArrowUp')K.t=0};addEventListener('keydown',kd);addEventListener('keyup',ku);off.push(()=>{removeEventListener('keydown',kd);removeEventListener('keyup',ku)});
const stars=Array.from({length:40},()=>[Math.random()*W,Math.random()*H*.7,Math.random()*1.6+.4]);
function finish(ok){s.done=true;const fuel=Math.round(s.f),xp=ok?30+Math.round(fuel/2):5;const r=el.querySelector('#res');r.style.display='block';r.innerHTML=`<h2>${ok?'🎉 Perfect landing!':'💥 Bumpy landing!'}</h2><p>${ok?`Fuel left: ${fuel}%. +${xp} XP`:'Too fast or tilted. Try slower and upright!'}</p><button class="btn" id="again">Try again</button> <a class="btn alt" href="#/play">Games</a>`;r.querySelector('#again').onclick=play;if(ok){sfx.win();update(S=>{S.stats.lander++});addXP(xp,'for landing')}else sfx.bad()}
function loop(){raf=requestAnimationFrame(loop);if(!s.done){if(K.l)s.a-=.05;if(K.r)s.a+=.05;s.vy+=wd.g;if(K.t&&s.f>0){s.vx+=Math.sin(s.a)*.09;s.vy-=Math.cos(s.a)*.09;s.f-=.25}s.x+=s.vx;s.y+=s.vy;if(s.x<10||s.x>W-10){s.vx*=-.5;s.x=Math.max(10,Math.min(W-10,s.x))}
if(s.y+18>=gy(s.x)){const ok=s.x>padX&&s.x<padX+padW&&Math.abs(s.vy)<1.6&&Math.abs(s.a)<.35&&Math.abs(s.vx)<1.1;s.y=gy(s.x)-18;finish(ok)}}
x.fillStyle=wd.sky;x.fillRect(0,0,W,H);x.fillStyle='#fff';stars.forEach(([a,b,r])=>x.fillRect(a,b,r,r));
x.fillStyle=wd.gr;x.beginPath();x.moveTo(0,H);pts.forEach(p=>x.lineTo(p[0],p[1]));x.lineTo(W,H);x.fill();x.strokeStyle='#14122b';x.lineWidth=3;x.stroke();x.fillStyle='#ffd34e';x.fillRect(padX,H-54,padW,8);
x.save();x.translate(s.x,s.y);x.rotate(s.a);if(K.t&&s.f>0&&!s.done){x.fillStyle='#ff7a2e';x.beginPath();x.moveTo(-6,14);x.lineTo(0,34+Math.random()*10);x.lineTo(6,14);x.fill()}
x.strokeStyle='#14122b';x.lineWidth=3;x.fillStyle='#f2c240';x.beginPath();x.arc(0,0,15,0,7);x.fill();x.stroke();x.beginPath();x.moveTo(-14,10);x.lineTo(-22,20);x.moveTo(14,10);x.lineTo(22,20);x.stroke();
x.fillStyle='#fff';x.beginPath();x.arc(-5,-2,4.5,0,7);x.arc(5,-2,4.5,0,7);x.fill();x.fillStyle='#14122b';x.beginPath();x.arc(-4,-1,2,0,7);x.arc(6,-1,2,0,7);x.fill();x.restore();
x.fillStyle='#fff';x.font='bold 13px monospace';x.fillText(`FUEL ${Math.round(s.f)}%   SPEED ${Math.abs(s.vy).toFixed(1)} ${Math.abs(s.vy)<1.6?'✓':'!'}`,10,20)}
loop()}
menu()},
unmount(){cancelAnimationFrame(raf);off.forEach(f=>f());off=[]}};
