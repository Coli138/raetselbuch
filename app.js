'use strict';

/* ---------- Daten ---------- */
// [Emoji, Name mit Artikel, Mehrzahl]
const VEHICLES = [
  ['🚂', 'die Lokomotive', 'Lokomotiven'], ['🚒', 'das Feuerwehrauto', 'Feuerwehrautos'],
  ['🚜', 'der Traktor', 'Traktoren'], ['✈️', 'das Flugzeug', 'Flugzeuge'],
  ['🚁', 'der Hubschrauber', 'Hubschrauber'], ['🚗', 'das Auto', 'roten Autos'],
  ['🚌', 'der Bus', 'Busse'], ['🚓', 'das Polizeiauto', 'Polizeiautos'],
  ['🚑', 'der Krankenwagen', 'Krankenwagen'], ['🚲', 'das Fahrrad', 'Fahrräder'],
  ['🚀', 'die Rakete', 'Raketen'], ['⛵', 'das Segelboot', 'Segelboote'],
  ['🚚', 'der Lastwagen', 'Lastwagen'], ['🚢', 'das Schiff', 'Schiffe'],
  ['🏍️', 'das Motorrad', 'Motorräder'], ['🚕', 'das Taxi', 'Taxis'],
];
// Für Schatten nur Fahrzeuge mit klar verschiedenem Umriss
const DISTINCT = ['🚂', '✈️', '🚁', '🚗', '🚌', '🚲', '🚀', '⛵', '🚜', '🚢'];
const OTHERS = ['🐶', '🐱', '🍎', '🍌', '🐘', '🌳', '⚽', '🧸', '🐟', '🌸', '🐄', '🍓'];
const PAIRS = [['🚒', '🔥'], ['🚑', '🏥'], ['🚀', '🌙'], ['⛵', '🌊'], ['🚂', '🛤️'], ['🚜', '🌾'], ['✈️', '☁️'], ['🚌', '🚏']];
const ROUTES = [['🚒', '🔥'], ['🚑', '🏥'], ['🚂', '🚉'], ['🚌', '🏫'], ['🚜', '🌾'], ['🚗', '🏠'], ['🚚', '🏭'], ['🚓', '🚦']];
const PATHS = [
  'M 100 300 C 300 40, 420 560, 620 300 S 840 100, 900 300',
  'M 100 480 C 280 480, 240 130, 480 130 S 700 480, 900 460',
  'M 100 130 L 360 130 C 540 130, 480 470, 660 470 L 900 470',
  'M 100 300 C 200 60, 480 60, 500 300 S 800 540, 900 300',
  'M 100 460 C 260 460, 300 300, 500 300 S 740 140, 900 140',
];
const SHAPES = {
  kreis: ['#EF5B5B', '<circle cx="50" cy="50" r="44"/>'],
  quadrat: ['#4EA5D9', '<rect x="9" y="9" width="82" height="82" rx="7"/>'],
  dreieck: ['#5FB49C', '<polygon points="50,8 95,90 5,90" stroke-linejoin="round"/>'],
  stern: ['#FFC857', `<polygon points="${starPoints()}"/>`],
  herz: ['#9B7EDE', '<path d="M50 90 C 8 60, 2 30, 26 16 C 40 9, 50 20, 50 32 C 50 20, 60 9, 74 16 C 98 30, 92 60, 50 90 Z"/>'],
};
const NUMBERS = ['', 'Eins', 'Zwei', 'Drei', 'Vier', 'Fünf', 'Sechs', 'Sieben', 'Acht', 'Neun', 'Zehn'];

function starPoints() {
  const p = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 ? 20 : 47, a = Math.PI * i / 5 - Math.PI / 2;
    p.push((50 + r * Math.cos(a)).toFixed(1) + ',' + (52 + r * Math.sin(a)).toFixed(1));
  }
  return p.join(' ');
}

