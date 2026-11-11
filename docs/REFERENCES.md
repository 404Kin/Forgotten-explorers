# References, libraries, and asset credits

This index covers resources currently used in the repository and the cited sources in the curated robot records. Source URLs are recorded per record in [`src/data/robotRecords.json`](../src/data/robotRecords.json). Unless noted, web sources were accessed as static pages; the live API behavior is documented in [DATA_SOURCES.md](DATA_SOURCES.md).

## Data and research sources

| Source | Use | License / usage |
|---|---|---|
| NASA Image and Video Library API — https://images-api.nasa.gov/ ; https://images.nasa.gov/ | NASA image search, metadata, photo pages, and image assets. | NASA media is generally available for educational/informational use with attribution; check each media item's credit and third-party restrictions. NASA guidance: https://www.nasa.gov/nasa-brand-center/images-and-media/ |
| JPL Horizons API and documentation — https://ssd.jpl.nasa.gov/api/horizons.api ; https://ssd-api.jpl.nasa.gov/doc/horizons.html ; https://ssd-api.jpl.nasa.gov/doc/horizons_lookup.html | Spacecraft/body ephemerides and distance fixtures. | NASA/JPL public scientific service; cite JPL Horizons. |
| NASA Deep Space Network Now — https://eyes.nasa.gov/apps/dsn-now/ ; https://eyes.nasa.gov/dsn/data/dsn.json | Live DSN feed metadata. | NASA/JPL; live feed is transient and cached by the app service. |
| NASA Moon Trek / Mars Trek — https://trek.nasa.gov/moon/ ; https://trek.nasa.gov/mars/ ; https://trek.nasa.gov/tiles/apidoc/trekAPI.html?body=moon ; https://trek.nasa.gov/tiles/apidoc/trekAPI.html?body=mars | Moon and Mars map mosaics and tile service. | NASA Trek attribution is in [map credits](../public/images/maps/CREDITS.md); Mars mosaic source product also credits USGS: https://astrogeology.usgs.gov/search/map/mars_viking_colorized_global_mosaic_232m |
| LRO / LROC — https://science.nasa.gov/mission/lro/ ; https://www.lroc.im-ldi.com/about/terms | Moon map source imagery and Vikram landing-site image article. | Follow LROC terms and per-image credit. LROC terms: https://www.lroc.im-ldi.com/about/terms |
| NSSDCA and NASA/JPL mission pages | Mission dates, landing sites, hardware facts, operational history, and status. | Each robot's primary URLs are listed in `sources[]` in `src/data/robotRecords.json`; NASA page use and media terms apply. |
| NASA Solar System and planetary facts — https://science.nasa.gov/solar-system/solar-system-facts/ ; https://nssdc.gsfc.nasa.gov/planetary/factsheet/ ; https://science.nasa.gov/moon/facts/ ; https://science.nasa.gov/mercury/facts/ ; https://science.nasa.gov/venus/facts/ ; https://science.nasa.gov/earth/facts/ ; https://science.nasa.gov/jupiter/facts/ ; https://science.nasa.gov/uranus/facts/ ; https://science.nasa.gov/mission/voyager/fact-sheet/ | Reference sources for planet facts in `src/data/planets.js`. | NASA public educational/reference pages. Verify numeric copy against sources before publication; orbit/size values are layout parameters. |
| NASA preservation and mission context — https://www.nasa.gov/wp-content/uploads/2017/10/617743main_nasa-usg_lunar_historic_sites_reva-508.pdf ; https://nodis3.gsfc.nasa.gov/displayDir.cfm?Internal_ID=N_PR_8715_006E_&page_name=Chapter1 ; https://www.nasa.gov/reference/3-9-project-phase-f-closeout/ ; https://www.nasa.gov/news-release/nasa-sets-path-to-return-mars-samples-seeks-innovative-designs/ | Context for heritage, orbital/space preservation, and mission cost/complexity. | NASA public references; cited in content where used. |
| ISRO Chandrayaan-3 — https://www.isro.gov.in/ISRO_EN/Chandrayaan3.html ; https://www.isro.gov.in/media_isro/pdf/APXS_CH3.pdf | Vikram/Chandrayaan-3 landing, coordinates, and mission facts. | ISRO data, not NASA data. Record labels agency `ISRO` and cites official ISRO URLs. NASA LRO image link is separately credited in that record. |

### Record-level sources

The URLs below are the complete source set currently attached to each archived record. The record itself is the machine-readable citation manifest.

