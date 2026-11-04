# Team guide: how to change things
**Add a robot**: (1) draw it in `src/art/robots.js` (or reuse `rover`/`lander`), (2) add an object in `D` inside `src/data/missions.js` (story pages `p`, quiz `q`, colors), (3) add its id in `RID` and a record in `src/data/relics.json`, (4) add a NASA search in `src/data/nasaQueries.js`.
**Add a quiz question**: append to `src/data/quiz.js`. First option is the right one. Topic `t` = moon | mars | deep | any. `m` = robot nickname to show it in that robot's quiz.
**Add a badge**: `src/data/badges.js`, write a `test(state)`.
**Add a game**: create `src/games/MyGame.js` exporting `{name,mount(el),unmount()}`, register `route('/play/mygame',MyGame)` in `src/main.js`, add a tile in `src/screens/Play.js`. Reward with `addXP(n,'text')` from `state/store.js`.
**Fix a wrong NASA photo**: open the photo on images.nasa.gov, copy the ID from the URL, put it in `PINNED` in `nasaQueries.js`.
**Change colors/fonts**: `src/styles/tokens.css`.
**Suggested split for 4 people**: 1) data + science accuracy, 2) art + CSS, 3) 3D (three/), 4) games + quiz.
