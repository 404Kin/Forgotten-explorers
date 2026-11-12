// The texture generators in utils/textureGenerator.js return finished THREE textures, but some local helpers return raw canvases.
// Wrapping a texture in CanvasTexture again gives an invalid image: the planet renders pure black (the bug on the map).
// This accepts either and always returns a usable texture.
import * as THREE from 'three';
export const asTexture=src=>{
  const t=src?.isTexture?src:new THREE.CanvasTexture(src);
  t.colorSpace=THREE.SRGBColorSpace;t.needsUpdate=true;return t;
};
