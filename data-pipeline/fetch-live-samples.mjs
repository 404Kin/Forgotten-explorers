import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), 'samples');
await mkdir(join(root, 'horizons-lookups'), { recursive: true });
await mkdir(join(root, 'horizons-sample-responses'), { recursive: true });

async function save(url, path) {
  const response = await fetch(url, { headers: { 'user-agent': 'ForgottenExplorers-research/1.0' } });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText} for ${url}`);
  const body = await response.text();
  await writeFile(path, body, 'utf8');
  return body;
}

for (const [label, term] of [['voyager-1', 'Voyager 1'], ['parker-solar-probe', 'Parker Solar Probe'], ['jwst', 'James Webb Space Telescope']]) {
  const url = new URL('https://ssd.jpl.nasa.gov/api/horizons_lookup.api');
  url.searchParams.set('sstr', term);
  url.searchParams.set('group', 'sct');
  const body = await save(url, join(root, 'horizons-lookups', `${label}.json`));
  const parsed = JSON.parse(body);
  console.log(`LOOKUP ${label}: ${JSON.stringify(parsed.result ?? parsed)}\n`);
}

for (const [label, command] of [['moon', '301'], ['mars', '499'], ['voyager-1', '-31'], ['parker-solar-probe', '-96'], ['jwst', '-170']]) {
  const url = new URL('https://ssd.jpl.nasa.gov/api/horizons.api');
  for (const [key, value] of Object.entries({
    format: 'json', COMMAND: command, OBJ_DATA: 'NO', MAKE_EPHEM: 'YES',
    EPHEM_TYPE: 'OBSERVER', CENTER: '500@399', START_TIME: '2026-11-11',
    STOP_TIME: '2026-11-12', STEP_SIZE: '1 d', QUANTITIES: '20,21'
  })) url.searchParams.set(key, value);
  const body = await save(url, join(root, 'horizons-sample-responses', `${label}.json`));
  console.log(`EPHEMERIS ${label}: saved ${body.length} bytes`);
}

const dsnXml = await save('https://eyes.nasa.gov/dsn/data/dsn.xml', join(root, 'dsn-sample.xml'));
console.log(`DSN feed: saved ${dsnXml.length} bytes`);

const imageQueries = [
  ['apollo-11-descent-stage', 'Apollo 11 lunar surface lunar module'],
  ['apollo-12-descent-stage', 'Apollo 12 lunar surface'],
  ['apollo-14-descent-stage', 'Apollo 14 lunar surface'],
  ['apollo-15-descent-stage', 'Apollo 15 lunar surface'],
  ['apollo-16-descent-stage', 'Apollo 16 lunar surface'],
  ['apollo-17-descent-stage', 'Apollo 17 lunar surface'],
  ['apollo-15-rover', 'Apollo 15 rover Moon'],
  ['apollo-16-rover', 'Apollo 16 rover Moon'],
  ['apollo-17-rover', 'Apollo 17 rover Moon'],
  ['surveyor-3', 'Surveyor 3 lunar lander Apollo 12 NASA'],
  ['sojourner', 'Sojourner Mars rover NASA Pathfinder'],
  ['viking-1-lander', 'Viking 1 lander Mars surface NASA'],
  ['viking-2-lander', 'Viking 2 lander Mars surface NASA'],
  ['spirit', 'Spirit rover Mars NASA'],
  ['opportunity', 'Opportunity rover Mars NASA'],
  ['phoenix', 'Phoenix Mars lander NASA'],
  ['insight', 'InSight Mars lander NASA'],
  ['ingenuity', 'Ingenuity Mars helicopter final flight NASA'],
  ['chandrayaan-3-vikram', 'Chandrayaan 3 Vikram lunar surface'],
  ['curiosity', 'Curiosity Mars rover NASA'],
  ['perseverance', 'Perseverance Mars rover NASA'],
  ['jwst', 'James Webb Space Telescope NASA'],
  ['parker-solar-probe', 'Parker Solar Probe NASA'],
  ['voyager-1', 'Voyager 1 spacecraft NASA']
];
const images = [];
for (const [id, query] of imageQueries) {
  const url = new URL('https://images-api.nasa.gov/search');
  url.searchParams.set('q', query);
  url.searchParams.set('media_type', 'image');
  url.searchParams.set('page_size', '10');
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status} ${response.statusText} for ${url}`);
  const payload = await response.json();
  const items = payload.collection?.items ?? [];
  images.push({ id, query, results: items.map(item => item.data?.[0]).filter(Boolean).slice(0, 8) });
  console.log(`IMAGES ${id}: ${items.slice(0, 4).map(item => `${item.data?.[0]?.nasa_id}=${item.data?.[0]?.title}`).join(' | ')}`);
}
await writeFile(join(root, 'nasa-image-search-audit.json'), JSON.stringify(images, null, 2), 'utf8');
