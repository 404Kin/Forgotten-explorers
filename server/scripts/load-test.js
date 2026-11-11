import {performance} from 'node:perf_hooks';

const url=new URL(process.env.LOAD_TEST_URL||'http://127.0.0.1:8787/api/v1/health');
const requests=Number(process.env.LOAD_TEST_REQUESTS||100);
const concurrency=Number(process.env.LOAD_TEST_CONCURRENCY||10);

if(!['http:','https:'].includes(url.protocol)||url.username||url.password)throw new Error('LOAD_TEST_URL must be an HTTP(S) URL without credentials.');
if(!Number.isInteger(requests)||requests<1||requests>1000)throw new Error('LOAD_TEST_REQUESTS must be an integer from 1 to 1000.');
if(!Number.isInteger(concurrency)||concurrency<1||concurrency>50)throw new Error('LOAD_TEST_CONCURRENCY must be an integer from 1 to 50.');

const latencies=[];
const statuses=new Map();
let next=0,failures=0;
const started=performance.now();

async function worker(){
  while(next<requests){
    next++;
    const requestStarted=performance.now();
    try{
      const response=await fetch(url,{signal:AbortSignal.timeout(10000)});
      await response.arrayBuffer();
      latencies.push(performance.now()-requestStarted);
      statuses.set(response.status,(statuses.get(response.status)||0)+1);
      if(!response.ok)failures++;
    }catch(error){
      latencies.push(performance.now()-requestStarted);
      failures++;
      statuses.set(error?.name||'network-error',(statuses.get(error?.name||'network-error')||0)+1);
    }
  }
}

await Promise.all(Array.from({length:Math.min(concurrency,requests)},worker));
const durationSeconds=(performance.now()-started)/1000;
latencies.sort((a,b)=>a-b);
const p95=latencies[Math.ceil(latencies.length*.95)-1]||0;
console.log(JSON.stringify({
  host:url.host,
  requests,
  concurrency:Math.min(concurrency,requests),
  durationSeconds:Number(durationSeconds.toFixed(2)),
  requestsPerSecond:Number((requests/durationSeconds).toFixed(2)),
  p95Milliseconds:Number(p95.toFixed(1)),
  failures,
  statuses:Object.fromEntries(statuses)
},null,2));
if(failures)process.exitCode=1;
