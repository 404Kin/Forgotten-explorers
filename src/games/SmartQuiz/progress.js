// Per-question progress for any quiz: a question is unseen (no entry), mastered or missed.
// Pure reducers (easy to test) plus a small store that survives blocked or full localStorage.
export const STATUS={UNSEEN:'unseen',MASTERED:'mastered',MISSED:'missed'};

export const statusOf=(state,id)=>state[id]===STATUS.MASTERED||state[id]===STATUS.MISSED?state[id]:STATUS.UNSEEN;
/** Right answer = mastered. Wrong answer = missed, and it comes back until it is answered right. Returns a NEW state. */
export const applyAnswer=(state,id,correct)=>({...state,[id]:correct?STATUS.MASTERED:STATUS.MISSED});
export function counts(bank,state){
  const c={total:bank.length,mastered:0,missed:0,unseen:0};
  for(const q of bank)c[statusOf(state,q.id)]++;
  return c;
}
/** Remove the saved result of some questions (back to unseen). Returns a NEW state. */
export const forgetIds=(state,ids)=>Object.fromEntries(Object.entries(state).filter(([id])=>!ids.includes(id)));
export const allMastered=(bank,state)=>bank.length>0&&bank.every(q=>statusOf(state,q.id)===STATUS.MASTERED);

/** Only keep valid entries from whatever was saved (old versions, hand edits, other quizzes). */
export const cleanState=raw=>{
  if(!raw||typeof raw!=='object'||Array.isArray(raw))return{};
  return Object.fromEntries(Object.entries(raw).filter(([,v])=>v===STATUS.MASTERED||v===STATUS.MISSED));
};

/**
 * Store with the same API for every quiz. `backend` is anything with getItem/setItem/removeItem (default: localStorage).
 * Every storage call is in try/catch (private mode, quota, blocked cookies); progress then lives in memory for the session.
 */
export function createProgressStore({key,backend}={}){
  let memory={};
  const store=()=>{try{return backend??globalThis.localStorage??null}catch{return null}};
  const read=()=>{try{const raw=store()?.getItem(key);return raw?cleanState(JSON.parse(raw)):memory}catch{return memory}};
  const write=state=>{memory=state;try{store()?.setItem(key,JSON.stringify(state))}catch{/* keep in memory */}};
  return{
    get:read,
    record(id,correct){const next=applyAnswer(read(),id,correct);write(next);return next},
    forget(ids){write(forgetIds(read(),ids))},
    reset(){memory={};try{store()?.removeItem(key)}catch{/* ignore */}},
  };
}
