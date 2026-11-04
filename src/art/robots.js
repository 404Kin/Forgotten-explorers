// Flat, thick-outline robot illustrations (SVG strings, viewBox 0 0 200 200).
// Add a robot: write a new function here, then reference it from data/missions.js
const K='#14122b';
/* ---------- flat characters ---------- */
const P=(d,f,x='')=>`<path d="${d}" fill="${f}" stroke="${K}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round" ${x}/>`;
const Ci=(x,y,r,f)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${f}" stroke="${K}" stroke-width="5"/>`;
const Rc=(x,y,w,h,r,f)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${f}" stroke="${K}" stroke-width="5" stroke-linejoin="round"/>`;
const wh=(x,y,r=15)=>Ci(x,y,r,'#3d3a6b')+Ci(x,y,r/3,'#ffd34e');
const face=(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="-11" rx="9" ry="10" fill="#fff" stroke="${K}" stroke-width="3.5"/><ellipse cx="11" rx="9" ry="10" fill="#fff" stroke="${K}" stroke-width="3.5"/><circle cx="-9" cy="2" r="4.5" fill="${K}"/><circle cx="13" cy="2" r="4.5" fill="${K}"/><circle cx="-7.5" cy="0" r="1.6" fill="#fff"/><circle cx="14.5" cy="0" r="1.6" fill="#fff"/><path d="M-6 17q6 7 12 0" fill="none" stroke="${K}" stroke-width="3.5" stroke-linecap="round"/><circle cx="-23" cy="13" r="4" fill="#ff8fa3"/><circle cx="23" cy="13" r="4" fill="#ff8fa3"/></g>`;
const SOL='#3a58b8';
function rover(o){return (o.panel?P('M52 80 L68 54 L150 54 L162 80Z',SOL):'')+(o.heli?Rc(92,36,16,14,4,'#fff')+`<path d="M60 34 H140" stroke="${K}" stroke-width="5" stroke-linecap="round"/>`:'')+Rc(62,34,9,48,3,'#ddd')+Rc(50,24,32,20,7,'#eee')+Ci(60,34,4,K)+Rc(44,78,112,52,14,o.c)+(o.rtg?Rc(150,92,28,16,5,'#bbb'):'')+(o.arm?`<path d="M156 108 L182 122 L184 142" fill="none" stroke="${K}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`:'')+[58,100,142].map(x=>wh(x,152)).join('')+face(100,104)}
function lander(o){return `<path d="M72 125 L44 170 M128 125 L156 170 M88 130 L80 172 M112 130 L120 172" stroke="${K}" stroke-width="7" stroke-linecap="round"/>`+[44,156,80,120].map((x,i)=>`<ellipse cx="${x}" cy="${i<2?172:174}" rx="13" ry="5" fill="#ddd" stroke="${K}" stroke-width="4"/>`).join('')+(o.round?`<path d="M52 100 H26 M148 100 H174" stroke="${K}" stroke-width="6"/>`+Ci(22,100,24,SOL)+Ci(178,100,24,SOL):'')+P('M70 66 L130 66 L152 88 L152 128 L130 148 L70 148 L48 128 L48 88Z',o.c)+(o.arm?`<path d="M150 112 L184 124 L186 146" fill="none" stroke="${K}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`:'')+(o.flag?Rc(90,40,30,18,3,'#fff')+`<path d="M90 40 V70" stroke="${K}" stroke-width="5"/>`+'<rect x="93" y="43" width="24" height="5" fill="#ff9933"/><rect x="93" y="53" width="24" height="3" fill="#138808"/>':'')+face(100,104)}
function voyager(){return Rc(78,122,44,36,6,'#f2c240')+Ci(100,166,13,'#ffd34e')+`<path d="M168 72 L194 42" stroke="${K}" stroke-width="6" stroke-linecap="round"/>`+Rc(184,28,16,16,3,'#bbb')+P('M22 72 Q100 168 178 72 Q100 36 22 72Z','#fff')+face(100,86,.9)}
function webb(){const h=(x,y,r)=>P([0,1,2,3,4,5].map(i=>`${i?'L':'M'}${(x+r*Math.cos(i*Math.PI/3)).toFixed(1)} ${(y+r*Math.sin(i*Math.PI/3)).toFixed(1)}`).join('')+'Z','#ffd34e');
let s=P('M14 162 L100 188 L186 162 L156 144 L44 144Z','#c3a6ff')+P('M30 150 L100 170 L170 150','none');s+=h(100,88,23);for(let i=0;i<6;i++)s+=h(100+43*Math.cos(i*Math.PI/3+Math.PI/6),88+43*Math.sin(i*Math.PI/3+Math.PI/6),23);return s+face(100,90,.7)}
function parker(){let f='';for(let i=0;i<12;i++){const a=i*Math.PI/6,b=a+Math.PI/12,c=a+Math.PI/6;f+=`${i?'L':'M'}${100+66*Math.cos(a)} ${100+66*Math.sin(a)} L${100+90*Math.cos(b)} ${100+90*Math.sin(b)} `}
return P(f+'Z','#ff7a2e')+Ci(100,100,60,'#ffb02e')+Rc(10,92,34,16,4,SOL)+Rc(156,92,34,16,4,SOL)+Rc(68,68,64,64,18,'#eee')+face(100,102,.85)}

export {rover,lander,voyager,webb,parker,face};
