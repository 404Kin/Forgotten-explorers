// Authoring script (not shipped in the app): builds src/data/sources.json from robotRecords.json + the 3D model config + a URL check.
//   node src/screens/DataSources/build-sources.mjs <url-check-results.tsv>
// The .tsv has lines "<http status>\t<url>" made by fetching every URL. A source that did not answer 200 is NOT listed on the page
// (it goes to "unverified"); a known repaired link is applied through URL_FIXES and recorded in "urlFixes" so P1 can fix the record.
import fs from 'node:fs';
import {MODELS,ROBOT_MODEL} from '../../components/Model3D/models.config.js';
const root=new URL('../../../',import.meta.url),read=p=>JSON.parse(fs.readFileSync(new URL(p,root),'utf8'));
const records=read('src/data/robotRecords.json'),manifest=read('public/images/maps/manifest.json');
const CHECKED=process.argv[3]||'2026-11-13';
const status=Object.fromEntries(fs.readFileSync(process.argv[2],'utf8').trim().split('\n').map(l=>{const [c,u]=l.split('\t');return[u,+c]}));
// Links that returned 404 but have a working replacement on the same topic (title checked by hand on CHECKED).
const URL_FIXES={
  'https://www.nasa.gov/news-release/nasa-retires-insight-mars-lander-mission-after-years-of-science/':'https://www.nasa.gov/missions/mars-insight/nasa-retires-insight-mars-lander-mission-after-years-of-science/',
  'https://science.nasa.gov/mission/webb/webbs-orbit-at-l2/':'https://science.nasa.gov/mission/webb/orbit/'
};
const ok=u=>status[u]===200;
const host=u=>new URL(u).hostname.replace(/^www\./,'');
const urlFixes=[],unverified=[];
const robots=records.map(r=>{
  const sources=[];
  for(const u of r.sources){
    const fixed=URL_FIXES[u];
    if(ok(u))sources.push({url:u,host:host(u)});
    else if(fixed&&ok(fixed)){sources.push({url:fixed,host:host(fixed)});urlFixes.push({robot:r.id,was:u,now:fixed})}
    else unverified.push({robot:r.id,url:u,status:status[u]??'not checked'});
  }
  const m=ROBOT_MODEL[r.id]?MODELS[ROBOT_MODEL[r.id]]:null;
  return{id:r.id,name:r.name,world:r.world,status:r.status,needsReview:Boolean(r.needsReview),sources,
    photo:r.photo?{nasaId:r.photo.nasaId,credit:r.photo.credit,pageUrl:r.photo.pageUrl,ok:ok(r.photo.pageUrl)}:null,
    model:m?{kind:'nasa',title:m.title,credit:m.credit,source:m.source}:{kind:'none'}};
});
const hosts={};robots.forEach(r=>r.sources.forEach(s=>hosts[s.host]=(hosts[s.host]||0)+1));
const out={generated:CHECKED,lastChecked:CHECKED,
  datasets:[
    {id:'nasa-image-library',name:'NASA Image and Video Library',provider:'NASA',url:'https://images.nasa.gov',apiUrl:'https://images-api.nasa.gov',usedFor:'One photo picked for each robot, plus more photos found by search. Every photo shows its credit and links back to its NASA page.',where:'Robot pages (photo and Photos tab), Explore photo strip',lastChecked:CHECKED,state:'used'},
    {id:'nasa-3d-resources',name:'NASA 3D Resources',provider:'NASA',url:'https://science.nasa.gov/3d-resources/',apiUrl:'https://github.com/nasa/NASA-3D-Resources',usedFor:`Real 3D models of ${robots.filter(r=>r.model.kind==='nasa').length} robots. We shrank the files so they load fast. Robots NASA has no model for show no 3D model.`,where:'Robot pages, 3D view panel',lastChecked:CHECKED,state:'used'},
    {id:'nasa-eyes',name:'NASA Eyes on the Solar System',provider:'NASA/JPL-Caltech',url:'https://eyes.nasa.gov/apps/solar-system/',apiUrl:'https://eyes.nasa.gov/assets/static/models/sc_mars_science_laboratory/rover/curiosity_static.gltf',usedFor:'The real 3D model of the Curiosity rover (NASA 3D Resources only has a Blender file for it).',where:'Curiosity robot page, 3D view panel',lastChecked:CHECKED,state:'used'},
    {id:'nasa-mission-pages',name:'NASA mission pages',provider:'NASA, JPL and NSSDCA; ISRO for Chandrayaan-3',url:'https://www.nasa.gov',usedFor:'Dates, places and the reason each robot was left or went silent. The per-robot list below links every page.',where:'Robot pages, Last Message, Why did we leave it there?, quiz questions',lastChecked:CHECKED,state:'used',note:'Text was drafted from these pages and is still being checked. Draft text shows a Draft label.'},
    {id:'nasa-trek',name:'NASA Moon Trek and Mars Trek map pictures',provider:'NASA/JPL',url:'https://trek.nasa.gov',usedFor:`The pictures wrapped around the 3D Moon and Mars globes. Credits: Moon: ${manifest.moon.credit}. Mars: ${manifest.mars.credit}.`,where:'World pages (3D globes)',lastChecked:CHECKED,state:'used'},
    {id:'team-snapshot',name:'Team mission snapshot (relics.json)',provider:'Forgotten Explorers team',url:null,usedFor:'Distance from Earth and message time on some robot pages. These numbers are a saved snapshot with no date, not live data.',where:'Robot pages (Real data), Still Talking',lastChecked:CHECKED,state:'snapshot'}
  ],
  notUsed:'The app does not call JPL Horizons, DSN Now, data.nasa.gov, api.nasa.gov or Earthdata. The Still Talking page shows a saved snapshot, not a live feed.',
  robots,hostCounts:hosts,urlFixes,unverified,
  libraries:[{name:'three.js (with its meshopt decoder)',license:'MIT',url:'https://threejs.org',usedFor:'3D views and globes'},{name:'Vite',license:'MIT',url:'https://vitejs.dev',usedFor:'Build tool'},{name:'glTF-Transform',license:'MIT',url:'https://gltf-transform.dev',usedFor:'Shrinking the NASA model files (build step only)'}],
  fonts:[{name:'Archivo Black, Nunito, Space Mono, Caveat Brush, Lilita One',license:'SIL Open Font License',url:'https://fonts.google.com',usedFor:'All text'}],
  sound:{text:'There are no music or sound files. Sound effects are made live in your browser with the Web Audio API, and the guide voice is your device\'s own speech voice.'},
  facts:{records:records.length,needsReview:records.filter(r=>r.needsReview).length,sourcesListed:robots.reduce((n,r)=>n+r.sources.length,0),fixed:urlFixes.length,unverified:unverified.length}};
fs.writeFileSync(new URL('src/data/sources.json',root),JSON.stringify(out,null,1)+'\n');
console.log(out.facts,'hosts',hosts);
