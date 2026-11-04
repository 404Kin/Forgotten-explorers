// Real NASA photos via the free NASA Image and Video Library API (no key needed). Cached for 7 days.
import {NASA_API} from '../config.js';
import {PINNED} from '../data/nasaQueries.js';
const mem=new Map(),TTL=7*864e5,A='https://images-assets.nasa.gov/image/';
const toImg=i=>{const d=i.data[0],id=d.nasa_id,b=`${A}${encodeURIComponent(id)}/${encodeURIComponent(id)}`;return{id,title:d.title||id,desc:(d.description||'').replace(/<[^>]+>/g,'').slice(0,220),date:(d.date_created||'').slice(0,10),credit:d.secondary_creator||d.center||'NASA',thumb:i.links[0].href,medium:b+'~medium.jpg',link:'https://images.nasa.gov/details/'+encodeURIComponent(id)}};
export async function searchImages(q,max=12){const k='nasa:'+q;if(mem.has(k))return mem.get(k);
try{const c=JSON.parse(localStorage.getItem(k)||'null');if(c&&Date.now()-c.t<TTL){mem.set(k,c.v);return c.v}}catch{}
try{const r=await fetch(`${NASA_API}/search?q=${encodeURIComponent(q)}&media_type=image&page_size=${max*2}`);if(!r.ok)throw new Error(r.status);const j=await r.json();
const v=(j.collection?.items||[]).filter(i=>i.links?.[0]&&i.data?.[0]).slice(0,max).map(toImg);mem.set(k,v);try{localStorage.setItem(k,JSON.stringify({t:Date.now(),v}))}catch{}return v}catch{return[]}}
export async function missionImages(m){const pin=(PINNED[m.n]||[]).map(id=>({id,title:m.n,desc:'',date:'',credit:'NASA',thumb:`${A}${id}/${id}~thumb.jpg`,medium:`${A}${id}/${id}~medium.jpg`,link:'https://images.nasa.gov/details/'+id}));return[...pin,...await searchImages(m.nasaQuery)]}
export const imgTag=(i,cls='')=>`<img class="${cls}" loading="lazy" src="${i.medium}" alt="${i.title.replace(/"/g,'')}" onerror="this.onerror=null;this.src='${i.thumb}'">`;
