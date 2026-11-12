// Everything tweakable about the race is here: ONE config object (levels + difficulties). Units: pixels and seconds.
// jump/gravity are chosen together: apex = jump^2 / (2*gravity), air distance = speed * 2*jump/gravity.
// Check: on every level the air distance at top speed (>= 230px) is larger than the widest crater (<= 108px), so every obstacle can be cleared.
// Each level is longer AND faster than the one before it.
// Day turns to night in the middle of the run. `at` = how far along the race (0..1) it starts; the change takes DAY_TO_NIGHT_SECONDS.
// The fact shown when it happens carries its NASA source and is still to be fact-checked (project rule: no fact without a source).
export const DAY_TO_NIGHT_SECONDS=5;
const MOON_NIGHT={at:.5,factKey:'buggy.fact.moonNight',source:'https://science.nasa.gov/moon/facts/',needsFactCheck:true};
const MARS_NIGHT={at:.5,factKey:'buggy.fact.marsNight',source:'https://science.nasa.gov/mars/facts/',needsFactCheck:true};
export const LEVELS=[
  {id:'moon',  icon:'🌙',labelKey:'buggy.level.moon',  descKey:'buggy.level.moonDesc',  color:'#d5d5e6',
    length:9000, gravity:900, jump:420,speed:{start:230,end:330},obstacleGap:[300,430],crater:{w:[80,108],depth:46},rock:{w:[26,38],h:[22,32]},hills:9,
    sky:['#243580','#7f98e6'],ground:'#b4b5d1',far:'#8b93c4',decor:'earth',nightSky:['#03040f','#10143a'],night:MOON_NIGHT},
  {id:'apollo',icon:'🚩',labelKey:'buggy.level.apollo',descKey:'buggy.level.apolloDesc',color:'#c9d6ff',
    length:12000,gravity:900, jump:420,speed:{start:250,end:360},obstacleGap:[270,390],crater:{w:[82,108],depth:48},rock:{w:[26,38],h:[22,32]},hills:17,
    sky:['#20307a','#7690dd'],ground:'#bcbdd6',far:'#8087b9',decor:'earth',nightSky:['#03040f','#10143a'],night:MOON_NIGHT},
  {id:'dust',  icon:'🔴',labelKey:'buggy.level.dust',  descKey:'buggy.level.dustDesc',  color:'#f0b79c',
    length:15000,gravity:1300,jump:520,speed:{start:270,end:380},obstacleGap:[250,370],crater:{w:[72,98],depth:46},rock:{w:[26,40],h:[24,34]},hills:14,
    sky:['#3b1717','#b5452a'],ground:'#c9603f',far:'#8a3a28',decor:'sun',nightSky:['#12050a','#3a1018'],night:MARS_NIGHT},
  {id:'canyon',icon:'🏜️',labelKey:'buggy.level.canyon',descKey:'buggy.level.canyonDesc',color:'#e9a27d',
    length:18000,gravity:1300,jump:520,speed:{start:290,end:410},obstacleGap:[230,340],crater:{w:[72,100],depth:52},rock:{w:[28,42],h:[26,36]},hills:26,
    sky:['#2a0f10','#9a3a24'],ground:'#a8472b',far:'#6f2a1c',decor:'sun',nightSky:['#12050a','#3a1018'],night:MARS_NIGHT}
];
// lives: how many crashes the run can take. speed: multiplies the level's speed. gap: multiplies the space between obstacles (smaller = busier).
export const DIFFICULTIES=[
  {id:'easy',  labelKey:'levels.easy',  descKey:'buggy.diff.easy',  lives:5,speed:.9, gap:1.25},
  {id:'normal',labelKey:'levels.normal',descKey:'buggy.diff.normal',lives:3,speed:1,  gap:1},
  {id:'hard',  labelKey:'levels.hard',  descKey:'buggy.diff.hard',  lives:2,speed:1.12,gap:.85}
];
export const STORAGE_KEY='fe2.buggy2';
// Relaxed mode (also the default when the player prefers reduced motion) slows everything down.
export const RELAXED_FACTOR=.72;
export const VIEW={w:640,h:360,groundY:268,buggyScreenX:150};

/** The race for one level at one difficulty (a plain object the physics and the drawing read). Pure. */
export function buildTrack(levelId,difficultyId,{gentle=false}={}){
  const level=LEVELS.find(l=>l.id===levelId)||LEVELS[0],d=DIFFICULTIES.find(x=>x.id===difficultyId)||DIFFICULTIES[1];
  return{...level,level,difficulty:d,lives:d.lives,
    // Reduced motion: the speed still grows, but only about half as much, so the race never feels like it is running away.
    speed:{start:level.speed.start*d.speed,end:(level.speed.start+(level.speed.end-level.speed.start)*(gentle?.45:1))*d.speed},
    obstacleGap:level.obstacleGap.map(g=>g*d.gap)};
}
