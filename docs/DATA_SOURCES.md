# Data sources
- Photos: NASA Image and Video Library API, https://images-api.nasa.gov (free, no key). Each photo shows its credit and links back to images.nasa.gov.
- Mission facts: dates, landing coordinates, distance, light-time, speed in `src/data/relics.json` (from the team's relics dataset). Distances are snapshots and change with time.
- Moon/Mars/Sun/Earth textures: generated in the browser (`utils/textureGenerator.js`). To use real maps, put images in `public/images/` and load them with THREE.TextureLoader in `three/WorldMap.js` (e.g. NASA SVS Moon/Mars maps).
- Please double-check every fact against NASA mission pages before submitting.
