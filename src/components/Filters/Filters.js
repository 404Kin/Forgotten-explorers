// Generic filter chips. Config-driven: Hub uses it for world + status; any screen can pass other groups.
import './Filters.css';
import {t} from '../../i18n/index.js';

/** Pure: keep items where every active filter matches. getters[groupId](item) returns that item's value. */
export function applyFilters(items,values,getters){
  // A getter may return one value or a list of tags (e.g. a left-behind robot is both "left_behind" and "abandoned").
  return items.filter(it=>Object.entries(values).every(([g,v])=>{if(v==='all')return true;const x=getters[g](it);return Array.isArray(x)?x.includes(v):x===v}));
}

/**
 * groups: [{id, labelKey, options:[{value, labelKey, icon?}]}]  (an "All" option is added for you)
 * Calls onChange(values) after every change. Returns {set(values), get()}.
 */
export function createFilters(el,groups,onChange,initial={}){
  const values=Object.fromEntries(groups.map(g=>[g.id,initial[g.id]??'all']));
  const draw=()=>{
    el.innerHTML=`<div class="filters" role="group" aria-label="${t('filter.label')}">`+groups.map(g=>
      `<div class="fgroup" role="group" aria-labelledby="fl-${g.id}"><span class="mono" id="fl-${g.id}">${t(g.labelKey)}</span><div class="chips">`+
      [{value:'all',labelKey:'common.all'},...g.options].map(o=>`<button type="button" class="chip${values[g.id]===o.value?' on':''}" data-g="${g.id}" data-v="${o.value}" aria-pressed="${values[g.id]===o.value}">${o.icon?`<span aria-hidden="true">${o.icon}</span> `:''}${t(o.labelKey)}</button>`).join('')+
      `</div></div>`).join('')+`</div>`;
  };
  el.onclick=e=>{const b=e.target.closest('[data-g]');if(!b)return;values[b.dataset.g]=b.dataset.v;draw();
    // Redrawing loses focus; put it back on the same chip so keyboard users keep their place.
    el.querySelector(`[data-g="${b.dataset.g}"][data-v="${b.dataset.v}"]`)?.focus();onChange({...values})};
  draw();
  return{get:()=>({...values}),set(v){Object.assign(values,v);draw();onChange({...values})},redraw:draw};
}
