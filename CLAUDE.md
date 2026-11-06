# Project: Forgotten Explorers (NASA Space Apps 2026 challenge "Abandoned but not Forgotten")
Goal: win. A kid-friendly, story-driven web app about NASA hardware left on the Moon, Mars and in
deep space. Audience: school-age kids and casual space fans.
## Stack (do not rewrite)
Vite, vanilla JS, Three.js. Read README.md and docs/TEAM_GUIDE.md first. Keep the current folder
structure. Backend lives in /server. Data tools live in /data-pipeline.
## Ownership (do not edit other folders without asking)
P1 data: data-pipeline/, src/data/, public/images/maps, worksheets/, docs/FACT_CHECK.md
P2 backend: server/, docs/API.md, docs/openapi.yaml, CI and deploy
P3 frontend: src/screens, src/three, src/games, src/components, src/styles, src/i18n loader and
en.json
P4 video: video/, docs/PLAYTEST.md, submission text
## Rules
- Accuracy first. Every fact needs a NASA source URL in the data file. Never invent numbers or
quotes. Mark poetic lines as such.
- Use only NASA open data: Image and Video Library, JPL Horizons, DSN Now, NASA SVS, Moon Trek, Mars
Trek, NSSDCA. Always show credit.
- Do not use the NASA logo.
- No hardcoded UI text. Use translation keys with files per language (en, bn, ar). Support RTL.
- Generic and reusable code (DRY, single responsibility, config driven). One generic data
repository, no copy paste per robot.
- API: /api/v1, pagination, one standard error format, input validation on the server, rate
limiting, secrets only in env vars, no secrets in git.
- Central error handling and logging. Never log sensitive data.
- Cache NASA calls. Lazy load heavy assets (3D, images). App must work if an API fails (fallback
data).
- Accessibility: keyboard use, reduced motion, alt text, contrast, 44px tap targets,
loading/empty/error states, responsive.
- Tests for core logic and critical flows. Run npm run check and tests before every commit.
- A new unrelated component gets its own new folder with all its code inside. A related component
goes inside the existing component's folder.
- Small commits, one branch per task (feature/<role>-<task>), PR review by one teammate, CI must
pass.
- Comments explain why, not what. Update README and docs when behavior changes.
- Plain, simple English in all kid-facing text. Reading level: age 8 to 12.
## Working style
Before coding: read the relevant files, write a short plan, then implement. After coding: run build,
check, tests. Report what changed and what is still risky. Ask me if a task touches another
teammate's folder.
