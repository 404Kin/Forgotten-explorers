// Sound settings for Pip's voice AND the sound effects (one volume for everything). Pure helpers + a small store.
// All storage calls are in try/catch. Nothing here speaks: speaking only starts after the player taps (see services/audio.js).
export const KEY='fe2.sound';
export const DEFAULTS={muted:false,volume:.8,rate:1,voiceURI:''};
export const RATE_MIN=.7,RATE_MAX=1.3;
export const clamp=(v,lo,hi)=>{const n=Number(v);return Number.isFinite(n)?Math.min(hi,Math.max(lo,n)):lo};

/** Keep only valid values from whatever was saved. */
export const cleanSettings=raw=>({
  muted:Boolean(raw?.muted),
  volume:clamp(raw?.volume??DEFAULTS.volume,0,1),
  rate:clamp(raw?.rate??DEFAULTS.rate,RATE_MIN,RATE_MAX),
  voiceURI:typeof raw?.voiceURI==='string'?raw.voiceURI:''
});
/** English voices only (en, en-US, en-GB ...). */
export const englishVoices=voices=>(voices||[]).filter(v=>/^en([-_]|$)/i.test(v.lang||''));
/** The saved voice if it still exists; otherwise null (the browser's default English voice is used). */
export const pickVoice=(voices,uri)=>englishVoices(voices).find(v=>v.voiceURI===uri)||null;
/** What a sound effect gets: 0 when muted, else its own loudness times the master volume. */
export const effectGain=(base,s)=>s.muted?0:base*s.volume;

const subs=new Set();let current=null;
const load=()=>{try{return cleanSettings(JSON.parse(globalThis.localStorage?.getItem(KEY)||'null'))}catch{return cleanSettings(null)}};
export const getSoundSettings=()=>current||(current=load());
export const onSoundChange=fn=>(subs.add(fn),()=>subs.delete(fn));
export function setSoundSettings(patch){
  current=cleanSettings({...getSoundSettings(),...patch});
  try{globalThis.localStorage?.setItem(KEY,JSON.stringify(current))}catch{/* kept for this visit only */}
  subs.forEach(f=>f(current));return current;
}
