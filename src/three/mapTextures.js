// Real Moon/Mars map pictures, lazy loaded. The picture files and their credits belong to P1 (public/images/maps/),
// described by public/images/maps/manifest.json:
//   { "moon": { "file":"moon.jpg", "credit":"NASA/GSFC/Arizona State University", "url":"https://...", "lonOffset":0 }, "mars": {...} }
// lonOffset (degrees) turns maps that start at 0 degrees east instead of -180. No manifest, or a missing/broken file = null,
// and the caller keeps its generated texture. We never show a real map without a credit from the manifest.
const base=()=>import.meta.env?.BASE_URL||'/';
const MANIFEST_URL='images/maps/manifest.json';

let manifest;
async function loadManifest(){
  if(manifest!==undefined)return manifest;
  try{
    const r=await fetch(base()+MANIFEST_URL);
    // Vite and some hosts answer a missing file with 200 + an HTML page, so check the type too.
    manifest=r.ok&&(r.headers.get('content-type')||'').includes('json')?await r.json():null;
  }catch{manifest=null}
  return manifest;
}

/** @returns {Promise<{texture, credit:string, url?:string}|null>} */
export async function loadMapTexture(THREE,world){
  const entry=(await loadManifest())?.[world];
  if(!entry?.file||!entry.credit)return null;
  return new Promise(resolve=>{
    new THREE.TextureLoader().load(base()+'images/maps/'+entry.file,tex=>{
      tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=4;
      if(entry.lonOffset){tex.wrapS=THREE.RepeatWrapping;tex.offset.x=entry.lonOffset/360}
      resolve({texture:tex,credit:entry.credit,url:entry.url});
    },undefined,()=>resolve(null));
  });
}