/* ---------- Helfer ---------- */
const $ = s => document.querySelector(s);
const rnd = n => Math.floor(Math.random() * n);
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = (a, n) => shuffle(a).slice(0, n);
const veh = e => VEHICLES.find(v => v[0] === e);
function el(tag, cls, html) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
}
function wobble(n) { n.classList.remove('wobble'); void n.offsetWidth; n.classList.add('wobble'); }

/* ---------- Speicher ---------- */
const S = { stars: 0, sound: true, hard: false };
try { Object.assign(S, JSON.parse(localStorage.getItem('raetselbuch') || '{}')); } catch (e) {}
function save() { try { localStorage.setItem('raetselbuch', JSON.stringify(S)); } catch (e) {} }

/* ---------- Ton und Sprache ---------- */
let ac;
function tone(freq, at, dur, type, gain) {
  if (!S.sound) return;
  try {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    if (ac.state === 'suspended') ac.resume();
    const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime + at;
    o.type = type || 'sine'; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(gain || 0.16, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(ac.destination);
    o.start(t); o.stop(t + dur + 0.05);
  } catch (e) {}
}
const ok = () => { tone(660, 0, .15); tone(880, .1, .25); };
const no = () => { tone(190, 0, .22, 'triangle', .12); };
const win = () => [523, 659, 784, 1047].forEach((f, i) => tone(f, i * .12, .35, 'triangle'));
function say(text) {
  if (!S.sound || !text || !('speechSynthesis' in window)) return;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'de-DE'; u.rate = 0.9; u.pitch = 1.1;
    speechSynthesis.speak(u);
  } catch (e) {}
}

/* ---------- Ziehen ---------- */
// Eigenschaft translate statt transform: sie wirkt ausserhalb der Vergrösserung beim Ziehen,
// sonst läuft das Teil dem Finger davon und rastet versetzt ein.
function setT(n, x, y) { n._t = [x, y]; n.style.translate = `${x}px ${y}px`; }
function center(n) { const r = n.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }
function inside(n, x, y, pad) { const r = n.getBoundingClientRect(); return x > r.left - pad && x < r.right + pad && y > r.top - pad && y < r.bottom + pad; }
// onDrop(x, y) liefert das Zielelement oder null
function draggable(n, onDrop) {
  let id = null, sx, sy, bx, by;
  n.addEventListener('pointerdown', e => {
    if (id !== null || n.classList.contains('locked')) return;
    id = e.pointerId;
    try { n.setPointerCapture(id); } catch (err) {}
    [bx, by] = n._t || [0, 0]; sx = e.clientX; sy = e.clientY;
    n.classList.remove('back'); n.classList.add('dragging');
  });
  n.addEventListener('pointermove', e => { if (e.pointerId === id) setT(n, bx + e.clientX - sx, by + e.clientY - sy); });
  const up = e => {
    if (e.pointerId !== id) return;
    id = null; n.classList.remove('dragging');
    const [cx, cy] = center(n), target = onDrop(cx, cy);
    n.classList.add('back');
    if (target) {
      const [tx, ty] = center(target), [x, y] = n._t || [0, 0];
      setT(n, x + tx - cx, y + ty - cy); n.classList.add('locked');
    } else setT(n, 0, 0);
  };
  n.addEventListener('pointerup', up); n.addEventListener('pointercancel', up);
}

