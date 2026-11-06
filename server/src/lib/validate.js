// Query-string validation driven by a small schema, so every route validates the same way.
// schema: { page:{type:'int',min:1,max:1000,default:1}, status:{type:'enum',values:[...]}, ids:{type:'list',pattern:/^[a-z0-9-]+$/,max:20} }
import {badParam} from './errors.js';
export function parseQuery(url,schema){
  const out={};
  for(const k of url.searchParams.keys()) if(!(k in schema)) throw badParam(`Unknown parameter: ${k}`,{param:k});
  for(const[k,r]of Object.entries(schema)){
    const raw=url.searchParams.get(k);
    if(raw===null||raw===''){
      if(r.required) throw badParam(`${k} is required`,{param:k});
      if('default' in r) out[k]=r.default;
      continue;
    }
    if(r.type==='int'){
      if(!/^-?\d+$/.test(raw)) throw badParam(`${k} must be a whole number`,{param:k});
      const n=Number(raw);
      if(n<(r.min??-Infinity)||n>(r.max??Infinity)) throw badParam(`${k} must be between ${r.min} and ${r.max}`,{param:k,min:r.min,max:r.max});
      out[k]=n;
    }else if(r.type==='enum'){
      if(!r.values.includes(raw)) throw badParam(`${k} must be one of ${r.values.join(', ')}`,{param:k,allowed:r.values});
      out[k]=raw;
    }else if(r.type==='list'){
      const items=raw.split(',');
      if(items.length>(r.max??20)) throw badParam(`${k} has too many items (max ${r.max??20})`,{param:k});
      if(items.some(i=>!r.pattern.test(i))) throw badParam(`${k} has an invalid item`,{param:k});
      out[k]=items;
    }else if(r.type==='string'){
      if(raw.length>(r.max??100)||(r.pattern&&!r.pattern.test(raw))) throw badParam(`${k} is not valid`,{param:k});
      out[k]=raw;
    }else throw new Error(`Unknown schema type for ${k}`);
  }
  return out;
}
