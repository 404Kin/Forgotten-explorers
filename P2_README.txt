P2 BUNDLE (steps 1 + 2 + 3a together). Unzip into the REPO ROOT and merge folders.
NEW files: CLAUDE.md, LICENSE, .dockerignore, .github/workflows/ci.yml, server/**, docs/{API.md,openapi.yaml,AI_USE.md,SPRINT_NOTE.md,DEPLOY.md}
REPLACES (tiny file): scripts/check-project.mjs  (now exits with code 1 on a missing import, so CI can fail)
YOU EDIT BY HAND (1 line) in the root package.json "scripts":   "test": "npm --prefix server test"
Then:  cd server && npm test        (expect: tests 26, pass 26)
       npm run mock                  (fake robots on http://localhost:8787/api/v1/robots)
