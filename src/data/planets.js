// Bodies on the Explorer Map. au = REAL distance from the Sun. orbit/size = display values (map is NOT to scale).
// missions = robot nicknames that live there (see data/missions.js). world = 3D globe route (moon|mars).
export const BODIES=[
{id:'sun',name:'Sun',emoji:'☀️',au:0,fact:'The Sun is a star. It holds 99.8% of everything in the solar system, and about 1.3 million Earths could fit inside it!',missions:['PARKER']},
{id:'mercury',name:'Mercury',emoji:'🪨',au:.39,orbit:4.6,size:.22,fact:'The smallest planet. One year here lasts only 88 Earth days!',missions:[]},
{id:'venus',name:'Venus',emoji:'🌕',au:.72,orbit:6,size:.38,fact:'The hottest planet, about 465 °C on the ground, and it spins backwards compared with Earth.',missions:[]},
{id:'earth',name:'Earth',emoji:'🌍',au:1,orbit:7.6,size:.42,fact:'Home sweet home, and the only place we know with life. Up above it, the James Webb telescope watches from 1.5 million km away.',missions:['WEBB']},
{id:'moon',name:'Moon',emoji:'🌙',au:1,fact:'About 384,400 km from Earth. Two of our explorers wait on its dusty ground.',missions:['EAGLE','VIKRAM'],world:'moon',km:'384,400 km from Earth'},
{id:'mars',name:'Mars',emoji:'🔴',au:1.52,orbit:9.2,size:.3,fact:'The red planet. A day (a “sol”) lasts 24 hours 39 minutes, and it has two tiny moons, Phobos and Deimos.',missions:['SPIRIT','OPPY','PHOENIX','INSIGHT','CURIO','PERSY'],world:'mars'},
{id:'jupiter',name:'Jupiter',emoji:'🟠',au:5.2,orbit:13,size:1.05,fact:'The biggest planet. Its Great Red Spot is a giant storm that people have watched for more than 150 years.',missions:[]},
{id:'saturn',name:'Saturn',emoji:'🪐',au:9.54,orbit:17,size:.9,fact:'Its shiny rings are made of chunks of ice and rock. Saturn is so light for its size that it would float in a giant bathtub!',missions:[]},
{id:'uranus',name:'Uranus',emoji:'🔵',au:19.2,orbit:20.5,size:.6,fact:'It spins on its side, like a rolling ball.',missions:[]},
{id:'neptune',name:'Neptune',emoji:'💙',au:30.07,orbit:23.5,size:.58,fact:'The windiest planet, and one year here lasts 165 Earth years.',missions:[]}
];