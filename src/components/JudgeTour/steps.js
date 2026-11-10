// The tour is DATA, not code: add, re-order or hide a step here and nothing else changes.
// route:  hash route to open for this step.   target: CSS selector to highlight (optional, tour continues if it never appears).
// ready:  false = the feature is not built yet, so the step is skipped. Flip to true when its screen exists.
import {MISSIONS} from '../../data/missions.js';
// The robot used by the robot and Last Message steps is the first one in the data, so renaming or reordering robots never breaks the tour.
const FIRST_ROBOT=MISSIONS[0]?.id;
export const TOUR_STEPS=[
  {id:'map',route:'/map',target:'#mapbox',ready:true},
  {id:'robot',route:`/mission/${FIRST_ROBOT}`,target:'.mtitle',ready:true},
  {id:'lastMessage',route:`/last-message/${FIRST_ROBOT}`,target:'.lm-stage',ready:true},
  {id:'live',route:'/live',target:'#livebox',ready:true},
  {id:'language',route:'/hub',target:'.langsel',ready:true}
];
export const TOUR_STORAGE_KEY='fe2.tour';
