import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const records = JSON.parse(await readFile(join(root, 'src/data/robotRecords.json'), 'utf8'));
const why = JSON.parse(await readFile(join(root, 'src/data/whyLeft.json'), 'utf8'));
const links = urls => [...new Set(urls)].map(url => `[${new URL(url).hostname}](${url})`).join('<br>');

const recordRows = records.map(r => `| \`${r.id}\` | ${links([...r.sources, r.photo.pageUrl])} |`).join('\n');
const whyRows = why.sections.map(s => `| \`${s.id}\` | ${links(s.sources)} |`).join('\n');
const doc = `# References, licenses, and credits

This list covers external sources cited by the structured robot records and the shared “Why did we leave it there?” content, plus the direct dependencies, runtime fonts, and media assets the repository uses. NASA sources are NASA data unless a row explicitly identifies another provider. ISRO mission facts are other-agency data and remain credited to ISRO in the Vikram record.

## Robot records and photo pages

Every URL in each record's `sources[]` and its `photo.pageUrl` is listed below. The photo credit is stored beside the URL in `src/data/robotRecords.json`; verify the particular page for third-party restrictions before publishing.

| Record | Source URLs |
|---|---|
${recordRows}

## Shared “Why” content

| Section | Source URLs |
|---|---|
${whyRows}

## APIs, datasets, and policy pages

| Source | URL | Use / rights note |
|---|---|---|
| NASA Image and Video Library API | [images-api.nasa.gov](https://images-api.nasa.gov) | Search endpoint for the current gallery and metadata audit. Media rights and credits vary by item; see NASA guidance below. |
| NASA Image and Video Library | [images.nasa.gov](https://images.nasa.gov/) | Image detail pages and remote image assets; use the page's displayed credit. |
| NASA media-use guidance | [NASA Images and Media Usage Guidelines](https://www.nasa.gov/nasa-brand-center/images-and-media/) | NASA media is generally available for educational/informational use in the U.S.; credit NASA, avoid endorsement, and check for third-party material. NASA insignia/logos are not public-domain assets. |
| JPL Horizons API | [API](https://ssd.jpl.nasa.gov/api/horizons.api) · [API documentation](https://ssd-api.jpl.nasa.gov/doc/horizons.html) · [Lookup API](https://ssd-api.jpl.nasa.gov/doc/horizons_lookup.html) · [manual](https://ssd.jpl.nasa.gov/horizons/manual.html) | Target lookup and dated ephemeris fixtures in `data-pipeline/samples/`; live server endpoint when P2 configures target mappings. JPL/NASA data, with query dates and target IDs retained in the fixture files. |
| NASA DSN Now | [Live status page](https://eyes.nasa.gov/apps/dsn-now/) · [JSON feed](https://eyes.nasa.gov/dsn/data/dsn.json) · [captured XML sample](https://eyes.nasa.gov/dsn/data/dsn.xml) | Live signal links and a research snapshot. Runtime uses JSON; XML is only a saved sample. NASA source, time-sensitive. |
| NASA Moon Trek / LRO WAC | [Moon Trek](https://trek.nasa.gov/moon/) · [tile service guide](https://trek.nasa.gov/tiles/apidoc/trekAPI.html?body=moon) · [LROC terms](https://www.lroc.im-ldi.com/about/terms) | Source for the derived local Moon texture. NASA/GSFC/Arizona State University credit; educational-use citation guidance at LROC. |
| NASA Mars Trek / Viking VIS | [Mars Trek](https://trek.nasa.gov/mars/) · [tile service guide](https://trek.nasa.gov/tiles/apidoc/trekAPI.html?body=mars) · [USGS mosaic record](https://astrogeology.usgs.gov/search/map/mars_viking_colorized_global_mosaic_232m) | Source for the derived local Mars texture. Viking imagery with NASA/JPL/USGS processing; see `public/images/maps/CREDITS.md`. |
| NSSDCA / NASA mission archive | [NSSDCA planetary lunar pages](https://nssdc.gsfc.nasa.gov/planetary/) · [NASA mission index](https://science.nasa.gov/missions/) | Official records cited by robot entries; record-specific URLs appear in the first table. NASA data. |
| NASA LRO image of Vikram | [NASA article](https://www.nasa.gov/image-article/nasas-lro-observes-chandrayaan-3-landing-site/) | NASA LRO image and NASA/GSFC/Arizona State University credit; separate NASA source from ISRO's mission data. |
| ISRO Chandrayaan-3 | [mission page](https://www.isro.gov.in/ISRO_EN/Chandrayaan3.html) · [APXS landing-site paper](https://www.isro.gov.in/media_isro/pdf/APXS_CH3.pdf) | Official non-NASA mission data for Vikram, labeled ISRO in the record. No ISRO image asset is used. No image-reuse license is claimed. |
| NASA solar-system facts | [NASA Solar System Facts](https://science.nasa.gov/solar-system/solar-system-facts/) · [NASA NSSDC Planetary Fact Sheets](https://nssdc.gsfc.nasa.gov/planetary/factsheet/)
| Sun size/mass facts | [NASA NTRS “The Sun” fact sheet](https://ntrs.nasa.gov/citations/20200000290) |
| Individual planetary facts | [Mercury](https://science.nasa.gov/mercury/facts/) · [Venus temperatures](https://science.nasa.gov/resource/solar-system-temperatures/) · [Earth](https://science.nasa.gov/earth/facts/) · [Moon](https://science.nasa.gov/moon/facts/) · [Mars press kit](https://science.nasa.gov/wp-content/uploads/2023/09/mars_insight_launch_presskit.pdf) · [Jupiter](https://science.nasa.gov/jupiter/facts/) · [Saturn](https://science.nasa.gov/mission/cassini/faq/) · [Uranus](https://science.nasa.gov/uranus/facts/) · [Neptune](https://science.nasa.gov/mission/voyager/fact-sheet/) | Official NASA pages for the facts used in the all-planets Solar Map. `orbit` and `size` in `src/data/planets.js` are display coordinates/scales, not scientific measurements. |

## Software libraries

Direct dependencies are read from the root, `data-pipeline/package.json`, and `server/package.json`. The server manifest currently declares no external dependencies.

| Package | Declared version | Role | License and project URL |
|---|---|---|---|
| Three.js (`three`) | `^0.160.0` | 3D maps and scene rendering | MIT · [project](https://threejs.org/) · [license](https://github.com/mrdoob/three.js/blob/dev/LICENSE) |
| Ajv (`ajv`) | `^8.17.1` | JSON Schema validation | MIT · [project](https://ajv.js.org/) · [license](https://github.com/ajv-validator/ajv/blob/master/LICENSE) |
| Vite (`vite`) | `^5.4.0` | Development server and build | MIT · [project](https://vite.dev/) · [license](https://github.com/vitejs/vite/blob/main/packages/vite/LICENSE.md) |
| Sharp (`sharp`) | `0.35.5` | Reproducible map stitching, resizing, and WebP compression | Apache-2.0 · [project](https://sharp.pixelplumbing.com/) · [license](https://github.com/lovell/sharp/blob/main/LICENSE) |

## Fonts

Fonts load from Google Fonts over HTTPS; the repository does not bundle font files. Google Fonts family metadata identifies these families under SIL Open Font License 1.1. The configured Arabic font is disabled in `src/i18n/languages.js` and is not currently loaded.

| Font | Use | URL | License |
|---|---|---|---|
| Archivo Black | Display headings | [Google Fonts](https://fonts.google.com/specimen/Archivo+Black) | SIL OFL 1.1 · [family metadata](https://github.com/google/fonts/tree/main/ofl/archivoblack) |
| Caveat Brush | Handwritten accents | [Google Fonts](https://fonts.google.com/specimen/Caveat+Brush) | SIL OFL 1.1 · [family metadata](https://github.com/google/fonts/tree/main/ofl/caveatbrush) |
| Lilita One | Display headings | [Google Fonts](https://fonts.google.com/specimen/Lilita+One) | SIL OFL 1.1 · [family metadata](https://github.com/google/fonts/tree/main/ofl/lilitaone) |
| Nunito | Body/UI text | [Google Fonts](https://fonts.google.com/specimen/Nunito) | SIL OFL 1.1 · [family metadata](https://github.com/google/fonts/tree/main/ofl/nunito) |
| Space Mono | Labels/data text | [Google Fonts](https://fonts.google.com/specimen/Space+Mono) | SIL OFL 1.1 · [family metadata](https://github.com/google/fonts/tree/main/ofl/spacemono) |
| Noto Sans Bengali | Bangla UI font | [Google Fonts](https://fonts.google.com/specimen/Noto+Sans+Bengali) | SIL OFL 1.1 · [family metadata](https://github.com/google/fonts/tree/main/ofl/notosansbengali) |
| Noto Sans Arabic | Arabic font configured for a disabled locale | [Google Fonts](https://fonts.google.com/specimen/Noto+Sans+Arabic) | SIL OFL 1.1 · [family metadata](https://github.com/google/fonts/tree/main/ofl/notosansarabic) |

## Local and generated assets

| Asset | Source, license, and credit |
|---|---|
| `public/images/maps/moon-2048.webp`, `moon-1024.webp` | Resized NASA Moon Trek LRO WAC map; NASA/GSFC/Arizona State University credit. Educational/informational use with attribution; review [NASA media guidance](https://www.nasa.gov/nasa-brand-center/images-and-media/) and [LROC terms](https://www.lroc.im-ldi.com/about/terms). Details and source tiles are documented in `public/images/maps/CREDITS.md`. |
| `public/images/maps/mars-2048.webp`, `mars-1024.webp` | Resized NASA Mars Trek Viking VIS mosaic; NASA/JPL/USGS credit. NASA government imagery with attribution; the derived map page links to the [USGS product record](https://astrogeology.usgs.gov/search/map/mars_viking_colorized_global_mosaic_232m). See `public/images/maps/CREDITS.md`. |
| `public/images/maps/manifest.json` | Project configuration for local map files and visible credit/source links; project MIT license. |
| NASA gallery images | Loaded remotely from NASA Image and Video Library asset URLs. Each record stores an image ID, page URL, alt text, and credit. NASA's public-use guidance does not override a third-party copyright notice on an individual page. |
| `public/favicon.svg`, inline chapter illustrations, and procedural planet textures | Original project artwork/code, covered by the repository's MIT license. Procedural textures are generated at runtime; they are not downloaded planet images. |
| `public/audio/` and `public/models/` | Empty placeholders at the time of this inventory; no audio or model asset is used. |

The project code is licensed under the repository's [MIT license](../LICENSE). The NASA insignia/logo is not used, and the project does not claim NASA or ISRO endorsement.
`;

await writeFile(join(root, 'docs', 'REFERENCES.md'), doc);
console.log(`Wrote references for ${records.length} records and ${why.sections.length} shared sections.`);
