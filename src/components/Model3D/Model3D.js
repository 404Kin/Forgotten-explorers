// "3D view" panel for any robot. One generic viewer: it reads models.config.js, so adding a robot never needs new code.
// Real NASA models load from public/models/ (lazy: three.js and the file are only fetched when the panel scrolls into view).
// Robots without a NASA model get a labelled artist model. If WebGL is missing or a file fails, the flat drawing is shown instead.
import './Model3D.css';
import {t,tx} from '../../i18n/index.js';
import {modelFor,PARTS,ROBOT_NOTE} from './models.config.js';
import {renderState} from '../StateView/StateView.js';

const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const base=()=>import.meta.env?.BASE_URL||'/';

/** HTML for the credit line. Real model = credit + source link. Artist model = the clear label. Pure, easy to test. */
export function creditHTML(model,note){
  if(!model)return '';
  if(model.kind==='artist')return `<p class="m3d-credit"><span class="m3d-badge m3d-artist">🎨 ${t('model.artist')}</span></p>`;
  return `<p class="m3d-credit"><span class="m3d-badge m3d-nasa">🛰 ${t('model.nasa')}</span> ${t('model.credit',{credit:esc(model.credit),title:esc(model.title)})} · `+
    `<a href="${esc(model.source)}" target="_blank" rel="noopener">${t('model.source')}</a>${note?`<span class="m3d-note">${t(note)}</span>`:''}</p>`;
}

