import sharp from 'sharp';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// NASA Trek global tile matrix at zoom 2 is 8 columns x 4 rows (256 px/tile).
// Re-run with: npm --prefix data-pipeline install && node data-pipeline/build-maps.mjs
const root = dirname(fileURLToPath(import.meta.url));
const outDir = join(root, '..', 'public', 'images', 'maps');
const tileDir = join(root, 'samples', 'map-tiles');
const size = 256;
const maps = [
  {
    slug: 'moon',
    layer: 'LRO_WAC_Mosaic_Global_303ppd_v02',
    base: 'https://trek.nasa.gov/tiles/Moon/EQ/LRO_WAC_Mosaic_Global_303ppd_v02/1.0.0/default/default028mm',
  },
  {
    slug: 'mars',
    layer: 'Mars_Viking_MDIM21_ClrMosaic_global_232m',
    base: 'https://trek.nasa.gov/tiles/Mars/EQ/Mars_Viking_MDIM21_ClrMosaic_global_232m/1.0.0/default/default028mm',
  },
];

await mkdir(outDir, { recursive: true });
await mkdir(tileDir, { recursive: true });
for (const map of maps) {
  const parts = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 8; col++) {
      const file = join(tileDir, `${map.slug}-z2-${row}-${col}.jpg`);
      try {
        await readFile(file);
      } catch {
        const response = await fetch(`${map.base}/2/${row}/${col}.jpg`);
        if (!response.ok) throw new Error(`${map.slug}: tile ${row}/${col} returned ${response.status}`);
        await writeFile(file, Buffer.from(await response.arrayBuffer()));
      }
      parts.push({ input: await readFile(file), left: col * size, top: row * size });
    }
  }
  const image = sharp({ create: { width: 2048, height: 1024, channels: 3, background: '#000' } }).composite(parts);
  await image.clone().resize(2048, 1024).webp({ quality: 78, effort: 6 }).toFile(join(outDir, `${map.slug}-2048.webp`));
  await image.clone().resize(1024, 512).webp({ quality: 78, effort: 6 }).toFile(join(outDir, `${map.slug}-1024.webp`));
  console.log(`Built ${map.slug}: ${parts.length} NASA Trek tiles -> 2048x1024 and 1024x512 WebP`);
}
