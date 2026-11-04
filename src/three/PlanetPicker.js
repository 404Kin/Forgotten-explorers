// Three cute toon planets (Moon, Mars, Deep space). Tap one -> onPick(worldKey).
import * as THREE from 'three';
const PL=[['moon',0xd5d5e6,'Moon'],['mars',0xe0674a,'Mars'],['deep',0x7a5cff,'Deep space']];
export function createPlanetPicker(canvas,labels,onPick){
const r=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true}),s=new THREE.Scene(),c=new THREE.PerspectiveCamera(40,3,.1,50);c.position.set(0,0,8.5);
s.add(new THREE.AmbientLight(0xffffff,.75));const L=new THREE.DirectionalLight(0xffffff,.7);L.position.set(3,4,6);s.add(L);
const gm=new THREE.DataTexture(new Uint8Array([90,175,255]),3,1,THREE.RedFormat);gm.minFilter=gm.magFilter=THREE.NearestFilter;gm.needsUpdate=true;
const mat=col=>new THREE.MeshToonMaterial({color:col,gradientMap:gm}),ink=new THREE.MeshBasicMaterial({color:0x14122b,side:THREE.BackSide}),B=c=>new THREE.MeshBasicMaterial({color:c});
const gs=[];PL.forEach(([k,col],i)=>{const g=new THREE.Group();g.add(new THREE.Mesh(new THREE.SphereGeometry(1,32,32),mat(col)),new THREE.Mesh(new THREE.SphereGeometry(1.07,32,32),ink));
if(k==='deep'){const rg=new THREE.Mesh(new THREE.TorusGeometry(1.55,.09,8,48),B(0xffd34e));rg.rotation.x=1.2;g.add(rg)}
if(k==='moon')[[.5,.5,.7,.22],[-.55,-.35,.75,.16]].forEach(([x,y,z,q])=>{const cr=new THREE.Mesh(new THREE.SphereGeometry(q,12,12),mat(0xaeaec8));cr.position.set(x,y,z).normalize().multiplyScalar(.97);cr.scale.z=.35;cr.lookAt(0,0,0);cr.rotateY(Math.PI);g.add(cr)});
[-1,1].forEach(m=>{const e=new THREE.Mesh(new THREE.SphereGeometry(.2,12,12),B(0xffffff)),p=new THREE.Mesh(new THREE.SphereGeometry(.11,10,10),B(0x14122b)),ch=new THREE.Mesh(new THREE.SphereGeometry(.12,8,8),B(0xff8fa3));e.position.set(m*.32,.15,.9);p.position.set(m*.32,.13,1.06);ch.position.set(m*.55,-.12,.82);ch.scale.z=.3;g.add(e,p,ch)});
const sm=new THREE.Mesh(new THREE.TorusGeometry(.14,.035,6,12,Math.PI),B(0x14122b));sm.rotation.z=Math.PI;sm.position.set(0,-.08,1.0);g.add(sm);
g.position.x=(i-1)*3.3;g.userData={k,i};s.add(g);gs.push(g)});
function resize(){const w=canvas.clientWidth,h=canvas.clientHeight;if(!w)return;r.setPixelRatio(Math.min(devicePixelRatio,2));r.setSize(w,h,false);c.aspect=w/h;c.updateProjectionMatrix();const vw=2*8.5*Math.tan(20*Math.PI/180)*c.aspect;labels.forEach((n,i)=>{n.textContent=PL[i][2];n.style.left=(50+(i-1)*3.3/vw*100)+'%'})}
addEventListener('resize',resize);resize();
const ray=new THREE.Raycaster(),mv=new THREE.Vector2();
const up=e=>{const b=canvas.getBoundingClientRect();mv.set((e.clientX-b.left)/b.width*2-1,-(e.clientY-b.top)/b.height*2+1);ray.setFromCamera(mv,c);const h=ray.intersectObjects(gs,true)[0];if(h){let o=h.object;while(!o.userData.k)o=o.parent;onPick(o.userData.k)}};canvas.addEventListener('pointerup',up);
let raf,clk=new THREE.Clock();(function loop(){raf=requestAnimationFrame(loop);const t=clk.getElapsedTime();gs.forEach(g=>{g.position.y=Math.sin(t*1.6+g.userData.i*2)*.18;g.rotation.y=Math.sin(t*.8+g.userData.i)*.25});r.render(s,c)})();
return{dispose(){cancelAnimationFrame(raf);removeEventListener('resize',resize);canvas.removeEventListener('pointerup',up);r.dispose()}}}
