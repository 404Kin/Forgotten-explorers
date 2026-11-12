import {MISSIONS} from '../data/missions.js';
import {QUIZ} from '../data/quiz.js';
import {cardHTML} from '../components/Card.js';
import {missionImages,imgTag} from '../services/nasaImages.js';
import {lightbox} from '../components/Modal.js';
import {runQuiz} from '../games/QuizEngine.js';
import {mountRobotStoryCards} from '../components/RobotStoryCards/RobotStoryCards.js';
import {createProgressStore,counts,allMastered} from '../games/SmartQuiz/progress.js';
import {pickRound} from '../games/SmartQuiz/round.js';
import {questionId} from '../games/SmartQuiz/ids.js';
// Same smart-quiz rules as the Web Walker quiz: missed first, then unseen, mastered only when nothing else is left.
const robotQuiz = createProgressStore({key: 'fe2.sq.robot'});
import {get,update,addXP,collect} from '../state/store.js';
import {formatKm,formatTime,num} from '../i18n/format.js';
import {t} from '../i18n/index.js';
import {getDistances} from '../services/api.js';
import {liveLabelHTML} from '../components/LiveLabel/LiveLabel.js';
import {statusBadgeHTML} from '../components/StatusBadge/StatusBadge.js';
import {statusOf} from '../services/api.js';
import {renderState,loadInto} from '../components/StateView/StateView.js';
import {localRobot,localQuiz} from '../i18n/content.js';
import {speak,stopSpeak,sfx} from '../services/audio.js';
import {go} from '../router/router.js';
import {MISSION_DETAILS} from '../data/missionDetails.js';
import {modelViewerHTML,createModelViewer} from '../components/ModelViewer.js';
// GLB files must be imported through Vite: a hard-coded /src/image/... path only works in the dev server, not in the built site.
const GLB_URLS=import.meta.glob('../image/*.glb',{query:'?url',import:'default',eager:true});
import missionVideos from '../data/missionVideos.json';

let stop;
let modelViewerInstance = null;
let videoCleanup = null;

function destroyViewer() {
  if (modelViewerInstance) {
    try { modelViewerInstance.destroy(); } catch (e) {}
    modelViewerInstance = null;
  }
}

function getEmbedUrl(raw) {
  if (!raw || typeof raw !== 'string') return '';
  const trimmed = raw.trim();
  if (!trimmed) return '';

  const srcMatch = trimmed.match(/src=["']([^"']+)["']/i);
  if (srcMatch) return getEmbedUrl(srcMatch[1]);

  let base = trimmed;
  if (!trimmed.includes('youtube.com/embed/')) {
    const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (watchMatch) {
      base = `https://www.youtube-nocookie.com/embed/${watchMatch[1]}`;
    } else {
      const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
      if (shortMatch) {
        base = `https://www.youtube-nocookie.com/embed/${shortMatch[1]}`;
      } else if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
        base = `https://www.youtube-nocookie.com/embed/${trimmed}`;
      }
    }
  }

  if (base.includes('youtube.com/embed/') || base.includes('youtube-nocookie.com/embed/')) {
    if (!base.includes('enablejsapi=1')) {
      base += (base.includes('?') ? '&' : '?') + 'enablejsapi=1';
    }
  }
  return base;
}

function getMissionVideoUrl(missionId, missionName) {
  if (!missionVideos) return '';
  if (missionVideos[missionId]) return getEmbedUrl(missionVideos[missionId]);

  const underKey = missionId.replace(/-/g, '_') + '_video';
  if (missionVideos[underKey]) return getEmbedUrl(missionVideos[underKey]);

  const shortKey = missionId.split('-')[0] + '_video';
  if (missionVideos[shortKey]) return getEmbedUrl(missionVideos[shortKey]);

  if (missionName) {
    const nameKey = missionName.toLowerCase().replace(/\s+/g, '_') + '_video';
    if (missionVideos[nameKey]) return getEmbedUrl(missionVideos[nameKey]);
  }

  const firstWord = missionId.split('-')[0].toLowerCase();
  for (const [k, v] of Object.entries(missionVideos)) {
    if (k.toLowerCase().includes(firstWord) && v) {
      return getEmbedUrl(v);
    }
  }

  return '';
}

