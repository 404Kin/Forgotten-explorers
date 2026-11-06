// Optional language overlay. File <i18nDir>/<lang>.json shaped { "<i18nKey>": { name, kidFact, endReason, story:[{title,text}], quiz:[{q,options}] } }.
// Anything missing falls back to English, and the response says which language it really used.
import {readFileSync} from 'node:fs';
import {join} from 'node:path';
export const LANGS=['en','bn','ar'];
export function loadTranslations(dir,logger){
  const table={};
  for(const lang of LANGS.filter(l=>l!=='en')){
    try{table[lang]=JSON.parse(readFileSync(join(dir,`${lang}.json`),'utf8'))}
    catch(err){if(err.code!=='ENOENT')logger.warn('translation_unreadable',{lang,error:err.message})}
  }
  return table;
}
export function applyLang(robot,lang,table){
  const t=lang==='en'?null:table[lang]?.[robot.i18nKey];
  if(!t) return{robot,lang:'en'};
  const out={...robot};
  for(const k of['name','kidFact','endReason']) if(typeof t[k]==='string'&&t[k]) out[k]=t[k];
  // Pages and questions are replaced only when the count matches, so the quiz answers can never get misaligned.
  if(Array.isArray(t.story)&&t.story.length===robot.story.length) out.story=t.story.map((s,i)=>({title:s.title||robot.story[i].title,text:s.text||robot.story[i].text}));
  if(Array.isArray(t.quiz)&&t.quiz.length===robot.quiz.length&&t.quiz.every((q,i)=>q.options?.length===robot.quiz[i].options.length)) out.quiz=t.quiz;
  return{robot:out,lang};
}
