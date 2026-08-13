/**
 * НавИИгатор — SPA-логика фронтенда
 * Роутинг через hash: #/, #/quiz, #/routes, #/tour?route=..., #/results
 */

const STORAGE_KEY = "navigator-state";
const QUIZ_TTL_MS = 2 * 60 * 1000;

/** @type {{ profile: object, tour: object|null, quizStep: number, quizAnswers: object, postQuizAnswers: object, postQuizDone: boolean }} */
let state = {
  profile: {
    name: "",
    age: "",
    profession: "",
    hobby: "",
    tourTime: "",
    style: "informal",
    theme: "",
  },
  tour: null,
  quizStep: 0,
  quizAnswers: {},
  postQuizAnswers: {},
  postQuizDone: false,
};

let timerInterval = null;

// ─── Persistence (TTL 2 мин для ответов опроса) ─────────────

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    const parsed = JSON.parse(saved);
    if (parsed.savedAt && Date.now() - parsed.savedAt <= QUIZ_TTL_MS) {
      state = { ...state, ...parsed.data };
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (_) {}
}

function saveState() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ data: state, savedAt: Date.now() })
  );
}

const defaultState = () => ({
  profile: {
    name: "",
    age: "",
    profession: "",
    hobby: "",
    tourTime: "",
    style: "informal",
    theme: "",
  },
  tour: null,
  quizStep: 0,
  quizAnswers: {},
  postQuizAnswers: {},
  postQuizDone: false,
});

function checkQuizExpiry() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return false;
    const parsed = JSON.parse(saved);
    if (parsed.savedAt && Date.now() - parsed.savedAt > QUIZ_TTL_MS) {
      localStorage.removeItem(STORAGE_KEY);
      state = defaultState();
      return true;
    }
  } catch (_) {
    localStorage.removeItem(STORAGE_KEY);
    state = defaultState();
    return true;
  }
  return false;
}

// ─── Helpers ───────────────────────────────────────────────

function esc(str) {
  const d = document.createElement("div");
  d.textContent = str ?? "";
  return d.innerHTML;
}

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function isProfileComplete() {
  const p = state.profile;
  return !!(p.name && p.age && p.profession && p.hobby && p.tourTime && p.style && p.theme);
}

function getExhibit(id) {
  return EXHIBITS.find((e) => e.id === id);
}

function getRouteExhibits(routeId) {
  const route = ROUTES.find((r) => r.id === routeId);
  if (!route) return [];
  return route.exhibitIds.map(getExhibit).filter(Boolean);
}

function getExhibitText(exhibit) {
  const p = state.profile;
  const base = p.style === "formal" ? exhibit.formal : exhibit.informal;
  const hint = exhibit.professionHints[p.profession];
  return hint ? `${base}\n\n💡 ${hint}` : base;
}

function getGreeting() {
  const name = state.profile.name || "Гость";
  return state.profile.style === "formal"
    ? `Здравствуйте, ${name}. Добро пожаловать в Яндекс Музей.`
    : `Привет, ${name}! Круто, что заглянул(а) в музей 👋`;
}

function matchRoutes() {
  const p = state.profile;
  const tags = [
    ...(THEME_TAGS[p.theme] || []),
    TIME_TAGS[p.tourTime] || "medium",
    ...(HOBBY_TAGS[p.hobby] || []),
  ];
  return [...ROUTES]
    .map((r) => ({ route: r, score: r.tags.filter((t) => tags.includes(t)).length }))
    .sort((a, b) => b.score - a.score)
    .map((x) => x.route);
}

function calcScore(answers, questions) {
  let ok = 0;
  questions.forEach((q) => {
    const sel = answers[q.id];
    const opt = q.options.find((o) => o.id === sel);
    if (opt?.correct) ok++;
  });
  return Math.round((ok / questions.length) * 100);
}

function parseHash() {
  const raw = location.hash.slice(1) || "/";
  const [path, query] = raw.split("?");
  const params = new URLSearchParams(query || "");
  return { path: path || "/", params };
}

function navigate(path) {
  location.hash = path;
}

/** SVG-стрелка для кнопок */
function btnArrow() {
  return `<span class="btn__arrow" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3.75 9h10.5M9.75 4.5L14.25 9l-4.5 4.5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg></span>`;
}

// ─── Render: Home ──────────────────────────────────────────

