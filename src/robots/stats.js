// Counts and ordering that depend only on the robot list (pure: pass the list in, nothing is typed by hand).
// robot.status is one of: left_behind | silent | talking. robot.w is moon | mars | deep.
export const isAbandoned=r=>r.status==='left_behind'||r.status==='silent';

/** The numbers for the Abandoned count panel. */
export function abandonedCounts(robots){
  const ab=robots.filter(isAbandoned);
  return{
    total:robots.length,abandoned:ab.length,
    moon:ab.filter(r=>r.w==='moon').length,        // left or silent on the Moon
    mars:ab.filter(r=>r.w==='mars').length,        // left or silent on Mars
    leftBehind:robots.filter(r=>r.status==='left_behind').length,
    silent:robots.filter(r=>r.status==='silent').length,
    talking:robots.filter(r=>r.status==='talking').length
  };
}

/** Walk order for "Next explorer": the abandoned robots first (Left Behind, then Went Silent), then the active ones, in list order. */
export function walkOrder(robots){
  const rank=r=>r.status==='left_behind'?0:r.status==='silent'?1:2;
  return[...robots].sort((a,b)=>rank(a)-rank(b)||a.index-b.index);
}
/** The robot after `id` in walk order (wraps to the first). null if the id is unknown. */
export function nextRobot(robots,id){
  const order=walkOrder(robots),i=order.findIndex(r=>r.id===id);
  return i<0?null:order[(i+1)%order.length];
}
