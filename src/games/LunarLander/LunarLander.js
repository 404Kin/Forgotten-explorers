// Soft Landing screen: world picker + "how to play", then the game inside the shared GameShell (pause, restart, back).
// Rules live in physics.js, drawing in render.js. This file only wires input, HUD and the result.
import './LunarLander.css';
import {t} from '../../i18n/index.js';
import {addXP,update} from '../../state/store.js';
import {sfx} from '../../services/audio.js';
import {createGameShell} from '../../components/GameShell/GameShell.js';
import {VIEW,WORLDS,WORLD_IDS,rng,createTerrain,createLander,step,speedState,tiltState,xpFor} from './physics.js';
import {draw,makeBackdrop} from './render.js';

const reducedMotion=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const ICON={moon:'🌙',mars:'🔴'};
let raf=0,cleanup=[];
const stop=()=>{cancelAnimationFrame(raf);cleanup.forEach(f=>f());cleanup=[]};

export default{name:'lander',
mount(el){
  const menu=()=>{
    stop();
    el.innerHTML=`<div class="wrap ll-menu"><a class="btn sm alt" href="#/play"><span aria-hidden="true">←</span> ${t('game.back')}</a>`+
      `<div class="hero"><h1>🛬 ${t('game.lander')}</h1><p>${t('lander.sub')}</p></div>`+
      `<div class="tiles">${WORLD_IDS.map(k=>`<button type="button" class="tile ll-worldtile" data-k="${k}" style="background:${k==='moon'?'#d5d5e6':'#f0b79c'}"><span aria-hidden="true">${ICON[k]}</span><b>${t('world.'+k+'.short')}</b>${t('lander.'+k+'Desc')}<em>▶ ${t('lander.start')}</em></button>`).join('')}</div>`+
      `<section class="panel ll-how" aria-labelledby="llh"><h2 id="llh">${t('lander.how.title')}</h2><ol class="ll-steps">`+
        [['🔥','1'],['↔️','2'],['🟡','3']].map(([ic,n])=>`<li><span class="ico" aria-hidden="true">${ic}</span><span><b>${t('lander.how.'+n+'.title')}</b>${t('lander.how.'+n+'.text')}</span></li>`).join('')+
      `</ol><p class="mono" style="margin:12px 0 0;text-align:center">${t('lander.how.keys')}</p></section></div>`;
    el.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>play(b.dataset.k));
  };

  function play(key){
    stop();
    const world=WORLDS[key],reduced=reducedMotion(),random=rng((Math.random()*2**31)|0);
    const terrain=createTerrain(random),s=createLander(random),bg=makeBackdrop(),particles=[];
    const input={left:false,right:false,thrust:false};
    const shell=createGameShell(el,{title:t('game.lander'),icon:ICON[key],accent:key==='moon'?'#d5d5e6':'#f0b79c',onRestart:()=>play(key),onResume:()=>{last=0}});
    cleanup.push(()=>shell.destroy());
    shell.hud.innerHTML='';
    shell.body.className='gs-body ll-play';
    shell.body.innerHTML=
      `<div class="ll-hud">`+
        `<div class="ll-meter" id="mfuel" role="meter" aria-label="${t('lander.fuel')}" aria-valuemin="0" aria-valuemax="100"><span>⛽ ${t('lander.fuel')}</span><div class="bar"><i></i></div><span class="word"></span></div>`+
        `<div class="ll-meter" id="mspeed" role="status" aria-label="${t('lander.speed')}"><span>🚀 ${t('lander.speed')}</span><div class="bar"><i></i></div><span class="word"></span></div>`+
        `<div class="ll-meter" id="mtilt" role="status" aria-label="${t('lander.tilt')}"><span>📐 ${t('lander.tilt')}</span><div class="bar"><i></i></div><span class="word"></span></div></div>`+
      `<div class="ll-canvaswrap"><canvas width="${VIEW.w}" height="${VIEW.h}" role="img" aria-label="${t('lander.canvas')}"></canvas><p class="ll-hint" id="hint">${t('lander.hintStart')}</p></div>`+
      `<div class="ll-controls"><button type="button" class="btn alt" data-c="left" aria-label="${t('lander.left')}"><span aria-hidden="true">⬅️</span><small>${t('lander.left')}</small></button>`+
        `<button type="button" class="btn" data-c="thrust" aria-label="${t('lander.thrust')}"><span aria-hidden="true">🔥</span><small>${t('lander.thrust')}</small></button>`+
        `<button type="button" class="btn alt" data-c="right" aria-label="${t('lander.right')}"><span aria-hidden="true">➡️</span><small>${t('lander.right')}</small></button></div>`+
      `<p class="ll-keys">${t('lander.how.keys')}</p>`;
    const $=q=>shell.body.querySelector(q),cv=$('canvas'),c=cv.getContext('2d'),dpr=Math.min(devicePixelRatio||1,2);
    cv.width=VIEW.w*dpr;cv.height=VIEW.h*dpr;c.scale(dpr,dpr);
    const hint=$('#hint');let hintUntil=7,last=0,t0=0,done=false;

    // ---- input: hold buttons (pointer capture so a finger sliding off does not get stuck) or keys ----
    shell.body.querySelectorAll('[data-c]').forEach(b=>{
      const k=b.dataset.c,set=v=>{input[k]=v;b.classList.toggle('held',v)};
      b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture?.(e.pointerId);set(true)});
      ['pointerup','pointercancel','lostpointercapture'].forEach(ev=>b.addEventListener(ev,()=>set(false)));
    });
    const map={ArrowLeft:'left',a:'left',A:'left',ArrowRight:'right',d:'right',D:'right',ArrowUp:'thrust',w:'thrust',W:'thrust',' ':'thrust'};
    const kd=e=>{const k=map[e.key];if(!k||e.target.closest?.('input,select'))return;if(e.target.closest?.('button,a')&&e.key===' ')return;e.preventDefault();input[k]=true;shell.body.querySelector(`[data-c=${k}]`)?.classList.add('held')};
    const ku=e=>{const k=map[e.key];if(!k)return;input[k]=false;shell.body.querySelector(`[data-c=${k}]`)?.classList.remove('held')};
    addEventListener('keydown',kd);addEventListener('keyup',ku);cleanup.push(()=>{removeEventListener('keydown',kd);removeEventListener('keyup',ku)});

    const puff=(x,y,n,color,speed)=>{for(let i=0;i<n;i++)particles.push({x,y,vx:(Math.random()-.5)*speed,vy:(Math.random()-.3)*speed,life:1,r:2+Math.random()*3,color})};

    function hud(){
      const sp=speedState(s,world),tilt=tiltState(s,world);
      const fuel=$('#mfuel');fuel.setAttribute('aria-valuenow',Math.round(s.fuel));fuel.querySelector('i').style.width=s.fuel+'%';
      fuel.dataset.state=s.fuel>25?'ok':'careful';fuel.querySelector('.word').textContent=s.fuel>0?`${Math.round(s.fuel)}%`:t('lander.state.empty');
      const ms=$('#mspeed');ms.dataset.state=sp.state;ms.querySelector('i').style.width=Math.min(100,sp.ratio*100)+'%';
      ms.querySelector('.word').textContent=(sp.state==='slow'?'✓ ':sp.state==='fast'?'⚠ ':'')+t('lander.state.'+sp.state);
      const mt=$('#mtilt');mt.dataset.state=tilt;mt.querySelector('i').style.width=Math.min(100,Math.abs(s.angle)/world.safeAngle*50)+'%';
      mt.querySelector('.word').textContent=(tilt==='upright'?'✓ ':'⚠ ')+t('lander.state.'+tilt);
      // One helpful sentence at a time. First the welcome, then help only when it is needed.
      let msg='';
      if(s.time<hintUntil)msg=t('lander.hintStart');
      else if(s.fuel<=0)msg=t('lander.hintFuel');
      else if(sp.state==='fast')msg=t('lander.hintFast');
      else if(tilt==='tilted')msg=t('lander.hintTilt');
      hint.textContent=msg;hint.classList.toggle('off',!msg);
    }

    function finish(outcome){
      done=true;const r=s.result,xp=xpFor(r);
      if(outcome==='landed'){sfx.win();update(S=>{S.stats.lander++})}else{sfx.bad();puff(s.x,s.y,36,'#ffd34e',260)}
      addXP(xp,t('xp.landing'));
      hint.classList.add('off');
      // The crash explosion plays for a moment before the result card appears.
      setTimeout(()=>{if(!shell)return;shell.showResult(outcome==='landed'
        ?{icon:'🎉',title:t('lander.perfect'),stars:r.stars,text:t('lander.fuelLeft',{fuel:r.fuel,xp})}
        :{icon:'💥',title:t('lander.bumpy'),stars:0,text:`${t('lander.tip.'+r.reason)} +${xp} XP`})},outcome==='landed'?350:900);
    }

    function frame(now){
      raf=requestAnimationFrame(frame);
      const dt=last?Math.max(0,Math.min(.05,(now-last)/1000)):0;last=now;if(!t0)t0=now;
      if(!shell.paused&&!done){
        const out=step(s,dt,input,world,terrain);
        if(s.thrusting){if(Math.random()<.7)puff(s.x-Math.sin(s.angle)*16,s.y+Math.cos(s.angle)*16,1,Math.random()<.5?'#ff7a2e':'#ffe066',60)}
        hud();if(out)finish(out);
      }
      for(const p of particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt*1.6}while(particles.length&&particles[0].life<=0)particles.shift();
      draw(c,{world,terrain,s,bg,particles,t:(now-t0)/1000,reduced});
    }
    hud();raf=requestAnimationFrame(frame);
  }
  menu();
},
unmount(){stop()}};
