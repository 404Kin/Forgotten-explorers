// Everything tweakable about the race is here: ONE config object (levels + difficulties). Units: pixels and seconds.
// jump/gravity are chosen together: apex = jump^2 / (2*gravity), air distance = speed * 2*jump/gravity.
// Check: on every level the air distance at top speed (>= 230px) is larger than the widest crater (<= 108px), so every obstacle can be cleared.
// Each level is longer AND faster than the one before it.
export const LEVELS=[
  {id:'moon',  icon:'🌙',labelKey:'buggy.level.moon',  descKey:'buggy.level.moonDesc',  color:'#d5d5e6',
    length:7000, gravity:900, jump:420,speed:{start:200,end:250},obstacleGap:[300,430],crater:{w:[80,108],depth:46},rock:{w:[26,38],h:[22,32]},hills:9,
    sky:['#0b1030','#2b2f6e'],ground:'#9a9ab8',far:'#6c6c91',decor:'earth'},
  {id:'apollo',icon:'🚩',labelKey:'buggy.level.apollo',descKey:'buggy.level.apolloDesc',color:'#c9d6ff',
    length:9000, gravity:900, jump:420,speed:{start:218,end:280},obstacleGap:[270,390],crater:{w:[82,108],depth:48},rock:{w:[26,38],h:[22,32]},hills:17,
    sky:['#0a0d28','#34407e'],ground:'#aeb0c9',far:'#767aa3',decor:'earth'},
  {id:'dust',  icon:'🔴',labelKey:'buggy.level.dust',  descKey:'buggy.level.dustDesc',  color:'#f0b79c',
    length:11000,gravity:1300,jump:520,speed:{start:236,end:300},obstacleGap:[250,370],crater:{w:[72,98],depth:46},rock:{w:[26,40],h:[24,34]},hills:14,
    sky:['#3b1717','#b5452a'],ground:'#c9603f',far:'#8a3a28',decor:'sun'},
  {id:'canyon',icon:'🏜️',labelKey:'buggy.level.canyon',descKey:'buggy.level.canyonDesc',color:'#e9a27d',
    length:13000,gravity:1300,jump:520,speed:{start:255,end:330},obstacleGap:[230,340],crater:{w:[72,100],depth:52},rock:{w:[28,42],h:[26,36]},hills:26,
    sky:['#2a0f10','#9a3a24'],ground:'#a8472b',far:'#6f2a1c',decor:'sun'}
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
export function buildTrack(levelId,difficultyId){
  const level=LEVELS.find(l=>l.id===levelId)||LEVELS[0],d=DIFFICULTIES.find(x=>x.id===difficultyId)||DIFFICULTIES[1];
  return{...level,level,difficulty:d,lives:d.lives,
    speed:{start:level.speed.start*d.speed,end:level.speed.end*d.speed},
    obstacleGap:level.obstacleGap.map(g=>g*d.gap)};
}
