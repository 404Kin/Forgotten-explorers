// Everything tweakable about the race is here (config-driven, like LunarLander's WORLDS). Units: pixels and seconds.
// jump/gravity are chosen together: apex = jump^2 / (2*gravity), air distance = speed * 2*jump/gravity.
// Check: moon apex ~98px, ~190px of air at 205px/s, and no crater is wider than 110px, so every obstacle can be cleared.
export const TRACKS={
  moon:{id:'moon',length:8000,gravity:900,jump:420,speed:{start:185,end:235},
    obstacleGap:[300,430],crater:{w:[80,108],depth:46},rock:{w:[26,38],h:[22,32]},hills:11,
    sky:['#0b1030','#2b2f6e'],ground:'#9a9ab8',far:'#6c6c91',decor:'earth'},
  mars:{id:'mars',length:9000,gravity:1300,jump:520,speed:{start:200,end:260},
    obstacleGap:[260,380],crater:{w:[70,96],depth:44},rock:{w:[26,40],h:[24,34]},hills:14,
    sky:['#3b1717','#b5452a'],ground:'#c9603f',far:'#8a3a28',decor:'sun'}
};
export const TRACK_IDS=Object.keys(TRACKS);
export const LIVES=3;
// Relaxed mode (also the default when the player prefers reduced motion) slows everything down.
export const RELAXED_FACTOR=.72;
export const VIEW={w:640,h:360,groundY:268,buggyScreenX:150};
