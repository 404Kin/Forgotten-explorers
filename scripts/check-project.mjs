// npm run check : every relative import in src/ must point to a real file. Exits with code 1 when something is missing (so CI fails).
import fs from 'fs';import path from 'path';
let bad=0;const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
for(const f of walk('src').filter(f=>f.endsWith('.js'))){const t=fs.readFileSync(f,'utf8');for(const m of t.matchAll(/from\s+'(\.[^']+)'/g)){const p=path.resolve(path.dirname(f),m[1]);if(!fs.existsSync(p)){console.log('MISSING import',f,'->',m[1]);bad++}}}
console.log(bad?`${bad} problem(s)`:'Imports OK');
process.exit(bad?1:0);
