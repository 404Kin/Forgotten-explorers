/**
 * ModelViewer – reusable Three.js GLB model viewer for Forgotten Explorers.
 * Loads .glb files from src/image/ using GLTFLoader and renders with OrbitControls.
 */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/**
 * Returns the HTML string for the model viewer container.
 * @param {string} missionId - The mission slug ID
 */
export function modelViewerHTML(missionId) {
  return `<div class="model-viewer" id="mv-${missionId}"><div class="model-spinner"><div class="spinner"></div><p>Loading 3D model…</p></div></div>`;
}

/**
 * Initialises the 3D viewer inside the given container element.
 * @param {HTMLElement} container - The .model-viewer div
 * @param {string} glbPath - Path to the .glb file (e.g. '/src/image/curiosity-msl.glb')
 * @param {string} fallbackSVG - SVG markup string to show if the GLB fails to load
 * @param {string} heroColor - Mission accent color (hex) for fallback background
 * @returns {{ destroy: () => void }}
 */
export function createModelViewer(container, glbPath, fallbackSVG, heroColor) {
  let disposed = false;
  let animId = null;

  const width = container.clientWidth;
  const height = container.clientHeight || 320;

  // --- Renderer ---
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  // --- Scene ---
  const scene = new THREE.Scene();

  // --- Camera ---
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000);
  camera.position.set(0, 0.5, 3);

  // --- Lights ---
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
  dirLight1.position.set(3, 5, 4);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0x8888ff, 0.5);
  dirLight2.position.set(-3, -2, -3);
  scene.add(dirLight2);

  // --- Controls ---
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 2;
  controls.enablePan = false;
  controls.minDistance = 0.5;
  controls.maxDistance = 20;

  // --- Resize handler ---
  function onResize() {
    if (disposed) return;
    const w = container.clientWidth;
    const h = container.clientHeight || 320;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', onResize);

  // --- Animation loop ---
  function animate() {
    if (disposed) return;
    animId = requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }

  // --- Show fallback ---
  function showFallback() {
    const spinner = container.querySelector('.model-spinner');
    if (spinner) spinner.remove();

    container.innerHTML = `<div class="model-fallback" style="background:${heroColor || '#1a1745'}33">${fallbackSVG || ''}<p>3D model not available. Place the .glb file in src/image/ to see it here.</p></div>`;
  }

  // --- Load GLB ---
  const loader = new GLTFLoader();
  function loadGLB(path) {
    loader.load(
      path,
      (gltf) => {
        if (disposed) return;

        const model = gltf.scene;

        // Center and scale model to fit
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.0 / (maxDim || 1);

        model.position.sub(center);
        model.scale.setScalar(scale);

        scene.add(model);

        // Adjust camera
        const scaledSize = maxDim * scale;
        const dist = scaledSize / (2 * Math.tan((camera.fov * Math.PI) / 360));
        camera.position.set(0, scaledSize * 0.3, dist * 1.4);
        controls.target.set(0, 0, 0);
        controls.minDistance = dist * 0.3;
        controls.maxDistance = dist * 4;
        controls.update();

        // Remove spinner and attach canvas
        const spinner = container.querySelector('.model-spinner');
        if (spinner) spinner.remove();
        container.appendChild(renderer.domElement);

        // Start rendering
        animate();
      },
      undefined,
      (_err) => {
        if (disposed) return;
        if (path.startsWith('/src/image/')) {
          loadGLB(path.replace('/src/image/', '/models/'));
        } else {
          showFallback();
        }
      }
    );
  }
  loadGLB(glbPath);

  // --- Cleanup ---
  function destroy() {
    disposed = true;
    if (animId) cancelAnimationFrame(animId);
    window.removeEventListener('resize', onResize);
    controls.dispose();

    // Traverse and dispose all geometries, materials, textures
    scene.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        for (const mat of mats) {
          for (const key of Object.keys(mat)) {
            const val = mat[key];
            if (val && typeof val.dispose === 'function') val.dispose();
          }
          mat.dispose();
        }
      }
    });

    renderer.dispose();

    // Remove the canvas from DOM
    const canvas = container.querySelector('canvas');
    if (canvas) canvas.remove();
  }

  return { destroy };
}
