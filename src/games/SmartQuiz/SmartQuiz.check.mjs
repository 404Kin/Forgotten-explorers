// Quick logic check for the smart quiz (no test framework in this project):   node src/games/SmartQuiz/SmartQuiz.check.mjs
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {STATUS,statusOf,applyAnswer,counts,allMastered,cleanState,createProgressStore,forgetIds} from './progress.js';
import {pickRound,bankReport,shuffle} from './round.js';
import {questionId,hashText} from './ids.js';
import {prepareQuestion} from '../WebWalkerQuiz/core/questions.js';
import {createRng} from '../WebWalkerQuiz/core/random.js';

const raw=JSON.parse(fs.readFileSync(new URL('../WebWalkerQuiz/data/questions.en.json',import.meta.url),'utf8'));
const bank=raw.map(q=>({...q}));let passed=0;
const t=(name,fn)=>{fn();passed++;console.log('  ok  ',name)};
const ids=list=>list.map(q=>q.id);

t('status rules: right = mastered, wrong = missed, missed then right = mastered',()=>{
  let s={};assert.equal(statusOf(s,'a'),STATUS.UNSEEN);
  s=applyAnswer(s,'a',false);assert.equal(statusOf(s,'a'),STATUS.MISSED);
  s=applyAnswer(s,'a',true);assert.equal(statusOf(s,'a'),STATUS.MASTERED);
  const before={x:'missed'};applyAnswer(before,'x',true);assert.equal(before.x,'missed','reducer must not mutate');
});
t('empty progress: 10 unique questions, mixed difficulty',()=>{
  const r=pickRound(bank,{},{difficulty:'mixed',count:10,rng:createRng(1)});
  assert.equal(r.length,10);assert.equal(new Set(ids(r)).size,10);
  assert.equal(new Set(r.map(q=>q.difficulty)).size,3,'easy+medium+hard all present');
});
t('missed questions come first (always in the round)',()=>{
  const missed=ids(bank).slice(0,4),s=Object.fromEntries(missed.map(i=>[i,'missed']));
  for(let seed=1;seed<=20;seed++){const r=ids(pickRound(bank,s,{count:10,rng:createRng(seed)}));missed.forEach(m=>assert.ok(r.includes(m)))}
});
t('missed come before unseen even when a difficulty is chosen',()=>{
  const hardMissed=bank.filter(q=>q.difficulty==='hard').slice(0,3).map(q=>q.id),s=Object.fromEntries(hardMissed.map(i=>[i,'missed']));
  const r=ids(pickRound(bank,s,{difficulty:'hard',count:5,rng:createRng(2)}));hardMissed.forEach(m=>assert.ok(r.includes(m)));
});
t('mastered stay out while enough other questions exist',()=>{
  const mastered=ids(bank).slice(0,20),s=Object.fromEntries(mastered.map(i=>[i,'mastered']));
  for(let seed=1;seed<=20;seed++)assert.ok(!pickRound(bank,s,{count:10,rng:createRng(seed)}).some(q=>mastered.includes(q.id)));
});
t('mastered come back only to fill the round when everything else is used',()=>{
  const s=Object.fromEntries(ids(bank).slice(0,30).map(i=>[i,'mastered']));
  const r=pickRound(bank,s,{count:10,rng:createRng(3)});const rest=ids(bank).slice(30);
  assert.equal(r.length,10);rest.forEach(i=>assert.ok(ids(r).includes(i)));assert.equal(new Set(ids(r)).size,10);
});
t('difficulty choice: Hard round is all hard while 10+ hard are available',()=>{
  const r=pickRound(bank,{},{difficulty:'hard',count:10,rng:createRng(4)});assert.ok(r.every(q=>q.difficulty==='hard'),'only hard');
  const e=pickRound(bank,{},{difficulty:'easy',count:10,rng:createRng(4)});assert.ok(e.every(q=>q.difficulty==='easy'));
});
t('small bank: returns what exists, never invents or repeats',()=>{
  const tiny=bank.slice(0,6);const r=pickRound(tiny,{},{count:10,rng:createRng(5)});assert.equal(r.length,6);assert.equal(new Set(ids(r)).size,6);
});
t('options shuffle on screen, correct answer stays right (first option is correct only in the data)',()=>{
  const rng=createRng(7);let moved=0;
  for(const q of bank){const p=prepareQuestion(q,rng);assert.equal(p.options[p.correctIndex],q.options[q.correct]);if(p.correctIndex!==q.correct)moved++}
  assert.ok(moved>5,'shuffle really moves the right answer ('+moved+' of '+bank.length+')');
});
t('learning loop: a player who is right 70% of the time masters everything, no repeats inside a round',()=>{
  const rng=createRng(11);let s={},rounds=0;
  while(!allMastered(bank,s)&&rounds<200){
    const r=pickRound(bank,s,{count:10,rng});assert.equal(new Set(ids(r)).size,r.length);
    for(const q of r)s=applyAnswer(s,q.id,rng()<.7);rounds++;
  }
  assert.ok(allMastered(bank,s));console.log('        -> all',bank.length,'mastered after',rounds,'rounds');
});
t('missed questions return next round until answered right',()=>{
  let s={};const first=pickRound(bank,s,{count:10,rng:createRng(8)});
  first.forEach((q,i)=>{s=applyAnswer(s,q.id,i>=3)});          // first three wrong
  const wrong=ids(first).slice(0,3);const second=ids(pickRound(bank,s,{count:10,rng:createRng(9)}));
  wrong.forEach(w=>assert.ok(second.includes(w)));
  wrong.forEach(w=>{s=applyAnswer(s,w,true)});
  assert.ok(!pickRound(bank,s,{count:10,rng:createRng(10)}).some(q=>wrong.includes(q.id)),'once answered right they stay away');
});
t('counts and "x of N mastered"',()=>{
  const s={[bank[0].id]:'mastered',[bank[1].id]:'mastered',[bank[2].id]:'missed'};
  assert.deepEqual(counts(bank,s),{total:35,mastered:2,missed:1,unseen:32});
});
t('all mastered detection and reset',()=>{
  const mem={};const backend={getItem:k=>mem[k]??null,setItem:(k,v)=>{mem[k]=v},removeItem:k=>{delete mem[k]}};
  const store=createProgressStore({key:'k',backend});
  bank.forEach(q=>store.record(q.id,true));assert.ok(allMastered(bank,store.get()));
  store.reset();assert.equal(allMastered(bank,store.get()),false);assert.equal(counts(bank,store.get()).mastered,0);
});
t('storage that throws or holds garbage never crashes (memory fallback)',()=>{
  const broken={getItem(){throw new Error('blocked')},setItem(){throw new Error('quota')},removeItem(){throw new Error('x')}};
  const s=createProgressStore({key:'k',backend:broken});s.record('a',false);assert.equal(s.get().a,'missed','kept in memory');s.reset();assert.deepEqual(s.get(),{});
  const junk=createProgressStore({key:'k',backend:{getItem:()=>'{not json',setItem(){},removeItem(){}}});assert.deepEqual(junk.get(),{});
  assert.deepEqual(cleanState({a:'mastered',b:'weird',c:5,d:'missed'}),{a:'mastered',d:'missed'});assert.deepEqual(cleanState([1,2]),{});
});
t('ids: stable when the bank is re-ordered, derived from text when missing',()=>{
  const items=[{q:'One?'},{q:'Two?'}],rev=[...items].reverse();
  assert.equal(questionId(items[0]),questionId(rev[1]));assert.equal(questionId({id:'keep-me',q:'x'}),'keep-me');assert.notEqual(hashText('a'),hashText('b'));
});
t('forgetIds puts only the chosen questions back to unseen',()=>{
  const s={a:'mastered',b:'missed',c:'mastered'};assert.deepEqual(forgetIds(s,['a','b']),{c:'mastered'});assert.equal(s.a,'mastered','no mutation');
});
console.log('\nbank report (10 questions per round):');console.table(bankReport(bank));
console.log(`\n${passed} checks passed`);
