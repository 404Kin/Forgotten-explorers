// The tour is DATA, not code: add, re-order or hide a step here and nothing else changes.
// route:  hash route to open for this step.   target: CSS selector to highlight (optional, tour continues if it never appears).
// ready:  false = the feature is not built yet, so the step is skipped. Flip to true when its screen exists.
export const TOUR_STEPS=[
  {id:'map',route:'/map',target:'#mapbox',ready:true},
  {id:'robot',route:'/mission/curiosity-msl',target:'.mtitle',ready:true},
  // PLACEHOLDER until task 7 (Last Message) registers this route.
  {id:'lastMessage',route:'/last-message',target:null,ready:false},
  // PLACEHOLDER until task 6 (Still Talking tracker) registers this route.
  {id:'live',route:'/live',target:null,ready:false},
  {id:'language',route:'/hub',target:'.langsel',ready:true}
];
export const TOUR_STORAGE_KEY='fe2.tour';
