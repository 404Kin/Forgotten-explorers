// Collectible robot card (reference-style: big name, tagline, flat art, glyph badge).
import {t} from '../i18n/index.js';
import {localRobot} from '../i18n/content.js';
import {inkFor} from './contrast.js';
import {statusBadgeHTML} from './StatusBadge/StatusBadge.js';
import {statusOf} from '../services/api.js';
export function cardHTML(m,{collected=false,tag='a',heading='h3'}={}){const L=localRobot(m),href=tag==='a'?` href="#/mission/${m.id}"`:'';return `<${tag}${href} class="card" style="background:${m.c};color:${inkFor(m.c,m.k)}"><${heading}>${m.n}</${heading}><small>${L.t}</small><svg viewBox="0 0 200 200" aria-hidden="true">${m.ch()}</svg><div class="ft"><span class="lg"><i></i>${t('card.logo1')}<br>${t('card.logo2')}</span><b class="gl" aria-hidden="true">${m.g}</b></div>${statusBadgeHTML(statusOf(m),{variant:'card'})}${collected?`<span class="stamp" role="img" aria-label="${t('card.collected')}">⭐</span>`:''}</${tag}>`}
