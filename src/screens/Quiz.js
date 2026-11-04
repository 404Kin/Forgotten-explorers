import {QUIZ} from '../data/quiz.js';
import {MISSIONS} from '../data/missions.js';
import {runQuiz} from '../games/QuizEngine.js';
import {shuffle} from '../utils/dom.js';
import {get,update,addXP} from '../state/store.js';
let stop;
export default{name:'quiz',
mount(el){let topic='any';const menu=()=>{const s=get();el.innerHTML=`<div class="wrap"><div class="hero"><span class="mono">Mission quiz</span><h1>Test your space brain!</h1><p>8 questions · 3 lives · quick answers earn bonus XP · best score ${s.stats.bestQuiz}</p></div><div class="chips" style="justify-content:center;margin:16px 0">${[['any','🌌 Mixed'],['moon','🌙 Moon'],['mars','🔴 Mars'],['deep','🚀 Deep space']].map(([k,l])=>`<button class="chip ${k===topic?'on':''}" data-k="${k}">${l}</button>`).join('')}</div><div style="text-align:center"><button class="btn" id="go">Start quiz</button></div></div>`;
el.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{topic=b.dataset.k;menu()});el.querySelector('#go').onclick=start};
function start(){const pool=shuffle(QUIZ.filter(q=>topic==='any'||q.t===topic||q.t==='any')).slice(0,8);el.innerHTML='<div class="wrap" id="qa"></div>';
stop=runQuiz(el.querySelector('#qa'),pool,{lives:3,time:20,onEnd:r=>{update(S=>{S.stats.correct+=r.correct;S.stats.answered+=r.total;S.stats.bestQuiz=Math.max(S.stats.bestQuiz,r.xp)});if(r.xp)addXP(r.xp,'quiz');
el.querySelector('#qa').innerHTML=`<div class="panel" style="text-align:center"><div class="stars">${'⭐'.repeat(r.stars)||'🙂'}</div><h2>${r.stars===3?'Perfect!':r.stars?'Nice flying!':'Keep exploring!'}</h2><p>${r.correct}/${r.total} correct · +${r.xp} XP</p><button class="btn" id="ag">Play again</button> <a class="btn alt" href="#/hub">Explore</a></div>`;el.querySelector('#ag').onclick=menu}})}
menu()},unmount(){stop?.()}};
