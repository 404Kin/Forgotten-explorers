// Progress shared by every game with levels: which levels are unlocked, the best result per level + difficulty,
// and the difficulty the player chose last. Pure reducers + a store that survives blocked localStorage.
// `levels` is the game's own ordered list [{id,...}]; nothing here knows about a specific game.

export const emptyState=()=>({unlocked:1,best:{},difficulty:null});
const key=(levelId,difficulty)=>`${levelId}:${difficulty}`;

export function cleanState(raw){
  if(!raw||typeof raw!=='object')return emptyState();
  const best={};
  for(const[k,v]of Object.entries(raw.best||{}))if(v&&Number.isFinite(v.value))best[k]={value:v.value,stars:Number.isFinite(v.stars)?v.stars:0};
  return{unlocked:Number.isInteger(raw.unlocked)&&raw.unlocked>=1?raw.unlocked:1,best,difficulty:typeof raw.difficulty==='string'?raw.difficulty:null};
}

/** Level number `index` (0-based) can be played when it is within the unlocked count, or when the game has no locks. */
export const isUnlocked=(state,index,{locks=true}={})=>!locks||index<state.unlocked;
export const bestOf=(state,levelId,difficulty)=>state.best[key(levelId,difficulty)]||null;

/**
 * Record a finished run. `better` says what a good value is: 'max' (stars, score) or 'min' (time, moves).
 * A WIN unlocks the next level. Returns {state, newBest, unlockedNext}; never mutates the old state.
 */
export function recordResult(state,levels,{levelId,difficulty,value,stars=0,won=true,better='max'}){
  const index=levels.findIndex(l=>l.id===levelId);
  const old=bestOf(state,levelId,difficulty);
  const isBetter=won&&(!old||(better==='min'?value<old.value:value>old.value));
  const best=isBetter?{...state.best,[key(levelId,difficulty)]:{value,stars}}:state.best;
  const unlockedNext=won&&index>=0&&index+2>state.unlocked&&index+1<levels.length;
  const unlocked=unlockedNext?index+2:state.unlocked;
  return{state:{...state,best,unlocked},newBest:isBetter,unlockedNext};
}

export function createGameProgress(storageKey,{backend}={}){
  let memory=emptyState();
  const store=()=>{try{return backend??globalThis.localStorage??null}catch{return null}};
  const read=()=>{try{const raw=store()?.getItem(storageKey);return raw?cleanState(JSON.parse(raw)):memory}catch{return memory}};
  const write=s=>{memory=s;try{store()?.setItem(storageKey,JSON.stringify(s))}catch{/* kept in memory */}};
  return{
    get:read,
    setDifficulty(d){write({...read(),difficulty:d})},
    record(levels,result){const r=recordResult(read(),levels,result);write(r.state);return r},
    reset(){memory=emptyState();try{store()?.removeItem(storageKey)}catch{/* ignore */}},
  };
}
