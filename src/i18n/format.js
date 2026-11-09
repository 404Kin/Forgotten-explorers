// Language-aware number, distance, time and rank text. Lives here (not in utils/dom.js) so every unit word is a translation key.
import {t,getLang} from './index.js';
import {RANKS} from '../config.js';
import {level} from '../state/store.js';

/** Format a number with the digits and separators of the current language. */
export const num=(n,max=0)=>new Intl.NumberFormat(getLang(),{maximumFractionDigits:max,minimumFractionDigits:0}).format(n);

export const formatKm=k=>k>=1e9?t('unit.billionKm',{n:num(k/1e9,1)}):k>=1e6?t('unit.millionKm',{n:num(k/1e6,k>=1e8?0:1)}):t('unit.km',{n:num(Math.round(k))});
export const formatTime=s=>s>=3600?t('unit.hours',{n:num(s/3600,1)}):s>=60?t('unit.minutes',{n:num(Math.round(s/60))}):t('unit.seconds',{n:num(s)});
/** Rank name from the player's level; index matches config RANKS so adding a rank only needs a key rank.N */
export const rankLabel=s=>t('rank.'+Math.min(level(s),RANKS.length-1));
