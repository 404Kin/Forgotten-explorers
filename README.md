# Forgotten Explorers

Forgotten Explorers is a kid-friendly, story-driven guide to spacecraft and equipment left on the Moon, Mars, and in deep space. It combines short stories, quizzes, games, maps, and sourced mission facts for school-age kids and casual space fans.

This independent NASA Space Apps project is not affiliated with or endorsed by NASA. It does not use the NASA logo.

## Run locally

Requirements: Node.js 18.17 or newer.

```sh
npm install
npm run dev
```

The Vite app runs at `http://localhost:5173`. To run the checks:

```sh
npm run check
npm test
npm run build
```

The backend uses only Node.js built-ins and adds no NPM dependencies:

```sh
cd server
npm test
npm run mock
```

The mock server serves clearly fake test fixtures on port 8787. To run the real API, `data-pipeline/robots/` and `data-pipeline/translations/` must be supplied; production startup refuses to run without valid robot records. Check the pipeline before starting it:

```sh
npm run data:validate
cd server
npm start
```

Set `CORS_ORIGINS` to the frontend origin. See [server/.env.example](./server/.env.example) and [docs/DEPLOY.md](./docs/DEPLOY.md) for deployment settings.

## Architecture

- **Frontend:** Vite, vanilla JavaScript, and Three.js. `src/` contains screens, games, reusable components, styles, localization, and frontend fallback data.
- **Backend:** A read-only Node.js HTTP API in `server/`, with shared validation, pagination, rate limiting, CORS allow-listing, request IDs, and structured logging.
- **Mission data:** P1-owned JSON records under `data-pipeline/robots/` and translations under `data-pipeline/translations/`. The API validates records before serving them. Data files are not included in this checkout yet.
- **NASA services:** The API proxies NASA Image and Video Library searches, JPL Horizons distance calculations, and NASA Eyes DSN Now status. Live responses are cached; distance has a dated JPL fallback snapshot.

API contract: [docs/API.md](./docs/API.md) and [docs/openapi.yaml](./docs/openapi.yaml). Team ownership and contribution guidance: [docs/TEAM_GUIDE.md](./docs/TEAM_GUIDE.md).

## Data sources and credits

- Images: [NASA Image and Video Library](https://images.nasa.gov/)
- Solar-system distances: [JPL Horizons API](https://ssd-api.jpl.nasa.gov/doc/horizons.html)
- Deep Space Network status: [NASA Eyes DSN Now](https://eyes.nasa.gov/apps/dsn-now/)
- Mission facts: every served record must include a source URL from NASA or an approved partner agency. See [docs/DATA_SOURCES.md](./docs/DATA_SOURCES.md).

NASA images and mission data remain credited to NASA and the relevant mission partners (including JPL-Caltech, ISRO, and ESA where applicable). Credits should be shown beside media and sourced facts. The project is educational and independent.

## Current integration notes

The API reads any valid robot JSON files in `data-pipeline/robots/`; this repository checkout does not yet contain that P1 folder, so the 15-record integration and the production ID maps cannot be verified here. P1 must provide the canonical slug IDs and the verified Horizons/DSN mappings. The frontend `spirit-mer-a` versus API `spirit` mismatch is in P3-owned files and still needs P3 coordination.

The Render free web service spins down after idle time. The first request after a spin-down may take about a minute; keep the frontend's local fallback available.
