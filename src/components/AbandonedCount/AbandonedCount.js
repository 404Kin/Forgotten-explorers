// "Abandoned count" panel for the Hub. Every number is computed from the robot list (src/robots/stats.js), never typed by hand.
import './AbandonedCount.css';
import {t} from '../../i18n/index.js';
import {abandonedCounts} from '../../robots/stats.js';

export function abandonedCountHTML(robots){
  const c=abandonedCounts(robots);
  const cell=(n,key,icon)=>`<li class="ac-cell"><span class="ac-n">${n}</span><span class="ac-l"><span aria-hidden="true">${icon}</span> ${t(key)}</span></li>`;
  return `<section class="panel ac" aria-labelledby="ac-h"><h2 id="ac-h">${t('abandoned.title')}</h2><p class="ac-sum">${t('abandoned.sum',{abandoned:c.abandoned,total:c.total})}</p>`+
    `<ul class="ac-grid">${cell(c.moon,'abandoned.moon','🌙')}${cell(c.mars,'abandoned.mars','🔴')}${cell(c.silent,'abandoned.silent','🔇')}${cell(c.talking,'abandoned.talking','📡')}</ul>`+
    `<p class="mono ac-note">${t('abandoned.note')}</p></section>`;
}
