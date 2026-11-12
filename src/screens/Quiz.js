// Mission Quiz = the "Web Walker in Space" game (src/games/WebWalkerQuiz). Zip swings to the answer; a wrong one snaps the tether.
// It sits inside the shared GameShell, so it has the same Pause / Restart / Back to games buttons as every other game.
// The game is heavy (animations, confetti, sounds), so it is loaded only when this screen opens.
import {update,addXP} from '../state/store.js';
import {t} from '../i18n/index.js';
import {loadInto} from '../components/StateView/StateView.js';
import {createGameShell} from '../components/GameShell/GameShell.js';
let game,shell,offKeys;
export default{name:'quiz',
mount(el){
  shell=createGameShell(el,{title:t('game.quiz'),icon:'🧠',accent:'#8fd8b3',onRestart:()=>game?.restart()});
  // While paused the number keys must not answer questions behind the pause menu.
  const guard=e=>{if(shell?.paused&&/^[1-4]$/.test(e.key)){e.stopImmediatePropagation();e.preventDefault()}};
  addEventListener('keydown',guard,true);offKeys=()=>removeEventListener('keydown',guard,true);
  shell.body.className='gs-body ww-host';
  loadInto(shell.body,()=>import('../games/WebWalkerQuiz/mount.js'),{
    render:({mountGame},box)=>{
      game=mountGame(box,{embedded:true,
        // XP rule: half the game score, plus a bonus for finishing. Same stats the old quiz kept, so badges still work.
        onGameEnd:({score,won,correct,total})=>{const xp=Math.round(score/2)+(won?20:0);
          update(S=>{S.stats.correct+=correct;S.stats.answered+=total;S.stats.bestQuiz=Math.max(S.stats.bestQuiz,xp)});
          if(xp)addXP(xp,t('xp.quiz'))}});
    }});
},
unmount(){game?.destroy();game=null;shell?.destroy();shell=null;offKeys?.();offKeys=null}};