function videoHTML(missionId, missionName) {
  const url = getMissionVideoUrl(missionId, missionName);
  if (!url) {
    return `
      <div class="mission-video-box" id="mvbox">
        <div class="mission-video-header">
          <div class="mission-video-title-wrap">
            <span>🎬</span>
            <b>${t('mission.video.title')}</b>
          </div>
        </div>
        <div class="mission-video-placeholder">
          <span>📹</span>
          <p>${t('mission.video.placeholder')}</p>
          <small>Add embed link in src/data/missionVideos.json</small>
        </div>
      </div>
    `;
  }

  return `
    <div class="mission-video-box" id="mvbox">
      <div class="mission-video-header">
        <div class="mission-video-title-wrap">
          <span>🎬</span>
          <b>${t('mission.video.title')}</b>
        </div>
        <div class="mission-video-actions">
          <button class="video-btn video-expand-btn" id="v-exp" title="Center View (60%)" aria-label="Expand to 60% center view">⛶ 60%</button>
          <button class="video-close-btn" id="v-cls" title="Close center view" aria-label="Close center view">✕</button>
        </div>
      </div>
      <div class="mission-video-wrap">
        <iframe
          id="yt-iframe"
          src="${url}"
          title="Mission Video"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
          loading="lazy">
        </iframe>
      </div>
    </div>
  `;
}

