// The robot record contract (mirrors the plan's schema). If P1's JSON Schema changes, change ONLY this file.
export const WORLDS=['moon','mars','deep'];
export const STATUSES=['left_behind','silent','talking']; // Left Behind / Went Silent / Still Talking
const DATE=/^\d{4}(-\d{2}(-\d{2})?)?$/;
const str=(v,max=2000)=>typeof v==='string'&&v.trim().length>0&&v.length<=max;
export function hostAllowed(url,hosts){
  try{const u=new URL(url);return u.protocol==='https:'&&hosts.some(h=>u.hostname===h||u.hostname.endsWith('.'+h))}catch{return false}
}
export function validateRobot(r,{sourceHosts=['nasa.gov']}={}){
  const e=[];
  if(!r||typeof r!=='object'||Array.isArray(r)) return['record must be an object'];
  if(!/^[a-z0-9-]{2,40}$/.test(r.id??'')) e.push('id must be 2-40 chars: a-z, 0-9, dash');
  if(!str(r.name,80)) e.push('name is required');
  if(!WORLDS.includes(r.world)) e.push(`world must be one of ${WORLDS.join(', ')}`);
  if(!STATUSES.includes(r.status)) e.push(`status must be one of ${STATUSES.join(', ')}`);
  for(const k of['launchDate','arrivalDate']) if(!DATE.test(r[k]??'')) e.push(`${k} must look like YYYY, YYYY-MM or YYYY-MM-DD`);
  if(r.endDate!=null&&!DATE.test(r.endDate)) e.push('endDate must be a date or null');
  const needsPlace=r.world==='moon'||r.world==='mars';
  for(const[k,lim]of[['lat',90],['lon',180]]){
    if(r[k]==null){if(needsPlace)e.push(`${k} is required for moon and mars`)}
    else if(typeof r[k]!=='number'||Math.abs(r[k])>lim) e.push(`${k} must be a number between -${lim} and ${lim}`);
  }
  for(const k of['endReason','kidFact']) if(!str(r[k])) e.push(`${k} is required`);
  if(!/^[\w.-]+$/.test(r.i18nKey??'')) e.push('i18nKey is required');
  if(!Array.isArray(r.story)||!r.story.length||r.story.some(s=>!str(s?.title,120)||!str(s?.text))) e.push('story needs at least one page with title and text');
  if(!Array.isArray(r.quiz)||r.quiz.some(q=>!str(q?.q,300)||!Array.isArray(q.options)||q.options.length<2||q.options.some(o=>!str(o,200)))) e.push('quiz items need q and 2+ options (correct first)');
  if(!Array.isArray(r.sources)||!r.sources.length) e.push('at least one source URL is required');
  else{const bad=r.sources.filter(u=>!hostAllowed(u,sourceHosts));if(bad.length)e.push(`sources must be https URLs on: ${sourceHosts.join(', ')} (bad: ${bad.join(' ')})`)}
  return e;
}
export const summary=r=>({id:r.id,name:r.name,world:r.world,status:r.status,lat:r.lat??null,lon:r.lon??null,kidFact:r.kidFact,i18nKey:r.i18nKey});
