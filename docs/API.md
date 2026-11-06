# API (owner: P2)  ·  base path `/api/v1`  ·  full contract: `docs/openapi.yaml`
Available: `health`, `robots`, `robots/:id`, `images`. `live/distance` and `live/dsn` are blocked on P1's Horizons target IDs, DSN name map, and snapshot data.

For local contract tests, `cd server && npm run mock` uses clearly fake test fixtures only; it refuses to run with `NODE_ENV=production`. `npm start` loads real robot files from `../data-pipeline/robots/`. In production, the server refuses to start if no valid robot records are present. That P1 folder is not in this checkout yet.

## Rules for every endpoint
- JSON only, read-only (GET). `OPTIONS` is answered for CORS.
- Query strings are validated. Unknown or invalid parameters return `400 INVALID_PARAM`.
- CORS: only origins in `CORS_ORIGINS` get CORS headers.
- Rate limit: `RATE_LIMIT_MAX` per `RATE_LIMIT_WINDOW_MS` per IP. Over the limit: `429` + `Retry-After`.
- Every response has `X-Request-Id`. Quote it when reporting a bug.
- Lists are paginated: `page` (default 1), `pageSize` (default 12, max 50). `meta` has `page, pageSize, total, totalPages`.

## Standard error
```json
{ "error": { "code": "INVALID_PARAM", "message": "status must be one of ...", "details": {} } }
```
| HTTP | code | when |
|---|---|---|
| 400 | INVALID_PARAM | bad or unknown query parameter |
| 404 | NOT_FOUND | unknown route or id |
| 405 | METHOD_NOT_ALLOWED | not GET |
| 429 | RATE_LIMITED | too many requests |
| 503 | UPSTREAM_UNAVAILABLE | NASA Image and Video Library is unavailable and no cached result is available |
| 500 | INTERNAL | our bug. Message is generic, details only in server logs |

## GET /api/v1/health
`200 { status, service, version, uptimeSeconds, time, data:{ robots, rejected } }`. `rejected` is how many records failed validation and are NOT served. Anything above 0 means P1 has a data problem (details are in the server log, event `robots_rejected`).

## GET /api/v1/robots
Query: `world` (moon|mars|deep), `status` (left_behind|silent|talking), `page`, `pageSize`, `lang` (en|bn|ar).
Returns summaries: `id, name, world, status, lat, lon, kidFact, i18nKey, lang`. Sorted by name.

## GET /api/v1/robots/:id?lang=
The full record: dates, `endReason`, `story[]`, `quiz[]` (**first option is correct**), `sources[]`. Unknown id: 404.

## GET /api/v1/images?robotId=
Searches the real NASA Image and Video Library using the robot's name. Results include the NASA item ID, title, description, date, creator/center credit, NASA details link, and NASA-hosted thumbnail and medium image URLs. Results are cached in memory for 6 hours. If NASA is unavailable, an expired cached result is returned with `meta.stale: true`; without a cached result the API returns `503 UPSTREAM_UNAVAILABLE`. Search results are not pinned (`pinned: false`) until P1 provides its verified image IDs.

The current frontend still calls NASA directly; P3 needs to switch its image loader to this endpoint and keep its local fallback for the UI to use the proxy.

## Data rules (the server enforces them, so bad data never reaches kids)
A record is served only if: id/name/world/status valid, dates look like `YYYY[-MM[-DD]]`, moon and mars have `lat` and `lon`, story and quiz are well formed, and **at least one source URL is https on an allowed host** (`SOURCE_HOSTS`, default `nasa.gov,isro.gov.in`). Duplicate ids are rejected.

## Languages (proposal, P1 please confirm)
`<I18N_DIR>/<lang>.json` shaped `{ "<i18nKey>": { name, kidFact, endReason, story:[{title,text}], quiz:[{q,options}] } }`. Missing parts fall back to English; the response says which language it really used (`lang`, header `Content-Language`). Story and quiz are replaced only if the counts match, so answers cannot get misaligned.
