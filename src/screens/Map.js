// Explorer Map: a real-looking, cute 3D solar system. Tap a label to learn, then jump to a robot or its 3D globe.
import {MISSIONS} from '../data/missions.js';
import {BODIES} from '../data/planets.js';
import {createSolarMap} from '../three/SolarMap.js';
import {get} from '../state/store.js';
import {go} from '../router/router.js';
import RELICS from '../data/relics.json';
let map;
const JUMP=[['sun','☀️ Sun'],['earth','🌍 Earth'],['moon','🌙 Moon'],['mars','🔴 Mars'],['jupiter','🟠 Jupiter'],['saturn','🪐 Saturn'],['neptune','💙 Neptune'],['voyager','📡 Voyager']];
export default{name:'map',
mount(el){el.innerHTML=`<div class="mapwrap"><div id="mapbox"><canvas id="mc"></canvas></div><div class="maptop"><span class="mono">Explorer map</span><h1>Solar System</h1><p>Drag to look around · pinch or scroll to zoom · tap a name!</p></div><div class="jump" id="jump">${JUMP.map(([k,l])=>`<button class="chip" data-k="${k}">${l}</button>`).join('')}</div><div id="sheet" class="sheet2 panel" hidden></div></div>`;
const sheet=el.querySelector('#sheet');
const open=id=>{const b=BODIES.find(x=>x.id===id);if(!b)return;const col=get().collected;const ms=b.missions.map(n=>MISSIONS.find(m=>m.n===n)).filter(Boolean);
const dist=b.km||(b.au?`${b.au} AU from the Sun`:'The center of our solar system');
sheet.hidden=false;sheet.innerHTML=`<button class="x" aria-label="Close">✖</button><h2>${b.emoji} ${b.name}</h2><p class="mono">${dist} · map not to scale</p><p>${b.fact}</p>${ms.length?`<p class="mono">Explorers here</p><div class="chips">${ms.map(m=>`<button class="chip" data-m="${m.id}" style="background:${m.c};color:${m.k}">${m.n}${col.includes(m.n)?' ⭐':''}</button>`).join('')}</div>`:'<p class="mono">No robots from our story here yet.</p>'}${b.world?`<p style="margin:12px 0 0"><a class="btn sm" href="#/world/${b.world}">Open 3D globe</a></p>`:''}`;
sheet.querySelector('.x').onclick=()=>sheet.hidden=true;sheet.querySelectorAll('[data-m]').forEach(c=>c.onclick=()=>go('/mission/'+c.dataset.m))};
map=createSolarMap(el.querySelector('#mapbox'),el.querySelector('#mc'),{missions:MISSIONS,onPick:p=>{if(p.kind==='mission'){const r=RELICS.find(x=>x.id===p.m.id);go('/mission/'+p.m.id)}else{map.focus(p.id);open(p.id)}}});
el.querySelector('#jump').onclick=e=>{const b=e.target.closest('[data-k]');if(!b)return;const k=b.dataset.k;if(k==='voyager'){map.focus('voyager');const m=MISSIONS.find(x=>x.n==='VOYAGER'),r=RELICS.find(x=>x.id===m.id);sheet.hidden=false;sheet.innerHTML=`<button class="x" aria-label="Close">✖</button><h2>📡 Voyager 1</h2><p class="mono">About ${r.distanceAU} AU from the Sun (dataset snapshot) · map not to scale</p><p>${m.t} Still flying, and still talking to Earth.</p><div class="chips"><button class="chip" data-m="${m.id}" style="background:${m.c};color:${m.k}">VOYAGER</button></div>`;sheet.querySelector('.x').onclick=()=>sheet.hidden=true;sheet.querySelector('[data-m]').onclick=()=>go('/mission/'+m.id)}else{map.focus(k);open(k)}}},
unmount(){map?.dispose();map=null}};