/* ---------- Rätsel ---------- */
// Gemeinsame Mechanik: Teile unten auf Felder oben ziehen
function match(stage, done, items, ordered) {
  stage.style.setProperty('--n', items.length);
  const top = el('div', 'row'), bottom = el('div', 'row');
  let left = items.length;
  const slots = (ordered ? items : shuffle(items)).map(it => {
    const s = el('div', 'slot');
    if (it.top) s.append(el('div', 'em', it.top));
    s.append(el('div', 'slot-drop' + (it.ghost ? '' : ' dashed'), it.ghost || ''));
    s._key = it.key; top.append(s); return s;
  });
  shuffle(items).forEach(it => {
    const p = el('div', 'piece', it.piece);
    draggable(p, (x, y) => {
      const s = slots.find(s => inside(s, x, y, 12));
      if (!s) return null;
      if (s._key !== it.key || s._full) { no(); wobble(s); return null; }
      s._full = true; s.classList.add('full'); ok();
      if (it.name) say(it.name);
      if (--left === 0) done();
      return s.querySelector('.slot-drop');
    });
    bottom.append(p);
  });
  stage.append(top, bottom);
}
const svg = (inner, fill) => `<svg viewBox="0 0 100 100" ${fill ? `fill="${fill}"` : 'class="hole"'}>${inner}</svg>`;

