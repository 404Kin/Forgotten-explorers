// Narration audio. The audio file may not exist yet (recordings arrive later), so every state is handled:
// status: 'checking' | 'ready' | 'missing'.  When 'missing' the screen shows captions only and an "audio coming soon" note.

/** True only if the URL answers with real audio. (Vite and some hosts answer 200 + an HTML page for unknown files.) */
export async function audioExists(url){
  if(!url)return false;
  try{const r=await fetch(url,{method:'HEAD'});return r.ok&&(r.headers.get('content-type')||'').startsWith('audio')}
  catch{return false}
}

export function createNarrationPlayer({src,onTime,onPlayState,onStatus}){
  let audio=null,status='checking',destroyed=false;
  const setStatus=s=>{status=s;onStatus?.(s)};

  audioExists(src).then(ok=>{
    if(destroyed)return;
    if(!ok)return setStatus('missing');
    audio=new Audio();audio.preload='metadata';audio.src=src;
    audio.addEventListener('timeupdate',()=>onTime?.(audio.currentTime,audio.duration));
    audio.addEventListener('play',()=>onPlayState?.(true));
    audio.addEventListener('pause',()=>onPlayState?.(false));
    audio.addEventListener('ended',()=>{onPlayState?.(false);onTime?.(0,audio.duration)});
    // A file that exists but cannot be decoded is treated like a missing one.
    audio.addEventListener('error',()=>setStatus('missing'));
    setStatus('ready');
  });

  return{
    get status(){return status},
    toggle(){if(!audio)return;audio.paused?audio.play().catch(()=>setStatus('missing')):audio.pause()},
    seekStart(){if(audio)audio.currentTime=0},
    destroy(){destroyed=true;if(audio){audio.pause();audio.removeAttribute('src');audio.load();audio=null}}
  };
}
