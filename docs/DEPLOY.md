# Deploy (owner: P2)
The API is one small Node process with **no npm dependencies**. The frontend is static (GitHub Pages workflow already exists).

## What must be true for judging (Dec to Jan)
- A link that works for a logged-out person, on phone and laptop.
- The app must still work when the API is asleep or down (frontend uses its local fallback data). A free host may sleep when idle, so the first request can be slow. Check the host's CURRENT free-plan rules before choosing.

## Run the API anywhere with Docker (not tested in this repo yet: test it once before relying on it)
```
docker build -f server/Dockerfile -t fe-api .
docker run -p 8787:8787 -e CORS_ORIGINS=https://YOUR-USER.github.io -e TRUST_PROXY=true fe-api
```
The build needs the `data-pipeline/` folder to exist in the repo.

## Or without Docker (any host that runs Node 18.17+)
Root directory: `server`  ·  Build: (none)  ·  Start: `npm start`  ·  Health check path: `/api/v1/health`
Because the data folder lives outside `server/`, set `ROBOTS_DIR` and `I18N_DIR` to where the files really are on that host, or use Docker.

## Environment variables (see server/.env.example)
`PORT` (most hosts set it), `CORS_ORIGINS` (your frontend URL, no trailing slash, comma separated), `TRUST_PROXY=true` behind a proxy, `RATE_LIMIT_MAX`, `RATE_LIMIT_WINDOW_MS`, `SOURCE_HOSTS`, `ROBOTS_DIR`, `I18N_DIR`, `LOG_LEVEL`.
Never put secrets in git. Add them in the host's dashboard.

## Frontend side (P3)
Build the frontend with the API URL from an env var (for Vite: `VITE_API_URL`), and keep local fallback data.
