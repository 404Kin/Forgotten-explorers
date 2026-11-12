// node src/games/GameProgress/GameProgress.check.mjs
import assert from 'node:assert/strict';
import {emptyState,isUnlocked,bestOf,recordResult,cleanState,createGameProgress} from './progress.js';
const L=[{id:'a'},{id:'b'},{id:'c'}];let n=0;const t=(name,fn)=>{fn();n++;console.log('  ok  ',name)};
t('only level 1 is open at the start',()=>{const s=emptyState();assert.ok(isUnlocked(s,0));assert.ok(!isUnlocked(s,1));assert.ok(isUnlocked(s,2,{locks:false}))});
t('a win unlocks the next level, a loss does not',()=>{
  let r=recordResult(emptyState(),L,{levelId:'a',difficulty:'easy',value:2,won:false});assert.equal(r.state.unlocked,1);assert.equal(r.unlockedNext,false);
  r=recordResult(emptyState(),L,{levelId:'a',difficulty:'easy',value:2,stars:2});assert.equal(r.state.unlocked,2);assert.equal(r.unlockedNext,true);
});
t('winning an old level never locks anything again; the last level unlocks nothing new',()=>{
  let s={...emptyState(),unlocked:3};
  assert.equal(recordResult(s,L,{levelId:'a',difficulty:'easy',value:1}).state.unlocked,3);
  assert.equal(recordResult(s,L,{levelId:'c',difficulty:'easy',value:1}).unlockedNext,false);
});
t('best result: max for stars/score, min for time/moves, per level AND difficulty',()=>{
  let s=emptyState();
  s=recordResult(s,L,{levelId:'a',difficulty:'easy',value:2}).state;
  let r=recordResult(s,L,{levelId:'a',difficulty:'easy',value:1});assert.equal(r.newBest,false);assert.equal(bestOf(r.state,'a','easy').value,2);
  r=recordResult(s,L,{levelId:'a',difficulty:'easy',value:3});assert.equal(r.newBest,true);assert.equal(bestOf(r.state,'a','easy').value,3);
  let m=recordResult(emptyState(),L,{levelId:'a',difficulty:'hard',value:30,better:'min'}).state;
  m=recordResult(m,L,{levelId:'a',difficulty:'hard',value:24,better:'min'}).state;assert.equal(bestOf(m,'a','hard').value,24);
  assert.equal(bestOf(m,'a','easy'),null,'other difficulty is separate');
});
t('does not mutate the old state',()=>{const s=emptyState();recordResult(s,L,{levelId:'a',difficulty:'easy',value:5});assert.equal(s.unlocked,1);assert.deepEqual(s.best,{})});
t('garbage in storage becomes a clean empty state',()=>{
  assert.deepEqual(cleanState(null),emptyState());assert.equal(cleanState({unlocked:-4}).unlocked,1);assert.deepEqual(cleanState({best:{x:{value:'no'}}}).best,{});
});
t('store: saves, reloads, survives blocked storage',()=>{
  const mem={};const backend={getItem:k=>mem[k]??null,setItem:(k,v)=>{mem[k]=v},removeItem:k=>{delete mem[k]}};
  const p=createGameProgress('k',{backend});p.record(L,{levelId:'a',difficulty:'easy',value:3});assert.equal(createGameProgress('k',{backend}).get().unlocked,2);
  const broken=createGameProgress('k',{backend:{getItem(){throw 1},setItem(){throw 1},removeItem(){throw 1}}});broken.record(L,{levelId:'a',difficulty:'easy',value:1});assert.equal(broken.get().unlocked,2);
  p.reset();assert.equal(p.get().unlocked,1);
});
console.log(`\n${n} checks passed`);
