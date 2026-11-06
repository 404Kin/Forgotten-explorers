import test from 'node:test';
import assert from 'node:assert/strict';
import {parseQuery} from '../src/lib/validate.js';
import {createLogger,redact} from '../src/lib/logger.js';
import {loadConfig} from '../src/config.js';
import {createRateLimiter} from '../src/lib/rateLimit.js';
const q=s=>new URL('http://x/?'+s);
const S={page:{type:'int',min:1,max:100,default:1},status:{type:'enum',values:['left_behind','silent','talking']},ids:{type:'list',pattern:/^[a-z0-9-]+$/,max:3}};

test('parseQuery applies defaults and parses values',()=>{assert.deepEqual(parseQuery(q('status=silent&ids=a,b'),S),{page:1,status:'silent',ids:['a','b']})});
test('parseQuery rejects bad input',()=>{
  for(const bad of['page=0','page=abc','page=1.5','status=alive','ids=a,b,c,d','ids=A!','nope=1'])assert.throws(()=>parseQuery(q(bad),S),e=>e.code==='INVALID_PARAM'&&e.status===400,bad)});
test('logger redacts secrets',()=>{const lines=[];const log=createLogger({sink:{log:l=>lines.push(l),error:l=>lines.push(l)}});log.info('x',{authorization:'Bearer abc',nested:{apiKey:'k',ok:1}});assert.ok(!lines[0].includes('abc')&&!lines[0].includes('"k"'));assert.ok(lines[0].includes('"ok":1'));assert.equal(redact({token:'t'}).token,'[redacted]')});
test('config rejects unsafe settings',()=>{assert.throws(()=>loadConfig({PORT:'99999'}));assert.throws(()=>loadConfig({CORS_ORIGINS:'*'}));assert.equal(loadConfig({}).port,8787)});
test('rate limiter window resets',()=>{let t=0;const l=createRateLimiter({windowMs:1000,max:2,now:()=>t});assert.ok(l.check('a').allowed);assert.ok(l.check('a').allowed);assert.equal(l.check('a').allowed,false);t=1500;assert.ok(l.check('a').allowed);l.stop()});
