// One place to plug in routes. Next step adds: images, live/distance, live/dsn.
import {registerHealth} from './health.js';
import {registerRobots} from './robots.js';
export function registerRoutes(router,deps){registerHealth(router,deps);registerRobots(router,deps)}
