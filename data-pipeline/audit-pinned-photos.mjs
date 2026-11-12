import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const records = JSON.parse(await readFile(join(here, '..', 'src', 'data', 'robotRecords.json'), 'utf8'));
const audit = [];
for (const record of records) {
  const endpoint = new URL('https://images-api.nasa.gov/search');
  endpoint.searchParams.set('nasa_id', record.photo.nasaId);
  endpoint.searchParams.set('media_type', 'image');
  const response = await fetch(endpoint);
  if (!response.ok) throw new Error(`${record.id}: NASA Image API returned ${response.status}`);
  const body = await response.json();
  const item = body.collection?.items?.[0];
  const metadata = item?.data?.[0];
  audit.push({
    id: record.id,
    nasaId: record.photo.nasaId,
    found: Boolean(metadata),
    title: metadata?.title ?? null,
    description: metadata?.description ?? null,
    center: metadata?.center ?? null,
    dateCreated: metadata?.date_created ?? null,
    pageUrl: `https://images.nasa.gov/details/${record.photo.nasaId}`,
    photographer: metadata?.photographer ?? null,
    keywords: metadata?.keywords ?? [],
  });
}
await writeFile(join(here, 'samples', 'pinned-photo-audit.json'), `${JSON.stringify(audit, null, 2)}\n`);
for (const item of audit) console.log(`${item.id}\t${item.nasaId}\t${item.found ? 'FOUND' : 'MISSING'}\t${item.title ?? ''}`);
