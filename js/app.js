/* ============================================================
   C 语言学习网站 — 应用逻辑
   ============================================================ */

'use strict';

/* ---------------- 常量 ---------------- */
const COMPILE_URL = 'https://godbolt.org/api/compiler/cg162/compile';  // Compiler Explorer (godbolt) x86-64 gcc 16.2
const STORAGE_KEY = 'c-learn-progress-v1';

/* ---------------- 索引 ---------------- */
const stageMap = {};
const chapterMap = {};
const codeProblemMap = {};
const chapterOrder = [];

(function buildIndex() {
  (window.COURSE || []).forEach(function (stage) {
    stageMap[stage.id] = stage;
    (stage.chapters || []).forEach(function (ch) {
      ch.stageId = stage.id;
      chapterMap[ch.id] = ch;
      chapterOrder.push(ch);
      (ch.exercises || []).forEach(function (p, i) {
        p.stageId = stage.id;
        p.id = p.id || (ch.id + '-ex-' + i);
        codeProblemMap[p.id] = p;
      });
    });
    const quiz = stage.quiz || {};
    (quiz.code || []).forEach(function (p, i) {
      p.stageId = stage.id;
      p.id = p.id || (stage.id + '-code-' + i);
      codeProblemMap[p.id] = p;
    });
  });
})();

