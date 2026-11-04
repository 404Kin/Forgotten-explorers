import {defineConfig} from 'vite';
// base './' lets the built site run from any folder (GitHub Pages, Netlify, school server).
export default defineConfig({base:'./',build:{chunkSizeWarningLimit:900}});