function renderHome() {
  return `
    <section class="hero">
      <div class="hero__glow" aria-hidden="true"></div>
      <div class="hero__badge">
        <span class="hero__badge-dot"></span>
        Яндекс Музей × ИИ · для взрослых
      </div>
      <h1 class="hero__title">Нав<b class="brand-ii">ИИ</b>гатор</h1>
      <p class="hero__subtitle">
        Персональный ИИ-гид по музею технологий. Пройдите опрос — агент подберёт
        маршрут, стиль рассказа и время на каждый экспонат.
      </p>
      <div class="btn-row">
        <a href="#/quiz" class="btn btn--primary btn--lg">
          Пройти опрос ${btnArrow()}
        </a>
        <a href="#/routes" class="btn btn--outline btn--lg">
          Готовые маршруты
        </a>
      </div>
    </section>

    <section class="editorial">
      <div class="editorial__inner">
        <div class="editorial__item">
          <p class="editorial__num">01</p>
          <h3 class="editorial__title">Маршрут под вас</h3>
          <p class="editorial__text">Семь вопросов — и система собирает последовательность экспонатов с учётом времени и интересов.</p>
        </div>
        <div class="editorial__item">
          <p class="editorial__num">02</p>
          <h3 class="editorial__title">Тон рассказа</h3>
          <p class="editorial__text">Формальный или разговорный — тексты адаптируются под ваш выбор и профессию.</p>
        </div>
        <div class="editorial__item">
          <p class="editorial__num">03</p>
          <h3 class="editorial__title">Награды музея</h3>
          <p class="editorial__text">Стикеры, аватарка и значок «Знаток компьютеров» — после короткого квиза.</p>
        </div>
      </div>
    </section>`;
}

// ─── Render: Quiz ──────────────────────────────────────────

function renderQuiz() {
  const step = QUIZ_STEPS[state.quizStep];
  const progress = ((state.quizStep + 1) / QUIZ_STEPS.length) * 100;
  const val = state.profile[step.id] ?? "";

  let input = "";

  if (step.type === "text" || step.type === "number") {
    input = `<input class="input" type="${step.type}" id="quiz-input" value="${esc(val)}"
      placeholder="${esc(step.placeholder)}" autofocus />`;
  } else if (step.type === "style") {
    input = step.options
      .map(
        (o) => `
      <button type="button" class="option ${val === o.id ? "option--selected" : ""}"
        data-value="${o.id}">
        <strong>${esc(o.label)}</strong>
        <p class="mt-2" style="font-size:0.875rem;color:var(--g500)">${esc(o.desc)}</p>
      </button>`
      )
      .join("");
  } else {
    input = step.options
      .map(
        (o) => `
      <button type="button" class="option ${val === o.id ? "option--selected" : ""}"
        data-value="${o.id}">${esc(o.label)}</button>`
      )
      .join("");
  }

  const canNext = String(val).trim() !== "";
  const isLast = state.quizStep === QUIZ_STEPS.length - 1;

  return `
    <div class="container container--narrow">
      <h1 class="page-title">Расскажите о себе</h1>
      <p class="page-sub">7 вопросов — ИИ-агент подберёт маршрут и стиль рассказа</p>
      <div class="quiz-panel">
        <div class="progress"><div class="progress__bar" style="width:${progress}%"></div></div>
        <p class="quiz-step-label">Шаг ${state.quizStep + 1} из ${QUIZ_STEPS.length}</p>
        <h2 class="quiz-question">${esc(step.label)}</h2>
        ${step.hint ? `<p class="page-sub" style="margin-top:-1rem;margin-bottom:1.25rem;font-size:0.875rem">${esc(step.hint)}</p>` : ""}
        <div id="quiz-inputs">${input}</div>
        <div class="btn-row btn-row--left mt-4">
          ${state.quizStep > 0 ? `<button class="btn btn--outline" id="quiz-back">← Назад</button>` : ""}
          ${canNext && !isLast ? `<button class="btn btn--primary" id="quiz-next">Далее ${btnArrow()}</button>` : ""}
          ${(canNext && isLast) || isProfileComplete() ? `<a href="#/routes" class="btn btn--primary btn--lg">Показать мои маршруты ${btnArrow()}</a>` : ""}
        </div>
      </div>
    </div>`;
}

