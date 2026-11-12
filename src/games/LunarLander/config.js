// All the numbers for Soft Landing live here (one config object per game, no copies elsewhere).
// Difficulty multiplies the physics of a level; a level picks the world and the shape of the landing pad.
//   gravity: fall speed x   fuel: starting fuel   limit: how forgiving the landing limits are (1.2 = 20% more forgiving)
//   wind: sideways gusts in px/s² (0 = none)
export const DIFFICULTIES=[
  {id:'easy',  labelKey:'levels.easy',  descKey:'lander.diff.easy',  gravity:1,   fuel:110,limit:1.2, wind:0},
  {id:'medium',labelKey:'levels.medium',descKey:'lander.diff.medium',gravity:1.3, fuel:95, limit:1,   wind:0},
  {id:'hard',  labelKey:'levels.hard',  descKey:'lander.diff.hard',  gravity:1.6, fuel:80, limit:.85, wind:16}
];
// Levels unlock one after the other (win level 1 to open level 2). Level 3 is the same planet as 2 but with a narrow pad on rough ground.
export const LEVELS=[
  {id:'moon', world:'moon',icon:'🌙',labelKey:'lander.level.moon', descKey:'lander.level.moonDesc', color:'#d5d5e6',pad:120,rough:50},
  {id:'mars', world:'mars',icon:'🔴',labelKey:'lander.level.mars', descKey:'lander.level.marsDesc', color:'#f0b79c',pad:110,rough:55},
  {id:'ridge',world:'mars',icon:'⛰️',labelKey:'lander.level.ridge',descKey:'lander.level.ridgeDesc',color:'#e9c46a',pad:66, rough:95}
];
export const WORLD_BASE={
  moon:{gravity:34,thrust:105,turn:1.5,stabilize:1.1,safeVy:62,safeVx:48,safeAngle:.45,fuelBurn:6,sky:['#0b1030','#2b2f6e'],ground:'#a9a9c6',deco:'earth'},
  mars:{gravity:52,thrust:125,turn:1.5,stabilize:1.1,safeVy:64,safeVx:48,safeAngle:.45,fuelBurn:7,sky:['#3b1717','#c0502f'],ground:'#c9603f',deco:'sun'}
};
export const STORAGE_KEY='fe2.lander';
