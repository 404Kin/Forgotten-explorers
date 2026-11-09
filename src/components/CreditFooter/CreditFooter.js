// The credit + "not affiliated with NASA" footer, written once and shown on every screen that needs it.
import './CreditFooter.css';
import {t} from '../../i18n/index.js';

export function creditFooterHTML({link=true}={}){
  return `<footer class="credit"><p>${t('credit.text')} ${t('credit.disclaimer')}</p>`+
    (link?`<p><a class="credit-link" href="#/sources">${t('credit.sources')}</a></p>`:'')+`</footer>`;
}
