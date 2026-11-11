// WCAG contrast helper. Robot colours come from data (src/data/missions.js: background `c`, preferred text colour `k`).
// Some pairs fail 4.5:1 (white on Voyager grey = 3.3), so we keep the data's choice when it is readable and otherwise
// switch to whichever of dark ink / white reads better. Colours stay data-driven; readability is guaranteed here.
const INK='#14122b',WHITE='#ffffff';

const lum=hex=>{
  const h=hex.replace('#',''),n=h.length===3?[...h].map(c=>c+c).join(''):h;
  const [r,g,b]=[0,2,4].map(i=>parseInt(n.slice(i,i+2),16)/255).map(v=>v<=.03928?v/12.92:((v+.055)/1.055)**2.4);
  return .2126*r+.7152*g+.0722*b;
};
export const contrast=(a,b)=>{const [x,y]=[lum(a),lum(b)].sort((p,q)=>q-p);return (x+.05)/(y+.05)};

/** Text colour for background `bg`: `preferred` if it has at least 4.5:1, else the better of ink/white. */
export function inkFor(bg,preferred=INK){
  try{
    if(contrast(bg,preferred)>=4.5)return preferred;
    return contrast(bg,INK)>=contrast(bg,WHITE)?INK:WHITE;
  }catch{return preferred}
}
