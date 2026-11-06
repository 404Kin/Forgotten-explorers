import test from 'node:test';
import assert from 'node:assert/strict';
import {start,fx} from './helpers.js';
import {validateRobot} from '../src/domain/robot.js';
import {createRepository} from '../src/domain/repository.js';
import {loadRobots} from '../src/data/loadRobots.js';
import {createLogger} from '../src/lib/logger.js';
import {loadData} from '../src/data/index.js';
import {readFileSync} from 'node:fs';
const quiet=createLogger({level:'error',sink:{log(){},error(){}}});
const good=()=>JSON.parse(readFileSync(fx('robots/test-moon.json'),'utf8'));
const get=async(s,p)=>{const r=await fetch(s.base+p);return{r,b:await r.json()}};

test('validator accepts a good record',()=>assert.deepEqual(validateRobot(good(),{sourceHosts:['nasa.gov']}),[]));
test('validator rejects each kind of problem',()=>{
  const bad=(patch,part)=>{const e=validateRobot({...good(),...patch},{sourceHosts:['nasa.gov']});assert.ok(e.some(x=>x.includes(part)),part+' -> '+e.join('|'))};
  bad({sources:[]},'source');bad({sources:['https://example.com/x']},'sources must');bad({sources:['http://nasa.gov/x']},'sources must');bad({sources:['https://evilnasa.gov.example.com/x']},'sources must');
  bad({status:'alive'},'status');bad({world:'pluto'},'world');bad({lat:null},'lat');bad({lon:500},'lon');bad({launchDate:'soon'},'launchDate');bad({story:[]},'story');bad({quiz:[{q:'x',options:['only']}]},'quiz');bad({id:'Bad Id'},'id');
});
test('validator allows no coordinates for deep space',()=>assert.deepEqual(validateRobot({...good(),world:'deep',lat:null,lon:null},{sourceHosts:['nasa.gov']}),[]));
test('loader keeps good records and reports bad ones',()=>{
  const ok=loadRobots(fx('robots/'),{sourceHosts:['nasa.gov']},quiet);assert.equal(ok.valid.length,3);assert.equal(ok.rejected.length,0);
  const bad=loadRobots(fx('bad/'),{sourceHosts:['nasa.gov']},quiet);assert.equal(bad.valid.length,0);assert.equal(bad.rejected.length,2);
  const none=loadRobots(fx('missing-folder/'),{sourceHosts:['nasa.gov']},quiet);assert.equal(none.valid.length,0);
});
test('repository filters, sorts and paginates',()=>{
  const items=Array.from({length:25},(_,i)=>({id:'r'+i,name:'N'+String(i).padStart(2,'0'),world:i%2?'mars':'moon'}));
  const repo=createRepository(items);
  assert.equal(repo.count(),25);assert.equal(repo.get('r3').id,'r3');assert.equal(repo.get('nope'),null);
  const p=repo.list({page:2,pageSize:10});assert.equal(p.items.length,10);assert.deepEqual(p.meta,{page:2,pageSize:10,total:25,totalPages:3});
  assert.equal(repo.list({filters:{world:'mars'},pageSize:50}).meta.total,12);
  assert.equal(repo.list({filters:{world:undefined},pageSize:50}).meta.total,25);
  assert.equal(repo.list({page:9,pageSize:10}).items.length,0);
});
test('GET /robots lists with pagination meta',async()=>{const s=await start();const{r,b}=await get(s,'/api/v1/robots');assert.equal(r.status,200);assert.equal(b.data.length,3);assert.equal(b.meta.total,3);assert.equal(b.meta.lang,'en');assert.ok(!('story' in b.data[0]));assert.ok(r.headers.get('cache-control').includes('max-age'));await s.stop()});
test('GET /robots filters by world and status',async()=>{const s=await start();assert.deepEqual((await get(s,'/api/v1/robots?world=mars')).b.data.map(x=>x.id),['test-mars']);assert.equal((await get(s,'/api/v1/robots?status=talking')).b.data[0].id,'test-deep');assert.equal((await get(s,'/api/v1/robots?world=moon&status=talking')).b.meta.total,0);await s.stop()});
test('GET /robots paginates',async()=>{const s=await start();const a=await get(s,'/api/v1/robots?pageSize=2&page=2');assert.equal(a.b.data.length,1);assert.equal(a.b.meta.totalPages,2);await s.stop()});
test('GET /robots rejects bad parameters',async()=>{const s=await start();for(const q of['world=pluto','status=x','page=0','pageSize=51','lang=fr','foo=1']){const{r,b}=await get(s,'/api/v1/robots?'+q);assert.equal(r.status,400,q);assert.equal(b.error.code,'INVALID_PARAM')}await s.stop()});
test('GET /robots/:id returns the full record',async()=>{const s=await start();const{r,b}=await get(s,'/api/v1/robots/test-mars');assert.equal(r.status,200);assert.equal(b.data.story.length,2);assert.equal(b.data.sources[0].startsWith('https://'),true);assert.equal(b.data.lang,'en');await s.stop()});
test('GET /robots/:id unknown or malformed gives 404',async()=>{const s=await start();assert.equal((await get(s,'/api/v1/robots/nope')).r.status,404);const m=await get(s,'/api/v1/robots/%E0%A4%A');assert.equal(m.r.status,404);assert.equal(m.b.error.code,'NOT_FOUND');await s.stop()});
test('GET /images returns real NASA-shaped results and caches them',async()=>{
  const calls=[];
  const fetchImpl=async(url,options)=>{
    calls.push({url:new URL(url),options});
    return new Response(JSON.stringify({collection:{items:[{data:[{media_type:'image',nasa_id:'PIA07463',title:'Opportunity view',description_508:'A Mars image',date_created:'2005-03-17T00:00:00Z',secondary_creator:'NASA/JPL-Caltech'}],links:[{rel:'preview',href:'https://images-assets.nasa.gov/image/PIA07463/PIA07463~thumb.jpg'},{rel:'alternate',width:1280,href:'https://images-assets.nasa.gov/image/PIA07463/PIA07463~medium.jpg'}]}]}}),{status:200,headers:{'Content-Type':'application/json'}});
  };
  const s=await start({},undefined,{fetchImpl});
  const {r,b}=await get(s,'/api/v1/images?robotId=test-mars');
  assert.equal(r.status,200);
  assert.equal(calls.length,1);
  assert.equal(calls[0].url.origin,'https://images-api.nasa.gov');
  assert.equal(calls[0].url.searchParams.get('q'),'TEST Mars Robot');
  assert.equal(calls[0].url.searchParams.get('media_type'),'image');
  assert.equal(calls[0].options.signal instanceof AbortSignal,true);
  assert.equal(b.data[0].id,'PIA07463');
  assert.equal(b.data[0].credit,'NASA/JPL-Caltech');
  assert.equal(b.data[0].pinned,false);
  assert.equal(b.meta.source,'NASA Image and Video Library');
  assert.equal(b.meta.stale,false);
  assert.ok(r.headers.get('cache-control').includes('max-age=21600'));
  await get(s,'/api/v1/images?robotId=test-mars');
  assert.equal(calls.length,1);
  await s.stop();
});
test('GET /images validates robotId and rejects unknown robots without fetching',async()=>{
  let calls=0;
  const s=await start({},undefined,{fetchImpl:async()=>{calls++;return new Response('{}')}});
  for(const path of ['/api/v1/images','/api/v1/images?robotId=bad!','/api/v1/images?robotId=missing']){
    const {r,b}=await get(s,path);
    assert.equal(r.status,path.endsWith('missing')?404:400);
    assert.equal(b.error.code,path.endsWith('missing')?'NOT_FOUND':'INVALID_PARAM');
  }
  assert.equal(calls,0);
  await s.stop();
});
test('GET /images returns the standard upstream error when NASA is unavailable',async()=>{
  const s=await start({},undefined,{fetchImpl:async()=>{throw new Error('network details')}});
  const {r,b}=await get(s,'/api/v1/images?robotId=test-mars');
  assert.equal(r.status,503);
  assert.equal(b.error.code,'UPSTREAM_UNAVAILABLE');
  assert.equal(b.error.details.source,'NASA Image and Video Library');
  assert.ok(!JSON.stringify(b).includes('network details'));
  await s.stop();
});
test('GET /images serves a marked stale cache if NASA becomes unavailable',async()=>{
  const originalNow=Date.now;
  let now=originalNow(),calls=0;
  Date.now=()=>now;
  const fetchImpl=async()=>{
    calls++;
    if(calls>1)throw new Error('offline');
    return new Response(JSON.stringify({collection:{items:[]}}),{status:200,headers:{'Content-Type':'application/json'}});
  };
  const s=await start({},undefined,{fetchImpl});
  try{
    assert.equal((await get(s,'/api/v1/images?robotId=test-mars')).b.meta.stale,false);
    now+=6*60*60*1000+1;
    const {r,b}=await get(s,'/api/v1/images?robotId=test-mars');
    assert.equal(r.status,200);
    assert.equal(b.meta.stale,true);
    assert.equal(calls,2);
    assert.ok(r.headers.get('cache-control').includes('max-age=60'));
  }finally{
    Date.now=originalNow;
    await s.stop();
  }
});
test('lang=bn translates when available and falls back when not',async()=>{const s=await start();const a=await get(s,'/api/v1/robots/test-mars?lang=bn');assert.equal(a.b.data.lang,'bn');assert.ok(a.b.data.name.startsWith('[bn TEST]'));assert.equal(a.r.headers.get('content-language'),'bn');assert.equal(a.b.data.quiz.length,1);
  const b=await get(s,'/api/v1/robots/test-moon?lang=bn');assert.equal(b.b.data.lang,'en');assert.equal(b.b.data.name,'TEST Moon Robot');
  const l=await get(s,'/api/v1/robots?lang=bn');assert.equal(l.b.data.find(x=>x.id==='test-mars').lang,'bn');assert.equal(l.b.data.find(x=>x.id==='test-moon').lang,'en');await s.stop()});
test('health reports data counts and survives an empty data folder',async()=>{const s=await start();assert.deepEqual((await get(s,'/api/v1/health')).b.data,{robots:3,rejected:0});await s.stop();
  const e=await start({ROBOTS_DIR:fx('missing/')});const h=await get(e,'/api/v1/health');assert.equal(h.r.status,200);assert.equal(h.b.data.robots,0);assert.equal((await get(e,'/api/v1/robots')).b.meta.total,0);await e.stop()});
test('production refuses to start without valid real robot data',()=>{
  assert.throws(()=>loadData({env:'production',robotsDir:fx('missing/'),i18nDir:fx('i18n/'),sourceHosts:['nasa.gov']},quiet),/refusing to start production API/);
});
