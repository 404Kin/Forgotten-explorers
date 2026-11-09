// Collectible robot card (reference-style: big name, tagline, flat art, glyph badge).
import {t} from '../i18n/index.js';
import {localRobot} from '../i18n/content.js';
export function cardHTML(m,{collected=false,tag='a'}={}){const L=localRobot(m),href=tag==='a'?` href="#/mission/${m.id}"`:'';return `<${tag}${href} class="card" style="background:${m.c};color:${m.k}"><h3>${m.n}</h3><small>${L.t}</small><svg viewBox="0 0 200 200" aria-hidden="true">${m.ch()}</svg><div class="ft"><span class="lg"><i></i>${t('card.logo1')}<br>${t('card.logo2')}</span><b class="gl" aria-hidden="true">${m.g}</b></div><span class="st">${m.a?t('card.awake'):t('card.asleep')+' 💤'}</span>${collected?`<span class="stamp" role="img" aria-label="${t('card.collected')}">⭐</span>`:''}</${tag}>`}
