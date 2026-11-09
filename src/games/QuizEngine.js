// Reusable quiz runner: lives, countdown, streak bonus, explanations, stars.
// questions = [{q,o:[right,...wrong],e}]  ->  onEnd({correct,total,xp,stars,passed})
import {shuffle,esc} from '../utils/dom.js';
import {sfx} from '../services/audio.js';
import {t} from '../i18n/index.js';
export function runQuiz(el,questions,{lives=3,time=20,onEnd}){let i=0,L=lives,correct=0,xp=0,streak=0,timer,left;
const end=()=>{clearInterval(timer);const stars=correct===questions.length?3:correct/questions.length>=.7?2:correct/questions.length>=.4?1:0;onEnd({correct,total:questions.length,xp,stars,passed:correct/questions.length>=.5})};
function ask(){const Q=questions[i];if(!Q||L<=0)return end();left=time;
el.innerHTML=`<div class="panel"><div class="qhead"><span>${t('quiz.question',{n:i+1,total:questions.length})}</span><span aria-label="${L} ❤️">${'❤️'.repeat(L)}${streak>1?` 🔥×${streak}`:''}</span></div><div class="timer"><i id="tb"></i></div><p class="q">${esc(Q.q)}</p><div id="opts"></div><div id="fb"></div></div>`;
shuffle(Q.o).forEach(t=>{const b=document.createElement('button');b.className='opt';b.textContent=t;b.onclick=()=>pick(b,t===Q.o[0]);el.querySelector('#opts').appendChild(b)});
clearInterval(timer);timer=setInterval(()=>{left-=.1;const bar=el.querySelector('#tb');if(bar)bar.style.width=Math.max(0,left/time*100)+'%';if(left<=0)pick(null,false)},100)}
function pick(btn,ok){clearInterval(timer);const Q=questions[i];el.querySelectorAll('.opt').forEach(b=>{b.disabled=true;if(b.textContent===Q.o[0])b.classList.add('ok')});
if(ok){streak++;correct++;const g=10+Math.round(left/2)+Math.min(streak-1,3)*3;xp+=g;sfx.good()}else{streak=0;L--;btn?.classList.add('no');sfx.bad()}
el.querySelector('#fb').innerHTML=`<p class="expl">${ok?'🎉 '+t('quiz.correct'):left<=0?'⏰ '+t('quiz.timeUp'):t('quiz.notQuite')} ${esc(Q.e||'')}</p><button class="btn" id="nx">${i+1>=questions.length||L<=0?t('quiz.results'):t('quiz.next')}</button>`;el.querySelector('#nx').onclick=()=>{i++;ask()}}
ask();return()=>clearInterval(timer)}
