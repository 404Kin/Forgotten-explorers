// Pure caption timing (no DOM, no audio): easy to unit-test later.

/**
 * Which caption line is showing at `time` seconds?
 * Lines may carry `startSec`. If none do (the audio is not timed yet), the lines share the audio length equally.
 * Returns -1 before the first line starts.
 */
export function activeLineIndex(lines,time,duration){
  if(!lines.length)return -1;
  if(lines.every(l=>Number.isFinite(l.startSec))){
    let idx=-1;lines.forEach((l,i)=>{if(time>=l.startSec)idx=i});return idx;
  }
  if(!Number.isFinite(duration)||duration<=0)return 0;
  return Math.min(lines.length-1,Math.floor(time/duration*lines.length));
}

/** Clamp a step from the keyboard / buttons into 0..last. */
export const stepIndex=(i,dir,count)=>Math.max(0,Math.min(count-1,i+dir));
