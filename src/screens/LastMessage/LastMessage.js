// Last Message story mode: a robot tells its story in the first person, one line at a time, with captions and optional narration.
// Routes: /last-message (pick a robot) and /last-message/:id (the story).
import './LastMessage.css';
import {t,getLang} from '../../i18n/index.js';
import {localRobot} from '../../i18n/content.js';
import {loadInto,renderState} from '../../components/StateView/StateView.js';
import {statusBadgeHTML} from '../../components/StatusBadge/StatusBadge.js';
import {statusOf} from '../../services/api.js';
import {getMessage,robotsWithMessages} from './messages.js';
import {createNarrationPlayer} from './NarrationPlayer.js';
import {activeLineIndex,stepIndex} from './captions.js';

const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let player=null,onKey=null;

function renderIndex(el){
  el.innerHTML=`<div class="wrap"><div class="hero"><span class="mono">${t('lastMessage.kicker')}</span><h1>${t('lastMessage.title')}</h1><p>${t('lastMessage.intro')}</p></div>`+
    `<ul class="lm-list">${robotsWithMessages().map(m=>{const L=localRobot(m);
      return `<li><a class="panel lm-pick" href="#/last-message/${m.id}"><b>${esc(m.n)}</b><span>${esc(L.t)}</span>${statusBadgeHTML(statusOf(m))}</a></li>`}).join('')}</ul></div>`;
}

function renderStory(box,msg){
  const m=msg.robot,L=localRobot(m),lines=msg.lines,lang=getLang();
  const src=msg.audio?.[lang]?new URL(msg.audio[lang],document.baseURI).href:null;
  let i=0,playing=false,captionsOn=true;

  box.innerHTML=
    (msg.placeholder?`<p class="panel lm-note" role="note">${t('lastMessage.placeholderNote')}</p>`:'')+
    `<section class="panel lm-stage" tabindex="0" aria-label="${t('lastMessage.stageLabel')}"><p class="lm-count mono" id="lmcount"></p>`+
      `<p class="lm-line" id="lmline" aria-live="polite"></p><p class="lm-tags" id="lmtags"></p></section>`+
    `<div class="lm-controls"><button type="button" class="btn alt" id="lmprev">${t('lastMessage.prev')}</button>`+
      `<button type="button" class="btn" id="lmplay" hidden></button>`+
      `<button type="button" class="btn alt" id="lmnext">${t('lastMessage.next')}</button>`+
      `<button type="button" class="btn sm alt" id="lmcap" aria-pressed="true" hidden>${t('lastMessage.captions')}</button></div>`+
    `<p class="lm-audio-note" id="lmnote" role="status">${t('lastMessage.audioChecking')}</p>`+
    `<h2 class="lm-h2">${t('lastMessage.transcript')}</h2><ol class="lm-transcript" id="lmlist">`+
      lines.map((l,n)=>`<li data-i="${n}">${esc(l.text)}${l.poetic?` <span class="lm-poetic">${t('lastMessage.poetic')}</span>`:''}</li>`).join('')+`</ol>`+
    `<p><a class="btn sm" href="#/mission/${m.id}">${t('lastMessage.openRobot',{name:esc(m.n)})}</a></p>`;

  const $=s=>box.querySelector(s),stageLine=$('#lmline');
  const show=n=>{
    i=n;const l=lines[n];
    $('#lmcount').textContent=t('lastMessage.lineOf',{n:n+1,total:lines.length});
    stageLine.textContent=l.text;stageLine.hidden=!captionsOn;
    // Poetic and sourced lines are labelled with words, not just colour.
    $('#lmtags').innerHTML=(l.poetic?`<span class="lm-poetic">${t('lastMessage.poetic')}</span>`:'')+
      (l.source?`<a class="lm-source" href="${esc(l.source)}" target="_blank" rel="noopener">${t('lastMessage.source')}</a>`:'');
    box.querySelectorAll('#lmlist li').forEach((li,k)=>k===n?li.setAttribute('aria-current','true'):li.removeAttribute('aria-current'));
    $('#lmprev').disabled=n===0;$('#lmnext').disabled=n===lines.length-1;
  };
  const go=d=>show(stepIndex(i,d,lines.length));
  $('#lmprev').onclick=()=>go(-1);$('#lmnext').onclick=()=>go(1);
  box.querySelector('#lmlist').onclick=e=>{const li=e.target.closest('li');if(li)show(+li.dataset.i)};
  const stage=$('.lm-stage');
  onKey=e=>{if(!stage.contains(document.activeElement))return;if(e.key==='ArrowRight'){e.preventDefault();go(1)}else if(e.key==='ArrowLeft'){e.preventDefault();go(-1)}};
  document.addEventListener('keydown',onKey);

  const playBtn=$('#lmplay'),capBtn=$('#lmcap'),note=$('#lmnote');
  const label=()=>{playBtn.textContent=playing?`⏸ ${t('lastMessage.pause')}`:`▶ ${t('lastMessage.play')}`;playBtn.setAttribute('aria-pressed',String(playing))};
  capBtn.onclick=()=>{captionsOn=!captionsOn;capBtn.setAttribute('aria-pressed',String(captionsOn));stageLine.hidden=!captionsOn};

  player=createNarrationPlayer({src,
    onTime:(time,dur)=>{const n=activeLineIndex(lines,time,dur);if(n>=0&&n!==i)show(n)},
    onPlayState:p=>{playing=p;label()},
    onStatus:s=>{
      if(s==='ready'){note.textContent=t('lastMessage.audioReady');playBtn.hidden=false;capBtn.hidden=false;label()}
      else if(s==='missing'){
        // No file (or not in this language): captions stay on and nothing else breaks.
        note.textContent=t('lastMessage.audioSoon');playBtn.hidden=true;capBtn.hidden=true;captionsOn=true;stageLine.hidden=false;
      }
    }});
  playBtn.onclick=()=>{if(i===lines.length-1&&!playing)player.seekStart();player.toggle()};
  show(0);
  if(!src){note.textContent=t('lastMessage.audioSoon')}
}

export default{name:'lastmessage',
mount(el,{id}={}){
  if(!id)return renderIndex(el);
  el.innerHTML=`<div class="wrap lm"><a class="btn sm alt" href="#/last-message"><span aria-hidden="true">←</span> ${t('lastMessage.title')}</a><div id="lmhead"></div><div id="lmbox"></div></div>`;
  loadInto(el.querySelector('#lmbox'),async()=>getMessage(id),{
    isEmpty:d=>!d,empty:{messageKey:'state.notFound',actionHref:'#/last-message',actionKey:'lastMessage.title'},
    render:(msg,box)=>{
      const m=msg.robot;
      el.querySelector('#lmhead').innerHTML=`<div class="hero"><span class="mono">${t('lastMessage.kicker')}</span><h1>${esc(m.n)}</h1><p>${statusBadgeHTML(statusOf(m))}</p></div>`;
      renderStory(box,msg);
    }});
},
unmount(){player?.destroy();player=null;if(onKey){document.removeEventListener('keydown',onKey);onKey=null}}};
