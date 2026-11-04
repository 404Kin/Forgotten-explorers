// MISSIONS = story + quiz + art (hand-written) merged with REAL mission data (relics.json).
// To add a mission: add an object to D, an id in RID, a NASA search query in nasaQueries.js.
import {rover,lander,voyager,webb,parker} from '../art/robots.js';
import RELICS from './relics.json';
import {NASA_QUERY} from './nasaQueries.js';
const K='#14122b';

const D=[
{n:'EAGLE',t:'I still bounce lasers!',w:'moon',y:1969,a:1,c:'#f2c240',k:K,g:'☾',ch:()=>lander({c:'#f4c04a',arm:0}),
p:[['Meet me','I’m the bottom half of the Eagle lander. On July 20, 1969, I set two astronauts down on the Moon.'],['My job','I was their landing ship and their launch pad. A plaque on my leg says they came in peace for all humankind.'],['Right now','I’m still on the Moon! A laser mirror left beside me still bounces light back to Earth.']],q:['What left on the Moon still bounces laser light to Earth?','A mirror from Apollo 11','A giant flashlight','A Moon disco ball']},
{n:'VIKRAM',t:'India’s Moon lander',w:'moon',y:2023,a:0,c:'#fff',k:K,g:'✦',ch:()=>lander({c:'#e9e9f4',flag:1}),
p:[['Meet me','I’m Vikram, India’s Moon lander. A little rover named Pragyan rode inside me.'],['My job','On August 23, 2023, we landed near the Moon’s south pole, a place no one had landed before. Pragyan rolled out to test the soil.'],['Right now','The long, cold Moon night came and we fell asleep. A NASA orbiter even took a photo of our landing spot!']],q:['Where did Vikram land?','Near the Moon’s south pole','On Mars','In the ocean']},
{n:'SPIRIT',t:'Stuck, but loved',w:'mars',y:2004,a:0,c:'#5fb7b0',k:K,g:'♂',ch:()=>rover({c:'#f1f1f8',panel:1}),
p:[['Meet me','I’m Spirit! I landed on Mars in January 2004 with my twin, Oppy.'],['My job','We were built for 90 days. I explored for over six years and found clues that hot water once touched the ground.'],['Right now','In 2010 I got stuck in soft sand and the cold winter put me to sleep. I’m still on Mars.']],q:['What happened to Spirit in 2010?','It got stuck in soft sand','It ran out of snacks','It flew away']},
{n:'OPPY',t:'14 years, wow!',w:'mars',y:2004,a:0,c:'#e5533d',k:K,g:'☀',ch:()=>rover({c:'#fbe9c8',panel:1}),
p:[['Meet me','I’m Oppy, Spirit’s twin. I landed on Mars in January 2004.'],['My job','Scientists planned for 90 days. I worked for almost 14 years and drove farther than a marathon! I found proof that water once flowed here.'],['Right now','In 2018 a giant dust storm hid the Sun. My batteries ran low and I went quiet. Thank you for remembering me.']],q:['How long did Oppy work?','Almost 14 years','90 days','One week']},
{n:'PHOENIX',t:'The ice digger',w:'mars',y:2008,a:0,c:'#f0b79c',k:K,g:'❄',ch:()=>lander({c:'#fff6e8',round:1,arm:1}),
p:[['Meet me','I’m Phoenix. I landed near Mars’s north pole on May 25, 2008.'],['My job','I had a robot arm like a scoop. I dug into the ground and found frozen water ice hiding under the dust!'],['Right now','Winter came, the Sun went away, and my solar panels couldn’t charge. I fell asleep in 2008.']],q:['What did Phoenix find under the dust?','Water ice','Gold','Spaghetti']},
{n:'INSIGHT',t:'I hear marsquakes',w:'mars',y:2018,a:0,c:'#1d6fb0',k:'#fff',g:'≋',ch:()=>lander({c:'#f1f1f8',round:1}),
p:[['Meet me','I’m InSight. I landed on Mars in November 2018 and never moved. I was a listener.'],['My job','I put a super-sensitive seismometer on the ground to hear marsquakes and learn what is inside Mars.'],['Right now','Dust covered my solar panels and I ran out of power in 2022, after hearing more than a thousand quakes!']],q:['What did InSight listen for?','Marsquakes','Music','Martian songs']},
{n:'CURIO',t:'Still rolling!',w:'mars',y:2012,a:1,c:'#1d3f73',k:'#fff',g:'?',ch:()=>rover({c:'#f4e2c0',rtg:1,arm:1}),
p:[['Meet me','I’m Curiosity, a rover as big as a car. I landed in Gale Crater on Mars in August 2012.'],['My job','I climb a giant mountain called Mount Sharp and drill rocks to hunt for the ingredients life needs.'],['Right now','I’m still awake and rolling! I found that Mars once had lakes and streams.']],q:['How did Curiosity land?','Lowered by a sky crane','Bounced on a trampoline','Rode a slide']},
{n:'PERSY',t:'Best friend of a helicopter',w:'mars',y:2021,a:1,c:'#7a2d4e',k:'#fff',g:'✿',ch:()=>rover({c:'#fff',heli:1,arm:1}),
p:[['Meet me','I’m Perseverance. I landed on Mars in February 2021 with a helicopter friend named Ingenuity.'],['My job','I collect rock samples in tubes so future missions can bring them back to Earth.'],['Right now','I’m still working! Ingenuity flew 72 times, the first helicopter to fly on another world, before retiring in 2024.']],q:['What was Ingenuity?','A helicopter on Mars','A hot-air balloon','A submarine']},
{n:'VOYAGER',t:'Hello, space!',w:'deep',y:1977,a:1,c:'#8c8c9e',k:'#fff',g:'☄',ch:voyager,
p:[['Meet me','I’m Voyager 1! I zoomed away from Earth in 1977 and I’m still talking to home.'],['My job','I explored Jupiter and Saturn. Then in 2012 I became the first spacecraft to fly into interstellar space.'],['Right now','I’m more than 24 billion kilometers away. A message from me takes almost a whole day to reach you. I carry a golden record of Earth sounds.']],q:['Where is Voyager 1 flying now?','Interstellar space','On the Moon','Inside Mars']},
{n:'WEBB',t:'Golden eyes',w:'deep',y:2021,a:1,c:'#8fd8b3',k:K,g:'✧',ch:webb,
p:[['Meet me','I’m the James Webb Space Telescope. I launched on Christmas Day 2021. My mirror has 18 golden hexagons.'],['My job','I see infrared light, so I can peek at the very first galaxies and at planets around other stars.'],['Right now','I’m about 1.5 million kilometers from Earth, kept cold by a sunshield as big as a tennis court.']],q:['How many golden mirror pieces does Webb have?','18','3','1,000']},
{n:'PARKER',t:'I touch the Sun',w:'deep',y:2018,a:1,c:'#ff9d4d',k:K,g:'☼',ch:parker,
p:[['Meet me','I’m Parker Solar Probe. I launched in 2018 to visit our Sun.'],['My job','I fly through the Sun’s super-hot outer air, protected by a thick heat shield.'],['Right now','I’m still looping around the Sun, closer than any spacecraft has ever been. I’m the fastest human-made thing ever!']],q:['What protects Parker from the heat?','A thick heat shield','An umbrella','Ice cream']}];
const INTRO=['Shhh… the stars are sleepy tonight.','Far, far away, little robots are still out there. Some finished their jobs and fell asleep. Some are still awake.','They were left behind, but never forgotten. I’m Pip! Will you help me say hello to every one?'];


const RID={EAGLE:'apollo-11-lrrr',VIKRAM:'chandrayaan-3',SPIRIT:'spirit-mer-a',OPPY:'opportunity-mer-b',PHOENIX:'phoenix-lander',INSIGHT:'insight-lander',CURIO:'curiosity-msl',PERSY:'perseverance-ingenuity',VOYAGER:'voyager-1',WEBB:'jwst-telescope',PARKER:'parker-solar-probe'};
// n=nickname t=tagline w=world(moon|mars|deep) y=year a=still awake c/k=card+ink colors g=glyph ch=art p=story pages q=[question,right,wrong,wrong]
export const MISSIONS=D.map((d,index)=>({...d,index,id:RID[d.n],real:RELICS.find(r=>r.id===RID[d.n]),nasaQuery:NASA_QUERY[d.n]}));
export const WORLDS={moon:{name:'The Moon',emoji:'🌙'},mars:{name:'Mars',emoji:'🔴'},deep:{name:'Deep space',emoji:'🚀'}};
export {INTRO};
