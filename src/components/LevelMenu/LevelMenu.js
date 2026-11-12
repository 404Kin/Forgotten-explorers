// One menu for every game that has levels and difficulties: difficulty chips, level tiles (locked / best result), Start.
// Games only describe themselves with config (levels, difficulties, labels); this file has no game rules.
import './LevelMenu.css';
import {t} from '../../i18n/index.js';
import {isUnlocked,bestOf} from '../../games/GameProgress/progress.js';

/**
 * @param {HTMLElement} el
 * @param {object} o
 *  o.levels        [{id, icon, labelKey, descKey, color?}]
 *  o.difficulties  [{id, labelKey, descKey?}]   (empty array = no difficulty chips)
 *  o.progress      store from createGameProgress
 *  o.locks         true when a win is needed to unlock the next level
 *  o.formatBest    (best:{value,stars}) => string
 *  o.onStart(levelId, difficultyId)
 *  o.extraHTML     optional HTML under the tiles (e.g. "how to play")
 */
export function renderLevelMenu(el,{title,icon,intro,levels,difficulties,progress,locks=true,formatBest,onStart,extraHTML='',backHref='#/play',onDraw}){
  const state=progress.get();
  let difficulty=difficulties.find(d=>d.id===state.difficulty)?difficulties[difficulties.findIndex(d=>d.id===state.difficulty)].id:(difficulties[0]?.id??null);
  const draw=()=>{
    const st=progress.get();
    el.innerHTML=`<div class="wrap lm-menu"><a class="btn sm alt" href="${backHref}"><span aria-hidden="true">←</span> ${t('game.back')}</a>`+
      `<div class="hero"><h1>${icon} ${title}</h1><p>${intro}</p></div>`+
      (difficulties.length?`<div class="lvm-diff" role="group" aria-label="${t('levels.difficulty')}"><span class="mono">${t('levels.difficulty')}</span><div class="chips">${difficulties.map(d=>`<button type="button" class="chip${d.id===difficulty?' on':''}" data-d="${d.id}" aria-pressed="${d.id===difficulty}">${t(d.labelKey)}</button>`).join('')}</div>${difficulties.find(d=>d.id===difficulty)?.descKey?`<p class="lvm-ddesc">${t(difficulties.find(d=>d.id===difficulty).descKey)}</p>`:''}</div>`:'')+
      `<h2 class="lvm-h2">${t('levels.pick')}</h2><ol class="lvm-levels">${levels.map((l,i)=>{
        const open=isUnlocked(st,i,{locks}),best=bestOf(st,l.id,difficulty);
        return `<li><button type="button" class="tile lvm-tile" data-l="${l.id}" ${open?'':'disabled aria-disabled="true"'} style="background:${l.color||'#d9dcf2'}">`+
          `<span class="lvm-ico" aria-hidden="true">${open?l.icon:'🔒'}</span><span class="lvm-num">${t('levels.level',{n:i+1})}</span><b>${t(l.labelKey)}</b>`+
          `<span>${open?t(l.descKey):t('levels.locked')}</span>`+
          `<small>${open?(best?`🏅 ${formatBest(best)}`:t('levels.noBest')):''}</small></button></li>`}).join('')}</ol>`+
      `${extraHTML}</div>`;
    el.querySelectorAll('[data-d]').forEach(b=>b.onclick=()=>{difficulty=b.dataset.d;progress.setDifficulty(difficulty);draw();el.querySelector(`[data-d="${difficulty}"]`)?.focus()});
    el.querySelectorAll('[data-l]:not([disabled])').forEach(b=>b.onclick=()=>onStart(b.dataset.l,difficulty));
    onDraw?.(el); // lets a game attach handlers to its own extra HTML after every redraw
  };
  draw();
}
