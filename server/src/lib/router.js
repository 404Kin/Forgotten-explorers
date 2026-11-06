// Tiny router: add(method, '/path/:param', handler). A handler returns { status, body, headers, cacheSeconds }.
export function createRouter(){
  const routes=[];
  return{
    add(method,path,handler){
      const keys=[];
      const re=new RegExp('^'+path.replace(/:(\w+)/g,(_,k)=>{keys.push(k);return '([^/]+)'})+'/?$');
      routes.push({method,re,keys,handler});
    },
    match(method,pathname){
      const allow=new Set();
      for(const r of routes){
        const m=r.re.exec(pathname);
        if(!m) continue;
        allow.add(r.method);
        if(r.method!==method) continue;
        try{return{handler:r.handler,params:Object.fromEntries(r.keys.map((k,i)=>[k,decodeURIComponent(m[i+1])]))}}
        catch{allow.delete(r.method)} // malformed %-escape: treat as not found
      }
      return{allow:[...allow]};
    }
  };
}
