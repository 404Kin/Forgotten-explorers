// ONE config for every 3D model (no copy paste per robot). To add a model: add a row to MODELS and map the robot ids to it in ROBOT_MODEL.
//   kind 'nasa'   : a real NASA model file in public/models/ (credit + source page are shown with it)
//   kind 'artist' : built in code by artist.js. Always labelled "Artist model, not NASA data". NEVER presented as a NASA model.
//   scale  : size multiplier after the model is fitted into the view   camera: {dist: how far away, height: how high, fov}
//   note   : plain words shown under real models that stand in for a twin or a whole vehicle (so nobody is misled)
// Every NASA row was checked on 2026-11-13: the file is in github.com/nasa/NASA-3D-Resources and the source page answers 200.
const NASA_REPO='https://github.com/nasa/NASA-3D-Resources';
export const MODELS={
  'apollo-lm':{kind:'nasa',file:'apollo-lunar-module.glb',title:'Apollo Lunar Module',credit:'NASA',source:'https://science.nasa.gov/3d-resources/apollo-lunar-module/',repo:NASA_REPO,scale:1,camera:{dist:2.6,height:.5,fov:40},
    noteKey:'model.note.apolloLm'},
  'mer':{kind:'nasa',file:'mer-opportunity.glb',title:'Mars Exploration Rover (Opportunity, MER-B)',credit:'NASA/JPL-Caltech',source:'https://science.nasa.gov/3d-resources/mars-exploration-rover-opportunity-mer-b/',repo:NASA_REPO,scale:1,camera:{dist:2.7,height:.55,fov:40}},
  'viking':{kind:'nasa',file:'viking-lander.glb',title:'Viking Lander',credit:'NASA',source:'https://science.nasa.gov/3d-resources/viking-lander/',repo:NASA_REPO,scale:1,camera:{dist:2.7,height:.5,fov:40},noteKey:'model.note.viking'},
  'ingenuity':{kind:'nasa',file:'ingenuity.glb',title:'Ingenuity Mars Helicopter',credit:'NASA/JPL-Caltech',source:'https://science.nasa.gov/3d-resources/ingenuity-mars-helicopter/',repo:NASA_REPO,scale:1,camera:{dist:2.6,height:.4,fov:40}},
  'insight':{kind:'nasa',file:'insight.glb',title:'InSight Lander',credit:'NASA/JPL-Caltech',source:'https://science.nasa.gov/3d-resources/insight-cruise-lander/',repo:NASA_REPO,scale:1,camera:{dist:2.8,height:.6,fov:40}},
  'perseverance':{kind:'nasa',file:'perseverance.glb',title:'Mars 2020 Perseverance Rover',credit:'NASA/JPL-Caltech',source:'https://science.nasa.gov/3d-resources/mars-2020-perseverance-rover/',repo:NASA_REPO,scale:1,camera:{dist:2.7,height:.5,fov:40}},
  'voyager':{kind:'nasa',file:'voyager.glb',title:'Voyager Probe',credit:'NASA/JPL-Caltech',source:'https://science.nasa.gov/3d-resources/voyager-probe-a/',repo:NASA_REPO,scale:1,camera:{dist:2.6,height:.3,fov:40}},
  'jwst':{kind:'nasa',file:'jwst.glb',title:'James Webb Space Telescope',credit:'NASA/Goddard',source:'https://science.nasa.gov/3d-resources/james-webb-space-telescope-b/',repo:NASA_REPO,scale:1,camera:{dist:2.7,height:.5,fov:40}},
  'parker':{kind:'nasa',file:'parker-solar-probe.glb',title:'Parker Solar Probe',credit:'NASA/Johns Hopkins APL',source:'https://science.nasa.gov/3d-resources/parker-solar-probe/',repo:NASA_REPO,scale:1,camera:{dist:2.6,height:.4,fov:40}},
  // ---- artist models (no NASA model exists in the NASA 3D Resources collection for these) ----
  'lrv':{kind:'artist',builder:'lunarRover',title:'Lunar Roving Vehicle',scale:1,camera:{dist:2.4,height:.6,fov:40}},
  'surveyor':{kind:'artist',builder:'tripodLander',title:'Surveyor lander',scale:1,camera:{dist:2.4,height:.6,fov:40}},
  'sojourner':{kind:'artist',builder:'smallRover',title:'Sojourner rover',scale:1,camera:{dist:2.3,height:.6,fov:40}},
  'phoenix':{kind:'artist',builder:'solarLander',title:'Phoenix lander',scale:1,camera:{dist:2.5,height:.6,fov:40}},
  'vikram':{kind:'artist',builder:'boxLander',title:'Vikram lander',scale:1,camera:{dist:2.4,height:.6,fov:40}},
  'curiosity':{kind:'artist',builder:'bigRover',title:'Curiosity rover',scale:1,camera:{dist:2.5,height:.6,fov:40}}
};
// robot id (record id) -> model key
export const ROBOT_MODEL={
  'apollo-11-descent-stage':'apollo-lm','apollo-12-descent-stage':'apollo-lm','apollo-14-descent-stage':'apollo-lm','apollo-15-descent-stage':'apollo-lm','apollo-16-descent-stage':'apollo-lm','apollo-17-descent-stage':'apollo-lm',
  'apollo-15-lunar-rover':'lrv','apollo-16-lunar-rover':'lrv','apollo-17-lunar-rover':'lrv',
  'surveyor-3':'surveyor','sojourner':'sojourner','viking-1-lander':'viking','viking-2-lander':'viking',
  'spirit-mer-a':'mer','opportunity-mer-b':'mer','phoenix-lander':'phoenix','insight-lander':'insight','ingenuity':'ingenuity',
  'chandrayaan-3-vikram':'vikram','curiosity-msl':'curiosity','perseverance-mars-2020':'perseverance','jwst-telescope':'jwst','parker-solar-probe':'parker','voyager-1':'voyager'
};
// Some real models stand in for a twin (Spirit = Opportunity's twin) or show a whole vehicle: say so in plain words.
export const ROBOT_NOTE={'spirit-mer-a':'model.note.spiritTwin'};
// Short labelled parts, ONLY where the fact is already in our data (source noted). label/text are English data text, translated with tx() if a key exists.
export const PARTS={
  'curiosity-msl':[{label:'Wheels',text:'A 6-wheel rocker-bogie mobility system.',from:'src/data/missionDetails.js (hardware)'},{label:'Robotic arm',text:'A 2-meter robotic arm.',from:'src/data/missionDetails.js (hardware)'}],
  'apollo-11-descent-stage':[{label:'Plaque',text:'A plaque on a leg says they came in peace for all humankind.',from:'src/data/missions.js (EAGLE story)'},{label:'Laser mirror',text:'A laser mirror left beside it still bounces light back to Earth.',from:'src/data/missions.js (EAGLE story)'}]
};
export const modelFor=robotId=>{const key=ROBOT_MODEL[robotId];return key?{key,...MODELS[key]}:null};