export default {
  name: 'mission',
  mount(el, {id}) {
    const m0 = MISSIONS.find(x => x.id === id);
    if (!m0) return renderState(el, 'empty', {messageKey: 'state.notFound', actionHref: '#/hub'});
    const m = localRobot(m0), r = m.real;
    const details = MISSION_DETAILS[m.id];
    let imgs = [];

    el.innerHTML = `
      <div class="wrap">
        <a class="btn sm alt" href="#/world/${m.w}"><span aria-hidden="true">←</span> ${t('mission.back')}</a>
        <div class="mtitle">
          <h1>${m.n}</h1>
          <div>
            <div class="mono">${r.name} · ${r.status}</div>
            <div>${m.t}</div>
            <div style="margin-top:6px">
              ${statusBadgeHTML(statusOf(m0))}
              <a class="btn sm" href="#/last-message/${m.id}"><span aria-hidden="true">💌</span> ${t('game.lastMessage')}</a>
            </div>
          </div>
        </div>
        <div class="mhero" id="mh"></div>
        <div id="rscards"></div>
        <div class="mgrid" style="margin-top:18px">
          <div class="mcard-col">
            ${cardHTML(m, {tag: 'div', heading: 'h2', collected: get().collected.includes(m.n)})}
            ${videoHTML(m.id, m.n)}
          </div>
          <div>
            <div class="tabs">
              <button class="chip on" data-t="story">📖 ${t('mission.tab.story')}</button>
              <button class="chip" data-t="data">📊 ${t('mission.tab.data')}</button>
              <button class="chip" data-t="photos">📷 ${t('mission.tab.photos')}</button>
              <button class="chip" data-t="quiz">🧠 ${t('mission.tab.quiz')}</button>
            </div>
            <div class="panel" id="tb"></div>
          </div>
        </div>
      </div>
    `;

    const hero = el.querySelector('#mh');
    mountRobotStoryCards(el.querySelector('#rscards'), m0.id);
    let loaded = false;

    const loadPhotos = () => loadInto(hero, () => missionImages(m), {
      isEmpty: () => false,
      compact: true,
      render: list => {
        loaded = true;
        imgs = list;
        if (list[0]) {
          hero.style.background = '';
          hero.innerHTML = `${imgTag(list[0])}<div class="cap"><b>${list[0].title}</b><br>${t('mission.credit', {credit: list[0].credit})} · <a href="${list[0].link}" target="_blank" rel="noopener">${t('mission.nasaLibrary')}</a></div>`;
        } else {
          hero.style.background = m.c;
          hero.innerHTML = `<svg viewBox="0 0 200 200" role="img" aria-label="${m.n}" style="height:240px;display:block;margin:auto">${m.ch()}</svg><div class="cap">${t('mission.offlineCaption')}</div>`;
        }
        if (tab === 'photos') show('photos');
      }
    });

    let tab = 'story';
    const tb = el.querySelector('#tb');
    loadPhotos();

    function show(tabName) {
      tab = tabName;
      stopSpeak();
      stop?.();
      destroyViewer();
      el.querySelectorAll('.tabs .chip').forEach(c => c.classList.toggle('on', c.dataset.t === tabName));

      if (tabName === 'story') {
        let storyHTML = '';
        const glbFile = details?.glbFile || `${m.id}.glb`;
        const svgMarkup = `<svg viewBox="0 0 200 200" role="img" aria-label="${m.n}" style="height:180px;display:block;margin:auto">${m.ch()}</svg>`;

        storyHTML += modelViewerHTML(m.id);
        storyHTML += `<p class="model-caption">${t('mission.story.modelCaption')}</p>`;

        if (details) {
          if (details.purpose) {
            storyHTML += `<div class="story-section"><h4>🎯 ${t('mission.story.purpose')}</h4><p>${details.purpose}</p></div>`;
          }
          const sl = details.storyLine;
          if (sl) {
            if (sl.launch) {
              storyHTML += `<div class="story-section"><h4>🚀 ${t('mission.story.launch')} <span class="year-tag">${sl.launch.year}</span></h4><b>${sl.launch.title}</b><p>${sl.launch.desc}</p></div>`;
            }
            if (sl.arrival) {
              storyHTML += `<div class="story-section"><h4>🪐 ${t('mission.story.arrival')} <span class="year-tag">${sl.arrival.year}</span></h4><b>${sl.arrival.title}</b><p>${sl.arrival.desc}</p></div>`;
            }
            if (sl.hardware) {
              storyHTML += `<div class="story-section"><h4>🤖 ${t('mission.story.hardware')}</h4><b>${sl.hardware.title}</b><p>${sl.hardware.desc}</p></div>`;
            }
            if (sl.science) {
              storyHTML += `<div class="story-section"><h4>🔬 ${t('mission.story.science')}</h4><b>${sl.science.title}</b><p>${sl.science.desc}</p></div>`;
            }
            if (sl.currentStatus) {
              storyHTML += `<div class="story-section"><h4>📡 ${t('mission.story.status')}</h4><b>${sl.currentStatus.title}</b><p>${sl.currentStatus.desc}</p></div>`;
            }
          }
          if (details.funFact) {
            storyHTML += `<div class="fun-fact"><b>💡 ${t('mission.story.funFact')}</b>${details.funFact}</div>`;
          }
        } else {
          storyHTML += m.p.map(([h, x]) => `<div class="pg"><h3>${h}</h3><p>${x}</p></div>`).join('');
        }

        storyHTML += `<div style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn sm alt" id="rd">🔊 ${t('mission.readAloud')}</button>
          <button class="btn sm" id="rm">${get().read.includes(m.n) ? '✓ ' + t('mission.read') : t('mission.markRead')}</button>
        </div>`;

        tb.innerHTML = storyHTML;

        // Mount model viewer
        const mvContainer = tb.querySelector(`#mv-${m.id}`);
        if (mvContainer) {
          // No WebGL (old phone, blocked GPU) must not break the whole robot page: keep the story, show the drawing instead.
          try {
            modelViewerInstance = createModelViewer(mvContainer, GLB_URLS[`../image/${glbFile}`] || '', svgMarkup, m.c);
          } catch {
            modelViewerInstance = null;
            mvContainer.innerHTML = `<div style="background:${m.c};padding:12px">${svgMarkup}</div>`;
          }
        }

        // Read aloud & mark read handlers
        const readText = details ? [
          details.purpose,
          details.storyLine?.launch?.title, details.storyLine?.launch?.desc,
          details.storyLine?.arrival?.title, details.storyLine?.arrival?.desc,
          details.storyLine?.hardware?.title, details.storyLine?.hardware?.desc,
          details.storyLine?.science?.title, details.storyLine?.science?.desc,
          details.storyLine?.currentStatus?.title, details.storyLine?.currentStatus?.desc,
          details.funFact
        ].filter(Boolean).join('. ') : m.p.map(p => p.join('. ')).join(' ');

        const rdBtn = tb.querySelector('#rd');
        if (rdBtn) rdBtn.onclick = () => speak(readText);
        const rmBtn = tb.querySelector('#rm');
        if (rmBtn) {
          rmBtn.onclick = e => {
            if (!get().read.includes(m.n)) {
              update(S => S.read.push(m.n));
              addXP(20, t('xp.reading'));
              e.target.textContent = '✓ ' + t('mission.read');
            }
          };
        }
      }

      if (tabName === 'data') {
        let dataHTML = '';

        if (details) {
          // 1. Mission Vitals
          if (details.missionVitals) {
            const v = details.missionVitals;
            dataHTML += `<div class="data-section">
              <h3>⚡ ${t('mission.data.vitals')}</h3>
              <div class="vitals-grid">
                <div class="vital-item"><div class="vital-label">${t('mission.data.mass')}</div><div class="vital-value">${v.mass || '—'}</div></div>
                <div class="vital-item"><div class="vital-label">${t('mission.data.dimensions')}</div><div class="vital-value">${v.dimensions || '—'}</div></div>
                <div class="vital-item"><div class="vital-label">${t('mission.data.powerSource')}</div><div class="vital-value">${v.powerSource || '—'}</div></div>
                <div class="vital-item"><div class="vital-label">${t('mission.data.powerOutput')}</div><div class="vital-value">${v.powerOutput || '—'}</div></div>
                <div class="vital-item"><div class="vital-label">${t('mission.data.designLife')}</div><div class="vital-value">${v.designLife || '—'}</div></div>
                <div class="vital-item"><div class="vital-label">${t('mission.data.actualLife')}</div><div class="vital-value">${v.actualLife || '—'}</div></div>
              </div>
            </div>`;
          }

          // 2. Construction
          if (details.construction) {
            const c = details.construction;
            dataHTML += `<div class="data-section">
              <h3>🏗️ ${t('mission.data.construction')}</h3>
              <div class="construction-card">
                <div class="c-item"><span class="c-label">${t('mission.data.builtBy')}</span><span class="c-value">${c.builtBy || '—'}</span></div>
                <div class="c-item"><span class="c-label">${t('mission.data.builtAt')}</span><span class="c-value">${c.builtAt || '—'}</span></div>
                <div class="c-item"><span class="c-label">${t('mission.data.facility')}</span><span class="c-value">${c.facility || '—'}</span></div>
                <div class="c-item"><span class="c-label">${t('mission.data.years')}</span><span class="c-value">${c.startYear} – ${c.completedYear}</span></div>
                <div class="c-item"><span class="c-label">${t('mission.data.cost')}</span><span class="c-value">${c.cost || '—'}</span></div>
                <div class="c-item"><span class="c-label">${t('mission.data.purpose')}</span><span class="c-value">${details.purpose || '—'}</span></div>
              </div>
            </div>`;
          }

          // 3. Instruments & Hardware
          if (details.instruments && details.instruments.length) {
            dataHTML += `<div class="data-section">
              <h3>🔬 ${t('mission.data.instruments')}</h3>
              <div class="instrument-groups">
                ${details.instruments.map((group, gIdx) => `
                  <div class="instrument-group ${gIdx === 0 ? 'open' : ''}">
                    <div class="instrument-group-header">
                      <span>${group.icon || '🔬'}</span>
                      <b>${group.group}</b>
                      <span class="ig-arrow">▶</span>
                    </div>
                    <div class="instrument-items">
                      ${group.items.map(item => `
                        <div class="instrument-item">
                          <h5>${item.name}</h5>
                          <p>${item.desc}</p>
                          ${item.specs ? `<dl class="specs-table">
                            ${Object.entries(item.specs).map(([sk, sv]) => `
                              <dt>${sk.replace(/_/g, ' ')}</dt><dd>${sv}</dd>
                            `).join('')}
                          </dl>` : ''}
                        </div>
                      `).join('')}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>`;
          }

          // 4. Milestones
          if (details.milestones && details.milestones.length) {
            dataHTML += `<div class="data-section">
              <h3>🏆 ${t('mission.data.milestones')}</h3>
              <ul class="milestone-list">
                ${details.milestones.map(ms => `
                  <li>
                    <span class="ms-icon">${ms.icon || '🏆'}</span>
                    <span class="ms-year">${ms.year}</span>
                    <span>${ms.title}</span>
                  </li>
                `).join('')}
              </ul>
            </div>`;
          }
        }

        // 5. Live Telemetry
        const L = [
          ['launched', r.launchDate],
          ['arrived', `${r.arrivalDate}. ${r.arrivalEvent}`],
          ['where', r.location],
          ['coordinates', r.coordinates],
          ['distance', formatKm(r.distanceKm)],
          ['message', formatTime(r.lightSeconds)],
          ['speed', t('unit.kmPerSecond', {n: num(r.speedKmS, 1)})],
          ['status', r.status]
        ];

        dataHTML += `<div class="data-section">
          <h3>📡 ${t('mission.data.telemetry')}</h3>
          <div class="telemetry-section">
            <ul class="dl">
              ${L.map(([a, b]) => `<li data-k="${a}"><b>${t('mission.data.' + a)}</b><span class="val">${b}</span></li>`).join('')}
            </ul>
            <p id="livelbl" style="margin-top:10px">${liveLabelHTML({source: 'snapshot'})}</p>
          </div>
        </div>`;

        dataHTML += `<p class="mono" style="margin-top:14px;font-size:0.72rem;opacity:0.7">${t('mission.data.sourceNote')}</p>`;

        tb.innerHTML = dataHTML;

        // Instrument toggles
        tb.querySelectorAll('.instrument-group-header').forEach(hdr => {
          hdr.onclick = () => {
            hdr.closest('.instrument-group').classList.toggle('open');
          };
        });

        // Telemetry live updates
        getDistances([m.id]).then(res => {
          const d = res.data?.[0];
          if (!d || tab !== 'data' || !tb.isConnected) return;
          const set = (k, v) => {
            const s = tb.querySelector(`[data-k="${k}"] .val`);
            if (s && v != null) s.textContent = v;
          };
          set('distance', d.distanceKm != null ? formatKm(d.distanceKm) : null);
          set('message', d.lightSeconds != null ? formatTime(d.lightSeconds) : null);
          const ll = tb.querySelector('#livelbl');
          if (ll) ll.innerHTML = liveLabelHTML({source: d.source, asOf: d.asOf});
        }).catch(() => {});
      }

      if (tabName === 'photos') {
        if (!loaded) renderState(tb, 'loading', {compact: true});
        else if (!imgs.length) renderState(tb, 'empty', {messageKey: 'mission.noPhotos', compact: true, onRetry: () => { renderState(tb, 'loading', {compact: true}); loadPhotos(); }});
        else tb.innerHTML = `<div class="gal">${imgs.map((i, n) => `<figure data-n="${n}" tabindex="0" role="button" aria-label="${i.title.replace(/"/g, '')}">${imgTag(i)}</figure>`).join('')}</div><p class="mono">${t('mission.photosHelp')}</p>`;
        tb.onclick = e => { const f = e.target.closest('figure'); if (f) lightbox(imgs[+f.dataset.n]); };
        tb.onkeydown = e => { if (e.key !== 'Enter' && e.key !== ' ') return; const f = e.target.closest('figure'); if (f) { e.preventDefault(); lightbox(imgs[+f.dataset.n]); } };
      }

      if (tabName === 'quiz') {
        // The robot's own question has no id in the data, so it gets one from its (English) text.
        const pool = [...localQuiz(QUIZ).filter(q => q.m === m.n), {id: questionId({q: m0.q[0]}), q: m.q[0], o: m.q.slice(1), e: ''}];
        const poolIds = pool.map(q => q.id), mastery = () => counts(pool, robotQuiz.get());
        const qs = pickRound(pool, robotQuiz.get(), {difficulty: 'mixed', count: 4});
        const awake = get().collected.includes(m.n), need = Math.ceil(qs.length / 2), everything = allMastered(pool, robotQuiz.get());
        // Explain the rules BEFORE the quiz starts: this is how an explorer gets woken up, and players did not know.
        tb.innerHTML = `<div class="wake-intro"><div class="wake-ico" aria-hidden="true">${awake ? '🌟' : '😴'}</div>`
          + `<h2>${awake ? t('mission.quiz.awakeTitle', {name: m.n}) : t('mission.quiz.sleepTitle', {name: m.n})}</h2>`
          + `<p>${awake ? t('mission.quiz.awakeText') : t('mission.quiz.sleepText', {name: m.n, n: qs.length, need})}</p>`
          + `<p class="mono">🎓 ${t('mission.quiz.mastery', {mastered: mastery().mastered, total: pool.length})}</p>`
          + (everything ? `<p><b>${t('mission.quiz.knowAll', {name: m.n})}</b></p><button type="button" class="btn alt" id="resetq">${t('mission.quiz.reset')}</button> ` : '')
          + `<button type="button" class="btn" id="startq">${awake ? t('mission.quiz.again') : t('mission.quiz.start', {name: m.n})}</button></div>`;
        const resetBtn = tb.querySelector('#resetq'); if (resetBtn) resetBtn.onclick = () => { robotQuiz.forget(poolIds); show('quiz'); };
        const missedNow = [];
        tb.querySelector('#startq').onclick = () => {
        stop = runQuiz(tb, qs, {
          lives: 2,
          time: 20,
          // Save every answer by question id: right = mastered, wrong = missed (and it comes back next time).
          onAnswer: (Q, ok) => { robotQuiz.record(Q.id, ok); if (!ok) missedNow.push(Q); },
          onEnd: res => {
            tb.innerHTML = `<div class="stars">${'⭐'.repeat(res.stars) || '🙂'}</div><h2 style="text-align:center">${res.passed ? t('mission.woke', {name: m.n}) : t('mission.almost')}</h2><p style="text-align:center">${t('quiz.score', {correct: res.correct, total: res.total, xp: res.xp})}</p>${res.passed ? `<p style="text-align:center">${t('mission.quiz.wokeHelp')}</p>` : `<p style="text-align:center">${t('mission.quiz.tryHelp', {need})}</p>`}<p class="mono" style="text-align:center">🎓 ${t('mission.quiz.mastery', {mastered: mastery().mastered, total: pool.length})}</p>${missedNow.length ? `<div class="panel" style="margin:10px 0"><b>${t('mission.quiz.review')}</b><ul>${missedNow.map(Q => `<li>${Q.q} <b>✓ ${Q.o[0]}</b></li>`).join('')}</ul></div>` : ''}${allMastered(pool, robotQuiz.get()) ? `<p style="text-align:center"><b>${t('mission.quiz.knowAll', {name: m.n})}</b></p>` : ''}<div style="text-align:center"><button class="btn" id="rt">${t('common.tryAgain')}</button> <a class="btn alt" href="#/album">${t('mission.quiz.toAlbum')}</a></div>`;
            update(S => { S.stats.correct += res.correct; S.stats.answered += res.total; });
            if (res.xp) addXP(res.xp, t('xp.quiz'));
            if (res.passed && collect(m.n)) { sfx.win(); addXP(30, t('xp.waking', {name: m.n})); }
            tb.querySelector('#rt').onclick = () => show('quiz');
          }
        });
        };
      }
    }

    el.querySelectorAll('.tabs .chip').forEach(c => c.onclick = () => show(c.dataset.t));
    // The Album's "Wake up" button opens this page straight on the quiz tab.
    const firstTab = sessionStorage.getItem('fe2.openTab') || 'story'; sessionStorage.removeItem('fe2.openTab');
    show(firstTab);
    // Coming from the Album's Wake up button: bring the quiz into view instead of leaving it far below the photo.
    if (firstTab === 'quiz') setTimeout(() => el.querySelector('.tabs')?.scrollIntoView({block: 'start'}), 50);

    // Video theater mode controller (centers at 60% width and height when played or expanded)
    const vbox = el.querySelector('#mvbox');
    if (vbox) {
      let userDismissed = false;

      const enterTheater = () => {
        vbox.classList.add('theater');
      };

      const exitTheater = () => {
        vbox.classList.remove('theater');
        userDismissed = true;
      };

      const expBtn = vbox.querySelector('#v-exp');
      if (expBtn) {
        expBtn.onclick = (e) => {
          e.stopPropagation();
          userDismissed = false;
          enterTheater();
        };
      }

      const clsBtn = vbox.querySelector('#v-cls');
      if (clsBtn) {
        clsBtn.onclick = (e) => {
          e.stopPropagation();
          exitTheater();
        };
      }

      // Backdrop click closes theater mode
      vbox.onclick = (e) => {
        if (vbox.classList.contains('theater') && !e.target.closest('.mission-video-wrap') && !e.target.closest('.mission-video-header')) {
          exitTheater();
        }
      };

      // Escape key exits theater mode
      const onKeyDown = (e) => {
        if (e.key === 'Escape' && vbox.classList.contains('theater')) {
          exitTheater();
        }
      };
      window.addEventListener('keydown', onKeyDown);

      // YouTube postMessage: triggers 60% center theater when playback starts
      const onYTMessage = (e) => {
        if (userDismissed) return;
        try {
          const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
          if (data) {
            // state 1 = playing, 3 = buffering to play
            if (data.event === 'onStateChange' && (data.info === 1 || data.info === 3)) {
              enterTheater();
            } else if (data.event === 'infoDelivery' && data.info && (data.info.playerState === 1 || data.info.playerState === 3)) {
              enterTheater();
            }
          }
        } catch (_) {}
      };
      window.addEventListener('message', onYTMessage);

      videoCleanup = () => {
        window.removeEventListener('keydown', onKeyDown);
        window.removeEventListener('message', onYTMessage);
      };
    }
  },
  unmount() {
    destroyViewer();
    videoCleanup?.();
    videoCleanup = null;
    stop?.();
    stopSpeak();
  }
};
