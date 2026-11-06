// `npm run mock`: runs the real server on FAKE placeholder robots so the frontend can start before P1's real data lands.
import {fileURLToPath} from 'node:url';
if(process.env.NODE_ENV==='production')throw new Error('Refusing to run placeholder fixtures in production');
process.env.ROBOTS_DIR=fileURLToPath(new URL('../test/fixtures/robots/',import.meta.url));
process.env.I18N_DIR=fileURLToPath(new URL('../test/fixtures/i18n/',import.meta.url));
process.env.SOURCE_HOSTS=process.env.SOURCE_HOSTS||'nasa.gov,isro.gov.in';
console.log('*** MOCK MODE: placeholder robots only. None of this data is real. ***');
await import('../src/index.js');