const KINDS = [
  { id: 'schatten', title: 'Schatten', icon: '<span class="shadow" style="opacity:.6">🚁</span>', color: 'var(--violet)', say: 'Welcher Schatten passt?',
    build(stage, done) {
      match(stage, done, pick(DISTINCT, S.hard ? 4 : 3).map(e => ({ key: e, piece: `<span class="em">${e}</span>`, ghost: `<span class="em shadow">${e}</span>`, name: veh(e)[1] })));
    } },
  { id: 'paare', title: 'Was gehört zusammen?', icon: '🔥', color: 'var(--red)', say: 'Was gehört zusammen?',
    build(stage, done) {
      match(stage, done, pick(PAIRS, 3).map(([v, place]) => ({ key: v, piece: `<span class="em">${v}</span>`, top: place })));
    } },
  { id: 'formen', title: 'Formen', icon: '🔷', color: 'var(--blue)', say: 'Wo passen die Formen hinein?',
    build(stage, done) {
      match(stage, done, pick(Object.keys(SHAPES), 4).map(k => ({ key: k, piece: svg(SHAPES[k][1], SHAPES[k][0]), ghost: svg(SHAPES[k][1]) })));
    } },
  { id: 'memory', title: 'Memory', icon: '🎴', color: 'var(--green)', say: 'Finde die gleichen Paare.',
    build(stage, done) {
      const pairs = S.hard ? 6 : 3, box = el('div', 'memory' + (S.hard ? ' big' : ''));
      let open = [], busy = false, left = pairs;
      shuffle(pick(VEHICLES, pairs).flatMap(v => [v, v])).forEach(v => {
        const c = el('button', 'card', `<div><i class="rear">?</i><i class="face">${v[0]}</i></div>`);
        c.addEventListener('click', () => {
          if (busy || c.classList.contains('open')) return;
          c.classList.add('open'); tone(520, 0, .08); open.push([c, v]);
          if (open.length < 2) return;
          const [[a, va], [b, vb]] = open; open = [];
          if (va === vb) {
            a.classList.add('found'); b.classList.add('found'); ok(); say(va[1]);
            if (--left === 0) done();
          } else {
            busy = true;
            setTimeout(() => { a.classList.remove('open'); b.classList.remove('open'); busy = false; }, 1000);
          }
        });
        box.append(c);
      });
      stage.append(box);
    } },
  { id: 'fremd', title: 'Was passt nicht?', icon: '❓', color: 'var(--yellow)', say: 'Was passt nicht dazu?',
    build(stage, done) {
      const same = S.hard ? 5 : 3;
      let items;
      if (rnd(2)) items = [...pick(VEHICLES, same).map(v => [v[0], false]), [pick(OTHERS, 1)[0], true]];
      else { const [a, b] = pick(VEHICLES, 2); items = [...Array(same).fill([a[0], false]), [b[0], true]]; }
      const box = el('div', 'grid'); box.style.gridTemplateColumns = `repeat(${S.hard ? 3 : 2}, auto)`;
      let solved = false;
      shuffle(items).forEach(([e, odd]) => {
        const b = el('button', 'pick em', e);
        b.addEventListener('click', () => {
          if (solved) return;
          if (!odd) { no(); wobble(b); return; }
          solved = true; b.classList.add('right'); ok(); done();
        });
        box.append(b);
      });
      stage.append(box);
    } },
  { id: 'finde', title: 'Suchen', icon: '🔍', color: 'var(--red)',
    build(stage, done) {
      const cols = S.hard ? 5 : 4, total = cols * (S.hard ? 4 : 3);
      const [target, ...rest] = pick(VEHICLES, S.hard ? 9 : 6), n = (S.hard ? 5 : 3) + rnd(2);
      const cells = shuffle([...Array(n).fill(target), ...Array.from({ length: total - n }, (_, i) => rest[i % rest.length])]);
      const banner = el('div', 'banner', `<span>🔍</span><span>${target[0]}</span>` + '<span class="todo">⭐</span>'.repeat(n));
      const todo = [...banner.querySelectorAll('.todo')];
      const box = el('div', 'grid find' + (S.hard ? ' big' : '')); box.style.gridTemplateColumns = `repeat(${cols}, auto)`;
      let found = 0;
      cells.forEach(v => {
        const b = el('button', 'pick em', v[0]);
        b.style.rotate = (rnd(21) - 10) + 'deg';
        b.addEventListener('click', () => {
          if (b.classList.contains('right')) return;
          if (v !== target) { no(); wobble(b); return; }
          b.classList.add('right'); ok(); todo[found++].classList.add('ok');
          if (found === n) done();
        });
        box.append(b);
      });
      stage.append(banner, box);
      return 'Finde alle ' + target[2] + '.';
    } },
  { id: 'weg', title: 'Weg fahren', icon: '🛣️', color: 'var(--green)',
    build(stage, done) {
      const [car, goal] = pick(ROUTES, 1)[0], d = pick(PATHS, 1)[0], flip = rnd(2) === 1;
      stage.innerHTML = `<svg class="weg" viewBox="0 0 1000 600">
        <g ${flip ? 'transform="translate(0,600) scale(1,-1)"' : ''}>
          <path class="road-edge" d="${d}"/><path class="road" d="${d}"/><path class="road-done" d="${d}"/><path class="road-line" d="${d}"/>
        </g>
        <text class="goal" dy=".35em">${goal}</text>
        <g class="car"><text transform="scale(-1,1)" dy=".35em">${car}</text><text class="finger" x="10" y="120">👆</text></g>
      </svg>`;
      const s = stage.firstChild, road = s.querySelector('.road'), trail = s.querySelector('.road-done'), carG = s.querySelector('.car');
      const L = road.getTotalLength(), N = 240;
      const pts = Array.from({ length: N + 1 }, (_, i) => { const p = road.getPointAtLength(L * i / N); return [p.x, flip ? 600 - p.y : p.y]; });
      const g = s.querySelector('.goal'); g.setAttribute('x', pts[N][0]); g.setAttribute('y', pts[N][1] - 20);
      trail.style.strokeDasharray = L;
      let cur = 0, active = false, finished = false;
      const place = () => { carG.setAttribute('transform', `translate(${pts[cur][0]},${pts[cur][1] - 20})`); trail.style.strokeDashoffset = L * (1 - cur / N); };
      place();
      const move = e => {
        if (!active || finished) return;
        const q = new DOMPoint(e.clientX, e.clientY).matrixTransform(s.getScreenCTM().inverse());
        let best = -1, bd = 120;
        for (let i = cur; i <= Math.min(N, cur + 34); i++) {
          const dist = Math.hypot(pts[i][0] - q.x, pts[i][1] - q.y);
          if (dist <= bd) { bd = dist; best = i; }
        }
        if (best <= cur) return;
        if (cur === 0) { const f = s.querySelector('.finger'); if (f) f.remove(); }
        cur = best; place();
        if (cur >= N - 3) { cur = N; place(); finished = true; ok(); done(); }
      };
      s.addEventListener('pointerdown', e => { active = true; move(e); });
      s.addEventListener('pointermove', move);
      s.addEventListener('pointerup', () => { active = false; });
      s.addEventListener('pointercancel', () => { active = false; });
      return `Fahre ${veh(car)[1].replace(/^der /, 'den ')} ans Ziel.`;
    } },
  { id: 'zaehlen', title: 'Zählen', icon: '🔢', color: 'var(--blue)', say: 'Wie viele sind es?',
    build(stage, done) {
      stage.style.setProperty('--n', 3);
      const max = S.hard ? 10 : 6, n = S.hard ? 4 + rnd(7) : 1 + rnd(5), v = pick(VEHICLES, 1)[0];
      const area = el('div', 'count-area' + (n > 5 ? ' many' : ''), Array.from({ length: n }, (_, i) => `<span style="animation-delay:${i * .08}s">${v[0]}</span>`).join(''));
      const opts = new Set([n]);
      while (opts.size < 3) opts.add(Math.max(1, Math.min(max, n + rnd(5) - 2)));
      const row = el('div', 'row');
      let solved = false;
      [...opts].sort((a, b) => a - b).forEach(k => {
        const b = el('button', 'pick num', `${k}<small>${'●'.repeat(k)}</small>`);
        b.addEventListener('click', () => {
          if (solved) return;
          if (k !== n) { no(); wobble(b); return; }
          solved = true; b.classList.add('right'); ok(); say(NUMBERS[n] + '!'); done();
        });
        row.append(b);
      });
      stage.append(area, row);
    } },
  { id: 'puzzle', title: 'Puzzle', icon: '🧩', color: 'var(--violet)', say: 'Setze das Bild zusammen.',
    build(stage, done) {
      const v = pick(VEHICLES, 1)[0];
      const inner = `<div class="jig-inner">${v[0]}</div>`;
      const board = el('div', 'jig-board', inner), tray = el('div', 'row tray');
      const cols = S.hard ? 3 : 2, rows = 2, ids = Array.from({ length: cols * rows }, (_, i) => i);
      stage.style.setProperty('--gc', cols); stage.style.setProperty('--gr', rows);
      const cells = ids.map(() => { const c = el('div', 'jig-cell'); board.append(c); return c; });
      let left = ids.length;
      shuffle(ids).forEach(i => {
        const p = el('div', 'piece jig-piece', inner);
        p.style.setProperty('--c', i % cols); p.style.setProperty('--r', Math.floor(i / cols));
        draggable(p, (x, y) => {
          if (!inside(board, x, y, 10)) return null;
          if (!inside(cells[i], x, y, 14)) { no(); return null; }
          ok();
          if (--left === 0) { say(v[1]); done(); }
          return cells[i];
        });
        tray.append(p);
      });
      stage.append(board, tray);
    } },

  /* ---------- Schwierigere Arten ---------- */
  { id: 'muster', title: 'Reihe', icon: '🔁', color: 'var(--yellow)', hard: true, say: 'Wie geht die Reihe weiter?',
    build(stage, done) {
      const forms = S.hard ? [[0, 1], [0, 0, 1], [0, 1, 1], [0, 1, 2]] : [[0, 1]];
      const form = pick(forms, 1)[0], vs = pick(VEHICLES, 4).map(v => v[0]), len = S.hard ? 6 : 5;
      const seq = Array.from({ length: len }, (_, i) => vs[form[i % form.length]]);
      const answer = vs[form[len % form.length]];
      const series = el('div', 'series', seq.map(e => `<span>${e}</span>`).join('') + '<span class="gap">?</span>');
      const used = [...new Set(form)].map(i => vs[i]);
      const row = el('div', 'row');
      let solved = false;
      shuffle([...used, ...vs.filter(v => !used.includes(v))].slice(0, 3)).forEach(e => {
        const b = el('button', 'pick em', e);
        b.addEventListener('click', () => {
          if (solved) return;
          if (e !== answer) { no(); wobble(b); return; }
          solved = true; b.classList.add('right');
          const gap = series.querySelector('.gap'); gap.textContent = e; gap.classList.add('filled');
          ok(); done();
        });
        row.append(b);
      });
      stage.append(series, row);
    } },
  { id: 'fehlt', title: 'Was fehlt?', icon: '👀', color: 'var(--violet)', hard: true, say: 'Schau genau hin und merke dir die Fahrzeuge.',
    build(stage, done) {
      const n = S.hard ? 4 : 3;
      stage.style.setProperty('--n', n);
      const vs = pick(VEHICLES, n + 2), shown = vs.slice(0, n), gone = rnd(n);
      const top = el('div', 'row'), bottom = el('div', 'row');
      const cards = shown.map(v => { const c = el('div', 'pick em', v[0]); top.append(c); return c; });
      bottom.style.visibility = 'hidden';
      let solved = false;
      shuffle([shown[gone], vs[n], vs[n + 1]]).forEach(v => {
        const b = el('button', 'pick em', v[0]);
        b.addEventListener('click', () => {
          if (solved) return;
          if (v !== shown[gone]) { no(); wobble(b); return; }
          solved = true; b.classList.add('right');
          cards[gone].textContent = v[0]; cards[gone].classList.add('right');
          ok(); say(v[1]); done();
        });
        bottom.append(b);
      });
      stage.append(top, bottom);
      // Erst anschauen lassen, dann zudecken und eines verschwinden lassen
      setTimeout(() => {
        if (!top.isConnected) return;
        cards.forEach(c => c.classList.add('covered'));
        setTimeout(() => {
          if (!top.isConnected) return;
          cards[gone].textContent = '❓';
          cards.forEach(c => c.classList.remove('covered'));
          bottom.style.visibility = '';
          sentence = 'Was fehlt?'; say(sentence);
        }, 900);
      }, S.hard ? 4000 : 3500);
    } },
  { id: 'mehr', title: 'Wo sind mehr?', icon: '⚖️', color: 'var(--blue)', hard: true, say: 'Wo sind mehr?',
    build(stage, done) {
      const max = S.hard ? 9 : 5, a = 1 + rnd(max);
      let b;
      do { b = S.hard ? a + pick([-2, -1, 1, 2], 1)[0] : 1 + rnd(max); } while (b === a || b < 1 || b > max);
      const vs = pick(VEHICLES, 2), row = el('div', 'row');
      let solved = false;
      [a, b].forEach((k, i) => {
        const box = el('button', 'pick heap', `<span>${vs[i][0]}</span>`.repeat(k));
        box.addEventListener('click', () => {
          if (solved) return;
          if (k < Math.max(a, b)) { no(); wobble(box); return; }
          solved = true; box.classList.add('right'); ok(); say(NUMBERS[k] + '!'); done();
        });
        row.append(box);
      });
      stage.append(row);
    } },
  { id: 'groesse', title: 'Klein und gross', icon: '📏', color: 'var(--green)', hard: true, say: 'Ordne von klein nach gross.',
    build(stage, done) {
      const v = pick(VEHICLES, 1)[0], sizes = S.hard ? [.4, .6, .8, 1] : [.45, .72, 1];
      match(stage, done, sizes.map(s => ({
        key: s,
        piece: `<span class="em" style="scale:${s}">${v[0]}</span>`,
        ghost: `<span class="em shadow" style="scale:${s}">${v[0]}</span>`,
      })), true);
    } },
  { id: 'labyrinth', title: 'Labyrinth', icon: '🌀', color: 'var(--red)', hard: true,
    build(stage, done) {
      const W = S.hard ? 6 : 4, H = S.hard ? 4 : 3, C = S.hard ? 150 : 200;
      const grid = v => Array.from({ length: H }, () => Array(W).fill(v));
      const right = grid(true), down = grid(true), seen = grid(false);
      // Irrgarten mit genau einem Weg zwischen zwei Feldern (Tiefensuche)
      const stack = [[0, 0]]; seen[0][0] = true;
      while (stack.length) {
        const [x, y] = stack[stack.length - 1];
        const free = [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]].filter(([a, b]) => a >= 0 && b >= 0 && a < W && b < H && !seen[b][a]);
        if (!free.length) { stack.pop(); continue; }
        const [a, b] = free[rnd(free.length)];
        if (a > x) right[y][x] = false; else if (a < x) right[y][a] = false; else if (b > y) down[y][x] = false; else down[b][x] = false;
        seen[b][a] = true; stack.push([a, b]);
      }
      const open = (x, y, a, b) => a > x ? !right[y][x] : a < x ? !right[y][a] : b > y ? !down[y][x] : !down[b][x];
      let walls = '';
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        if (x < W - 1 && right[y][x]) walls += `M${(x + 1) * C} ${y * C}V${(y + 1) * C}`;
        if (y < H - 1 && down[y][x]) walls += `M${x * C} ${(y + 1) * C}H${(x + 1) * C}`;
      }
      const [car, goal] = pick(ROUTES, 1)[0], start = [0, rnd(H)], end = [W - 1, rnd(H)];
      const mid = ([x, y]) => [(x + .5) * C, (y + .5) * C];
      stage.innerHTML = `<svg class="maze" viewBox="-20 -20 ${W * C + 40} ${H * C + 40}" font-size="${C * .62}">
        <rect class="maze-bg" width="${W * C}" height="${H * C}" rx="24"/>
        <polyline class="maze-trail" stroke-width="${C * .34}"/>
        <path class="maze-walls" d="${walls}"/>
        <rect class="maze-walls" width="${W * C}" height="${H * C}" rx="24"/>
        <text x="${mid(end)[0]}" y="${mid(end)[1]}" dy=".35em">${goal}</text>
        <g class="car"><text transform="scale(-1,1)" dy=".35em">${car}</text></g>
      </svg>`;
      const s = stage.firstChild, trail = s.querySelector('.maze-trail'), carG = s.querySelector('.car');
      const path = [start];
      let active = false, finished = false;
      const draw = () => {
        trail.setAttribute('points', path.map(c => mid(c).join(',')).join(' '));
        carG.setAttribute('transform', `translate(${mid(path[path.length - 1]).join(',')})`);
      };
      draw();
      const move = e => {
        if (!active || finished) return;
        const q = new DOMPoint(e.clientX, e.clientY).matrixTransform(s.getScreenCTM().inverse());
        const a = Math.floor(q.x / C), b = Math.floor(q.y / C), [x, y] = path[path.length - 1];
        if (a < 0 || b < 0 || a >= W || b >= H || Math.abs(a - x) + Math.abs(b - y) !== 1 || !open(x, y, a, b)) return;
        const prev = path[path.length - 2];
        if (prev && prev[0] === a && prev[1] === b) path.pop(); else path.push([a, b]);
        draw();
        if (a === end[0] && b === end[1]) { finished = true; ok(); done(); }
      };
      s.addEventListener('pointerdown', e => { active = true; move(e); });
      s.addEventListener('pointermove', move);
      s.addEventListener('pointerup', () => { active = false; });
      s.addEventListener('pointercancel', () => { active = false; });
      return `Fahre ${veh(car)[1].replace(/^der /, 'den ')} durch das Labyrinth.`;
    } },
];

