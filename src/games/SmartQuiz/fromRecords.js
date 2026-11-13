// Extra quiz questions made ONLY from facts already in the robot records (src/data/robotRecords.json): no new facts are invented.
// Each question carries the record's first source URL and needsFactCheck:true, because the record text is a draft (needsReview).
// Pure functions: pass the records in. The data keeps the right answer FIRST; the games shuffle the options on screen.

// Question kinds we use, by the way the record's own question starts. Difficulty follows how hard the recall is.
const KINDS=[
  {key:'fact',   test:q=>/^Which fact about/i.test(q),    difficulty:'easy'},
  {key:'happened',test:q=>/^What happened to/i.test(q),   difficulty:'medium'},
  {key:'launch', test:q=>/launch\?$/i.test(q),            difficulty:'medium'},
  {key:'reach',  test:q=>/reach .*\?$/i.test(q),          difficulty:'hard'},
  {key:'why',    test:q=>/^Why is/i.test(q),              difficulty:'hard'}
];
const MAX_OPTION=110; // very long answers do not fit on a phone button

/** Turn "The record's launch date is X." into a plain sentence; other explanations are kept as they are. */
function factText(kind,name,answer,explanation){
  if(kind==='launch')return `${name} launched on ${answer}.`;
  if(kind==='reach')return `${name} reached its destination on ${answer}.`;
  return String(explanation||'').replace(/^The record['’]s /,'').trim();
}

/** All usable questions for one record. */
export function recordQuestions(record){
  const out=[];
  for(const [i,q] of (record.quiz||[]).entries()){
    const kind=KINDS.find(k=>k.test(q.q));
    const opts=q.options||[];
    if(!kind||opts.length!==4||new Set(opts).size!==4||opts.some(o=>!o||o.length>MAX_OPTION))continue;
    out.push({id:`rec-${record.id}-${kind.key}`,difficulty:kind.difficulty,question:q.q,options:[...opts],correct:0,
      fact:factText(kind.key,record.name,opts[0],q.explanation),source:(record.sources||[])[0]||'',needsFactCheck:true,origin:'robotRecords'});
  }
  return out;
}
/** Questions for every record. Duplicate ids are dropped. */
export function recordBank(records){
  const seen=new Set();
  return records.flatMap(recordQuestions).filter(q=>!seen.has(q.id)&&seen.add(q.id));
}
