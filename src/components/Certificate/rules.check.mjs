// node src/components/Certificate/rules.check.mjs
import assert from 'node:assert/strict';
import {certificateProgress,isCertificateUnlocked} from './rules.js';
const robots=['A','B','C','D'].map(n=>({n}));let k=0;const t=(name,fn)=>{fn();k++;console.log('  ok  ',name)};
t('locked until every robot is woken',()=>{assert.equal(isCertificateUnlocked([],robots),false);assert.equal(isCertificateUnlocked(['A','B','C'],robots),false);assert.equal(isCertificateUnlocked(['A','B','C','D'],robots),true)});
t('counts come from the real robot list (3 of 4, then 24 of 24)',()=>{assert.deepEqual(certificateProgress(['A','B','C'],robots),{woken:3,total:4,left:1,percent:75,unlocked:false});
  const many=Array.from({length:24},(_,i)=>({n:'R'+i}));assert.equal(certificateProgress(many.map(r=>r.n),many).total,24);assert.equal(certificateProgress([],many).left,24)});
t('duplicates and unknown names do not count',()=>{assert.equal(certificateProgress(['A','A','A','ZZZ'],robots).woken,1);assert.equal(isCertificateUnlocked(['A','B','C','ZZZ'],robots),false)});
t('XP and rank are ignored: the function only takes the collected list',()=>{assert.equal(certificateProgress.length,2);assert.equal(isCertificateUnlocked(['A'],robots),false)});
t('no robots = never unlocked',()=>{assert.equal(isCertificateUnlocked([],[]),false)});
t('adding a robot to the data raises the requirement automatically',()=>{const five=[...robots,{n:'E'}];assert.equal(isCertificateUnlocked(['A','B','C','D'],five),false)});
console.log(`\n${k} checks passed`);
