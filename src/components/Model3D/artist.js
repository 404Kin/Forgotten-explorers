// Simple built-in models for robots that have NO model in NASA's 3D collection.
// They are drawn in the same flat, friendly style as the rest of the app and are always shown with the label
// "Artist model, not NASA data". They show the general idea of the machine, not exact measurements.
// All builders take the THREE namespace (so this file does not load three.js itself) and return a THREE.Group about 2 units wide.

const COLORS={body:0xf2c240,foil:0xe0b84a,panel:0x3a58b8,metal:0xdfe3f2,dark:0x2a2a40,wheel:0x3d3a6b,accent:0xfc3d21,white:0xf4f6ff};

export function makeArtistModel(THREE,builder){
  const mat=(c,o={})=>new THREE.MeshStandardMaterial({color:c,roughness:.7,metalness:.1,flatShading:true,...o});
  const box=(w,h,d,c,x=0,y=0,z=0)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(c));m.position.set(x,y,z);return m};
  const cyl=(rt,rb,h,c,x=0,y=0,z=0,seg=16)=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,seg),mat(c));m.position.set(x,y,z);return m};
  const wheel=(r,w,x,y,z)=>{const g=new THREE.Group(),t=cyl(r,r,w,COLORS.wheel,0,0,0,18);t.rotation.z=Math.PI/2;const hub=cyl(r*.4,r*.4,w*1.15,COLORS.metal,0,0,0,10);hub.rotation.z=Math.PI/2;g.add(t,hub);g.position.set(x,y,z);return g};
  const leg=(x,z,h=.7)=>{const g=new THREE.Group(),l=cyl(.035,.035,h,COLORS.metal,0,0,0,6);l.position.set(x*.55,h/2,z*.55);l.rotation.z=-x*.45;l.rotation.x=z*.45;const foot=cyl(.12,.12,.03,COLORS.metal,x,0,z,12);g.add(l,foot);return g};
  const g=new THREE.Group();

  if(builder==='lunarRover'){                         // open frame, four wheels, two seats, dish antenna
    g.add(box(1.5,.08,.8,COLORS.metal,0,.45,0),box(.5,.5,.06,COLORS.white,-.3,.75,-.22),box(.5,.5,.06,COLORS.white,-.3,.75,.22));
    for(const[x,z]of[[-.6,-.5],[.6,-.5],[-.6,.5],[.6,.5]])g.add(wheel(.26,.12,x,.26,z));
    g.add(cyl(.02,.02,.9,COLORS.metal,.55,.9,0,6));const dish=new THREE.Mesh(new THREE.SphereGeometry(.3,16,8,0,Math.PI*2,0,Math.PI/2),mat(COLORS.white,{side:THREE.DoubleSide}));dish.position.set(.55,1.35,0);dish.rotation.x=Math.PI*.35;g.add(dish);
    g.add(box(.35,.2,.5,COLORS.body,.55,.55,0));
  }else if(builder==='tripodLander'){                 // three legs, a box deck, a tall mast with a solar panel
    g.add(box(.9,.35,.9,COLORS.foil,0,.85,0),cyl(.04,.04,1,COLORS.metal,0,1.55,0,8),box(.85,.04,.55,COLORS.panel,0,2.05,0));
    for(const[x,z]of[[1,0],[-.5,.87],[-.5,-.87]])g.add(leg(x,z,.85));
    g.add(box(.3,.3,.3,COLORS.white,.55,1.05,.3));
  }else if(builder==='smallRover'){                   // small body, solar panel on top, six wheels, short antenna
    g.add(box(.95,.28,.65,COLORS.white,0,.42,0),box(.95,.04,.65,COLORS.panel,0,.6,0),cyl(.015,.015,.5,COLORS.metal,.4,.85,.2,6));
    for(const x of[-.38,0,.38])for(const z of[-.42,.42])g.add(wheel(.17,.1,x,.2,z));
  }else if(builder==='solarLander'){                  // round deck, three legs, two round solar panels, an arm
    g.add(cyl(.55,.6,.28,COLORS.white,0,.85,0,6));
    for(const s of[-1,1]){const p=cyl(.55,.55,.03,COLORS.panel,s*1.0,1.0,0,20);p.rotation.z=s*.12;g.add(p)}
    for(const[x,z]of[[1,0],[-.5,.87],[-.5,-.87]])g.add(leg(x,z,.8));
    g.add(box(.9,.07,.07,COLORS.metal,.5,1.15,.35),cyl(.03,.03,.7,COLORS.metal,0,1.3,-.2,6));
  }else if(builder==='boxLander'){                    // square body, four legs, panel on top
    g.add(box(1,.55,1,COLORS.white,0,.9,0),box(1,.04,1,COLORS.panel,0,1.2,0));
    for(const[x,z]of[[1,1],[-1,1],[1,-1],[-1,-1]])g.add(leg(x*.8,z*.8,.75));
    g.add(box(.3,.15,.3,COLORS.accent,0,1.35,0));
  }else{                                              // 'bigRover': car-sized body, six wheels, mast with camera head, arm, RTG tail
    g.add(box(1.3,.4,.8,COLORS.white,0,.75,0),box(.35,.35,.5,COLORS.metal,-.8,.8,0),cyl(.03,.03,.6,COLORS.metal,.3,1.2,.2,6),box(.25,.15,.2,COLORS.dark,.3,1.55,.2));
    for(const x of[-.55,0,.55])for(const z of[-.52,.52])g.add(wheel(.24,.14,x,.25,z));
    g.add(box(.6,.06,.06,COLORS.metal,.9,.7,-.25));
  }
  return g;
}
