// Translated views of the content in src/data/*. English text there stays the source of truth/fallback;
// a key in the language file (robot.EAGLE.tagline, quiz.3.q, badge.moon.name ...) overrides it.
// Key names are documented in docs/I18N.md.
import {tx,t} from './index.js';

const QUIZ_PARTS=['q','right','wrong1','wrong2','wrong3'];

/** A robot with tagline, story pages and its one-question quiz translated. Everything else is untouched. */
export const localRobot=m=>({...m,
  t:tx(`robot.${m.n}.tagline`,m.t),
  p:m.p.map(([h,x],i)=>[tx(`robot.${m.n}.story.${i}.title`,h),tx(`robot.${m.n}.story.${i}.text`,x)]),
  q:m.q.map((s,i)=>tx(`robot.${m.n}.quiz.${QUIZ_PARTS[i]||i}`,s))});

/** Whole quiz bank, translated. Index in src/data/quiz.js is the key, so do not re-order that array without moving keys. */
export const localQuiz=bank=>bank.map((q,i)=>({...q,q:tx(`quiz.${i}.q`,q.q),o:q.o.map((s,j)=>tx(`quiz.${i}.o${j}`,s)),e:q.e?tx(`quiz.${i}.e`,q.e):''}));

export const localBadge=b=>({...b,name:tx(`badge.${b.id}.name`,b.name),desc:tx(`badge.${b.id}.desc`,b.desc)});
export const localBody=b=>({...b,name:tx(`body.${b.id}.name`,b.name),fact:tx(`body.${b.id}.fact`,b.fact),km:b.km?tx(`body.${b.id}.km`,b.km):b.km});
export const worldName=k=>t(`world.${k}.name`);
export const introLines=lines=>lines.map((s,i)=>tx(`intro.${i}`,s));
