// "Live" or "Snapshot on <date>" label. Shown next to every number that can change over time, so we never
// present an old number as if it were happening right now. Words + icon + shape, never colour alone.
import './LiveLabel.css';
import {t,getLang} from '../../i18n/index.js';

/** Pure: which kind of label? live = answered by the API right now; anything else is a saved snapshot. */
export const labelKind=source=>source==='live'||source==='api'?'live':'snapshot';

const fmtDate=iso=>{
  const d=new Date(iso);
  return Number.isNaN(d.getTime())?null:new Intl.DateTimeFormat(getLang(),{dateStyle:'medium'}).format(d);
};

/** @param {{source:string, asOf?:string|null}} info  source: 'live' | 'api' | 'snapshot' | 'local' */
export function liveLabelHTML({source,asOf}){
  const kind=labelKind(source);
  if(kind==='live'){
    const when=asOf&&new Date(asOf).getTime()?new Intl.DateTimeFormat(getLang(),{timeStyle:'short'}).format(new Date(asOf)):null;
    return `<span class="ll ll-live"><span aria-hidden="true">⚡</span> ${t('live.live')}${when?` · ${t('live.updated',{time:when})}`:''}</span>`;
  }
  const date=asOf?fmtDate(asOf):null;
  // PLACEHOLDER: until P1 dates the snapshot in relics.json, asOf is null and we say "saved snapshot" without a date.
  return `<span class="ll ll-snap"><span aria-hidden="true">🗓</span> ${date?t('live.snapshotOn',{date}):t('live.snapshot')}</span>`;
}