/* ---------------- 工具函数 ---------------- */
function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function renderInline(text) {
  return esc(text).replace(/`([^`]+)`/g, function (m, c) { return '<code>' + c + '</code>'; });
}
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(function () { t.classList.remove('show'); }, 2400);
}
function norm(s) { return String(s == null ? '' : s).trim().toLowerCase(); }

/* ---------------- 进度存储 ---------------- */
let progress = loadProgress();
function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return { done: {}, quiz: {}, codePassed: {}, last: null, openStages: { ch1: true } };
}
function saveProgress() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); } catch (e) {}
}
function markChapterDone(id, done) {
  if (done) progress.done[id] = true; else delete progress.done[id];
  progress.last = id;
  saveProgress();
  refreshAll();
}
function markCodePassed(id) {
  if (progress.codePassed[id]) return;
  progress.codePassed[id] = true;
  saveProgress();
  toast('🎉 编程题通过！');
  refreshAll();
}
function saveQuizScore(stageId, correct, total) {
  progress.quiz[stageId] = { correct: correct, total: total };
  saveProgress();
  refreshAll();
}
function isStageOpen(stageId) {
  if (progress.openStages && stageId in progress.openStages) return progress.openStages[stageId];
  return stageId === 'ch1';
}
function setStageOpen(stageId, open) {
  progress.openStages = progress.openStages || {};
  progress.openStages[stageId] = open;
  saveProgress();
}

/* ---------------- 统计 ---------------- */
function computeStats() {
  let chapters = 0, doneChapters = 0;
  let codeTotal = 0, codePassed = 0;
  let quizQ = 0, quizCorrect = 0;
  const perStage = {};
  COURSE.forEach(function (stage) {
    let sCh = 0, sDone = 0, sCode = 0, sCodePass = 0, sQuizQ = 0, sQuizCorrect = 0;
    (stage.chapters || []).forEach(function (ch) {
      chapters++; sCh++;
      if (progress.done[ch.id]) { doneChapters++; sDone++; }
      (ch.exercises || []).forEach(function (p) {
        codeTotal++; sCode++;
        if (progress.codePassed[p.id]) { codePassed++; sCodePass++; }
      });
    });
    const quiz = stage.quiz || {};
    (quiz.code || []).forEach(function (p) {
      codeTotal++; sCode++;
      if (progress.codePassed[p.id]) { codePassed++; sCodePass++; }
    });
    const qTotal = (quiz.choice || []).length + (quiz.fill || []).length;
    quizQ += qTotal; sQuizQ = qTotal;
    const qr = progress.quiz[stage.id];
    if (qr) { quizCorrect += (qr.correct || 0); sQuizCorrect = (qr.correct || 0); }
    perStage[stage.id] = { done: sDone, chapters: sCh, codePass: sCodePass, codeTotal: sCode, quizQ: sQuizQ, quizCorrect: sQuizCorrect };
  });
  const totalUnits = chapters + codeTotal + quizQ;
  const doneUnits = doneChapters + codePassed + quizCorrect;
  const overall = totalUnits ? Math.round(doneUnits / totalUnits * 100) : 0;
  return { chapters, doneChapters, codeTotal, codePassed, quizQ, quizCorrect, overall, perStage };
}

/* ---------------- 在线运行（Compiler Explorer / godbolt 编译执行） ---------------- */
function gbText(arr) {
  // godbolt 的 stdout/stderr 是 [{text}] 数组，每行一个、行尾无换行
  if (!Array.isArray(arr)) return '';
  return arr.map(function (o) { return o && o.text != null ? String(o.text) : ''; }).join('\n');
}
const ANSI_RE = new RegExp(String.fromCharCode(27) + '\\[[0-9;]*[A-Za-z]', 'g');
function stripAnsi(s) {
  return String(s == null ? '' : s).replace(ANSI_RE, '');
}
async function runCCode(code, stdin) {
  const res = await fetch(COMPILE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      source: code,
      options: {
        userArguments: '',
        compilerOptions: { executorRequest: true },
        filters: { execute: true },
        executeParameters: { args: [], stdin: stdin || '' }
      }
    })
  });
  if (!res.ok) throw new Error('在线编译器暂时不可用（HTTP ' + res.status + '）');
  const d = await res.json();
  const build = d.buildResult || {};
  const compileError = stripAnsi(gbText(build.stderr));
  return {
    stdout: stripAnsi(gbText(d.stdout)),
    stderr: stripAnsi(gbText(d.stderr)),
    compileError: build.code !== 0 ? compileError : '',
    status: build.code !== 0 ? String(build.code) : String(d.code)
  };
}
function formatRun(r) {
  // 返回 { out, err } 供展示
  const compileError = (r.compileError || '').trim();
  const stderr = (r.stderr || '').trim();
  const stdout = (r.stdout || '').replace(/\s+$/, '');
  if (compileError) return { out: stdout, err: '编译错误：\n' + compileError };
  if (r.status === '0') return { out: stdout, err: stderr || '' };
  return { out: stdout, err: stderr || ('程序异常退出（状态码 ' + r.status + '）') };
}
const OFFLINE_MSG = '无法连接在线编译器。请检查网络连接后重试；离线时可直接查看下方的「参考答案」。';

/* ---------------- 判题 ---------------- */
async function gradeCodeProblem(problem, code) {
  const results = [];
  for (const t of problem.tests || []) {
    try {
      const r = await runCCode(code, t.stdin || '');
      const compileError = (r.compileError || '').trim();
      if (compileError) {
        results.push({ ok: false, stage: '编译', stdin: t.stdin, got: compileError.split('\n').slice(0, 4).join('\n'), expected: '程序能正常编译运行' });
        continue;
      }
      const got = norm(r.stdout);
      const expected = norm(t.expected);
      results.push({ ok: got === expected, stage: '测试', stdin: t.stdin, got: (r.stdout || '(无输出)').trim(), expected: t.expected });
    } catch (e) {
      results.push({ ok: false, stage: '运行', stdin: t.stdin, got: e.message, expected: t.expected });
    }
  }
  return { results: results, allPass: results.every(function (t) { return t.ok; }) };
}

/* ---------------- 渲染：侧边栏 ---------------- */
function renderSidebar() {
  const el = document.getElementById('sidebar');
  const stats = computeStats();
  let html = '';
  COURSE.forEach(function (stage) {
    const open = isStageOpen(stage.id);
    const ps = stats.perStage[stage.id] || { done: 0, chapters: stage.chapters.length };
    html += '<div class="stage-group' + (open ? ' open' : '') + '" data-stage="' + stage.id + '">';
    html += '<div class="stage-head js-stage-toggle">';
    html += '<span class="stage-icon">' + esc(stage.icon) + '</span>';
    html += '<span class="stage-title">' + esc(stage.title) + '</span>';
    html += '<span class="stage-count">' + ps.done + '/' + (ps.chapters || 0) + '</span>';
    html += '<span class="stage-arrow">▶</span></div>';
    html += '<div class="chapter-list">';
    (stage.chapters || []).forEach(function (ch) {
      const done = progress.done[ch.id];
      html += '<div class="chapter-item' + (done ? ' done' : '') + '" data-nav="chapter" data-id="' + ch.id + '">';
      html += '<span class="chapter-dot"></span>';
      html += '<span class="chapter-title">' + esc(ch.title) + '</span>';
      html += '<span class="chapter-check">✔</span></div>';
    });
    if (stage.quiz) {
      const qr = progress.quiz[stage.id];
      html += '<div class="quiz-item" data-nav="quiz" data-id="' + stage.id + '">';
      html += '<span>📝</span><span class="quiz-title">训练题</span>';
      if (qr) html += '<span class="quiz-score">' + qr.correct + '/' + qr.total + '</span>';
      html += '</div>';
    }
    html += '</div></div>';
  });
  el.innerHTML = html;
}

/* ---------------- 渲染：内容块 ---------------- */
function renderBlock(block) {
  switch (block.t) {
    case 'h': return '<h3>' + renderInline(block.x) + '</h3>';
    case 'p': return '<p>' + renderInline(block.x) + '</p>';
    case 'list': return '<ul>' + block.x.map(function (i) { return '<li>' + renderInline(i) + '</li>'; }).join('') + '</ul>';
    case 'ol': return '<ol>' + block.x.map(function (i) { return '<li>' + renderInline(i) + '</li>'; }).join('') + '</ol>';
    case 'tip': return '<div class="callout callout-tip"><span class="callout-label">💡 提示</span>' + renderInline(block.x) + '</div>';
    case 'warn': return '<div class="callout callout-warn"><span class="callout-label">⚠️ 注意</span>' + renderInline(block.x) + '</div>';
    case 'note': return '<div class="callout callout-note"><span class="callout-label">📌 补充</span>' + renderInline(block.x) + '</div>';
    case 'code': return renderStaticCode(block.x, block.out);
    case 'table': {
      let t = '<table><thead><tr>' + block.head.map(function (h) { return '<th>' + renderInline(h) + '</th>'; }).join('') + '</tr></thead><tbody>';
      block.rows.forEach(function (r) {
        t += '<tr>' + r.map(function (c) { return '<td>' + renderInline(c) + '</td>'; }).join('') + '</tr>';
      });
      return t + '</tbody></table>';
    }
    default: return '';
  }
}
function renderStaticCode(code, out) {
  let html = '<div class="codeblock"><div class="codeblock-head"><span>C</span><button class="run-btn js-run">▶ 运行</button></div>';
  html += '<pre><code>' + esc(code) + '</code></pre>';
  if (out != null) html += '<div class="codeblock-out" style="display:block"><span class="out-label">预期输出</span>\n' + esc(out) + '</div>';
  html += '<div class="codeblock-out js-out"></div></div>';
  return html;
}
function renderExample(ex) {
  let html = '<div class="example">';
  html += '<div class="example-title">🔍 示例：' + esc(ex.title) + '</div>';
  if (ex.note) html += '<div class="example-note">' + renderInline(ex.note) + '</div>';
  html += '<div class="editor"><textarea class="code-editor">' + esc(ex.code) + '</textarea></div>';
  html += '<div class="editor-toolbar"><button class="btn-small btn-run js-run">▶ 运行</button><span class="spacer"></span><span class="editor-status js-status"></span></div>';
  html += '<div class="output js-out"></div>';
  html += '</div>';
  return html;
}
function renderCodeProblem(p) {
  const levelLabel = { easy: '简单', mid: '中等', hard: '挑战' }[p.level] || '练习';
  let html = '<div class="exercise" data-codeid="' + p.id + '">';
  html += '<div class="exercise-title"><span class="tag ' + (p.level || 'easy') + '">' + levelLabel + '</span>编程题 · ' + esc(p.title) + '</div>';
  html += '<div class="exercise-prompt">' + renderInline(p.prompt) + '</div>';
  html += '<div class="editor"><textarea class="code-editor">' + esc(p.starter || '') + '</textarea></div>';
  html += '<div class="editor-toolbar">';
  html += '<button class="btn-small btn-run js-run">▶ 运行</button>';
  html += '<button class="btn-small btn-check js-check">✔ 提交判题</button>';
  if (p.answer) html += '<button class="btn-small btn-answer js-answer">👀 参考答案</button>';
  html += '<button class="btn-small btn-reset js-reset">↺ 重置</button>';
  html += '<span class="spacer"></span><span class="editor-status js-status"></span></div>';
  html += '<div class="output js-out"></div>';
  html += '<div class="test-results js-results"></div>';
  if (p.hint) {
    html += '<div class="hint-box"><button class="hint-btn js-hint">💡 查看提示</button><div class="hint-content" style="display:none;margin-top:6px">' + renderInline(p.hint) + '</div></div>';
  }
  if (p.answer) {
    html += '<div class="answer-box js-answer-box"><span class="answer-label">参考答案</span><pre>' + esc(p.answer) + '</pre>';
    if (p.explain) html += '<div class="answer-explain">📖 解析：' + renderInline(p.explain) + '</div>';
    html += '</div>';
  }
  html += '</div>';
  return html;
}

function getStageById(id) { return stageMap[id]; }
function getChapterById(id) { return chapterMap[id]; }

/* ---------------- 渲染：章节 ---------------- */
function renderChapter(id) {
  const ch = getChapterById(id);
  if (!ch) { renderHome(); return; }
  const stage = getStageById(ch.stageId);
  const idx = chapterOrder.indexOf(ch);
  const prev = idx > 0 ? chapterOrder[idx - 1] : null;
  const next = idx < chapterOrder.length - 1 ? chapterOrder[idx + 1] : null;
  const isDone = !!progress.done[id];

  let html = '';
  html += '<div class="chapter-head">';
  html += '<div class="crumb">' + esc(stage.title) + ' <span class="sep">›</span> ' + esc(ch.title) + '</div>';
  html += '<h1>' + esc(ch.title) + '</h1>';
  html += '</div>';

  html += '<div class="lesson">';
  (ch.lesson || []).forEach(function (b) { html += renderBlock(b); });
  html += '</div>';

  if (ch.examples && ch.examples.length) {
    html += '<div class="section-title">动手试试</div>';
    ch.examples.forEach(function (ex) { html += renderExample(ex); });
  }

  if (ch.exercises && ch.exercises.length) {
    html += '<div class="section-title">练习</div>';
    ch.exercises.forEach(function (p) { html += renderCodeProblem(p); });
  }

  html += '<div class="chapter-nav">';
  html += '<button class="btn btn-done js-mark-done' + (isDone ? ' done' : '') + '">' + (isDone ? '✓ 已完成' : '标记本节完成') + '</button>';
  html += '<div class="nav-btns">';
  html += prev ? '<button class="btn btn-ghost js-prev">← ' + esc(prev.title) + '</button>' : '';
  html += next ? '<button class="btn btn-primary js-next">' + esc(next.title) + ' →</button>' : '<a class="btn btn-primary" href="#/quiz/' + stage.id + '">做本章训练题 →</a>';
  html += '</div></div>';

  const content = document.getElementById('content');
  content.innerHTML = html;
  initEditors(content);
  openStageOf(ch.stageId);
}
function openStageOf(stageId) {
  if (!isStageOpen(stageId)) setStageOpen(stageId, true);
}

/* ---------------- 渲染：首页 ---------------- */
function renderHome() {
  const s = computeStats();
  let html = '';
  html += '<div class="hero">';
  html += '<h1>⚙️ 从零开始，系统学会 C 语言</h1>';
  html += '<p>不需要任何编程基础。跟着 ' + COURSE.length + ' 个章节循序渐进：边看讲解、边在网页里写 C 代码、编译运行、做题训练，一路走到能独立做小项目。</p>';
  html += '<div class="hero-actions">';
  html += '<a class="btn btn-primary" href="#/chapter/' + (progress.last || chapterOrder[0].id) + '">' + (progress.last ? '继续学习 →' : '开始第一课 →') + '</a>';
  html += '<a class="btn btn-outline" href="#/progress">查看学习进度</a>';
  html += '</div></div>';

  html += '<div class="stat-row">';
  html += '<div class="stat"><div class="stat-num">' + s.overall + '%</div><div class="stat-label">总进度</div></div>';
  html += '<div class="stat"><div class="stat-num">' + s.doneChapters + '/' + s.chapters + '</div><div class="stat-label">已完成小节</div></div>';
  html += '<div class="stat"><div class="stat-num">' + s.codePassed + '/' + s.codeTotal + '</div><div class="stat-label">已通过编程题</div></div>';
  html += '<div class="stat"><div class="stat-num">' + s.quizCorrect + '/' + s.quizQ + '</div><div class="stat-label">客观题答对数</div></div>';
  html += '</div>';

  html += '<div class="section-title">学习路径</div><div class="path">';
  COURSE.forEach(function (stage, i) {
    const ps = s.perStage[stage.id] || {};
    const total = ps.chapters || 0;
    const pct = total ? Math.round((ps.done || 0) / total * 100) : 0;
    html += '<div class="stage-card" data-nav="chapter" data-id="' + (stage.chapters && stage.chapters[0] ? stage.chapters[0].id : '') + '">';
    html += '<div class="sc-top"><span class="sc-icon">' + esc(stage.icon) + '</span>';
    html += '<div><div class="sc-title">第 ' + (i + 1) + ' 章 · ' + esc(stage.title) + '</div>';
    html += '<div class="sc-sub">' + esc(stage.intro || '') + '</div></div></div>';
    html += '<div class="sc-progress"><div class="sc-progress-track"><div class="sc-progress-fill" style="width:' + pct + '%"></div></div>';
    html += '<div class="sc-progress-meta"><span>' + (ps.done || 0) + '/' + total + ' 节</span><span>' + pct + '%</span></div></div>';
    html += '</div>';
  });
  html += '</div>';

  const content = document.getElementById('content');
  content.innerHTML = html;
}

/* ---------------- 渲染：训练题 ---------------- */
const quizAnswers = {}; // stageId -> { choice: [idx], fill: [text] }

function initQuizState(stageId) {
  const quiz = getStageById(stageId).quiz;
  if (!quizAnswers[stageId]) {
    quizAnswers[stageId] = {
      choice: (quiz.choice || []).map(function () { return -1; }),
      fill: (quiz.fill || []).map(function () { return ''; })
    };
  }
}

function renderQuiz(stageId) {
  const stage = getStageById(stageId);
  if (!stage || !stage.quiz) { renderHome(); return; }
  const quiz = stage.quiz;
  initQuizState(stageId);
  const choice = quiz.choice || [];
  const fill = quiz.fill || [];
  const code = quiz.code || [];
  const CN = ['一', '二', '三', '四', '五', '六'];
  let secNo = 0;

  let html = '';
  html += '<div class="quiz-head"><div class="crumb">' + esc(stage.title) + '</div>';
  html += '<h1>' + esc(quiz.title || '本章训练题') + '</h1>';
  const totalParts = [];
  if (choice.length) totalParts.push('选择题 ' + choice.length);
  if (fill.length) totalParts.push('填空题 ' + fill.length);
  if (code.length) totalParts.push('编程题 ' + code.length);
  html += '<p>共 ' + (choice.length + fill.length + code.length) + ' 题：' + totalParts.join('、') + '。</p></div>';

  if (choice.length) {
    html += '<div class="quiz-part-title">' + CN[secNo++] + '、选择题</div>';
    html += '<div class="quiz-part-hint">点击选项选中，提交后显示答案与解析。</div>';
    choice.forEach(function (q, qi) {
      html += '<div class="question" data-qi="' + qi + '">';
      html += '<div class="q-text"><span class="q-num">' + (qi + 1) + '.</span>' + renderInline(q.q) + '</div>';
      q.options.forEach(function (opt, oi) {
        html += '<div class="option js-quiz-option" data-oi="' + oi + '"><span class="opt-letter">' + String.fromCharCode(65 + oi) + '</span><span>' + renderInline(opt) + '</span></div>';
      });
      html += '</div>';
    });
  }

  if (fill.length) {
    html += '<div class="quiz-part-title">' + CN[secNo++] + '、填空题</div>';
    html += '<div class="quiz-part-hint">在输入框中填写答案（不区分大小写），提交后判对错并给出解析。</div>';
    fill.forEach(function (q, fi) {
      html += '<div class="question" data-fi="' + fi + '">';
      html += '<div class="q-text"><span class="q-num">' + (fi + 1) + '.</span>' + renderInline(q.q) + '</div>';
      html += '<input class="fill-input js-fill-input" type="text" placeholder="请输入答案…" autocomplete="off">';
      html += '</div>';
    });
  }

  if (choice.length || fill.length) {
    html += '<div class="quiz-submit"><button class="btn btn-primary js-quiz-submit">提交选择题与填空题</button><span class="js-quiz-note" style="color:var(--ink-faint);font-size:13px"></span></div>';
    html += '<div class="js-quiz-score"></div>';
  }

  if (code.length) {
    html += '<div class="quiz-part-title">' + CN[secNo++] + '、编程题</div>';
    html += '<div class="quiz-part-hint">在编辑器中写代码，点「运行」看结果，点「提交判题」自动判对错。</div>';
    code.forEach(function (p) { html += renderCodeProblem(p); });
  }

  const content = document.getElementById('content');
  content.innerHTML = html;
  initEditors(content);
  // 回填已填过的填空答案
  const state = quizAnswers[stageId];
  content.querySelectorAll('.question[data-fi]').forEach(function (qEl) {
    const fi = Number(qEl.dataset.fi);
    qEl.querySelector('.js-fill-input').value = state.fill[fi] || '';
  });
  openStageOf(stageId);
}

function submitQuiz(stageId) {
  const stage = getStageById(stageId);
  const quiz = stage.quiz;
  const state = quizAnswers[stageId];
  const container = document.getElementById('content');
  const choice = quiz.choice || [];
  const fill = quiz.fill || [];
  let correct = 0, total = choice.length + fill.length;

  // 选择题
  choice.forEach(function (q, qi) {
    const qEl = container.querySelector('.question[data-qi="' + qi + '"]');
    if (!qEl) return;
    const picked = state.choice[qi];
    qEl.querySelectorAll('.option').forEach(function (optEl, oi) {
      if (oi === q.answer) optEl.classList.add('correct');
      else if (oi === picked && picked !== q.answer) optEl.classList.add('wrong');
    });
    if (picked === q.answer) correct++;
    if (q.explain) qEl.insertAdjacentHTML('beforeend', '<div class="explain"><span class="explain-label">解析：</span>' + renderInline(q.explain) + '</div>');
  });

  // 填空题
  fill.forEach(function (q, fi) {
    const qEl = container.querySelector('.question[data-fi="' + fi + '"]');
    if (!qEl) return;
    const input = qEl.querySelector('.js-fill-input');
    const val = input.value;
    state.fill[fi] = val;
    const accept = [q.answer].concat(q.accept || []);
    const ok = accept.some(function (a) { return norm(a) === norm(val); }) && norm(val) !== '';
    if (ok) { input.classList.add('right'); correct++; }
    else input.classList.add('wrong');
    qEl.insertAdjacentHTML('beforeend', '<div class="explain"><span class="explain-label">答案：</span><code>' + esc(q.answer) + '</code>' + (q.explain ? '<br><span class="explain-label">解析：</span>' + renderInline(q.explain) : '') + '</div>');
  });

  const scoreEl = container.querySelector('.js-quiz-score');
  const pct = total ? Math.round(correct / total * 100) : 0;
  const cls = pct >= 80 ? 'good' : pct >= 60 ? 'mid' : 'bad';
  const face = pct >= 80 ? '🎉' : pct >= 60 ? '👍' : '💪';
  scoreEl.innerHTML = '<div class="quiz-score-box ' + cls + '"><span class="big">' + face + ' ' + correct + '/' + total + '</span>' +
    '客观题答对 ' + correct + ' 题，共 ' + total + ' 题（' + pct + '%）' +
    (pct < 60 ? '<br>建议复习本节的讲解后再来一次。' : (pct < 80 ? '<br>不错，个别知识点再回顾一下会更好。' : '<br>很好，可以进入下一章了！')) + '</div>';
  saveQuizScore(stageId, correct, total);
  const note = container.querySelector('.js-quiz-note');
  if (note) note.textContent = '已提交，结果已保存到进度中。';
}

/* ---------------- 渲染：进度页 ---------------- */
function renderProgress() {
  const s = computeStats();
  let html = '<div class="quiz-head"><h1>我的学习进度</h1><p>数据保存在当前浏览器中，无需登录。</p></div>';
  html += '<div class="stat-row">';
  html += '<div class="stat"><div class="stat-num">' + s.overall + '%</div><div class="stat-label">总进度</div></div>';
  html += '<div class="stat"><div class="stat-num">' + s.doneChapters + '/' + s.chapters + '</div><div class="stat-label">已完成小节</div></div>';
  html += '<div class="stat"><div class="stat-num">' + s.codePassed + '/' + s.codeTotal + '</div><div class="stat-label">已通过编程题</div></div>';
  html += '<div class="stat"><div class="stat-num">' + s.quizCorrect + '/' + s.quizQ + '</div><div class="stat-label">客观题答对数</div></div>';
  html += '</div>';

  html += '<div class="section-title">各章节明细</div><div class="progress-list">';
  COURSE.forEach(function (stage) {
    const ps = s.perStage[stage.id] || {};
    const total = ps.chapters || 0;
    const pct = total ? Math.round((ps.done || 0) / total * 100) : 0;
    const qr = progress.quiz[stage.id];
    html += '<div class="progress-stage"><div class="ps-top"><span class="ps-title">' + esc(stage.icon) + ' ' + esc(stage.title) + '</span><span class="ps-pct">' + pct + '%</span></div>';
    html += '<div class="sc-progress"><div class="sc-progress-track"><div class="sc-progress-fill" style="width:' + pct + '%"></div></div>';
    html += '<div class="sc-progress-meta"><span>小节 ' + (ps.done || 0) + '/' + total + '</span><span>编程题 ' + (ps.codePass || 0) + '/' + (ps.codeTotal || 0) + '</span>' + (stage.quiz ? '<span>客观题 ' + (qr ? qr.correct + '/' + qr.total : '未做') + '</span>' : '') + '</div></div></div>';
  });
  html += '</div>';

  html += '<div class="chapter-nav"><button class="btn btn-ghost js-reset-progress">🗑 清空学习进度</button></div>';

  const content = document.getElementById('content');
  content.innerHTML = html;
}

/* ---------------- 编辑器初始化 ---------------- */
function initEditors(root) {
  const textareas = root.querySelectorAll('textarea.code-editor');
  textareas.forEach(function (ta) {
    if (window.CodeMirror) {
      CodeMirror.fromTextArea(ta, {
        mode: 'text/x-csrc', theme: 'dracula', lineNumbers: true,
        indentUnit: 4, tabSize: 4, indentWithTabs: false,
        lineWrapping: false
      });
    } else {
      ta.style.cssText = 'display:block;width:100%;min-height:80px;background:#282a36;color:#f8f8f2;padding:12px;font-family:var(--mono);border:none;outline:none;resize:vertical;line-height:1.6;font-size:14px;';
    }
  });
}
function getEditorCode(container) {
  const cmEl = container.querySelector('.CodeMirror');
  if (cmEl && cmEl.CodeMirror) return cmEl.CodeMirror.getValue();
  const ta = container.querySelector('textarea.code-editor');
  if (ta) return ta.value;
  return null;
}
function setEditorCode(container, code) {
  const cmEl = container.querySelector('.CodeMirror');
  if (cmEl && cmEl.CodeMirror) { cmEl.CodeMirror.setValue(code); return; }
  const ta = container.querySelector('textarea.code-editor');
  if (ta) ta.value = code;
}

/* ---------------- 运行 / 判题交互 ---------------- */
async function runIntoContainer(container) {
  const outEl = container.querySelector('.js-out');
  const statusEl = container.querySelector('.js-status');
  let code = getEditorCode(container);
  if (code == null) {
    const pre = container.querySelector('pre code');
    if (pre) code = pre.textContent;
    else return;
  }
  if (statusEl) { statusEl.textContent = '正在编译运行…'; statusEl.classList.add('loading'); }
  try {
    const r = formatRun(await runCCode(code, ''));
    showOutput(outEl, r.out, r.err);
  } catch (e) {
    showOutput(outEl, '', OFFLINE_MSG);
  }
  if (statusEl) { statusEl.textContent = ''; statusEl.classList.remove('loading'); }
}
function showOutput(outEl, stdout, stderr) {
  if (!outEl) return;
  outEl.classList.add('show');
  if (stderr) {
    outEl.innerHTML = '<span class="out-label">输出 / 错误</span>\n<span class="out-err">' + esc(stderr) + '</span>' + (stdout ? '\n' + esc(stdout) : '');
  } else {
    outEl.innerHTML = '<span class="out-label">输出</span>\n' + (esc(stdout) || '(无输出)');
  }
}

async function checkCodeProblem(container) {
  const p = codeProblemMap[container.dataset.codeid];
  if (!p) return;
  const code = getEditorCode(container);
  if (code == null) return;
  const statusEl = container.querySelector('.js-status');
  const resultsEl = container.querySelector('.js-results');
  if (statusEl) { statusEl.textContent = '正在判题…'; statusEl.classList.add('loading'); }
  const r = await gradeCodeProblem(p, code);
  if (statusEl) { statusEl.textContent = ''; statusEl.classList.remove('loading'); }
  const allPass = r.allPass;
  let html = r.results.map(function (t) {
    const cls = t.ok ? 'pass' : 'fail';
    const head = (t.ok ? '✓ 通过' : '✗ 未通过') + ' · ' + esc(t.stage || '测试');
    let body = '';
    if (t.stdin != null) body += '输入：' + esc(t.stdin);
    if (t.got != null) body += (body ? '　→　' : '') + '你的结果：' + esc(t.got);
    if (t.expected != null) body += (body ? '　→　' : '') + '期望：' + esc(t.expected);
    return '<div class="test-case ' + cls + '"><div class="tc-head">' + head + '</div><div class="tc-body">' + body + '</div></div>';
  }).join('');
  html += '<div class="verdict ' + (allPass ? 'allpass' : 'fail') + '">' + (allPass ? '🎉 全部用例通过，太棒了！' : '还有用例没通过，再试试～') + '</div>';
  resultsEl.innerHTML = html;
  if (allPass) markCodePassed(p.id);
}

/* ---------------- 全局事件 ---------------- */
document.addEventListener('click', function (e) {
  const el = e.target;

  const stageToggle = el.closest('.js-stage-toggle');
  if (stageToggle) {
    const g = stageToggle.closest('.stage-group');
    const sid = g.dataset.stage;
    setStageOpen(sid, !isStageOpen(sid));
    renderSidebar();
    return;
  }

  const hintBtn = el.closest('.js-hint');
  if (hintBtn) {
    const content = hintBtn.nextElementSibling;
    if (content) content.style.display = content.style.display === 'none' ? 'block' : 'none';
    return;
  }

  const answerBtn = el.closest('.js-answer');
  if (answerBtn) {
    const box = answerBtn.closest('.exercise').querySelector('.js-answer-box');
    if (box) box.classList.toggle('show');
    return;
  }

  const markDone = el.closest('.js-mark-done');
  if (markDone) {
    const id = currentChapterId();
    if (id) { markChapterDone(id, !progress.done[id]); }
    return;
  }

  const prevBtn = el.closest('.js-prev');
  if (prevBtn) { const c = chapterOrder[chapterOrder.indexOf(getChapterById(currentChapterId())) - 1]; if (c) location.hash = '#/chapter/' + c.id; return; }
  const nextBtn = el.closest('.js-next');
  if (nextBtn) { const c = chapterOrder[chapterOrder.indexOf(getChapterById(currentChapterId())) + 1]; if (c) location.hash = '#/chapter/' + c.id; return; }

  const resetProg = el.closest('.js-reset-progress');
  if (resetProg) {
    if (confirm('确定要清空全部学习进度吗？此操作无法撤销。')) {
      progress = { done: {}, quiz: {}, codePassed: {}, last: null, openStages: { ch1: true } };
      saveProgress();
      toast('进度已清空');
      refreshAll();
    }
    return;
  }

  const runBtn = el.closest('.js-run');
  if (runBtn) {
    const container = runBtn.closest('.codeblock, .example, .exercise');
    if (container) runIntoContainer(container);
    return;
  }

  const checkBtn = el.closest('.js-check');
  if (checkBtn) {
    const container = checkBtn.closest('.exercise');
    if (container) checkCodeProblem(container);
    return;
  }

  const resetBtn = el.closest('.js-reset');
  if (resetBtn) {
    const container = resetBtn.closest('.exercise');
    if (container) {
      const p = codeProblemMap[container.dataset.codeid];
      if (p) setEditorCode(container, p.starter || '');
    }
    return;
  }

  const quizOption = el.closest('.js-quiz-option');
  if (quizOption) {
    const qEl = quizOption.closest('.question');
    const stageId = currentQuizId();
    const qi = Number(qEl.dataset.qi);
    const oi = Number(quizOption.dataset.oi);
    quizAnswers[stageId].choice[qi] = oi;
    qEl.querySelectorAll('.option').forEach(function (o) { o.classList.remove('selected'); });
    quizOption.classList.add('selected');
    return;
  }

  const quizSubmit = el.closest('.js-quiz-submit');
  if (quizSubmit) { submitQuiz(currentQuizId()); return; }

  const nav = el.closest('[data-nav]');
  if (nav) {
    const kind = nav.dataset.nav;
    const id = nav.dataset.id;
    if (kind === 'chapter') location.hash = '#/chapter/' + id;
    else if (kind === 'quiz') location.hash = '#/quiz/' + id;
    else if (kind === 'home') location.hash = '#/home';
    else if (kind === 'progress') location.hash = '#/progress';
    return;
  }
});

/* ---------------- 路由 ---------------- */
function currentChapterId() {
  const p = location.hash.replace(/^#\/?/, '').split('/');
  return p[0] === 'chapter' ? p[1] : null;
}
function currentQuizId() {
  const p = location.hash.replace(/^#\/?/, '').split('/');
  return p[0] === 'quiz' ? p[1] : null;
}
function route() {
  const h = location.hash.replace(/^#\/?/, '');
  const parts = h.split('/');
  const path = parts[0];
  if (path === 'chapter' && parts[1]) renderChapter(parts[1]);
  else if (path === 'quiz' && parts[1]) renderQuiz(parts[1]);
  else if (path === 'progress') renderProgress();
  else renderHome();
  renderSidebar();
  updateTopbar();
  updateActiveNav();
  window.scrollTo(0, 0);
  closeSidebarMobile();
}
function refreshAll() {
  renderSidebar();
  updateTopbar();
}

function updateTopbar() {
  const s = computeStats();
  const label = document.getElementById('topbarProgressLabel');
  const fill = document.getElementById('topbarProgressFill');
  if (label) label.textContent = '总进度 ' + s.overall + '%';
  if (fill) fill.style.width = s.overall + '%';
}

function updateActiveNav() {
  const h = location.hash.replace(/^#\/?/, '').split('/')[0];
  document.querySelectorAll('.topbar-link').forEach(function (a) {
    a.classList.toggle('active', a.dataset.nav === (h === '' || h === 'home' ? 'home' : (h === 'progress' ? 'progress' : '')));
  });
}

function closeSidebarMobile() {
  const sb = document.getElementById('sidebar');
  if (sb) sb.classList.remove('open');
}

/* ---------------- 移动端菜单按钮 ---------------- */
function injectMenuToggle() {
  if (document.querySelector('.menu-toggle')) return;
  const btn = document.createElement('button');
  btn.className = 'menu-toggle';
  btn.innerHTML = '☰';
  btn.setAttribute('aria-label', '打开目录');
  const topbar = document.querySelector('.topbar');
  topbar.insertBefore(btn, topbar.firstChild);
  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    document.getElementById('sidebar').classList.toggle('open');
  });
}

/* ---------------- 启动 ---------------- */
window.addEventListener('hashchange', route);
document.addEventListener('DOMContentLoaded', function () {
  injectMenuToggle();
  if (!location.hash) location.hash = '#/home';
  route();
});
