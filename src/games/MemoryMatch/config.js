// Memory Match: one config object. More pairs = a bigger grid = harder. No locks: any size can be played at any time.
export const LEVELS=[
  {id:'small', icon:'🟦',labelKey:'memory.level.small', descKey:'memory.level.smallDesc', color:'#8fd8b3',pairs:6, cols:4},
  {id:'medium',icon:'🟨',labelKey:'memory.level.medium',descKey:'memory.level.mediumDesc',color:'#ffd34e',pairs:8, cols:4},
  {id:'large', icon:'🟥',labelKey:'memory.level.large', descKey:'memory.level.largeDesc', color:'#ff8fa3',pairs:10,cols:5}
];
export const PEEK_MS=2200,MISMATCH_MS=900,STORAGE_KEY='fe2.memory';
// Stars by moves per pair: a perfect game needs 1 move per pair.
export const STAR_MOVES_PER_PAIR={three:1.7,two:2.6};
