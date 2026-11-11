// Moon Buggy Race: jump over rocks and craters, grab stars, reach the flag. Tap, press Space, or use the Jump button.
// Rules live in physics.js, drawing in render.js, numbers in tracks.js. This file is only the screen: menu, HUD, input, result.
import './MoonBuggy.css';
import {t} from '../../i18n/index.js';
import {num} from '../../i18n/format.js';
import {addXP,update} from '../../state/store.js';
import {sfx} from '../../services/audio.js';
import {TRACKS,TRACK_IDS,VIEW,LIVES} from './tracks.js';
import {createRng,generateWorld,createState,step,xpFor} from './physics.js';
import {draw,makeBackdrop} from './render.js';

const BEST_KEY='fe2.buggy';
const reducedMotion=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const loadBest=()=>{try{return JSON.parse(localStorage.getItem(BEST_KEY)||'{}')}catch{return{}}};
const saveBest=b=>{try{localStorage.setItem(BEST_KEY,JSON.stringify(b))}catch{}};
const seconds=s=>num(s,1);

let raf=0,cleanup=[];
const stop=()=>{cancelAnimationFrame(raf);cleanup.forEach(f=>f());cleanup=[]};

export default{name:'buggy',
mount(el){
  let relaxed=reducedMotion(); // slower by default for people who asked for less motion

  const menu=()=>{
    stop();const best=loadBest();
    el.innerHTML=`<div class="wrap"><a class="btn sm alt" href="#/play"><span aria-hidden="true">←</span> ${t('game.back')}</a>`+
      `<div class="hero"><span class="mono">${t('game.buggy')}</span><h1>${t('game.buggy')}</h1><p>${t('buggy.sub')}</p></div>`+
      `<div class="tiles bg-tiles">${TRACK_IDS.map(k=>`<button type="button" class="tile bg-track" data-k="${k}" style="background:${k==='moon'?'#d5d5e6':'#f0b79c'}"><span aria-hidden="true">${k==='moon'?'🌙':'🔴'}</span><b>${t('world.'+k+'.short')}</b>${t('buggy.desc.'+k)}<small>${best[k]?t('buggy.best',{time:seconds(best[k])}):t('buggy.noBest')}</small></button>`).join('')}</div>`+
      `<label class="bg-opt"><input type="checkbox" id="bgrelax"${relaxed?' checked':''}> ${t('buggy.relaxed')}</label>`+
      `<div class="panel bg-how"><h2>${t('buggy.howTitle')}</h2><ul><li>${t('buggy.how1')}</li><li>${t('buggy.how2')}</li><li>${t('buggy.how3')}</li></ul></div></div>`;
    el.querySelector('#bgrelax').onchange=e=>{relaxed=e.target.checked};
    el.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>play(b.dataset.k));
  };

  function play(key){
    stop();
    const track=TRACKS[key],world=generateWorld(track,createRng((Math.random()*2**31)|0)),state=createState(),backdrop=makeBackdrop(7);
    state.relaxed=relaxed;
    const reduced=reducedMotion(),dust=[],totalStars=world.stars.length;
    el.innerHTML=`<div class="wrap bg-play"><a class="btn sm alt" href="#/play/buggy" id="bgquit"><span aria-hidden="true">←</span> ${t('game.buggy')}</a>`+
      `<div class="bg-hud"><span id="bglives"></span><span id="bgstars"></span><span id="bgtime"></span></div>`+
      `<div class="bg-prog" role="progressbar" aria-label="${t('buggy.progress')}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i></i></div>`+
      `<div class="bg-stage"><canvas width="${VIEW.w}" height="${VIEW.h}" role="img" aria-label="${t('buggy.canvas')}"></canvas>`+
      `<p class="bg-overlay panel" id="bgmsg">${t('buggy.ready')}</p><div id="bgres" class="panel bg-result" hidden></div></div>`+
      `<div class="bg-ctl"><button type="button" class="btn bg-jump" id="bgjump">${t('buggy.jump')}</button><button type="button" class="btn alt" id="bgpause">${t('buggy.pause')}</button></div>`+
      `<p class="bg-live" id="bglive" role="status" aria-live="polite"></p></div>`;
    const cv=el.querySelector('canvas'),ctx=cv.getContext('2d'),dpr=Math.min(devicePixelRatio||1,2);
    cv.width=VIEW.w*dpr;cv.height=VIEW.h*dpr;ctx.scale(dpr,dpr);
    const $=s=>el.querySelector(s),msg=$('#bgmsg'),live=$('#bglive');
    let jump=false,paused=false,last=0,t0=0,finished=false;

    const hud=()=>{
      $('#bglives').textContent='❤️'.repeat(Math.max(0,state.lives));$('#bglives').setAttribute('aria-label',t('buggy.lives',{n:state.lives}));
      $('#bgstars').textContent=`⭐ ${state.stars}`;$('#bgstars').setAttribute('aria-label',t('buggy.stars',{n:state.stars}));
      $('#bgtime').textContent=`⏱ ${seconds(state.time)}`;
      const p=Math.min(100,Math.round(state.x/track.length*100));$('.bg-prog').setAttribute('aria-valuenow',p);$('.bg-prog i').style.width=p+'%';
    };
    const say=text=>{live.textContent=text};

    function finish(){
      finished=true;cancelAnimationFrame(raf);
      const xp=xpFor(state),won=state.status==='won',best=loadBest();let newBest=false;
      if(won){if(!best[key]||state.time<best[key]){best[key]=state.time;saveBest(best);newBest=true}sfx.win()}else sfx.bad();
      update(S=>{S.stats.buggy=(S.stats.buggy||0)+1});addXP(xp,t('buggy.xpReason'));
      const r=$('#bgres');r.hidden=false;msg.hidden=true;
      r.innerHTML=`<h2>${won?'🏁 '+t('buggy.won'):'🛠 '+t('buggy.lost')}</h2>`+
        `<p>${won?t('buggy.winText',{time:seconds(state.time),stars:state.stars,total:totalStars,xp}):t('buggy.lostText',{stars:state.stars,xp})}</p>`+
        (newBest?`<p><b>${t('buggy.newBest')}</b></p>`:'')+
        `<button type="button" class="btn" id="bgagain">${t('common.playAgain')}</button> <a class="btn alt" href="#/play">${t('game.back')}</a>`;
      r.querySelector('#bgagain').onclick=()=>play(key);r.querySelector('#bgagain').focus();
      say(won?t('buggy.won'):t('buggy.lost'));
    }

    function frame(now){
      raf=requestAnimationFrame(frame);
      // First frame has no previous time; rAF's timestamp can also be slightly older than performance.now(), so never go negative.
      const dt=last?Math.max(0,Math.min(.05,(now-last)/1000)):0;last=now;if(!t0)t0=now;
      if(!paused){
        const events=step(state,dt,jump,track,world);jump=false;
        for(const e of events){
          if(e==='jump')sfx.tap();
          if(e==='star'){sfx.good();say(t('buggy.star'))}
          if(e==='crash'){sfx.bad();say(t('buggy.crash',{n:state.lives}))}
        }
        if(state.status==='run')msg.hidden=true;
        if(state.grounded&&state.status==='run'&&!reduced&&Math.random()<.5)dust.push({x:state.x-24,y:state.y,life:1});
        for(const d of dust)d.life-=dt*2.2;while(dust.length&&dust[0].life<=0)dust.shift();
        hud();
      }
      draw(ctx,{track,world,state,backdrop,dust,reduced,t:(now-t0)/1000});
      if(!finished&&(state.status==='won'||state.status==='lost'))finish();
    }

    // ----- input: Space / Up / W, tap on the game, the Jump button; P or Esc pauses -----
    const doJump=()=>{if(!paused)jump=true};
    const onKey=e=>{
      if(e.key===' '||e.key==='ArrowUp'||e.key==='w'||e.key==='W'){
        // Let Space still press a focused button (Pause, Play again) instead of stealing it.
        if(e.target.closest?.('button,a,input'))return;
        e.preventDefault();doJump();
      }else if(e.key==='p'||e.key==='P'||e.key==='Escape'){e.preventDefault();togglePause()}
    };
    function togglePause(){
      if(finished||state.status==='ready')return;
      paused=!paused;$('#bgpause').textContent=paused?t('buggy.resume'):t('buggy.pause');
      msg.hidden=!paused;msg.textContent=t('buggy.paused');say(paused?t('buggy.paused'):'');
    }
    const onVis=()=>{if(document.hidden&&!paused)togglePause()};
    addEventListener('keydown',onKey);document.addEventListener('visibilitychange',onVis);
    cleanup.push(()=>{removeEventListener('keydown',onKey);document.removeEventListener('visibilitychange',onVis)});
    const jb=$('#bgjump');
    // pointerdown (not click) so the jump happens the instant a finger touches.
    jb.addEventListener('pointerdown',e=>{e.preventDefault();doJump()});
    jb.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();doJump()}});
    cv.addEventListener('pointerdown',e=>{e.preventDefault();doJump()});
    $('#bgpause').onclick=togglePause;
    $('#bgquit').onclick=e=>{e.preventDefault();menu()};

    hud();raf=requestAnimationFrame(frame);jb.focus({preventScroll:true});
  }
  menu();
},
unmount(){stop()}};
