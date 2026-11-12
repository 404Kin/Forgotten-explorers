// Choosing a round of questions. Pure: pass the bank, the saved progress and (for tests) your own random function.
import {statusOf,STATUS} from './progress.js';

export const DIFFICULTIES=['easy','medium','hard'];
export const CHOICES=[...DIFFICULTIES,'mixed'];
export const ROUND_SIZE=10;
// When a difficulty runs out of questions, borrow from the closest one first.
const NEAREST={easy:['medium','hard'],medium:['easy','hard'],hard:['medium','easy']};

export function shuffle(items,rng=Math.random){
  const a=[...items];
  for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]]}
  return a;
}

/** Spread questions of different difficulties evenly (easy, medium, hard, easy, ...), so a mixed round is really mixed. */
function interleave(list,rng){
  const groups=DIFFICULTIES.map(d=>shuffle(list.filter(q=>q.difficulty===d),rng)),rest=shuffle(list.filter(q=>!DIFFICULTIES.includes(q.difficulty)),rng);
  const out=[];
  for(let i=0;groups.some(g=>i<g.length);i++)for(const g of groups)if(i<g.length)out.push(g[i]);
  return [...out,...rest];
}

/**
 * Pick up to `count` questions.
 * Order of preference: missed, then unseen (both from the chosen difficulty first, then the nearest ones),
 * and MASTERED questions only when nothing else is left. The chosen set is shuffled so the player cannot guess which were missed.
 */
export function pickRound(bank,state,{difficulty='mixed',count=ROUND_SIZE,rng=Math.random}={}){
  const mixed=difficulty==='mixed'||!DIFFICULTIES.includes(difficulty);
  const by=s=>bank.filter(q=>statusOf(state,q.id)===s);
  const dist=q=>mixed?0:q.difficulty===difficulty?0:(NEAREST[difficulty]||[]).indexOf(q.difficulty)+1||9;
  // Questions of the wanted difficulty go before borrowed ones; inside a group the order is random.
  const tier=list=>mixed?interleave(list,rng):[...new Set(list.map(dist))].sort((a,b)=>a-b).flatMap(d=>shuffle(list.filter(q=>dist(q)===d),rng));
  const ordered=[...tier(by(STATUS.MISSED)),...tier(by(STATUS.UNSEEN)),...tier(by(STATUS.MASTERED))];
  return shuffle(ordered.slice(0,count),rng);
}

/**
 * How many more questions the bank needs. `oneRound` = enough for a full round of this difficulty;
 * `twoRounds` = enough that two different rounds can be played before mastered questions must come back.
 */
export function bankReport(bank,{count=ROUND_SIZE}={}){
  const row=have=>({have,needForOneRound:Math.max(0,count-have),needForTwoRounds:Math.max(0,count*2-have)});
  return{mixed:row(bank.length),...Object.fromEntries(DIFFICULTIES.map(d=>[d,row(bank.filter(q=>q.difficulty===d).length)]))};
}