/* ---------- Ablauf ---------- */
const home = $('#home'), play = $('#play'), stage = $('#stage'), cheer = $('#cheer');
let mode = null, queue = [], current = null, sentence = '', solved = false, round = 0;

function garageSize() { return Math.min(VEHICLES.length, Math.floor(S.stars / 3)); }
function refresh() {
  document.querySelectorAll('.starcount').forEach(n => { n.textContent = S.stars; });
  $('#sound').textContent = S.sound ? '🔊' : '🔇';
  $('#level').innerHTML = S.hard ? '🔥<b>Schwer</b>' : '🌱<b>Leicht</b>';
  const g = garageSize();
  $('#garage').innerHTML = VEHICLES.map((v, i) => `<span class="${i < g ? '' : 'locked'}">${v[0]}</span>`).join('');
}

function show(kind) {
  current = kind; solved = false; round++;
  cheer.hidden = true;
  stage.innerHTML = ''; stage.removeAttribute('style');
  sentence = kind.build(stage, onSolved) || kind.say;
  $('#task').textContent = kind.title;
  say(sentence);
}
function nextPuzzle() {
  if (mode !== 'mix') return show(mode);
  if (!queue.length) { queue = shuffle(S.hard ? KINDS : KINDS.filter(k => !k.hard)); if (queue[0] === current) queue.push(queue.shift()); }
  show(queue.shift());
}
function onSolved() {
  if (solved) return;
  solved = true;
  const before = garageSize();
  S.stars++; save(); refresh();
  const gained = garageSize() > before ? VEHICLES[before] : null, r = round;
  setTimeout(() => {
    if (r !== round) return; // inzwischen wurde weitergeblättert
    win(); confetti();
    $('#prize').innerHTML = gained ? `${gained[0]}<small>Neu in deiner Garage!</small>` : '⭐';
    cheer.hidden = false;
    document.querySelectorAll('.stars').forEach(wobble);
    if (gained) setTimeout(() => say('Neu in deiner Garage: ' + gained[1] + '!'), 700);
  }, 650);
}
function confetti() {
  for (let i = 0; i < 16; i++) {
    const c = el('span', 'confetti', pick(['⭐', '✨', '🎉', '🎈', '🌟'], 1)[0]);
    const a = Math.random() * Math.PI * 2, r = 25 + Math.random() * 30;
    c.style.setProperty('--dx', Math.cos(a) * r + 'vmin');
    c.style.setProperty('--dy', Math.sin(a) * r + 'vmin');
    c.style.setProperty('--rot', rnd(360) - 180 + 'deg');
    play.append(c);
    setTimeout(() => c.remove(), 1400);
  }
}
function start(m) {
  mode = m; queue = [];
  home.hidden = true; play.hidden = false;
  nextPuzzle();
}

