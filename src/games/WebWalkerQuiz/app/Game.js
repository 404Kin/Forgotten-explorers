import { h } from '../utils/dom.js';
import { prefersReducedMotion } from '../utils/motion.js';
import { bindNumberKeys } from '../utils/keys.js';
import { wait } from '../utils/animate.js';
import { createRng } from '../core/random.js';
import { prepareGame } from '../core/questions.js';
import { createGameMachine, STATUS } from '../core/gameMachine.js';
import { loadQuestions as defaultLoader } from '../services/questionLoader.js';
import { createLiveRegion } from '../components/LiveRegion/LiveRegion.js';
import { createStatusView } from '../components/StatusView/StatusView.js';
import { createStartScreen } from '../components/StartScreen/StartScreen.js';
import { createHUD } from '../components/HUD/HUD.js';
import { createQuestionBoard } from '../components/QuestionBoard/QuestionBoard.js';
import { createAnswerGrid } from '../components/AnswerBox/AnswerGrid.js';
import { createCharacterLayer } from '../components/Character/CharacterLayer.js';
import { createFactCard } from '../components/FactCard/FactCard.js';
import { createGameOver } from '../components/GameOver/GameOver.js';
import { createMastered } from '../components/Mastered/Mastered.js';
import { createProgressStore, counts, allMastered } from '../../SmartQuiz/progress.js';
import { createSoundToggle } from '../components/SoundToggle/SoundToggle.js';
import { sparkleBurst } from '../components/Effects/sparkles.js';
import '../components/Effects/Effects.css';

const ANSWER_COUNT = 4;

/**
 * Glue between the pure game machine and the rendered components. It decides
 * *when* things happen; the machine decides *what* the state is.
 */
