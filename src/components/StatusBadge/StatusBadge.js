// Status badge: ALWAYS icon + words + a distinct border style, so it never relies on colour alone.
// To add a status: one row here, one key status.<id> in en.json.
import './StatusBadge.css';
import {t} from '../../i18n/index.js';

export const STATUSES={
  left_behind:{icon:'📍',labelKey:'status.left_behind'},
  silent:{icon:'🔇',labelKey:'status.silent'},
  talking:{icon:'📡',labelKey:'status.talking'}
};
export const STATUS_IDS=Object.keys(STATUSES);

/** @param {string} status one of STATUS_IDS  @param {{variant?:'card'|'inline'}} opts */
export function statusBadgeHTML(status,{variant='inline'}={}){
  const s=STATUSES[status];if(!s)return '';
  return `<span class="sb sb-${status} sb-${variant}"><span class="sb-icon" aria-hidden="true">${s.icon}</span><span class="sb-text">${t(s.labelKey)}</span></span>`;
}
