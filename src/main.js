// Bootstrap: styles, chrome (top bar / tab bar), routes.
import './styles/tokens.css';import './styles/base.css';import './styles/app.css';import './styles/map.css';
import {route,start} from './router/router.js';
import {mountChrome} from './components/TopBar.js';
import Landing from './screens/Landing.js';import Map from './screens/Map.js';import Hub from './screens/Hub.js';import World from './screens/World.js';import Mission from './screens/Mission.js';
import Quiz from './screens/Quiz.js';import Play from './screens/Play.js';import Album from './screens/Album.js';import Timeline from './screens/Timeline.js';
import Lander from './games/LunarLander.js';import Memory from './games/MemoryMatch.js';
import DataSources from './screens/DataSources/DataSources.js';
import LastMessage from './screens/LastMessage/LastMessage.js';
import MoonBuggy from './games/MoonBuggy/MoonBuggy.js';
import WhyLeft from './screens/WhyLeft/WhyLeft.js';
import Live from './screens/Live/Live.js';
route('/',Landing);route('/map',Map);route('/hub',Hub);route('/world/:k',World);route('/mission/:id',Mission);route('/quiz',Quiz);
route('/play',Play);route('/play/lander',Lander);route('/play/memory',Memory);route('/play/buggy',MoonBuggy);route('/album',Album);route('/timeline',Timeline);route('/sources',DataSources);route('/why',WhyLeft);route('/live',Live);route('/last-message',LastMessage);route('/last-message/:id',LastMessage);
mountChrome();start(document.getElementById('view'));