| Record ID | Source URLs |
|---|---|
| apollo-11-descent-stage | [source](https://nssdc.gsfc.nasa.gov/planetary/lunar/apolloland.html)<br>[source](https://nssdc.gsfc.nasa.gov/planetary/lunar/lunar_sites.html)<br>[source](https://www.nasa.gov/history/apollo-11-mission-overview/) |
| apollo-12-descent-stage | [source](https://www.nasa.gov/missions/apollo/apollo-12-the-pinpoint-mission/)<br>[source](https://nssdc.gsfc.nasa.gov/planetary/lunar/lunar_sites.html)<br>[source](https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo12info.html) |
| apollo-14-descent-stage | [source](https://www.nasa.gov/missions/apollo/apollo-14-mission-details/)<br>[source](https://nssdc.gsfc.nasa.gov/planetary/lunar/lunar_sites.html)<br>[source](https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo14info.html) |
| apollo-15-descent-stage | [source](https://www.nasa.gov/missions/apollo/apollo-15-mission-details/)<br>[source](https://nssdc.gsfc.nasa.gov/planetary/lunar/lunar_sites.html)<br>[source](https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo15info.html) |
| apollo-16-descent-stage | [source](https://www.nasa.gov/missions/apollo/apollo-16-mission-details/)<br>[source](https://nssdc.gsfc.nasa.gov/planetary/lunar/lunar_sites.html)<br>[source](https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo16info.html) |
| apollo-17-descent-stage | [source](https://www.nasa.gov/missions/apollo/apollo-17-mission-details/)<br>[source](https://nssdc.gsfc.nasa.gov/planetary/lunar/lunar_sites.html)<br>[source](https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo17info.html) |
| apollo-15-lunar-rover | [source](https://www.nasa.gov/wp-content/uploads/2023/04/sp-4029.pdf)<br>[source](https://nssdc.gsfc.nasa.gov/planetary/lunar/apolloland.html)<br>[source](https://www.nasa.gov/missions/apollo/apollo-15-mission-details/) |
| apollo-16-lunar-rover | [source](https://www.nasa.gov/missions/apollo/apollo-16-mission-details/)<br>[source](https://nssdc.gsfc.nasa.gov/planetary/lunar/apolloland.html)<br>[source](https://www.nasa.gov/wp-content/uploads/2023/04/sp-4029.pdf) |
| apollo-17-lunar-rover | [source](https://www.nasa.gov/missions/apollo/apollo-17-mission-details/)<br>[source](https://nssdc.gsfc.nasa.gov/planetary/lunar/apolloland.html)<br>[source](https://images.nasa.gov/details/as17-145-22162) |
| surveyor-3 | [source](https://science.nasa.gov/mission/surveyor-3/)<br>[source](https://science.nasa.gov/solar-system/moon/footpads-and-footprints-humans-and-machine-meet-on-the-moon/)<br>[source](https://nssdc.gsfc.nasa.gov/planetary/lunar/lunar_sites.html) |
| sojourner | [source](https://www.nasa.gov/image-article/july-4-1997-sojourner-arrives-red-planet/)<br>[source](https://science.nasa.gov/solar-system/mars-pathfinder-lands-on-mars/)<br>[source](https://www.nasa.gov/wp-content/uploads/2023/04/sp-4524.pdf) |
| viking-1-lander | [source](https://science.nasa.gov/mission/viking-1/)<br>[source](https://science.nasa.gov/mission/viking/)<br>[source](https://nssdc.gsfc.nasa.gov/planetary/viking.html) |
| viking-2-lander | [source](https://science.nasa.gov/mission/viking/)<br>[source](https://nssdc.gsfc.nasa.gov/planetary/viking.html)<br>[source](https://images.nasa.gov/details/PIA04023) |
| spirit-mer-a | [source](https://science.nasa.gov/mission/mer-spirit/)<br>[source](https://www.jpl.nasa.gov/news/nasa-concludes-attempts-to-contact-mars-rover-spirit/)<br>[source](https://ntrs.nasa.gov/citations/20160001767) |
| opportunity-mer-b | [source](https://science.nasa.gov/mission/mer-opportunity/)<br>[source](https://astrobiology.nasa.gov/news/opportunity-rover-mission-comes-to-an-end/)<br>[source](https://www.giss.nasa.gov/tools/mars24/help/landers.html) |
| phoenix-lander | [source](https://science.nasa.gov/mission/mars-phoenix/)<br>[source](https://science.nasa.gov/photojournal/phoenix-opens-its-eyes/)<br>[source](https://www.jpl.nasa.gov/missions/phoenix/) |
| insight-lander | [source](https://science.nasa.gov/mission/insight/)<br>[source](https://science.nasa.gov/mission/insight/?IM_ID=8302&Page=3)<br>[source](https://www.nasa.gov/news-release/nasa-retires-insight-mars-lander-mission-after-years-of-science/) |
| ingenuity | [source](https://www.jpl.nasa.gov/videos/thanksingenuity-nasas-mars-helicopter-team-says-goodbye/)<br>[source](https://www.jpl.nasa.gov/news/nasa-performs-first-aircraft-accident-investigation-on-another-world/)<br>[source](https://science.nasa.gov/blog/ingenuity-reestablishes-communications/) |
| chandrayaan-3-vikram | [source](https://www.isro.gov.in/ISRO_EN/Chandrayaan3.html)<br>[source](https://www.isro.gov.in/media_isro/pdf/APXS_CH3.pdf)<br>[source](https://www.nasa.gov/image-article/nasas-lro-observes-chandrayaan-3-landing-site/) |
| curiosity-msl | [source](https://science.nasa.gov/mission/msl-curiosity/)<br>[source](https://science.nasa.gov/mission/msl-curiosity/) |
| perseverance-mars-2020 | [source](https://science.nasa.gov/mission/mars-2020-perseverance/)<br>[source](https://images.nasa.gov/details/PIA24485) |
| jwst-telescope | [source](https://science.nasa.gov/mission/webb/)<br>[source](https://science.nasa.gov/mission/webb/webbs-orbit-at-l2/) |
| parker-solar-probe | [source](https://science.nasa.gov/mission/parker-solar-probe/)<br>[source](https://science.nasa.gov/blogs/parker-solar-probe/2026/09/10/after-latest-swing-past-sun-nasas-parker-solar-probe-checks-in/) |
| voyager-1 | [source](https://science.nasa.gov/mission/voyager/voyager-1/)<br>[source](https://www.jpl.nasa.gov/missions/voyager-1/) |

## Software libraries

Direct dependencies declared in the root, `data-pipeline/`, and `server/` package manifests:

| Package | Declared version | License | License/source URL | Use |
|---|---:|---|---|---|
| Three.js (`three`) | ^0.160.0 | MIT | https://github.com/mrdoob/three.js/blob/dev/LICENSE | 3D scenes and maps |
| Ajv (`ajv`) | ^8.17.1 | MIT | https://github.com/ajv-validator/ajv/blob/master/LICENSE | JSON Schema validation |
| Vite (`vite`) | ^5.4.0 | MIT | https://github.com/vitejs/vite/blob/main/packages/vite/LICENSE.md | Development and production build |
| Sharp (`sharp`) | 0.35.5 | Apache-2.0 | https://github.com/lovell/sharp/blob/main/LICENSE | Reproducible map resize/compression pipeline |

The server manifest declares no third-party runtime packages. Transitive dependencies are governed by their own licenses; inspect the lockfile/package metadata for a complete distribution inventory.

## Fonts

| Font | Delivery | License | URL |
|---|---|---|---|
| Archivo Black | Google Fonts, remote | SIL Open Font License 1.1 | https://fonts.google.com/specimen/Archivo+Black |
| Caveat Brush | Google Fonts, remote | SIL Open Font License 1.1 | https://fonts.google.com/specimen/Caveat+Brush |
| Lilita One | Google Fonts, remote | SIL Open Font License 1.1 | https://fonts.google.com/specimen/Lilita+One |
| Nunito | Google Fonts, remote | SIL Open Font License 1.1 | https://fonts.google.com/specimen/Nunito |
| Space Mono | Google Fonts, remote | SIL Open Font License 1.1 | https://fonts.google.com/specimen/Space+Mono |
| Noto Sans Bengali | Google Fonts configured for Bengali | SIL Open Font License 1.1 | https://fonts.google.com/noto/specimen/Noto+Sans+Bengali |
| Noto Sans Arabic | Google Fonts configured but currently inactive | SIL Open Font License 1.1 | https://fonts.google.com/noto/specimen/Noto+Sans+Arabic |

## Local assets

| Asset | Origin / license |
|---|---|
| `public/images/maps/moon-2048.webp`, `moon-1024.webp` | NASA Moon Trek LRO WAC mosaic; see [CREDITS.md](../public/images/maps/CREDITS.md) and LROC terms above. |
| `public/images/maps/mars-2048.webp`, `mars-1024.webp` | NASA Mars Trek-hosted Viking mosaic; underlying product attributed to USGS; see [CREDITS.md](../public/images/maps/CREDITS.md). |
| `public/favicon.svg`, procedural textures, and project-authored interface illustrations | Project repository license, MIT (`LICENSE`); contains no NASA logo. |
| `public/audio/`, `public/models/` | No shipped assets currently present. |

