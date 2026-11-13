// node src/robots/stats.check.mjs  (reads the real robot records, so the numbers it prints are the ones the app shows)
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {abandonedCounts,walkOrder,nextRobot,isAbandoned} from './stats.js';
const recs=JSON.parse(fs.readFileSync(new URL('../data/robotRecords.json',import.meta.url),'utf8'));
const W={moon:'moon',mars:'mars',deep_space:'deep'},S={left_behind:'left_behind',silent:'silent',still_talking:'talking'};
const robots=recs.map((r,i)=>({id:r.id,index:i,w:W[r.world],status:S[r.status]}));let k=0;const t=(n,f)=>{f();k++;console.log('  ok  ',n)};
const c=abandonedCounts(robots);console.log('        counts from the data:',c);
t('counts add up',()=>{assert.equal(c.total,24);assert.equal(c.leftBehind+c.silent+c.talking,c.total);assert.equal(c.abandoned,c.leftBehind+c.silent);assert.ok(c.moon+c.mars<=c.abandoned)});
t('Moon / Mars counts only count abandoned robots (not still talking ones)',()=>{assert.equal(c.moon,robots.filter(r=>r.w==='moon'&&isAbandoned(r)).length);assert.equal(c.mars,robots.filter(r=>r.w==='mars'&&isAbandoned(r)).length)});
t('walk order: abandoned first, left behind before silent, active last',()=>{const o=walkOrder(robots);const firstTalking=o.findIndex(r=>r.status==='talking');assert.ok(o.slice(0,firstTalking).every(isAbandoned));assert.ok(o.slice(firstTalking).every(r=>r.status==='talking'));
  const firstSilent=o.findIndex(r=>r.status==='silent');assert.ok(o.slice(0,firstSilent).every(r=>r.status==='left_behind'))});
t('next explorer visits everyone once and wraps around',()=>{let id=walkOrder(robots)[0].id;const seen=new Set();for(let i=0;i<robots.length;i++){seen.add(id);id=nextRobot(robots,id).id}assert.equal(seen.size,robots.length);assert.equal(id,walkOrder(robots)[0].id);assert.equal(nextRobot(robots,'nope'),null)});
console.log(`\n${k} checks passed`);
