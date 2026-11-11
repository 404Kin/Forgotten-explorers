# server/ (P2)
Small read-only API for Forgotten Explorers. **No dependencies**: only Node 18.17+ built-ins, so `npm install` is not needed.
```
cd server
npm test           # 37 tests
npm run mock       # test-only fake robot fixtures; never real mission data
npm start          # validated project data from ../data-pipeline/robots
npm run load-test  # bounded local/staging load test
```
From the repository root, `npm test` runs the server test suite.

The live endpoints are `/api/v1/live/distance` (JPL Horizons; six-hour cache and dated snapshot fallback) and `/api/v1/live/dsn` (NASA Eyes DSN Now; one-minute cache). Set `HORIZONS_TARGETS` and `DSN_ROBOT_MAP` using P1-verified IDs; do not guess mappings. The distance snapshot cites its NASA/JPL request URLs in `src/data/distance-snapshot.json`.

Layout
- `src/config.js` env settings · `src/server.js` request pipeline (id, headers, CORS, rate limit, routing, errors, log)
- `src/lib/` router, errors, logger, rate limit, query validator
- `src/domain/` `robot.js` (the record contract, the ONLY place to change when P1's schema changes) and `repository.js` (generic filter + pagination)
- `src/data/` loads and validates P1's JSON, optional translations
- `src/routes/` one file per endpoint group · `test/` tests + clearly fake fixtures
Add an endpoint: create `src/routes/<name>.js`, export `register<Name>(router,deps)`, call it in `src/routes/index.js`, validate input with `parseQuery`, throw `AppError`, add tests, update `docs/openapi.yaml` and `docs/API.md`.
