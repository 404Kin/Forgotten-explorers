// Sound effects (made live with the Web Audio API) and Pip's read-aloud voice.
// Both follow the shared settings (mute, volume, speed, voice): src/components/GuideSound/settings.js.
// Browsers only allow sound after the player has touched the page, so speaking is refused until a first tap or key press.
import {getSoundSettings,effectGain,pickVoice} from '../components/GuideSound/settings.js';

let AC,touched=false;
if(typeof addEventListener==='function')for(const ev of ['pointerdown','keydown'])addEventListener(ev,()=>{touched=true},{capture:true,once:true,passive:true});
const userHasTouched=()=>touched||Boolean(globalThis.navigator?.userActivation?.hasBeenActive);

const tone=(f,t0,d,v=.14,type='sine')=>{
  const g0=effectGain(v,getSoundSettings());if(g0<=0)return;
  try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.value=f;o.connect(g);g.connect(AC.destination);const t=AC.currentTime+t0;g.gain.setValueAtTime(g0,t);g.gain.exponentialRampToValueAtTime(.0005,t+d);o.start(t);o.stop(t+d)}catch{}
};
export const sfx={good:()=>[523,659,784].forEach((f,i)=>tone(f,i*.11,.3)),bad:()=>[220,165].forEach((f,i)=>tone(f,i*.14,.25,.12,'triangle')),tap:()=>tone(700,0,.07,.08),win:()=>[523,659,784,1047].forEach((f,i)=>tone(f,i*.12,.4))};

/** Read text aloud. Returns false (and says nothing) when muted or before the first tap. */
export function speak(text){
  const s=getSoundSettings();
  if(s.muted||s.volume<=0||!userHasTouched())return false;
  try{
    speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(text);
    u.rate=s.rate*.95;u.pitch=1.25;u.volume=s.volume;
    const v=pickVoice(speechSynthesis.getVoices(),s.voiceURI);if(v){u.voice=v;u.lang=v.lang}else u.lang='en-US';
    speechSynthesis.speak(u);return true;
  }catch{return false}
}
export const stopSpeak=()=>{try{speechSynthesis.cancel()}catch{}};
