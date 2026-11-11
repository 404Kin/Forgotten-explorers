// One place to plug in routes.
import {registerHealth} from './health.js';
import {registerImages} from './images.js';
import {registerLive} from './live.js';
import {registerRobots} from './robots.js';
export function registerRoutes(router,deps){registerHealth(router,deps);registerRobots(router,deps);registerImages(router,deps);registerLive(router,deps)}
