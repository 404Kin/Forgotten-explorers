// Pure helpers for the tour (no DOM), so they are easy to unit-test later.
export const readySteps=steps=>steps.filter(s=>s.ready!==false);
/** Next step index after moving `dir` (+1 / -1). Returns -1 when the tour is over (moved past the end). */
export const move=(index,dir,total)=>{const n=index+dir;return n<0?0:n>=total?-1:n};
export const progress=(index,total)=>({n:index+1,total,percent:Math.round(((index+1)/total)*100)});