function bindQuiz() {
  const step = QUIZ_STEPS[state.quizStep];

  if (step.type === "text" || step.type === "number") {
    const input = document.getElementById("quiz-input");
    input?.addEventListener("input", (e) => {
      state.profile[step.id] = e.target.value;
      saveState();
      render();
    });
  } else {
    document.querySelectorAll("#quiz-inputs .option").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.profile[step.id] = btn.dataset.value;
        saveState();
        render();
      });
    });
  }

  document.getElementById("quiz-back")?.addEventListener("click", () => {
    state.quizStep--;
    saveState();
    render();
  });

  document.getElementById("quiz-next")?.addEventListener("click", () => {
    state.quizStep++;
    saveState();
    render();
  });
}

// ─── Render: Routes ────────────────────────────────────────

function routeCardHTML(route, highlighted) {
  const exhibits = getRouteExhibits(route.id);
  return `
    <article class="route-card ${highlighted ? "route-card--ai" : ""}">
      <div class="route-card__cover ${route.cover || "cover-express"}">
        <span class="route-card__category">${esc(route.category)}</span>
        <span class="route-card__cover-icon">${route.icon}</span>
      </div>
      <div class="route-card__body">
        <div class="route-card__meta">
          ${highlighted ? `<span class="route-card__ai-tag">✦ Подобрано ИИ</span>` : "<span></span>"}
          <span class="route-card__duration">${route.duration}</span>
        </div>
        <h3 class="route-card__title">${esc(route.title)}</h3>
        <p class="route-card__desc">${esc(route.description)}</p>
        <p class="route-card__exhibits-label">Экспонаты по порядку</p>
        <ol class="route-card__exhibits">
          ${exhibits.map((ex, i) => `<li><span class="route-card__num">${i + 1}</span><span>${ex.icon}</span><span>${esc(ex.title)}</span></li>`).join("")}
        </ol>
        <a href="#/tour?route=${route.id}" class="btn btn--primary btn--block">
          Начать маршрут ${btnArrow()}
        </a>
      </div>
    </article>`;
}

function renderRoutes() {
  const complete = isProfileComplete();
  const routes = complete ? matchRoutes() : ROUTES;
  const top = complete ? routes.slice(0, 2) : [];
  const rest = complete ? routes.slice(2) : routes;

  return `
    <div class="container">
      <div class="page-header-row">
        <div>
          <h1 class="page-title">Маршруты</h1>
          <p class="page-sub">${complete ? esc(getGreeting()) : 'Пройдите <a href="#/quiz">опрос</a> — ИИ-агент соберёт персональный маршрут'}</p>
          ${complete ? `<div class="profile-chip">🤖 Маршрут сгенерирован под ваш профиль</div>` : ""}
        </div>
        ${styleToggleHTML()}
      </div>
      ${complete && top.length ? `
        <section class="mb-6">
          <h2 class="section-title">
            <span class="section-title__badge">ИИ</span>
            Подобрано для вас
          </h2>
          <div class="routes-grid">${top.map((r) => routeCardHTML(r, true)).join("")}</div>
        </section>` : ""}
      <section>
        <h2 class="section-title">${complete ? "Тематические маршруты музея" : "Все маршруты"}</h2>
        <div class="routes-grid">${(complete ? rest : routes).map((r) => routeCardHTML(r, false)).join("")}</div>
      </section>
      ${!complete ? `<div class="text-center mt-4"><a href="#/quiz" class="btn btn--primary btn--lg">Пройти опрос ${btnArrow()}</a></div>` : ""}
    </div>`;
}

function styleToggleHTML() {
  return `
    <div class="style-toggle">
      <button type="button" data-style="formal" class="${state.profile.style === "formal" ? "active" : ""}">Формальный</button>
      <button type="button" data-style="informal" class="${state.profile.style === "informal" ? "active" : ""}">Неформальный</button>
    </div>`;
}

function bindStyleToggle() {
  document.querySelectorAll(".style-toggle button").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.profile.style = btn.dataset.style;
      saveState();
      render();
    });
  });
}

// ─── Render: Tour ──────────────────────────────────────────

