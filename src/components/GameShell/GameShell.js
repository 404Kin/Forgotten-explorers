// One frame for every game: title bar, Pause button, pause menu (Resume / Restart / Back to games) and a result screen
// (Play again / Back to games). Games only supply their own canvas/board and react to onPause/onResume/onRestart,
// so every game behaves and looks the same and none of them needs its own pause code.
import './GameShell.css';
import {t} from '../../i18n/index.js';

/**
 * @param {HTMLElement} root  element to fill
 * @param {{title:string, icon:string, backHref?:string, accent?:string,
 *          onPause?:()=>void, onResume?:()=>void, onRestart:()=>void}} o
 */
export function createGameShell(root,{title,icon,backHref='#/play',accent='#ffd34e',onPause,onResume,onRestart}){
  root.innerHTML=
    `<div class="wrap gs" style="--gs-accent:${accent}">`+
      `<header class="gs-bar"><a class="btn sm alt gs-back" href="${backHref}"><span aria-hidden="true">←</span> ${t('game.back')}</a>`+
        `<h1 class="gs-title"><span aria-hidden="true">${icon}</span> ${title}</h1>`+
        `<button type="button" class="btn sm gs-pausebtn" aria-label="${t('shell.pause')}"><span aria-hidden="true">⏸</span> <span class="gs-pausetxt">${t('shell.pause')}</span></button></header>`+
      `<div class="gs-hud"></div>`+
      `<div class="gs-stage"><div class="gs-body"></div>`+
        `<div class="gs-overlay gs-pause" hidden role="dialog" aria-modal="true" aria-labelledby="gs-ph"><div class="panel gs-card">`+
          `<div class="gs-big" aria-hidden="true">⏸</div><h2 id="gs-ph">${t('shell.paused')}</h2><p>${t('shell.pausedHelp')}</p>`+
          `<div class="gs-actions"><button type="button" class="btn gs-resume">▶ ${t('shell.resume')}</button>`+
          `<button type="button" class="btn alt gs-restart">↻ ${t('shell.restart')}</button>`+
          `<a class="btn alt" href="${backHref}">${t('game.back')}</a></div></div></div>`+
        `<div class="gs-overlay gs-result" hidden role="dialog" aria-modal="true" aria-labelledby="gs-rh"><div class="panel gs-card"></div></div>`+
      `</div></div>`;

  const $=s=>root.querySelector(s),pauseBox=$('.gs-pause'),resultBox=$('.gs-result'),btn=$('.gs-pausebtn');
  let paused=false,over=false;

  function pause(){
    if(paused||over)return;paused=true;pauseBox.hidden=false;btn.disabled=true;
    $('.gs-resume').focus({preventScroll:true});onPause?.();
  }
  function resume(){
    if(!paused)return;paused=false;pauseBox.hidden=true;btn.disabled=false;btn.focus({preventScroll:true});onResume?.();
  }
  const toggle=()=>paused?resume():pause();

  btn.onclick=pause;$('.gs-resume').onclick=resume;
  $('.gs-restart').onclick=()=>{paused=false;pauseBox.hidden=true;btn.disabled=false;onRestart()};

  // P or Esc pauses/resumes. Not while typing in a field.
  const onKey=e=>{if(e.target.closest?.('input,textarea,select'))return;if(e.key==='Escape'||e.key==='p'||e.key==='P'){e.preventDefault();toggle()}};
  // A game must never keep running in a hidden tab.
  const onVis=()=>{if(document.hidden)pause()};
  addEventListener('keydown',onKey);document.addEventListener('visibilitychange',onVis);

  return{
    body:$('.gs-body'),hud:$('.gs-hud'),
    get paused(){return paused},
    pause,resume,toggle,
    /** {icon,title,text,stars?,primary?:{label,onClick}} : shows the result card with Play again + Back to games. */
    showResult({icon:ic='🎉',title:ti,text='',stars=null,extra=''}){
      over=true;paused=false;pauseBox.hidden=true;btn.disabled=true;
      resultBox.querySelector('.gs-card').innerHTML=
        `<div class="gs-big" aria-hidden="true">${ic}</div><h2 id="gs-rh">${ti}</h2>`+
        (stars!==null?`<div class="gs-stars" role="img" aria-label="${t('shell.stars',{n:stars})}">${'⭐'.repeat(stars)}${'☆'.repeat(Math.max(0,3-stars))}</div>`:'')+
        `<p>${text}</p>${extra}`+
        `<div class="gs-actions"><button type="button" class="btn gs-again">↻ ${t('common.playAgain')}</button><a class="btn alt" href="${backHref}">${t('game.back')}</a></div>`;
      resultBox.hidden=false;resultBox.querySelector('.gs-again').onclick=onRestart;resultBox.querySelector('.gs-again').focus({preventScroll:true});
    },
    destroy(){removeEventListener('keydown',onKey);document.removeEventListener('visibilitychange',onVis)}
  };
}
