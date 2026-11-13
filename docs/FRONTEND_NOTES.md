# Frontend notes (P3)
Owner: P3. Updated on submission day (2026-11-13).

## 3D models (checked 2026-11-13)
One generic viewer (`src/components/Model3D/`) reads `models.config.js`. Real models are NASA files from [NASA 3D Resources](https://github.com/nasa/NASA-3D-Resources) (free to use, credit NASA), optimised with gltf-transform (meshopt + WebP textures, each under 3 MB) and loaded lazily from `public/models/`. Artist models are built in code (`artist.js`) and are always labelled "Artist model, not NASA data".

| Robot | Model file | Source URL | Real NASA or artist | Note |
|---|---|---|---|---|
| Apollo 11 Lunar Module Eagle descent stage (`apollo-11-descent-stage`) | `public/models/apollo-lunar-module.glb` (0.74 MB) | https://science.nasa.gov/3d-resources/apollo-lunar-module/ | **Real NASA model** | Whole Apollo Lunar Module; the descent stage is the lower half |
| Apollo 12 Lunar Module Intrepid descent stage (`apollo-12-descent-stage`) | `public/models/apollo-lunar-module.glb` (0.74 MB) | https://science.nasa.gov/3d-resources/apollo-lunar-module/ | **Real NASA model** | Whole Apollo Lunar Module; the descent stage is the lower half |
| Apollo 14 Lunar Module Antares descent stage (`apollo-14-descent-stage`) | `public/models/apollo-lunar-module.glb` (0.74 MB) | https://science.nasa.gov/3d-resources/apollo-lunar-module/ | **Real NASA model** | Whole Apollo Lunar Module; the descent stage is the lower half |
| Apollo 15 Lunar Module Falcon descent stage (`apollo-15-descent-stage`) | `public/models/apollo-lunar-module.glb` (0.74 MB) | https://science.nasa.gov/3d-resources/apollo-lunar-module/ | **Real NASA model** | Whole Apollo Lunar Module; the descent stage is the lower half |
| Apollo 16 Lunar Module Orion descent stage (`apollo-16-descent-stage`) | `public/models/apollo-lunar-module.glb` (0.74 MB) | https://science.nasa.gov/3d-resources/apollo-lunar-module/ | **Real NASA model** | Whole Apollo Lunar Module; the descent stage is the lower half |
| Apollo 17 Lunar Module Challenger descent stage (`apollo-17-descent-stage`) | `public/models/apollo-lunar-module.glb` (0.74 MB) | https://science.nasa.gov/3d-resources/apollo-lunar-module/ | **Real NASA model** | Whole Apollo Lunar Module; the descent stage is the lower half |
| Apollo 15 Lunar Roving Vehicle (`apollo-15-lunar-rover`) | built in code (`artist.js`, lunarRover) | none: no NASA model in the collection | **Artist model** |  |
| Apollo 16 Lunar Roving Vehicle (`apollo-16-lunar-rover`) | built in code (`artist.js`, lunarRover) | none: no NASA model in the collection | **Artist model** |  |
| Apollo 17 Lunar Roving Vehicle (`apollo-17-lunar-rover`) | built in code (`artist.js`, lunarRover) | none: no NASA model in the collection | **Artist model** |  |
| Surveyor 3 lunar lander (`surveyor-3`) | built in code (`artist.js`, tripodLander) | none: no NASA model in the collection | **Artist model** |  |
| Sojourner Mars rover (`sojourner`) | built in code (`artist.js`, smallRover) | none: no NASA model in the collection | **Artist model** |  |
| Viking 1 Mars lander (`viking-1-lander`) | `public/models/viking-lander.glb` (0.42 MB) | https://science.nasa.gov/3d-resources/viking-lander/ | **Real NASA model** | Both Viking landers were built the same way |
| Viking 2 Mars lander (`viking-2-lander`) | `public/models/viking-lander.glb` (0.42 MB) | https://science.nasa.gov/3d-resources/viking-lander/ | **Real NASA model** | Both Viking landers were built the same way |
| Spirit Mars Exploration Rover (`spirit-mer-a`) | `public/models/mer-opportunity.glb` (0.03 MB) | https://science.nasa.gov/3d-resources/mars-exploration-rover-opportunity-mer-b/ | **Real NASA model** | Spirit uses its twin Opportunity's model |
| Opportunity Mars Exploration Rover (`opportunity-mer-b`) | `public/models/mer-opportunity.glb` (0.03 MB) | https://science.nasa.gov/3d-resources/mars-exploration-rover-opportunity-mer-b/ | **Real NASA model** |  |
| Phoenix Mars lander (`phoenix-lander`) | built in code (`artist.js`, solarLander) | none: no NASA model in the collection | **Artist model** |  |
| InSight Mars lander (`insight-lander`) | `public/models/insight.glb` (2.57 MB) | https://science.nasa.gov/3d-resources/insight-cruise-lander/ | **Real NASA model** |  |
| Ingenuity Mars Helicopter (`ingenuity`) | `public/models/ingenuity.glb` (0.37 MB) | https://science.nasa.gov/3d-resources/ingenuity-mars-helicopter/ | **Real NASA model** |  |
| Chandrayaan-3 Vikram lunar lander (`chandrayaan-3-vikram`) | built in code (`artist.js`, boxLander) | none: no NASA model in the collection | **Artist model** |  |
| Curiosity Mars Science Laboratory rover (`curiosity-msl`) | built in code (`artist.js`, bigRover) | none: no NASA model in the collection | **Artist model** |  |
| Perseverance Mars 2020 rover (`perseverance-mars-2020`) | `public/models/perseverance.glb` (2.07 MB) | https://science.nasa.gov/3d-resources/mars-2020-perseverance-rover/ | **Real NASA model** |  |
| James Webb Space Telescope (`jwst-telescope`) | `public/models/jwst.glb` (1.00 MB) | https://science.nasa.gov/3d-resources/james-webb-space-telescope-b/ | **Real NASA model** |  |
| Parker Solar Probe (`parker-solar-probe`) | `public/models/parker-solar-probe.glb` (0.38 MB) | https://science.nasa.gov/3d-resources/parker-solar-probe/ | **Real NASA model** |  |
| Voyager 1 (`voyager-1`) | `public/models/voyager.glb` (0.30 MB) | https://science.nasa.gov/3d-resources/voyager-probe-a/ | **Real NASA model** |  |

**16 of 24 robots have a real NASA model; 8 have an artist model.** Checked and found no NASA model for: Apollo lunar rovers, Surveyor 3, Sojourner, Phoenix, Chandrayaan-3 Vikram (ISRO), Curiosity (NASA only publishes a Blender file for it, which cannot be shown in a browser).

## Robot list
`src/robots/registry.js` merges the 11 hand-made robots (`src/data/missions.js`) with P1's 24 records (`src/data/robotRecords.json`). Every screen imports robots from `src/robots/index.js`. Old saved progress keeps working (nicknames did not change). Status (left behind / went silent / still talking) now comes from the records.

## Files edited outside the P3 folders
- `src/services/nasaImages.js` (P1's photo per robot now comes first)
- `src/state/store.js`, `src/art/chapters.js`, `src/services/api.js` (import path only, plus a comment)
- `public/models/*.glb` (new, NASA models), `docs/FRONTEND_NOTES.md` (this file)
- Unused now: `src/components/ModelViewer.js` and `src/image/*.glb` (Mayesha's first viewer; not deleted)

## Data Sources page (step 2)
- Content: `src/data/sources.json`, built by `node src/screens/DataSources/build-sources.mjs <url results>` from `robotRecords.json`, the 3D model config and a check of every link. P1 can replace the file later; the screen only reads it.
- Every URL in the data was fetched on 2026-11-13: 85 checked. 2 returned 404 and were repaired (checked by hand, same topic):
  - InSight record: `https://www.nasa.gov/news-release/nasa-retires-insight-mars-lander-mission-after-years-of-science/` -> `https://www.nasa.gov/missions/mars-insight/nasa-retires-insight-mars-lander-mission-after-years-of-science/`
  - Webb record: `https://science.nasa.gov/mission/webb/webbs-orbit-at-l2/` -> `https://science.nasa.gov/mission/webb/orbit/`
  The records themselves (P1's file) still hold the old links. Ask P1 to update them.
- Could not verify: nothing failed after the repairs. Limits of the check: a 200 answer proves the page exists, not that the text matches our sentence.
- One photo id is not in the NASA Image Library API: `M1447750764LR` (Chandrayaan-3 Vikram). The robot page uses search results for that robot, and the sources page links its nasa.gov article. Ask P1 for a library id.
- Not used by the app (and not listed as sources): JPL Horizons, DSN Now, data.nasa.gov, api.nasa.gov, Earthdata. Still Talking shows a saved snapshot.
