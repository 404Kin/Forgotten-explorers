// Explorer Map: a real-looking, cute 3D solar system. Tap a label to learn, then jump to a robot or its 3D globe.
import {MISSIONS} from '../data/missions.js';
import {BODIES as RAW_BODIES} from '../data/planets.js';
import {t} from '../i18n/index.js';
import {localBody,localRobot} from '../i18n/content.js';
import {num} from '../i18n/format.js';
import {createSolarMap} from '../three/SolarMap.js';
import {get} from '../state/store.js';
import {go} from '../router/router.js';
import RELICS from '../data/relics.json';
let map;
// [target id, emoji]. The label comes from the body name (or jump.voyager), so there is no second list to translate.
const JUMP=[['sun','☀️'],['earth','🌍'],['moon','🌙'],['mars','🔴'],['jupiter','🟠'],['saturn','🪐'],['neptune','💙'],['voyager','📡']];
export default{name:'map',
mount(el){const BODIES=RAW_BODIES.map(localBody),jumpLabel=k=>k==='voyager'?t('jump.voyager'):BODIES.find(b=>b.id===k).name;
el.innerHTML=`<div class="mapwrap"><div id="mapbox"><canvas id="mc"></canvas></div><div class="maptop"><span class="mono">${t('map.kicker')}</span><h1>${t('map.title')}</h1><p>${t('map.help')}</p></div><div class="jump" id="jump">${JUMP.map(([k,e])=>`<button class="chip" data-k="${k}">${e} ${jumpLabel(k)}</button>`).join('')}</div><div id="sheet" class="sheet2 panel" hidden></div></div>`;
const sheet=el.querySelector('#sheet');
const open=id=>{const b=BODIES.find(x=>x.id===id);if(!b)return;const col=get().collected;const ms=b.missions.map(n=>MISSIONS.find(m=>m.n===n)).filter(Boolean);
const dist=b.km||(b.au?t('map.fromSun',{au:num(b.au,2)}):t('map.center'));
sheet.hidden=false;sheet.innerHTML=`<button class="x" aria-label="${t('common.close')}">✖</button><h2>${b.emoji} ${b.name}</h2><p class="mono">${dist} · ${t('map.notToScale')}</p><p>${b.fact}</p>${ms.length?`<p class="mono">${t('map.explorersHere')}</p><div class="chips">${ms.map(m=>`<button class="chip" data-m="${m.id}" style="background:${m.c};color:${m.k}">${m.n}${col.includes(m.n)?' ⭐':''}</button>`).join('')}</div>`:`<p class="mono">${t('map.noRobots')}</p>`}${b.world?`<p style="margin:12px 0 0"><a class="btn sm" href="#/world/${b.world}">${t('map.open3d')}</a></p>`:''}`;
sheet.querySelector('.x').onclick=()=>sheet.hidden=true;sheet.querySelectorAll('[data-m]').forEach(c=>c.onclick=()=>go('/mission/'+c.dataset.m))};
map=createSolarMap(el.querySelector('#mapbox'),el.querySelector('#mc'),{missions:MISSIONS,onPick:p=>{if(p.kind==='mission'){const r=RELICS.find(x=>x.id===p.m.id);go('/mission/'+p.m.id)}else{map.focus(p.id);open(p.id)}}});
el.querySelector('#jump').onclick=e=>{const b=e.target.closest('[data-k]');if(!b)return;const k=b.dataset.k;if(k==='voyager'){map.focus('voyager');const m=MISSIONS.find(x=>x.n==='VOYAGER'),r=RELICS.find(x=>x.id===m.id);sheet.hidden=false;sheet.innerHTML=`<button class="x" aria-label="${t('common.close')}">✖</button><h2>📡 ${t('map.voyagerName')}</h2><p class="mono">${t('map.voyagerSnap',{au:num(r.distanceAU,1)})} · ${t('map.notToScale')}</p><p>${localRobot(m).t} ${t('map.voyagerLine')}</p><div class="chips"><button class="chip" data-m="${m.id}" style="background:${m.c};color:${m.k}">VOYAGER</button></div>`;sheet.querySelector('.x').onclick=()=>sheet.hidden=true;sheet.querySelector('[data-m]').onclick=()=>go('/mission/'+m.id)}else{map.focus(k);open(k)}}},
unmount(){map?.dispose();map=null}};