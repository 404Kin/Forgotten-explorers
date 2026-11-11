// Mission Quiz = the "Web Walker in Space" game (src/games/WebWalkerQuiz). Zip swings to the answer; a wrong one snaps the tether.
// The game is heavy (animations, confetti, sounds), so it is loaded only when this screen opens.
import {update,addXP} from '../state/store.js';
import {t} from '../i18n/index.js';
import {loadInto} from '../components/StateView/StateView.js';
let game;
export default{name:'quiz',
mount(el){
  el.innerHTML=`<div class="wrap"><a class="btn sm alt" href="#/hub"><span aria-hidden="true">←</span> ${t('common.explore')}</a><div id="wwbox" style="margin-top:12px"></div></div>`;
  loadInto(el.querySelector('#wwbox'),()=>import('../games/WebWalkerQuiz/mount.js'),{
    render:({mountGame},box)=>{
      game=mountGame(box,{embedded:true,
        // XP rule: half the game score, plus a bonus for finishing. Same stats the old quiz kept, so badges still work.
        onGameEnd:({score,won,correct,total})=>{const xp=Math.round(score/2)+(won?20:0);
          update(S=>{S.stats.correct+=correct;S.stats.answered+=total;S.stats.bestQuiz=Math.max(S.stats.bestQuiz,xp)});
          if(xp)addXP(xp,t('xp.quiz'))}});
    }});
},
unmount(){game?.destroy();game=null}};
