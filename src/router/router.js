// Hash router. A screen is { name, mount(el,params), unmount() }.
const routes=[];let cur;
export const route=(pattern,screen)=>{const keys=(pattern.match(/:\w+/g)||[]).map(k=>k.slice(1));routes.push([new RegExp('^'+pattern.replace(/:\w+/g,'([^/]+)')+'$'),keys,screen])};
export const go=p=>{location.hash='#'+p};
export function start(el){const run=()=>{const path=location.hash.slice(1)||'/';for(const[re,keys,scr]of routes){const m=re.exec(path);if(!m)continue;cur?.unmount?.();const params=Object.fromEntries(keys.map((k,i)=>[k,decodeURIComponent(m[i+1])]));el.innerHTML='';el.scrollTop=0;scrollTo(0,0);cur=scr;document.body.dataset.screen=scr.name;scr.mount(el,params);return}go('/')};addEventListener('hashchange',run);run()}
