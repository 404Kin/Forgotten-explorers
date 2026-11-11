# Deploy (P2)

## Host: Render

Use a Render Web Service with the repository's Dockerfile. The Docker build context must be the repository root because the image also copies P1's `data-pipeline/` folder.

1. Connect the GitHub repository to Render and create a Web Service.
2. Select Docker as the runtime; use `server/Dockerfile` as the Dockerfile path and the repository root as the build context.
3. Configure the environment variables below, then deploy.
4. Verify `https://<service>.onrender.com/api/v1/health`, followed by `/api/v1/live/dsn` and a mapped `/api/v1/live/distance?ids=...` request.

Render's [current free web-service documentation](https://render.com/docs/free) says free services spin down after 15 minutes without traffic, may take about a minute to wake, and have an ephemeral filesystem. Free instances are intended for testing/hobby projects, not production. Avoid relying on a warm instance during judging; the frontend must retain its local fallback.

## Required environment

| Variable | Example | Notes |
|---|---|---|
| `NODE_ENV` | `production` | Production refuses to start without valid robot records. |
| `PORT` | host-provided | Defaults to `8787` locally. |
| `CORS_ORIGINS` | `https://your-user.github.io` | Exact comma-separated frontend origins; never `*`. |
| `TRUST_PROXY` | `true` | Set only when the host proxy supplies the real client IP. |
| `HORIZONS_TARGETS` | `{"canonical-slug":"499"}` | JSON map from API robot slugs to verified JPL Horizons numeric target IDs. |
| `DSN_ROBOT_MAP` | `{"DSN-CODE":"canonical-slug"}` | JSON map from verified uppercase DSN targets to canonical API IDs. |

`RATE_LIMIT_MAX` (120), `RATE_LIMIT_WINDOW_MS` (60000), `SOURCE_HOSTS`, `ROBOTS_DIR`, `I18N_DIR`, `DISTANCE_SNAPSHOT_FILE`, and `LOG_LEVEL` are optional. Defaults are in [server/.env.example](../server/.env.example). Do not put credentials or API keys in the repository; the live NASA endpoints used here do not require a key.

## Local checks and smoke tests

Run before deployment:

```sh
npm run data:validate
npm test
npm run check
npm run build
```

The backend has no external NPM dependencies. To build and run the production image from the repository root:

```sh
docker build -f server/Dockerfile -t fe-api .
docker run --rm -p 8787:8787 -e NODE_ENV=production -e CORS_ORIGINS=http://localhost:5173 -e TRUST_PROXY=false fe-api
```

Use the no-dependency load test only against a local or explicitly authorized staging service:

```sh
npm --prefix server run load-test
```

Set `LOAD_TEST_URL`, `LOAD_TEST_REQUESTS` (max 1000), and `LOAD_TEST_CONCURRENCY` (max 50) to tune the test. The default target is the local health endpoint.

## Current blockers

This checkout has no `data-pipeline/` folder. The Dockerfile's data copy and production startup therefore cannot succeed until P1 supplies the verified robot and translation files. The 15-record validation command and target maps are ready for those files. Docker is not installed in the current development environment, so a Docker build/run could not be verified here.

## Security checklist

- [x] Global in-memory per-IP rate limit; tune via `RATE_LIMIT_MAX` and `RATE_LIMIT_WINDOW_MS`.
- [x] Explicit CORS origin allow-list; wildcard origins are rejected at startup.
- [x] JSON-only read endpoints; query parameters and loaded records are validated.
- [x] Standard client errors hide internal exceptions; structured logs redact common secret fields.
- [x] Secrets stay in environment variables; `.env` files are ignored by Git.
- [ ] Production deployment, image build, and external-origin CORS still need a live smoke test.

The rate limiter is process-local, not shared across replicas. `TRUST_PROXY=true` must only be used behind a trusted proxy that sets the forwarding header safely.
