import test from 'node:test';
import assert from 'node:assert/strict';
import {start} from './helpers.js';

const response=payload=>({ok:true,json:async()=>payload});
const vectorPayload={
  result:'Target body name: Mars (499) {source: mar099}\n$$SOE\n2461355.5 = A.D. 2026-Nov-11 00:00:00.0000 UT\n X = 3.0 Y = 4.0 Z = 0.0\n$$EOE'
};

test('live distance queries JPL Horizons and caches the result',async()=>{
  let calls=0,requestUrl;
  const s=await start({HORIZONS_TARGETS:'{"test-mars":"499"}'},undefined,{fetchImpl:async url=>{
    calls++;
    requestUrl=new URL(url);
    return response(vectorPayload);
  }});
  const first=await fetch(s.base+'/api/v1/live/distance?ids=test-mars');
  const body=await first.json();
  assert.equal(first.status,200);
  assert.equal(body.data[0].distanceKm,5);
  assert.equal(body.data[0].targetName,'Mars');
  assert.equal(body.data[0].source,'live');
  assert.equal(requestUrl.searchParams.get('COMMAND'),"'499'");
  assert.equal(requestUrl.searchParams.get('CENTER'),"'500@399'");
  assert.equal(requestUrl.searchParams.get('TIME_TYPE'),'UT');
  await fetch(s.base+'/api/v1/live/distance?ids=test-mars');
  assert.equal(calls,1);
  assert.equal(Number(first.headers.get('cache-control').match(/max-age=(\d+)/)[1]),21600);
  await s.stop();
});

test('live distance falls back to the dated JPL snapshot',async()=>{
  const s=await start({HORIZONS_TARGETS:'{"test-moon":"301"}'},undefined,{fetchImpl:async()=>{throw new Error('offline')}});
  const r=await fetch(s.base+'/api/v1/live/distance?ids=test-moon');
  const body=await r.json();
  assert.equal(r.status,200);
  assert.equal(body.data[0].source,'snapshot');
  assert.equal(body.data[0].targetName,'Moon');
  assert.match(body.data[0].asOf,/TDB$/);
  assert.ok(body.data[0].distanceKm>400000);
  await s.stop();
});

test('live distance validates ids and known robots',async()=>{
  const s=await start({},undefined,{fetchImpl:async()=>response(vectorPayload)});
  assert.equal((await fetch(s.base+'/api/v1/live/distance')).status,400);
  assert.equal((await fetch(s.base+'/api/v1/live/distance?ids=missing')).status,404);
  await s.stop();
});

test('DSN Now maps active spacecraft signals and caches the result',async()=>{
  let calls=0;
  const feed={time:Math.floor(Date.now()/1000),dishes:{
    53:{sigs:[{active:true,tgt:'JNO',dir:'down'}]},
    54:{sigs:[{active:false,tgt:'JNO',dir:'down'}]}
  }};
  const s=await start({DSN_ROBOT_MAP:'{"JNO":"test-deep"}'},undefined,{fetchImpl:async()=>{calls++;return response(feed)}});
  const first=await fetch(s.base+'/api/v1/live/dsn');
  const body=await first.json();
  assert.equal(first.status,200);
  assert.deepEqual(body.data,[{robotId:'test-deep',dish:'DSS-53',dsnCode:'JNO'}]);
  assert.equal(body.meta.source,'NASA Deep Space Network Now');
  await fetch(s.base+'/api/v1/live/dsn');
  assert.equal(calls,1);
  await s.stop();
});

test('DSN Now reports upstream failure without a cache',async()=>{
  const s=await start({},undefined,{fetchImpl:async()=>{throw new Error('offline')}});
  const r=await fetch(s.base+'/api/v1/live/dsn');
  assert.equal(r.status,503);
  assert.equal((await r.json()).error.code,'UPSTREAM_UNAVAILABLE');
  await s.stop();
});

test('DSN Now excludes mappings to unknown robot slugs',async()=>{
  const feed={time:Math.floor(Date.now()/1000),dishes:{53:{sigs:[{active:true,tgt:'JNO',dir:'down'}]}}};
  const s=await start({DSN_ROBOT_MAP:'{"JNO":"unverified-slug"}'},undefined,{fetchImpl:async()=>response(feed)});
  const body=await(await fetch(s.base+'/api/v1/live/dsn')).json();
  assert.deepEqual(body.data,[]);
  assert.equal(body.meta.unmappedTargets,1);
  await s.stop();
});
