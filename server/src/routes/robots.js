import {parseQuery} from '../lib/validate.js';
import {notFound} from '../lib/errors.js';
import {WORLDS,STATUSES,summary} from '../domain/robot.js';
import {LANGS,applyLang} from '../data/translations.js';
const LANG={type:'enum',values:LANGS,default:'en'};
const LIST={page:{type:'int',min:1,max:1000,default:1},pageSize:{type:'int',min:1,max:50,default:12},world:{type:'enum',values:WORLDS},status:{type:'enum',values:STATUSES},lang:LANG};
export function registerRobots(router){
  router.add('GET','/api/v1/robots',({url,data})=>{
    const q=parseQuery(url,LIST);
    const {items,meta}=data.robots.list({filters:{world:q.world,status:q.status},page:q.page,pageSize:q.pageSize});
    return{body:{data:items.map(r=>{const x=applyLang(r,q.lang,data.translations);return{...summary(x.robot),lang:x.lang}}),meta:{...meta,lang:q.lang}},cacheSeconds:300};
  });
  router.add('GET','/api/v1/robots/:id',({url,params,data})=>{
    const q=parseQuery(url,{lang:LANG});
    const r=data.robots.get(params.id);
    if(!r) throw notFound(`No robot with id "${params.id}"`);
    const x=applyLang(r,q.lang,data.translations);
    return{body:{data:{...x.robot,lang:x.lang}},headers:{'Content-Language':x.lang},cacheSeconds:300};
  });
}
