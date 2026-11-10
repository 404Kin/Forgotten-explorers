# Web Walker in Space (Mission Quiz)
Ported from the standalone "Spiderman in space" project (space version, commit 7d280e1). Zip is an original character.
- `mount.js` : `mountGame(el, {embedded, onGameEnd})`. Screen: `src/screens/Quiz.js` (route `/quiz`).
- `data/questions.en.json` : 35 questions, each with a NASA source URL and `needsFactCheck:true` (P1: fact-check, then clear the flag).
- Text: every string is a `ww.*` key in `src/i18n/locales/en.json`. Questions can be translated with `ww.q.<id>.question|o0..o3|fact`.
- `i18n/bn.ww.json` : Bangla for the `ww.*` UI keys from the original project. P1: merge into `bn.json`.
- Sounds are synthesized (no audio files). Best scores per difficulty are kept in localStorage (`webWalker:*`).
- The original unit tests were not copied (this app has no test runner yet). Pure logic to test later: `core/`, `services/storage.js`.
