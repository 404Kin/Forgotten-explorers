# Forgotten Explorers  🚀
NASA Space Apps Challenge 2026: **Abandoned but not Forgotten**.
A kid-friendly story, quiz and game app about the robots NASA left on the Moon, Mars and deep space.
Uses **real NASA photos** (NASA Image and Video Library API) and **real mission data** (dates, coordinates, distances).

## Run it
```
npm install
npm run dev        # http://localhost:5173
npm run build      # production site in /dist
npm run check      # sanity-check imports
```
Backend (optional): copy `.env.example` to `.env` and set `VITE_API_BASE_URL` (for example `http://localhost:8787`). With it empty, or if the API is down, the app uses the data in `src/data` instead. Client: `src/services/api.js`.
Needs Node 18+ and an internet connection (NASA photos, fonts and the 3D library come from the web / npm).

## What the player does
Cover and dreamy intro → 3D planet hub → storybook chapter cover → 3D map with real landing sites → robot dossier (story, real data, NASA photos, quiz) → XP, ranks, mission patches, certificate. Games: Mission Quiz (Web Walker in Space), Soft Landing, Moon Buggy Race, Memory Match. Extras: Last Message story mode, Still Talking tracker, Why did we leave it there?, Data Sources, and a skippable 60-second "Start here" tour.

## Folder tree (where to put things)
```
index.html                page shell
public/                   static files copied as-is
  images/  audio/  models/   (empty, ready for your own files)
src/
  main.js                 bootstrap + routes
  config.js               app constants (API url, XP per level, rank names)
  router/router.js        tiny hash router
  state/store.js          XP, rank, collection, badges, streak (saved in localStorage)
  data/                   ALL content lives here
    missions.js           stories + quiz + art per robot, merged with relics.json
    relics.json           REAL mission data (dates, coordinates, distance, light-time)
    quiz.js               quiz question bank (right answer first)
    badges.js             mission patch rules
    nasaQueries.js        NASA search words + PINNED image IDs
  services/
    nasaImages.js         NASA Image Library fetch + cache
    audio.js              sound effects + read aloud
  screens/                one file per page (Landing, Hub, World, Mission, Quiz, Play, Album, Timeline); bigger ones have their own folder: LastMessage/, Live/, WhyLeft/, DataSources/
  i18n/                   t() loader, languages.js, locales/en.json (source of all UI text; bn.json, ar.json are translations). See docs/I18N.md
  games/                  QuizEngine, LunarLander, MemoryMatch, MoonBuggy/, WebWalkerQuiz/  (add new games here)
  three/                  PlanetPicker (hub), WorldMap (globes + solar map)
  components/             Card, TopBar, Toast, Modal, StateView (loading/empty/error), StatusBadge, Filters, LiveLabel, JudgeTour, LanguageSwitcher, CreditFooter
  art/                    robots.js (SVG robots), cover.js (landing scene), chapters.js (world covers)
  utils/                  dom helpers, certificate, textureGenerator (procedural planet textures)
  styles/                 tokens.css (colors/fonts), base.css, app.css
docs/                     TEAM_GUIDE, DESIGN_SYSTEM, DATA_SOURCES, ROADMAP
scripts/                  check-project.mjs
.github/workflows/        auto-deploy to GitHub Pages
```
See `docs/TEAM_GUIDE.md` for "how do I add a robot / question / game / badge".

## Credits
Photos and data: NASA and mission partners (JPL-Caltech, ISRO, ESA, etc.) via images.nasa.gov. Independent educational project, not affiliated with or endorsed by NASA.