// Startseite
const tiles = $('#tiles');
const mix = el('button', 'tile mix', '<span class="ico">📖</span><span>Alles gemischt</span>');
mix.addEventListener('click', () => start('mix'));
tiles.append(mix);
KINDS.forEach(k => {
  const t = el('button', 'tile', `<span class="ico">${k.icon}</span><span>${k.title}</span>`);
  t.style.setProperty('--c', k.color);
  t.addEventListener('click', () => start(k));
  tiles.append(t);
});

$('#sound').addEventListener('click', () => { S.sound = !S.sound; save(); refresh(); if (S.sound) ok(); else if ('speechSynthesis' in window) speechSynthesis.cancel(); });
$('#level').addEventListener('click', () => { S.hard = !S.hard; save(); refresh(); tone(S.hard ? 880 : 520, 0, .15); });
$('#back').addEventListener('click', () => { round++; if ('speechSynthesis' in window) speechSynthesis.cancel(); play.hidden = true; home.hidden = false; });
$('#again').addEventListener('click', () => say(sentence));
$('#next').addEventListener('click', nextPuzzle);

// Nach dem Drehen des iPads die Seite neu aufbauen (gezogene Teile stimmen sonst nicht mehr)
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => { if (!play.hidden && !solved && current) show(current); }, 250);
});
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('gesturestart', e => e.preventDefault());
document.addEventListener('dblclick', e => e.preventDefault());

refresh();

// Offline: lokal nur mit ?sw=1, damit beim Entwickeln nichts Altes aus dem Speicher kommt
const local = ['localhost', '127.0.0.1'].includes(location.hostname);
if ('serviceWorker' in navigator && (!local || location.search.includes('sw=1'))) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
