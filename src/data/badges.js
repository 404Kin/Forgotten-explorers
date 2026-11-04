// Badges are mission patches. test(state) decides if it is unlocked.
const has=(s,w,M)=>M.filter(m=>m.w===w).every(m=>s.collected.includes(m.n));
export const badges=M=>[
{id:'first',name:'First Contact',icon:'👋',desc:'Wake up your first robot',test:s=>s.collected.length>=1},
{id:'moon',name:'Moon Walker',icon:'🌙',desc:'Meet every Moon explorer',test:s=>has(s,'moon',M)},
{id:'mars',name:'Mars Pal',icon:'🔴',desc:'Meet every Mars explorer',test:s=>has(s,'mars',M)},
{id:'deep',name:'Deep Voyager',icon:'🚀',desc:'Meet every deep-space explorer',test:s=>has(s,'deep',M)},
{id:'quiz10',name:'Quiz Whiz',icon:'🧠',desc:'Answer 10 questions right',test:s=>s.stats.correct>=10},
{id:'lander',name:'Soft Landing',icon:'🛬',desc:'Land safely in the Lander game',test:s=>s.stats.lander>=1},
{id:'memory',name:'Memory Master',icon:'🃏',desc:'Finish Memory Match',test:s=>s.stats.memory>=1},
{id:'streak3',name:'3-Day Streak',icon:'🔥',desc:'Visit 3 days in a row',test:s=>s.streak>=3},
{id:'crew',name:'Full Crew',icon:'🏅',desc:'Wake up all explorers',test:s=>s.collected.length>=M.length}];
