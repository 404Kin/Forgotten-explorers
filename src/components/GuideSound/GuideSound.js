// Small sound panel for Pip's narration: Mute, Volume, Speed (0.7x to 1.3x), Voice (English only), Test and Stop.
// Put it on any screen that can read aloud. Settings are saved and also control the sound effects in the games.
import './GuideSound.css';
import {t} from '../../i18n/index.js';
import {getSoundSettings,setSoundSettings,englishVoices,RATE_MIN,RATE_MAX} from './settings.js';
import {speak,stopSpeak} from '../../services/audio.js';

const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let uid=0;

export function createGuideSoundPanel(){
  const id=`gs${++uid}`,s=getSoundSettings();
  const box=document.createElement('details');box.className='gsound';
  box.innerHTML=`<summary><span aria-hidden="true">🔊</span> ${t('guide.title')}</summary><div class="gsound-body">`+
    `<button type="button" class="btn sm alt" data-a="mute" aria-pressed="${s.muted}">${s.muted?'🔇 '+t('guide.unmute'):'🔊 '+t('guide.mute')}</button>`+
    `<label for="${id}v">${t('guide.volume')} <output id="${id}vo">${Math.round(s.volume*100)}%</output></label><input id="${id}v" type="range" min="0" max="100" step="5" value="${Math.round(s.volume*100)}">`+
    `<label for="${id}r">${t('guide.speed')} <output id="${id}ro">${s.rate.toFixed(2)}×</output></label><input id="${id}r" type="range" min="${RATE_MIN*100}" max="${RATE_MAX*100}" step="5" value="${Math.round(s.rate*100)}">`+
    `<label for="${id}s">${t('guide.voice')}</label><select id="${id}s"><option value="">${t('guide.voiceDefault')}</option></select>`+
    `<div class="gsound-row"><button type="button" class="btn sm" data-a="test">▶ ${t('guide.test')}</button><button type="button" class="btn sm alt" data-a="stop">⏹ ${t('guide.stop')}</button></div></div>`;
  const $=q=>box.querySelector(q);
  const fillVoices=()=>{
    const sel=$(`#${id}s`),cur=getSoundSettings().voiceURI,vs=englishVoices(globalThis.speechSynthesis?.getVoices?.()||[]);
    sel.innerHTML=`<option value="">${t('guide.voiceDefault')}</option>`+vs.map(v=>`<option value="${esc(v.voiceURI)}">${esc(v.name)} (${esc(v.lang)})</option>`).join('');
    sel.value=vs.some(v=>v.voiceURI===cur)?cur:'';
  };
  fillVoices();globalThis.speechSynthesis?.addEventListener?.('voiceschanged',fillVoices);   // voices load a moment after the page
  $(`#${id}v`).oninput=e=>{const v=+e.target.value/100;setSoundSettings({volume:v});$(`#${id}vo`).textContent=Math.round(v*100)+'%'};
  $(`#${id}r`).oninput=e=>{const v=+e.target.value/100;setSoundSettings({rate:v});$(`#${id}ro`).textContent=v.toFixed(2)+'×'};
  $(`#${id}s`).onchange=e=>setSoundSettings({voiceURI:e.target.value});
  box.addEventListener('click',e=>{
    const a=e.target.closest('[data-a]')?.dataset.a;if(!a)return;
    if(a==='mute'){const m=!getSoundSettings().muted;setSoundSettings({muted:m});if(m)stopSpeak();const b=e.target.closest('[data-a]');b.setAttribute('aria-pressed',m);b.textContent=m?'🔇 '+t('guide.unmute'):'🔊 '+t('guide.mute')}
    else if(a==='test'){const ok=speak(t('guide.testText'));if(!ok&&getSoundSettings().muted)$(`#${id}ro`).parentElement.title=t('guide.isMuted')}
    else if(a==='stop')stopSpeak();
  });
  return box;
}
