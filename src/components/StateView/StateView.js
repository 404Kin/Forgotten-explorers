// ONE component for loading / empty / error on every screen (CLAUDE.md: loading/empty/error states everywhere).
// Screens never write their own spinner or "something went wrong" text; they call renderState() or loadInto().
import './StateView.css';
import {t} from '../../i18n/index.js';

const ICON={loading:'🛰',empty:'🌌',error:'📡'};

/** Map an ApiError code (or anything else) to a plain, kid-friendly message key. */
export const errorMessageKey=err=>err?.code==='RATE_LIMITED'?'state.error.rateLimited':err?.code==='NETWORK'||err?.code==='TIMEOUT'?'state.error.network':'state.error.message';

/**
 * kind: 'loading' | 'empty' | 'error'
 * opts: { messageKey, titleKey, onRetry, actionHref, actionKey, compact }
 * Roles: loading = status (polite), error = alert (read right away), empty = status.
 */
export function stateHTML(kind,{messageKey,titleKey,onRetry,actionHref,actionKey,compact=false}={}){
  const title=titleKey||(kind==='error'?'state.error.title':kind==='empty'?'state.empty.title':null);
  const message=messageKey||(kind==='error'?'state.error.message':kind==='empty'?'state.empty.message':'state.loading');
  const role=kind==='error'?'alert':'status';
  return `<div class="stateview ${kind}${compact?' compact':''}" role="${role}" aria-live="${kind==='error'?'assertive':'polite'}"${kind==='loading'?' aria-busy="true"':''}>`+
    `<span class="sv-icon${kind==='loading'?' spin':''}" aria-hidden="true">${ICON[kind]}</span>`+
    (title?`<h2 class="sv-title">${t(title)}</h2>`:'')+
    `<p class="sv-msg">${t(message)}</p>`+
    (onRetry?`<button type="button" class="btn sv-retry" data-retry>${t('common.tryAgain')}</button>`:'')+
    (actionHref?`<a class="btn alt sv-action" href="${actionHref}">${t(actionKey||'state.goExplore')}</a>`:'')+
  `</div>`;
}

/** Draw a state into `el` and wire the Retry button (a real <button>, so Enter/Space work). */
export function renderState(el,kind,opts={}){
  el.innerHTML=stateHTML(kind,opts);
  const btn=el.querySelector('[data-retry]');
  if(btn)btn.onclick=opts.onRetry;
  // After an error appears, keyboard users land on the Retry button instead of losing their place.
  if(kind==='error'&&btn&&opts.focus!==false&&el.isConnected)btn.focus({preventScroll:true});
  return el;
}

const runs=new WeakMap();
/**
 * Generic async section: loading -> (error | empty | render).
 * loader: () => Promise<data>   render: (data) => void (draws into el)
 * opts: { isEmpty(data), empty:{messageKey,...}, error:{messageKey,...}, compact }
 * A newer call on the same element (or a screen that was closed) cancels older answers, so late results never overwrite a new screen.
 */
export async function loadInto(el,loader,{render,isEmpty=d=>d==null||(Array.isArray(d)&&d.length===0),empty={},error={},compact=false}={}){
  const run=Symbol();runs.set(el,run);
  renderState(el,'loading',{compact});
  const again=()=>loadInto(el,loader,{render,isEmpty,empty,error,compact});
  try{
    const data=await loader();
    if(runs.get(el)!==run||!el.isConnected)return;
    if(isEmpty(data))return renderState(el,'empty',{compact,...empty});
    el.innerHTML='';render(data,el);
  }catch(err){
    if(runs.get(el)!==run||!el.isConnected)return;
    renderState(el,'error',{compact,messageKey:error.messageKey||errorMessageKey(err),onRetry:again,...error});
  }
}