function renderTour(routeId) {
  const route = ROUTES.find((r) => r.id === routeId);
  if (!route) {
    return `<div class="container text-center"><h1 class="page-title">Маршрут не найден</h1><a href="#/routes" class="btn btn--primary mt-4">Выбрать маршрут</a></div>`;
  }

  if (!state.tour || state.tour.routeId !== routeId) {
    state.tour = { routeId, index: 0, timerDone: false };
    saveState();
  }

  const exhibits = getRouteExhibits(routeId);
  const idx = state.tour.index;
  const exhibit = exhibits[idx];

  if (!exhibit) {
    navigate("#/results");
    return "";
  }

  const progress = ((idx + 1) / exhibits.length) * 100;
  const isLast = idx >= exhibits.length - 1;

  return `
    <div class="container container--medium">
      <div class="page-header-row">
        <div>
          <p style="font-size:0.875rem;color:var(--g400)">${route.icon} ${esc(route.title)}</p>
          <p style="font-size:0.875rem;font-weight:500;color:var(--g500)">Экспонат ${idx + 1} из ${exhibits.length}</p>
        </div>
        ${styleToggleHTML()}
      </div>
      <div class="progress mb-6"><div class="progress__bar" style="width:${progress}%"></div></div>
      <article class="tour-card">
        <div class="tour-card__icon">${exhibit.icon}</div>
        <h1 class="tour-card__title">${esc(exhibit.title)}</h1>
        <p class="tour-card__text">${esc(getExhibitText(exhibit))}</p>
        <div class="timer" id="exhibit-timer" data-duration="${exhibit.durationSec}">
          <div class="timer__row">
            <span class="timer__label">Время на экспонат</span>
            <span class="timer__value" id="timer-display">${formatTime(exhibit.durationSec)}</span>
          </div>
          <div class="timer__track"><div class="timer__fill" id="timer-fill" style="width:0%"></div></div>
        </div>
        <div>
          <p class="interactive-label">Интерактив</p>
          ${exhibit.interactives
            .map(
              (item) => `
            <button type="button" class="btn btn--outline btn--sm interactive-btn" data-content="${esc(item.content)}" style="width:100%;margin-bottom:0.5rem;text-align:left">${esc(item.label)}</button>`
            )
            .join("")}
          <div class="interactive-content" id="interactive-panel"></div>
        </div>
      </article>
      <div class="btn-row btn-row--left mt-4">
        <button class="btn btn--primary btn--lg" id="tour-next" disabled>
          ${isLast ? "Завершить экскурсию" : "Следующий экспонат"} ${btnArrow()}
        </button>
        <span class="hint" id="timer-hint">Кнопка активируется после таймера</span>
      </div>
    </div>`;
}

function bindTour(routeId) {
  bindStyleToggle();

  document.querySelectorAll(".interactive-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const panel = document.getElementById("interactive-panel");
      if (panel) {
        panel.textContent = btn.dataset.content;
        panel.classList.add("show");
      }
    });
  });

  const timerEl = document.getElementById("exhibit-timer");
  const duration = parseInt(timerEl?.dataset.duration || "60", 10);
  let remaining = duration;

  if (timerInterval) clearInterval(timerInterval);

  const display = document.getElementById("timer-display");
  const fill = document.getElementById("timer-fill");
  const nextBtn = document.getElementById("tour-next");
  const hint = document.getElementById("timer-hint");

  function updateTimer() {
    if (display) {
      display.textContent = formatTime(remaining);
      if (remaining <= 15) display.classList.add("timer__value--low");
    }
    if (fill) fill.style.width = `${((duration - remaining) / duration) * 100}%`;

    if (remaining <= 0) {
      clearInterval(timerInterval);
      if (nextBtn) nextBtn.disabled = false;
      if (hint) hint.classList.add("hidden");
      state.tour.timerDone = true;
      saveState();
      return;
    }
    remaining--;
  }

  if (state.tour.timerDone) {
    if (nextBtn) nextBtn.disabled = false;
    if (hint) hint.classList.add("hidden");
    if (display) display.textContent = "0:00";
    if (fill) fill.style.width = "100%";
  } else {
    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);
  }

  nextBtn?.addEventListener("click", () => {
    if (timerInterval) clearInterval(timerInterval);
    const exhibits = getRouteExhibits(routeId);
    if (state.tour.index >= exhibits.length - 1) {
      navigate("#/results");
    } else {
      state.tour.index++;
      state.tour.timerDone = false;
      saveState();
      render();
    }
  });
}

// ─── Render: Results ───────────────────────────────────────

