// 3D map of a world. Moon/Mars = globes with pins at REAL landing coordinates (relics.json).
// Deep space = a (not to scale) solar-system map. Names are HTML buttons that follow the pins.
import * as THREE from 'three';
import {inkFor} from '../components/contrast.js';
import {loadMapTexture} from './mapTextures.js';
import {createMoonTexture,createMarsTexture,createSunTexture,createEarthTexture} from '../utils/textureGenerator.js';
const latlon=(lat,lon,r)=>{const a=lat*Math.PI/180,b=lon*Math.PI/180;return new THREE.Vector3(r*Math.cos(a)*Math.cos(b),r*Math.sin(a),-r*Math.cos(a)*Math.sin(b))};
// onCredit({credit,url}) when a real map replaced the generated one; onCredit(null) when we stay on the generated texture.
export function createWorldMap(box,canvas,world,missions,onOpen,{onCredit}={}){let disposed=false;
const R=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true}),S=new THREE.Scene(),C=new THREE.PerspectiveCamera(40,1,.1,100);C.position.set(0,0,world==='deep'?12:6.4);
S.add(new THREE.AmbientLight(0xffffff,.85));const L=new THREE.DirectionalLight(0xffffff,.7);L.position.set(3,4,6);S.add(L);
const sp=[];for(let i=0;i<500;i++){const v=new THREE.Vector3().randomDirection().multiplyScalar(40+Math.random()*10);sp.push(v.x,v.y,v.z)}const sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.Float32BufferAttribute(sp,3));S.add(new THREE.Points(sg,new THREE.PointsMaterial({color:0xffffff,size:.25})));
const G=new THREE.Group();S.add(G);const marks=[];let rotX=0,rotY=0,drag=false,lx=0,ly=0,raf;const globe=world!=='deep';
const ball=(r,tex,basic)=>new THREE.Mesh(new THREE.SphereGeometry(r,48,36),basic?new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(tex)}):new THREE.MeshLambertMaterial({map:new THREE.CanvasTexture(tex)}));
function mark(m,pos,pole){const g=new THREE.Group();g.position.copy(pos);const head=new THREE.Mesh(new THREE.SphereGeometry(.13,16,16),new THREE.MeshBasicMaterial({color:new THREE.Color(m.c)})),ring=new THREE.Mesh(new THREE.TorusGeometry(.22,.035,8,24),new THREE.MeshBasicMaterial({color:0xffffff}));
if(pole){const n=pos.clone().normalize();head.position.copy(n.clone().multiplyScalar(.4));ring.position.copy(head.position);ring.lookAt(pos.clone().multiplyScalar(3));const st=new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,.4,6),new THREE.MeshBasicMaterial({color:0xffffff}));st.position.copy(n.clone().multiplyScalar(.2));st.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),n);g.add(st)}
g.add(head,ring);G.add(g);const el=document.createElement('button');el.className='ml';el.textContent=m.n;el.style.background=m.c;el.style.color=inkFor(m.c,m.k);el.onclick=()=>onOpen(m);box.appendChild(el);marks.push({g,head,el})}
let globeMesh;
if(globe){globeMesh=ball(2,(world==='moon'?createMoonTexture:createMarsTexture)());G.add(globeMesh,new THREE.Mesh(new THREE.SphereGeometry(2.07,48,36),new THREE.MeshBasicMaterial({color:0x14122b,side:THREE.BackSide})));
missions.forEach(m=>mark(m,latlon(m.real.lat,m.real.lon,2),true));const f=missions[0].real;rotY=-Math.PI/2-f.lon*Math.PI/180;rotX=Math.max(-.6,Math.min(.6,f.lat*Math.PI/180*.6))}
else{G.add(ball(.7,createSunTexture(),true));[1.3,3.2,6.4].forEach(r=>{const m=new THREE.Mesh(new THREE.RingGeometry(r-.02,r+.02,96),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.25,side:THREE.DoubleSide}));m.rotation.x=Math.PI/2;G.add(m)});
const e=ball(.28,createEarthTexture());e.position.set(3.2,0,0);G.add(e);const P={PARKER:[1.3,.1,0],WEBB:[3.75,.15,0],VOYAGER:[0,.5,-6.4]};missions.forEach(m=>mark(m,new THREE.Vector3(...P[m.n]),false));rotY=-.5;rotX=.45}
function resize(){const w=box.clientWidth,h=box.clientHeight;if(!w)return;R.setPixelRatio(Math.min(devicePixelRatio,2));R.setSize(w,h,false);C.aspect=w/h;C.updateProjectionMatrix()}
const down=e=>{drag=true;lx=e.clientX;ly=e.clientY},up=()=>drag=false,move=e=>{if(!drag)return;rotY+=(e.clientX-lx)*.008;rotX=Math.max(-1.1,Math.min(1.1,rotX+(e.clientY-ly)*.006));lx=e.clientX;ly=e.clientY};
box.addEventListener('pointerdown',down);addEventListener('pointerup',up);addEventListener('pointermove',move);addEventListener('resize',resize);resize();
const calm=matchMedia('(prefers-reduced-motion: reduce)').matches; // no auto-spin for people who asked for less motion
const v=new THREE.Vector3();(function loop(t){raf=requestAnimationFrame(loop);if(!drag&&!calm)rotY+=.0025;G.rotation.set(rotX,rotY,0);const w=box.clientWidth,h=box.clientHeight;
marks.forEach((m,i)=>{m.head.scale.setScalar(1+Math.sin(t*.004+i)*.12);m.g.getWorldPosition(v);const vis=globe?v.z>.5:true;v.project(C);m.el.style.transform=`translate(${(v.x*.5+.5)*w}px,${(-v.y*.5+.5)*h}px) translate(-50%,-150%)`;m.el.style.opacity=vis?1:0;m.el.style.pointerEvents=vis?'auto':'none'});R.render(S,C)})(0);
// The generated globe shows at once; the real picture is fetched after, and swapped in only if it loads.
if(globe)loadMapTexture(THREE,world).then(r=>{
if(disposed)return;if(!r){onCredit?.(null);return}
globeMesh.material.map?.dispose();globeMesh.material.map=r.texture;globeMesh.material.needsUpdate=true;onCredit?.({credit:r.credit,url:r.url})});
return{dispose(){disposed=true;cancelAnimationFrame(raf);box.removeEventListener('pointerdown',down);removeEventListener('pointerup',up);removeEventListener('pointermove',move);removeEventListener('resize',resize);marks.forEach(m=>m.el.remove());R.dispose()}}}
