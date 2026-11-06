import test from 'node:test';
import assert from 'node:assert/strict';
import {start} from './helpers.js';
const json=r=>r.json();
const isError=(b,code)=>{assert.equal(b.error.code,code);assert.equal(typeof b.error.message,'string');assert.equal(typeof b.error.details,'object')};

test('health returns ok',async()=>{const s=await start();const r=await fetch(s.base+'/api/v1/health');assert.equal(r.status,200);assert.match(r.headers.get('content-type'),/json/);assert.equal((await json(r)).status,'ok');assert.ok(r.headers.get('x-request-id'));await s.stop()});
test('unknown route uses the standard error shape',async()=>{const s=await start();const r=await fetch(s.base+'/api/v1/nope');assert.equal(r.status,404);isError(await json(r),'NOT_FOUND');await s.stop()});
test('wrong method gives 405 with Allow header',async()=>{const s=await start();const r=await fetch(s.base+'/api/v1/health',{method:'POST'});assert.equal(r.status,405);assert.ok(r.headers.get('allow'));isError(await json(r),'METHOD_NOT_ALLOWED');await s.stop()});
test('rate limit returns 429 with Retry-After',async()=>{const s=await start({RATE_LIMIT_MAX:'3'});for(let i=0;i<3;i++)assert.equal((await fetch(s.base+'/api/v1/health')).status,200);const r=await fetch(s.base+'/api/v1/health');assert.equal(r.status,429);assert.ok(Number(r.headers.get('retry-after'))>=1);isError(await json(r),'RATE_LIMITED');await s.stop()});
test('CORS only for allow-listed origins',async()=>{const s=await start();const ok=await fetch(s.base+'/api/v1/health',{headers:{Origin:'http://localhost:5173'}});assert.equal(ok.headers.get('access-control-allow-origin'),'http://localhost:5173');const bad=await fetch(s.base+'/api/v1/health',{headers:{Origin:'https://evil.example'}});assert.equal(bad.headers.get('access-control-allow-origin'),null);await s.stop()});
test('preflight OPTIONS returns 204',async()=>{const s=await start();const r=await fetch(s.base+'/api/v1/health',{method:'OPTIONS',headers:{Origin:'http://localhost:5173'}});assert.equal(r.status,204);await s.stop()});
test('unexpected errors never leak details',async()=>{const s=await start({},r=>r.add('GET','/api/v1/boom',()=>{throw new Error('db password=hunter2')}));const r=await fetch(s.base+'/api/v1/boom');assert.equal(r.status,500);const b=await json(r);isError(b,'INTERNAL');assert.ok(!JSON.stringify(b).includes('hunter2'));await s.stop()});
test('route params are decoded',async()=>{const s=await start({},r=>r.add('GET','/api/v1/echo/:id',c=>({body:{id:c.params.id}})));assert.equal((await json(await fetch(s.base+'/api/v1/echo/apollo-11'))).id,'apollo-11');await s.stop()});
