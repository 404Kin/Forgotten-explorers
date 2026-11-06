# API (owner: P2)  ·  base path `/api/v1`  ·  full contract: `docs/openapi.yaml`
Live now: `health`, `robots`, `robots/:id`. Planned next: `images`, `live/distance`, `live/dsn`.

**Frontend can start today:** `cd server && npm run mock` serves this exact API on FAKE placeholder robots (every text says TEST DATA). Real robots appear when P1's files are in `data-pipeline/robots/`.

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
| 500 | INTERNAL | our bug. Message is generic, details only in server logs |

## GET /api/v1/health
`200 { status, service, version, uptimeSeconds, time, data:{ robots, rejected } }`. `rejected` is how many records failed validation and are NOT served. Anything above 0 means P1 has a data problem (details are in the server log, event `robots_rejected`).

## GET /api/v1/robots
Query: `world` (moon|mars|deep), `status` (left_behind|silent|talking), `page`, `pageSize`, `lang` (en|bn|ar).
Returns summaries: `id, name, world, status, lat, lon, kidFact, i18nKey, lang`. Sorted by name.

## GET /api/v1/robots/:id?lang=
The full record: dates, `endReason`, `story[]`, `quiz[]` (**first option is correct**), `sources[]`. Unknown id: 404.

## Data rules (the server enforces them, so bad data never reaches kids)
A record is served only if: id/name/world/status valid, dates look like `YYYY[-MM[-DD]]`, moon and mars have `lat` and `lon`, story and quiz are well formed, and **at least one source URL is https on an allowed host** (`SOURCE_HOSTS`, default `nasa.gov,isro.gov.in`). Duplicate ids are rejected.

## Languages (proposal, P1 please confirm)
`<I18N_DIR>/<lang>.json` shaped `{ "<i18nKey>": { name, kidFact, endReason, story:[{title,text}], quiz:[{q,options}] } }`. Missing parts fall back to English; the response says which language it really used (`lang`, header `Content-Language`). Story and quiz are replaced only if the counts match, so answers cannot get misaligned.
