import {QUIZ} from '../data/quiz.js';
import {MISSIONS} from '../data/missions.js';
import {runQuiz} from '../games/QuizEngine.js';
import {shuffle} from '../utils/dom.js';
import {get,update,addXP} from '../state/store.js';
import {t} from '../i18n/index.js';
import {localQuiz} from '../i18n/content.js';
let stop;
export default{name:'quiz',
mount(el){let topic='any';const menu=()=>{const s=get();el.innerHTML=`<div class="wrap"><div class="hero"><span class="mono">${t('quiz.kicker')}</span><h1>${t('quiz.title')}</h1><p>${t('quiz.intro',{best:s.stats.bestQuiz})}</p></div><div class="chips" style="justify-content:center;margin:16px 0">${[['any','🌌'],['moon','🌙'],['mars','🔴'],['deep','🚀']].map(([k,e])=>`<button class="chip ${k===topic?'on':''}" data-k="${k}" aria-pressed="${k===topic}">${e} ${t('quiz.topic.'+k)}</button>`).join('')}</div><div style="text-align:center"><button class="btn" id="go">${t('quiz.start')}</button></div></div>`;
el.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{topic=b.dataset.k;menu()});el.querySelector('#go').onclick=start};
function start(){const pool=shuffle(localQuiz(QUIZ).filter(q=>topic==='any'||q.t===topic||q.t==='any')).slice(0,8);el.innerHTML='<div class="wrap" id="qa"></div>';
stop=runQuiz(el.querySelector('#qa'),pool,{lives:3,time:20,onEnd:r=>{update(S=>{S.stats.correct+=r.correct;S.stats.answered+=r.total;S.stats.bestQuiz=Math.max(S.stats.bestQuiz,r.xp)});if(r.xp)addXP(r.xp,t('xp.quiz'));
el.querySelector('#qa').innerHTML=`<div class="panel" style="text-align:center"><div class="stars">${'⭐'.repeat(r.stars)||'🙂'}</div><h2>${r.stars===3?t('quiz.perfect'):r.stars?t('quiz.nice'):t('quiz.keep')}</h2><p>${t('quiz.score',{correct:r.correct,total:r.total,xp:r.xp})}</p><button class="btn" id="ag">${t('common.playAgain')}</button> <a class="btn alt" href="#/hub">${t('common.explore')}</a></div>`;el.querySelector('#ag').onclick=menu}})}
menu()},unmount(){stop?.()}};
