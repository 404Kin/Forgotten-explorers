// Memory Match: find each robot's picture and its name card. Shared GameShell gives Pause / Restart / Back / result.
// Starts with a short peek so young players can see the cards first.
import './MemoryMatch.css';
import {MISSIONS} from '../../data/missions.js';
import {shuffle} from '../../utils/dom.js';
import {addXP,update} from '../../state/store.js';
import {sfx} from '../../services/audio.js';
import {t} from '../../i18n/index.js';
import {inkFor} from '../../components/contrast.js';
import {createGameShell} from '../../components/GameShell/GameShell.js';

const PAIRS=6,PEEK_MS=2200,MISMATCH_MS=900;
/** Stars for a finished game: fewer moves = more stars. Pure, easy to test. */
export const starsFor=moves=>moves<=10?3:moves<=16?2:1;
export const xpFor=moves=>Math.max(10,70-moves*3);

let timers=[],shell=null;
const later=(fn,ms)=>{const id=setTimeout(fn,ms);timers.push(id);return id};
const stop=()=>{timers.forEach(clearTimeout);timers=[];shell?.destroy();shell=null};

export default{name:'memory',
mount(el){start(el)},
unmount(){stop()}};

function start(el){
  stop();
  const pick=shuffle(MISSIONS).slice(0,PAIRS),tiles=shuffle(pick.flatMap(m=>[{m,kind:'art'},{m,kind:'name'}]));
  let open=[],matched=0,moves=0,lock=true;
  shell=createGameShell(el,{title:t('game.memory'),icon:'🃏',accent:'#ff8fa3',onRestart:()=>start(el)});
  const sh=shell;
  shell.hud.innerHTML=`<span class="gs-pill" id="mmmoves" aria-live="polite">👣 ${t('memory.moves',{n:0})}</span><span class="gs-pill" id="mmpairs">⭐ ${t('memory.pairs',{n:0,total:PAIRS})}</span>`;
  shell.body.className='gs-body mm-body';
  shell.body.innerHTML=`<p class="mm-msg" id="mmmsg" role="status">${t('memory.peek')}</p><div class="mm-grid" id="mmgrid"></div>`;
  const grid=shell.body.querySelector('#mmgrid'),msg=shell.body.querySelector('#mmmsg');

  const face=tl=>tl.kind==='art'
    ?`<svg viewBox="0 0 200 200" aria-hidden="true">${tl.m.ch()}</svg>`
    :`<b>${tl.m.n}</b><small>${tl.m.y}</small>`;
  const label=(tl,i,state)=>state==='hidden'?t('memory.cardHidden',{n:i+1}):tl.kind==='art'?t('memory.cardArt',{name:tl.m.n}):t('memory.cardName',{name:tl.m.n});

  const cards=tiles.map((tl,i)=>{
    const b=document.createElement('button');b.type='button';b.className='mm-card';
    b.innerHTML=`<span class="mm-in"><span class="mm-back" aria-hidden="true">✦</span><span class="mm-front" style="background:${tl.m.c};color:${inkFor(tl.m.c,tl.m.k)}">${face(tl)}</span></span>`;
    b.setAttribute('aria-label',label(tl,i,'hidden'));
    b.onclick=()=>flip(b,tl,i);grid.appendChild(b);return b;
  });
  const setOpen=(b,tl,i,on)=>{b.classList.toggle('open',on);b.setAttribute('aria-label',label(tl,i,on?'open':'hidden'))};

  function flip(b,tl,i){
    if(lock||sh.paused||b.classList.contains('open')||b.classList.contains('done'))return;
    sfx.tap();setOpen(b,tl,i,true);open.push([b,tl,i]);
    if(open.length<2)return;
    moves++;shell.hud.querySelector('#mmmoves').textContent=`👣 ${t('memory.moves',{n:moves})}`;
    const [[b1,t1,i1],[b2,t2,i2]]=open;open=[];
    if(t1.m===t2.m&&t1.kind!==t2.kind){
      matched++;sfx.good();[b1,b2].forEach(x=>x.classList.add('done'));
      shell.hud.querySelector('#mmpairs').textContent=`⭐ ${t('memory.pairs',{n:matched,total:PAIRS})}`;
      if(matched===PAIRS)win();
    }else{
      lock=true;later(()=>{setOpen(b1,t1,i1,false);setOpen(b2,t2,i2,false);lock=false},MISMATCH_MS);
    }
  }
  function win(){
    const xp=xpFor(moves);sfx.win();update(S=>{S.stats.memory++});addXP(xp,t('memory.xpReason'));
    later(()=>shell?.showResult({icon:'🎉',title:t('memory.won'),stars:starsFor(moves),text:t('memory.result',{moves,xp})}),700);
  }

  // Peek: show everything for a moment, then hide and let the player start.
  cards.forEach((b,i)=>b.classList.add('open'));
  later(()=>{cards.forEach((b,i)=>setOpen(b,tiles[i],i,false));msg.textContent=t('memory.go');lock=false},PEEK_MS);
}
