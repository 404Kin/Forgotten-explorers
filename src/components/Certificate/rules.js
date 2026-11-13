// When may a player download the REAL certificate? Only when every robot is woken. Pure functions (no DOM, no storage), so they are
// easy to test. XP, rank and level are deliberately NOT part of this: only the list of woken robots counts.
/**
 * @param {string[]} collected  nicknames of woken robots (from the saved game)
 * @param {{n:string}[]} robots  the real robot list
 */
export function certificateProgress(collected,robots){
  const names=new Set(robots.map(r=>r.n)),woken=new Set((collected||[]).filter(n=>names.has(n))).size; // stale or unknown names do not count
  const total=robots.length;
  return{woken,total,left:Math.max(0,total-woken),percent:total?Math.round(woken/total*100):0,unlocked:total>0&&woken>=total};
}
export const isCertificateUnlocked=(collected,robots)=>certificateProgress(collected,robots).unlocked;