export function createGame({
  root,
  config,
  i18n,
  progress,
  sound,
  errors,
  loadQuestions = defaultLoader,
  rng = createRng(),
  onGameEnd = null,
  // Per-question progress (unseen / mastered / missed). One generic store shared with the other quizzes.
  smart = createProgressStore({ key: 'fe2.sq.webwalker' }),
}) {
  const t = (key, params) => i18n.t(key, params);
  const app = h('main', { class: 'ws-app' });
  const live = createLiveRegion();
  root.append(app, live.el);

  const saved = progress.getSettings();
  const settings = {
    difficulty: config.choices.includes(saved.difficulty)
      ? saved.difficulty
      : config.defaultDifficulty,
  };
  let bank = [];
  let run = null; // everything that exists only while a game screen is up
  let token = 0; // bumped on teardown so stale async work stops touching the DOM
  const toggles = [];

  const effectColors = () =>
    ['blue', 'red', 'green', 'orange', 'yellow'].map((n) => config.colors[n]);

  function applyLocale() {
    root.lang = i18n.getLocale();
    root.dir = i18n.getDirection();
    root.setAttribute('aria-label', t('app.region', { title: config.title }));
  }

  function mountScreen(el) {
    app.replaceChildren(el);
  }

  function makeSoundToggle() {
    const toggle = createSoundToggle({ t, sound });
    toggles.push(toggle);
    return toggle;
  }

  function teardown() {
    token++;
    toggles.splice(0).forEach((x) => x.destroy());
    if (run) {
      run.unbindKeys();
      run.layer.destroy();
      run = null;
    }
  }

  async function guarded(fn, context) {
    try {
      await fn();
    } catch (err) {
      const appError = errors.handle(err, context);
      teardown();
      const status = createStatusView({ t });
      mountScreen(status.el);
      status.showError(appError.messageKey, appError.retryable ? boot : null);
    }
  }

  // ---------- boot / start ----------

  function boot() {
    return guarded(async () => {
      teardown();
      applyLocale();
      const status = createStatusView({ t });
      mountScreen(status.el);
      status.showLoading();
      bank = await loadQuestions({
        locale: i18n.getLocale(),
        fallbackLocale: config.fallbackLocale,
        difficulties: config.difficulties,
      });
      if (bank.length === 0) {
        status.showEmpty(boot);
        return;
      }
      showStart();
    }, 'load');
  }

  function showStart() {
    teardown();
    const screen = createStartScreen({
      t,
      config,
      languages: i18n.languages(),
      locale: i18n.getLocale(),
      difficulty: settings.difficulty,
      best: progress.getBest(settings.difficulty),
      mastery: counts(bank, smart.get()),
      soundToggle: makeSoundToggle(),
      onPlay: () => {
        sound.play('click');
        guarded(startGame, 'start');
      },
      onDifficulty(level) {
        settings.difficulty = level;
        progress.saveSettings({ difficulty: level });
        screen.setBest(progress.getBest(level));
      },
      onLocale(code) {
        if (i18n.setLocale(code)) {
          progress.saveSettings({ locale: code });
          boot();
        }
      },
    });
    mountScreen(screen.el);
    screen.focus();
  }

  // ---------- playing ----------

  function startGame() {
    // Every question mastered: nothing new to ask. Show the "you know them all" screen (with Reset) instead of an empty round.
    if (allMastered(bank, smart.get())) return showMastered();
    const questions = prepareGame(bank, {
      difficulty: settings.difficulty,
      count: config.questionCount,
      rng,
      state: smart.get(),
    });
    teardown();
    if (questions.length === 0) {
      const status = createStatusView({ t });
      mountScreen(status.el);
      status.showEmpty(showStart);
      return;
    }

    const machine = createGameMachine(config);
    machine.dispatch({ type: 'START', questions });

    const hud = createHUD({
      t,
      hearts: config.hearts,
      soundToggle: makeSoundToggle(),
      onHome: showStart,
    });
    const question = createQuestionBoard({ t });
    const grid = createAnswerGrid({
      t,
      count: ANSWER_COUNT,
      labelledBy: question.id,
      onSelect: (i) => answer(i),
    });
    const layer = createCharacterLayer({
      name: config.characterName,
      t,
      timing: config.timing,
    });
    const fact = createFactCard({ t });
    const board = h('div', { class: 'ws-board' }, question.el, grid.el, layer.el);
    const screen = h('div', { class: 'ws-screen' }, hud.el, board, fact.el);

    run = {
      machine,
      hud,
      question,
      grid,
      layer,
      fact,
      board,
      busy: false,
      unbindKeys: bindNumberKeys(document, ANSWER_COUNT, (i) => answer(i)),
    };
    mountScreen(screen);
    ask();
  }

  function updateHud() {
    const s = run.machine.getState();
    run.hud.update({
      hearts: s.hearts,
      score: s.score,
      streak: s.streak,
      total: s.questions.length,
      current: s.index + 1,
      done: s.index + (s.status === STATUS.FEEDBACK ? 1 : 0),
    });
  }

  function ask() {
    const { machine, question, grid, layer } = run;
    const s = machine.getState();
    const q = machine.currentQuestion();
    run.busy = false;
    updateHud();
    question.setQuestion({ text: q.text, number: s.index + 1, total: s.questions.length });
    grid.setOptions(q.options);
    layer.hang(question.hook);
    question.focus();
    question.el.scrollIntoView?.({ block: 'nearest' });
  }

  /** Board-relative point -> game-root-relative point (for the confetti canvas). */
  function toRoot(point) {
    const r = root.getBoundingClientRect();
    const b = run.board.getBoundingClientRect();
    return { x: b.left - r.left + point.x, y: b.top - r.top + point.y };
  }

  async function celebrate(point) {
    const reduced = prefersReducedMotion();
    sparkleBurst(run.layer.el, { ...point, colors: effectColors(), reducedMotion: reduced });
    if (reduced) return;
    const { launchConfetti } = await import('../components/Effects/confetti.js');
    launchConfetti(root, { origin: toRoot(point), colors: effectColors() });
  }

  function answer(choice) {
    if (!run || run.busy || run.machine.getState().status !== STATUS.ASKING) return;
    guarded(() => resolveAnswer(choice), 'play');
  }

  async function resolveAnswer(choice) {
    const my = token;
    const { machine, grid, layer, fact, hud } = run;
    const q = machine.currentQuestion();
    run.busy = true;
    grid.lock();
    sound.play('click');
    machine.dispatch({ type: 'ANSWER', choice });
    const s = machine.getState();
    const result = s.lastResult;
    smart.record(q.id, result.correct);
    const box = grid.box(choice);
    const answerText = q.options[q.correctIndex];

    live.announce(
      result.correct
        ? result.points.bonus > 0
          ? t('feedback.correctBonus', { points: result.points.total, bonus: result.points.bonus })
          : t('feedback.correct', { points: result.points.total })
        : t('feedback.wrong', { answer: answerText }),
    );

    sound.play('whoosh');
    await layer.swingTo(
      { dock: box.dock, box: box.el },
      {
        correct: result.correct,
        onLand(point) {
          if (my !== token) return;
          box.setState('correct');
          grid.dimOthers([choice]);
          updateHud();
          sound.play('chime');
          celebrate(point);
        },
        onSnap(point) {
          if (my !== token) return;
          sound.play('snap');
          box.setState('wrong');
          grid.box(q.correctIndex).setState('correct');
          grid.dimOthers([choice, q.correctIndex]);
          updateHud();
          sparkleBurst(layer.el, {
            ...point,
            colors: [config.colors.blue],
            count: 6,
            reducedMotion: prefersReducedMotion(),
          });
          setTimeout(() => my === token && sound.play('oops'), 220);
        },
      },
    );
    if (my !== token) return;
    // Reduced-motion path still needs a beat so the new state is seen before the card.
    await wait(result.correct ? 350 : 150);
    if (my !== token) return;

    fact.show({
      correct: result.correct,
      answerText,
      fact: q.fact,
      source: q.source,
      points: result.points.total,
      bonus: result.points.bonus,
      isLast: s.hearts <= 0 || s.index + 1 >= s.questions.length,
      onNext: () => next(),
    });
    hud.el.dataset.ready = 'true';
  }

  function next() {
    if (!run) return;
    run.fact.hide();
    run.machine.dispatch({ type: 'NEXT' });
    if (run.machine.getState().status === STATUS.OVER) showGameOver();
    else ask();
  }

  function showGameOver() {
    const s = run.machine.getState();
    const difficulty = settings.difficulty;
    const newBest = progress.submitScore(difficulty, s.score);
    // Lets the host app give XP. At OVER the index still points at the last answered question.
    const answered = s.index + 1;
    onGameEnd?.({ score: s.score, won: s.outcome === 'won', total: answered, correct: answered - s.missed.length, bestStreak: s.bestStreak });
    // The round that masters the last question ends on the celebration screen (with the round's score), not the normal results.
    if (allMastered(bank, smart.get())) {
      teardown();
      return showMastered(s.score);
    }
    const over = createGameOver({ t });
    teardown();
    mountScreen(over.el);
    over.show({
      outcome: s.outcome,
      score: s.score,
      best: progress.getBest(difficulty),
      newBest,
      bestStreak: s.bestStreak,
      missed: s.missed,
      mastery: counts(bank, smart.get()),
      onPlayAgain: () => {
        sound.play('click');
        guarded(startGame, 'start');
      },
      onMenu: showStart,
    });
    sound.play(s.outcome === 'won' ? 'chime' : 'oops');
  }

  function showMastered(score = null) {
    teardown();
    const screen = createMastered({ t });
    mountScreen(screen.el);
    screen.show({
      total: bank.length,
      score,
      onReset: () => {
        sound.play('click');
        smart.reset();
        showStart();
      },
      onMenu: showStart,
    });
    sound.play('chime');
  }

  return {
    boot,
    restart: () => guarded(startGame, 'start'),
    setLocale(code) {
      if (i18n.setLocale(code)) {
        progress.saveSettings({ locale: code });
        return boot();
      }
    },
    destroy() {
      teardown();
      live.destroy();
      app.remove();
      live.el.remove();
    },
  };
}
