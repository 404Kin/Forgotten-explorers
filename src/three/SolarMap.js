// Real-looking, cute solar-system map. Sun on the left, planets glide on their orbits.
// Names are sticker buttons that follow the 3D objects. onPick({kind:'body',id}) or onPick({kind:'mission',m}).
import * as THREE from 'three';
import {createSunTexture,createEarthTexture,createMarsTexture,createMoonTexture,createJupiterTexture,createSaturnTexture} from '../utils/textureGenerator.js';
import {BODIES} from '../data/planets.js';
const band=(cols,n=.1)=>{const c=document.createElement('canvas');c.width=256;c.height=128;const x=c.getContext('2d'),g=x.createLinearGradient(0,0,0,128);cols.forEach((k,i)=>g.addColorStop(i/(cols.length-1),k));x.fillStyle=g;x.fillRect(0,0,256,128);for(let i=0;i<70;i++){x.fillStyle=`rgba(255,255,255,${Math.random()*n})`;x.fillRect(0,Math.random()*128,256,1+Math.random()*3)}return c};
const glowTex=(a,b)=>{const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d'),g=x.createRadialGradient(64,64,0,64,64,64);g.addColorStop(0,a);g.addColorStop(1,b);x.fillStyle=g;x.fillRect(0,0,128,128);return new THREE.CanvasTexture(c)};
const TEX={mercury:()=>createMoonTexture(),venus:()=>band(['#e8d3a0','#d9b878','#ead9ae','#cfa862']),earth:createEarthTexture,mars:createMarsTexture,jupiter:createJupiterTexture,saturn:createSaturnTexture,uranus:()=>band(['#a9e6ea','#8fd3df','#a9e6ea'],.04),neptune:()=>band(['#3f6fe0','#2c52c4','#4a7cf0'],.08)};
const TINT={mercury:0xb9aa9c};
export function createSolarMap(box,canvas,{missions,onPick}){
const R=new THREE.WebGLRenderer({canvas,antialias:true}),S=new THREE.Scene(),C=new THREE.PerspectiveCamera(45,1,.1,400);S.background=new THREE.Color(0x05061a);
S.add(new THREE.AmbientLight(0xffffff,.38));S.add(new THREE.PointLight(0xfff1d0,2.6,0,0));
const st=[],sc=[];for(let i=0;i<1400;i++){const v=new THREE.Vector3().randomDirection().multiplyScalar(120+Math.random()*60);st.push(v.x,v.y,v.z);const c=new THREE.Color().setHSL(Math.random()<.7?.6:.1,.4,.7+Math.random()*.3);sc.push(c.r,c.g,c.b)}
const sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.Float32BufferAttribute(st,3));sg.setAttribute('color',new THREE.Float32BufferAttribute(sc,3));const stars=new THREE.Points(sg,new THREE.PointsMaterial({size:.9,vertexColors:true,sizeAttenuation:false}));S.add(stars);
const neb=glowTex('rgba(110,90,220,.45)','rgba(110,90,220,0)');for(let i=0;i<7;i++){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:neb,blending:THREE.AdditiveBlending,depthWrite:false,opacity:.5}));s.scale.setScalar(80+Math.random()*60);s.position.set((Math.random()-.5)*160,(Math.random()-.5)*50-15,-70-Math.random()*50);S.add(s)}
const sun=new THREE.Mesh(new THREE.SphereGeometry(2.1,48,36),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(createSunTexture())}));S.add(sun);
[[11,'rgba(255,170,60,.65)'],[20,'rgba(255,120,40,.22)']].forEach(([sz,col])=>{const s=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex(col,'rgba(255,120,40,0)'),blending:THREE.AdditiveBlending,depthWrite:false}));s.scale.setScalar(sz);S.add(s)});
const ring=(r,op=.3)=>{const p=[];for(let i=0;i<=160;i++){const a=i/160*Math.PI*2;p.push(new THREE.Vector3(Math.cos(a)*r,0,Math.sin(a)*r))}const l=new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(p),new THREE.LineBasicMaterial({color:0xffffff,transparent:true,opacity:op}));S.add(l)};
const labels=[],objs={},orb=[];
function lab(text,cls,minD,cb,badge){const b=document.createElement('button');b.className='pl '+cls;b.innerHTML=`<span>${text}${badge?`<b class="bd">${badge}</b>`:''}</span>`;b.onclick=cb;box.appendChild(b);return{el:b,minD}}
const add=(id,o3,up,l)=>{objs[id]=o3;labels.push({o:o3,up,...l})};
BODIES.filter(b=>b.orbit).forEach((b,i)=>{ring(b.orbit);const g=new THREE.Group(),m=new THREE.Mesh(new THREE.SphereGeometry(b.size,40,30),new THREE.MeshLambertMaterial({map:new THREE.CanvasTexture(TEX[b.id]()),color:TINT[b.id]||0xffffff}));g.add(m);g.userData={a:-.3+(i%3-1)*.12,r:b.orbit,w:.9/Math.pow(b.orbit,1.5),m};S.add(g);orb.push(g);
if(b.id==='saturn'){const rg=new THREE.Mesh(new THREE.RingGeometry(b.size*1.3,b.size*2.1,64),new THREE.MeshBasicMaterial({color:0xd8c49a,transparent:true,opacity:.75,side:THREE.DoubleSide}));rg.rotation.x=-Math.PI/2+.45;g.add(rg)}
add(b.id,g,b.size*1.3,lab(`${b.emoji} ${b.name}`,'',60,()=>onPick({kind:'body',id:b.id}),b.missions.length||0))});
const earth=objs.earth,moonB=BODIES.find(b=>b.id==='moon');
const pivot=new THREE.Group();earth.add(pivot);const moon=new THREE.Mesh(new THREE.SphereGeometry(.13,24,18),new THREE.MeshLambertMaterial({map:new THREE.CanvasTexture(createMoonTexture())}));moon.position.set(.85,0,0);pivot.add(moon);add('moon',moon,.3,lab('🌙 Moon','',24,()=>onPick({kind:'body',id:'moon'}),moonB.missions.length));
const mk=(n,color)=>{const g=new THREE.Group(),m=missions.find(x=>x.n===n),h=new THREE.Mesh(new THREE.SphereGeometry(.16,16,12),new THREE.MeshBasicMaterial({color:new THREE.Color(m.c)})),r=new THREE.Mesh(new THREE.TorusGeometry(.27,.03,8,24),new THREE.MeshBasicMaterial({color:0xffffff}));r.rotation.x=Math.PI/2;g.add(h,r);g.userData.m=m;g.userData.ring=r;return g};
const webb=mk('WEBB');earth.add(webb);add('webb',webb,.35,lab('🔭 WEBB','robot',24,()=>onPick({kind:'mission',m:webb.userData.m})));
const parker=mk('PARKER');S.add(parker);parker.userData.a=0;add('parker',parker,.35,lab('☄️ PARKER','robot',24,()=>onPick({kind:'mission',m:parker.userData.m})));
const voy=mk('VOYAGER');voy.position.set(Math.cos(-.35)*29,0,Math.sin(-.35)*29);S.add(voy);add('voyager',voy,.4,lab('📡 VOYAGER 1','robot',200,()=>onPick({kind:'mission',m:voy.userData.m})));ring(29,.1);
add('sun',sun,2.4,lab('☀️ Sun','',200,()=>onPick({kind:'body',id:'sun'}),1));
let yaw=.55,el=.5,dist=14,td=14,fo=earth,tgt=new THREE.Vector3(),pts=new Map(),pd=0,raf,last=0;
const FD={sun:11,mercury:5,venus:6,earth:6,moon:3,mars:5,jupiter:8,saturn:9,uranus:6,neptune:6,voyager:9,webb:4,parker:5};
function focus(id){fo=objs[id]||earth;td=FD[id]||8}
function resize(){const w=box.clientWidth,h=box.clientHeight;if(!w)return;R.setPixelRatio(Math.min(devicePixelRatio,2));R.setSize(w,h,false);C.aspect=w/h;C.updateProjectionMatrix()}
const down=e=>{pts.set(e.pointerId,[e.clientX,e.clientY]);if(pts.size===2){const[a,b]=[...pts.values()];pd=Math.hypot(a[0]-b[0],a[1]-b[1])}},
up=e=>pts.delete(e.pointerId),
move=e=>{if(!pts.has(e.pointerId))return;const p=pts.get(e.pointerId);if(pts.size===1){yaw-=(e.clientX-p[0])*.006;el=Math.max(.12,Math.min(1.3,el+(e.clientY-p[1])*.004))}pts.set(e.pointerId,[e.clientX,e.clientY]);if(pts.size===2){const[a,b]=[...pts.values()],d=Math.hypot(a[0]-b[0],a[1]-b[1]);td=Math.max(3,Math.min(60,td*pd/d));pd=d}},
wheel=e=>{e.preventDefault();td=Math.max(3,Math.min(60,td*(1+e.deltaY*.001)))};
box.addEventListener('pointerdown',down);addEventListener('pointerup',up);addEventListener('pointermove',move);box.addEventListener('wheel',wheel,{passive:false});addEventListener('resize',resize);resize();
const v=new THREE.Vector3(),w3=new THREE.Vector3();
(function loop(t){raf=requestAnimationFrame(loop);const dt=Math.min(.05,(t-last)/1000||0);last=t;
orb.forEach(g=>{g.userData.a+=g.userData.w*dt*3;g.position.set(Math.cos(g.userData.a)*g.userData.r,0,Math.sin(g.userData.a)*g.userData.r);g.userData.m.rotation.y+=dt*.4});
pivot.rotation.y+=dt*.9;parker.userData.a+=dt*.7;parker.position.set(Math.cos(parker.userData.a)*3.4,0,Math.sin(parker.userData.a)*3.4);
w3.copy(earth.position).normalize();webb.position.copy(w3.multiplyScalar(1.1));[webb,parker,voy].forEach((g,i)=>{g.scale.setScalar(1+Math.sin(t*.004+i)*.15)});
sun.rotation.y+=dt*.05;stars.rotation.y+=dt*.002;if(!pts.size)yaw+=dt*.02;
fo.getWorldPosition(v);tgt.lerp(v,.07);dist+=(td-dist)*.07;
C.position.set(tgt.x+dist*Math.sin(yaw)*Math.cos(el),tgt.y+dist*Math.sin(el),tgt.z+dist*Math.cos(yaw)*Math.cos(el));C.lookAt(tgt);C.updateMatrixWorld();
const W=box.clientWidth,H=box.clientHeight;
labels.forEach(l=>{l.o.getWorldPosition(v);v.y+=l.up;const cd=C.position.distanceTo(v);v.project(C);const show=v.z<1&&dist<l.minD&&v.x>-1.1&&v.x<1.1&&v.y>-1.1&&v.y<1.1;l.el.style.opacity=show?1:0;l.el.style.pointerEvents=show?'auto':'none';l.el.style.transform=`translate(${(v.x*.5+.5)*W}px,${(-v.y*.5+.5)*H}px) translate(-50%,-100%)`;l.el.style.zIndex=1000-Math.round(cd)});
R.render(S,C)})(0);
return{focus,dispose(){cancelAnimationFrame(raf);box.removeEventListener('pointerdown',down);removeEventListener('pointerup',up);removeEventListener('pointermove',move);box.removeEventListener('wheel',wheel);removeEventListener('resize',resize);labels.forEach(l=>l.el.remove());R.dispose()}}}