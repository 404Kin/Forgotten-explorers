// One place that describes every language. To add one: drop locales/<code>.json, add a row here, set enabled:true.
// "font" is loaded only when that language is chosen (lazy), because Archivo/Nunito have no Bangla or Arabic glyphs.
export const DEFAULT_LANG='en';
export const STORAGE_KEY='fe2.lang';
export const LANGUAGES=[
  {code:'en',label:'English',dir:'ltr',enabled:true},
  {code:'bn',label:'বাংলা',dir:'ltr',enabled:true,font:'https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;700;800&display=swap'},
  // Ready for Arabic + right-to-left: flip enabled to true once locales/ar.json exists.
  {code:'ar',label:'العربية',dir:'rtl',enabled:false,font:'https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;700;800&display=swap'}
];