function renderResults() {
  if (state.postQuizDone) {
    const score = calcScore(state.postQuizAnswers, POST_TOUR_QUIZ);
    const earned = REWARDS.filter((r) => (r.minScore ?? 0) <= score);
    const emoji = score >= 80 ? "🎉" : score >= 60 ? "👍" : "💪";

    return `
      <div class="container container--narrow">
        <div class="score-display">
          <div class="score-display__emoji">${emoji}</div>
          <h1 class="page-title">Отличная работа!</h1>
          <p class="score-display__result">Ваш результат: <b>${score}%</b></p>
        </div>
        <h2 class="section-title text-center">Ваши награды</h2>
        <div class="rewards-grid mb-6">
          ${earned.map((r, i) => `
            <div class="reward-card ${r.yandex ? "reward-card--yandex" : ""}" style="animation-delay:${i * 0.1}s">
              <div class="reward-card__emoji">${r.emoji}</div>
              <div class="reward-card__type">${r.type === "sticker" ? "Стикер музея" : r.type === "badge" ? "Значок Яндекса" : "Для аккаунта"}</div>
              <h3 class="reward-card__title">${esc(r.title)}</h3>
              <p class="reward-card__desc">${esc(r.description)}</p>
            </div>`).join("")}
        </div>
        <div class="btn-row">
          <a href="#/routes" class="btn btn--outline btn--lg">Новый маршрут</a>
          <a href="#/" class="btn btn--primary btn--lg">На главную ${btnArrow()}</a>
          <button class="btn btn--ghost" id="reset-btn">Начать заново</button>
        </div>
      </div>`;
  }

  const name = state.profile.name || "Гость";
  const intro =
    state.profile.style === "formal"
      ? `${name}, ответьте на вопросы по пройденному маршруту.`
      : `${name}, давай проверим, что запомнил(а)! 🧠`;

  return `
    <div class="container container--narrow">
      <h1 class="page-title">Проверьте знания</h1>
      <p class="page-sub">${esc(intro)}</p>
      ${POST_TOUR_QUIZ.map(
        (q, qi) => `
        <div class="card mb-6" style="margin-bottom:1.5rem">
          <p style="font-weight:700;margin-bottom:1rem">${qi + 1}. ${esc(q.question)}</p>
          ${q.options
            .map(
              (o) => `
            <button type="button" class="option ${state.postQuizAnswers[q.id] === o.id ? "option--selected" : ""}"
              data-q="${q.id}" data-value="${o.id}">${esc(o.text)}</button>`
            )
            .join("")}
        </div>`
      ).join("")}
      <button class="btn btn--primary btn--lg" id="submit-quiz"
        ${POST_TOUR_QUIZ.every((q) => state.postQuizAnswers[q.id]) ? "" : "disabled"}>
        Получить награды ${btnArrow()}
      </button>
    </div>`;
}

function bindResults() {
  if (state.postQuizDone) {
    document.getElementById("reset-btn")?.addEventListener("click", () => {
      state = defaultState();
      localStorage.removeItem(STORAGE_KEY);
      navigate("#/");
    });
    return;
  }

  document.querySelectorAll(".option[data-q]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.postQuizAnswers[btn.dataset.q] = btn.dataset.value;
      saveState();
      render();
    });
  });

  document.getElementById("submit-quiz")?.addEventListener("click", () => {
    state.postQuizDone = true;
    saveState();
    render();
  });
}

// ─── Router ────────────────────────────────────────────────

function render() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  const { path, params } = parseHash();
  const app = document.getElementById("app");
  if (!app) return;

  switch (path) {
    case "/":
      app.innerHTML = renderHome();
      break;
    case "/quiz":
      app.innerHTML = renderQuiz();
      bindQuiz();
      break;
    case "/routes":
      app.innerHTML = renderRoutes();
      bindStyleToggle();
      break;
    case "/tour": {
      const routeId = params.get("route") || "";
      if (routeId) {
        app.innerHTML = renderTour(routeId);
        bindTour(routeId);
      } else {
        navigate("#/routes");
      }
      break;
    }
    case "/results":
      app.innerHTML = renderResults();
      bindResults();
      break;
    default:
      app.innerHTML = renderHome();
  }

  window.scrollTo(0, 0);
}

// ─── Init ──────────────────────────────────────────────────

loadState();
window.addEventListener("hashchange", render);
if (!location.hash) location.hash = "#/";
render();
setInterval(() => {
  if (checkQuizExpiry()) render();
}, 15_000);
