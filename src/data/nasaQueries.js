// Search words sent to the NASA Image and Video Library (https://images.nasa.gov).
// If a result looks wrong, put exact NASA IDs in PINNED (copy from the image page URL: images.nasa.gov/details/<ID>).
export const NASA_QUERY={
  EAGLE:'Apollo 11 lunar module Eagle Tranquility Base',
  VIKRAM:'Chandrayaan-3 Vikram lander LRO',
  SPIRIT:'Spirit rover Mars Exploration Rover',
  OPPY:'Opportunity rover Mars Exploration Rover',
  PHOENIX:'Phoenix Mars Lander',
  INSIGHT:'InSight Mars lander',
  CURIO:'Curiosity rover Mount Sharp selfie',
  PERSY:'Perseverance rover Ingenuity helicopter',
  VOYAGER:'Voyager 1 spacecraft',
  WEBB:'James Webb Space Telescope',
  PARKER:'Parker Solar Probe'
};
// Human-reviewed NASA Image Library selections keyed by canonical robot record id.
export const PINNED={
  'apollo-11-descent-stage':'as11-40-5927',
  'apollo-12-descent-stage':'PIA12922',
  'apollo-14-descent-stage':'as14-66-09277',
  'apollo-15-descent-stage':'S71-43942',
  'apollo-16-descent-stage':'as16-113-18334',
  'apollo-17-descent-stage':'jsc2004e52772',
  'apollo-15-lunar-rover':'as15-88-11901',
  'apollo-16-lunar-rover':'as16-115-18559',
  'apollo-17-lunar-rover':'as17-145-22162',
  'surveyor-3':'KSC-2011-7762',
  'sojourner':'PIA00626',
  'viking-1-lander':'PIA00383',
  'viking-2-lander':'PIA04023',
  'spirit-mer-a':'PIA12354',
  'opportunity-mer-b':'PIA17941',
  'phoenix-lander':'PIA22223',
  'insight-lander':'PIA22571',
  'ingenuity':'PIA26236',
  'chandrayaan-3-vikram':'M1447750764LR',
  'curiosity-msl':'PIA23041',
  'perseverance-mars-2020':'PIA24485',
  'jwst-telescope':'GSFC_20171208_Archive_e000398',
  'parker-solar-probe':'KSC-20180419-PH_KLS01_0009',
  'voyager-1':'PIA14111'
};
export const FEATURED_QUERIES=['Mars rover panorama','Apollo lunar surface','Voyager Jupiter','James Webb deep field','Mars Jezero crater','Moon far side'];