export function mountModel3D(el,robot){
  const model=modelFor(robot.id);
  const parts=PARTS[robot.id]||[];
  let destroyed=false,api=null;
  el.innerHTML=`<section class="panel m3d" aria-labelledby="m3d-h"><h2 id="m3d-h"><span aria-hidden="true">🧊</span> ${t('model.title')}</h2>`+
    `<div class="m3d-stage" id="m3d-stage" tabindex="0" role="group" aria-label="${t('model.stageLabel',{name:esc(robot.n)})}"></div>`+
    `<div class="m3d-bar" role="group" aria-label="${t('model.controls')}"><button type="button" class="btn sm alt" data-a="left" aria-label="${t('model.rotateLeft')}">⟲</button>`+
      `<button type="button" class="btn sm alt" data-a="right" aria-label="${t('model.rotateRight')}">⟳</button><button type="button" class="btn sm alt" data-a="in" aria-label="${t('model.zoomIn')}">＋</button>`+
      `<button type="button" class="btn sm alt" data-a="out" aria-label="${t('model.zoomOut')}">－</button><button type="button" class="btn sm" data-a="reset">↺ ${t('model.reset')}</button>`+
      `<button type="button" class="btn sm alt" data-a="spin" aria-pressed="false">⏯ ${t('model.autoRotate')}</button></div>`+
    `<p class="m3d-help mono">${t('model.help')}</p>`+creditHTML(model,ROBOT_NOTE[robot.id]||model?.noteKey)+
    (parts.length?`<ul class="m3d-parts" aria-label="${t('model.parts')}">${parts.map(p=>`<li><b>${esc(tx(`model.part.${robot.id}.${p.label}.label`,p.label))}</b> ${esc(tx(`model.part.${robot.id}.${p.label}.text`,p.text))}</li>`).join('')}</ul>`:'')+
    `</section>`;
  const stage=el.querySelector('#m3d-stage'),bar=el.querySelector('.m3d-bar');

  // The flat drawing: used while nothing 3D is possible (no model, no WebGL, file error).
  const fallback=(msgKey)=>{bar.hidden=true;stage.innerHTML=`<div class="m3d-flat" style="background:${robot.c}"><svg viewBox="0 0 200 200" role="img" aria-label="${esc(robot.n)}">${robot.ch()}</svg></div><p class="m3d-err">${t(msgKey)}</p>`};
  if(!model){fallback('model.none');return{destroy(){}}}

  async function start(){
    renderState(stage,'loading',{compact:true,messageKey:'model.loading'});
    try{
      const [THREE,{GLTFLoader},{OrbitControls},{MeshoptDecoder}]=await Promise.all([import('three'),import('three/addons/loaders/GLTFLoader.js'),import('three/addons/controls/OrbitControls.js'),import('three/addons/libs/meshopt_decoder.module.js')]);
      if(destroyed)return;
      let object;
      if(model.kind==='nasa'){
        const loader=new GLTFLoader();loader.setMeshoptDecoder(MeshoptDecoder);
        const gltf=await loader.loadAsync(`${base()}models/${model.file}`);object=gltf.scene;
      }else{const {makeArtistModel}=await import('./artist.js');object=makeArtistModel(THREE,model.builder)}
      if(destroyed)return;
      stage.innerHTML='';
      const canvas=document.createElement('canvas');canvas.setAttribute('role','img');canvas.setAttribute('aria-label',t('model.canvas',{name:robot.n}));stage.appendChild(canvas);
      const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});
      renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));
      const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(model.camera.fov,1,.01,100);
      const key=new THREE.DirectionalLight(0xffffff,2.2),fill=new THREE.DirectionalLight(0x9bb0ff,.8);key.position.set(3,5,4);fill.position.set(-4,2,-3);
      scene.add(new THREE.AmbientLight(0xffffff,1.1),key,fill);
      // Fit ANY model into the same view: centre it and scale its biggest side to about 2 units, then apply the config scale.
      const box=new THREE.Box3().setFromObject(object),size=box.getSize(new THREE.Vector3()),centre=box.getCenter(new THREE.Vector3());
      const fit=2/Math.max(size.x,size.y,size.z,.0001)*(model.scale||1);
      object.position.sub(centre);const holder=new THREE.Group();holder.add(object);holder.scale.setScalar(fit);scene.add(holder);
      const home={d:model.camera.dist*1.35,h:model.camera.height};
      camera.position.set(home.d*.7,home.h+.4,home.d);const controls=new OrbitControls(camera,canvas);
      controls.enableDamping=!reduced();controls.minDistance=1.2;controls.maxDistance=8;controls.autoRotate=false;controls.autoRotateSpeed=1.2;
      // Auto-rotate is OFF when the player prefers reduced motion (and the toggle button starts un-pressed).
      const spinBtn=bar.querySelector('[data-a=spin]');const setSpin=on=>{controls.autoRotate=on;spinBtn.setAttribute('aria-pressed',String(on))};
      setSpin(!reduced());
      controls.addEventListener('start',()=>setSpin(false));
      const resize=()=>{const w=stage.clientWidth,h=stage.clientHeight||320;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()};
      resize();const ro=new ResizeObserver(resize);ro.observe(stage);
      const reset=()=>{camera.position.set(home.d*.7,home.h+.4,home.d);controls.target.set(0,0,0);controls.update()};
      const rotate=a=>{const off=camera.position.clone().sub(controls.target),c=Math.cos(a),s=Math.sin(a);camera.position.set(controls.target.x+off.x*c+off.z*s,camera.position.y,controls.target.z-off.x*s+off.z*c);controls.update()};
      const zoom=f=>{const off=camera.position.clone().sub(controls.target).multiplyScalar(f);camera.position.copy(controls.target).add(off);controls.update()};
      const act={left:()=>rotate(.3),right:()=>rotate(-.3),in:()=>zoom(.85),out:()=>zoom(1.18),reset,spin:()=>setSpin(!controls.autoRotate)};
      bar.onclick=e=>{const b=e.target.closest('[data-a]');if(!b)return;if(b.dataset.a!=='spin')setSpin(false);act[b.dataset.a]()};
      // Keyboard: arrows rotate, + and - zoom, 0 resets. Works when the stage has focus.
      stage.onkeydown=e=>{const k={ArrowLeft:'left',ArrowRight:'right','+':'in','=':'in','-':'out','0':'reset'}[e.key];if(!k)return;e.preventDefault();setSpin(false);act[k]()};
      let raf=0;const loop=()=>{raf=requestAnimationFrame(loop);controls.update();renderer.render(scene,camera)};loop();
      api={destroy(){cancelAnimationFrame(raf);ro.disconnect();controls.dispose();renderer.dispose();
        scene.traverse(o=>{o.geometry?.dispose();const m=o.material;(Array.isArray(m)?m:[m]).forEach(x=>{if(!x)return;for(const k in x)x[k]?.isTexture&&x[k].dispose();x.dispose?.()})})}};
    }catch(err){
      if(destroyed)return;
      console.warn('[Model3D]',err);
      // WebGL missing, or the file could not be loaded: keep the page useful with the flat drawing and an honest message.
      fallback(/webgl/i.test(String(err?.message))?'state.webgl':'model.loadError');
    }
  }
  // Lazy: nothing heavy is fetched until the panel is near the screen.
  const io=typeof IntersectionObserver!=='undefined'?new IntersectionObserver(es=>{if(es.some(e=>e.isIntersecting)){io.disconnect();start()}},{rootMargin:'0px'}):null;
  if(io)io.observe(stage);else start();
  return{destroy(){destroyed=true;io?.disconnect();api?.destroy()}};
}
