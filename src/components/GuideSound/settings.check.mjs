// node src/components/GuideSound/settings.check.mjs
import assert from 'node:assert/strict';
import {cleanSettings,clamp,englishVoices,pickVoice,effectGain,DEFAULTS,RATE_MIN,RATE_MAX} from './settings.js';
let k=0;const t=(n,f)=>{f();k++;console.log('  ok  ',n)};
t('speed stays between 0.7x and 1.3x, volume between 0 and 1',()=>{assert.equal(cleanSettings({rate:5}).rate,RATE_MAX);assert.equal(cleanSettings({rate:.1}).rate,RATE_MIN);assert.equal(cleanSettings({volume:-3}).volume,0);assert.equal(cleanSettings({volume:7}).volume,1)});
t('garbage settings fall back to safe defaults',()=>{assert.deepEqual(cleanSettings(null),{...DEFAULTS,muted:false});assert.equal(cleanSettings({volume:'loud'}).volume,0);assert.equal(clamp('x',0,1),0);assert.equal(cleanSettings({voiceURI:42}).voiceURI,'')});
t('voice list is English only',()=>{const vs=[{lang:'en-US',voiceURI:'a'},{lang:'bn-BD',voiceURI:'b'},{lang:'en',voiceURI:'c'},{lang:'fr-FR',voiceURI:'d'},{lang:'en_GB',voiceURI:'e'}];assert.deepEqual(englishVoices(vs).map(v=>v.voiceURI),['a','c','e']);assert.equal(pickVoice(vs,'b'),null,'a non-English saved voice is ignored');assert.equal(pickVoice(vs,'e').voiceURI,'e')});
t('mute silences effects; volume scales them',()=>{assert.equal(effectGain(.14,{muted:true,volume:1}),0);assert.ok(Math.abs(effectGain(.14,{muted:false,volume:.5})-.07)<1e-9)});
console.log(`\n${k} checks passed`);
