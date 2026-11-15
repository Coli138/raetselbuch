'use strict';

/* ---------- Farben, Formen, Fahrzeuge (alles Vektor, nichts Gerastertes) ---------- */
const C = { blau: '#1f4e9e', gruen: '#23744f', gelb: '#f4be0c', rot: '#cf2a22', tinte: '#171614', papier: '#faf9f6' };
const T = C.tinte, P = C.papier;
const FARBEN = ['blau', 'gruen', 'gelb', 'rot'];
const FARBNAME = { blau: 'blaue', gruen: 'grüne', gelb: 'gelbe', rot: 'rote' };
const FORM = {
  kreis: '<circle cx="50" cy="50" r="42"/>',
  quadrat: '<rect x="10" y="10" width="80" height="80"/>',
  dreieck: '<polygon points="50,10 94,88 6,88"/>',
  viertel: '<path d="M10 90V10A80 80 0 0 1 90 90Z"/>',
};
const FORMEN = Object.keys(FORM);
const FORMNAME = { kreis: 'Kreise', quadrat: 'Quadrate', dreieck: 'Dreiecke', viertel: 'Viertelkreise' };
const svg = (inner, cls, vb) => `<svg viewBox="${vb || '0 0 100 100'}"${cls ? ` class="${cls}"` : ''}>${inner}</svg>`;
const form = (k, farbe, t) => `<g fill="${C[farbe] || farbe}"${t ? ` transform="${t}"` : ''}>${FORM[k]}</g>`;
const rad = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${T}"/><circle cx="${x}" cy="${y}" r="${r * .36}" fill="${P}"/>`;
const box = (x, y, w, h, f) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}"/>`;
const poly = (pts, f) => `<polygon points="${pts}" fill="${f}"/>`;

const FAHRZEUGE = [
  { name: 'das Auto', farbe: 'rot', bild: c => `<path d="M26 52A24 24 0 0 1 74 52Z" fill="${c}"/><path d="M34 52A16 16 0 0 1 66 52Z" fill="${P}"/>${box(48, 34, 4, 18, c)}${box(8, 52, 84, 20, c)}${rad(28, 74, 11)}${rad(72, 74, 11)}` },
  { name: 'der Bus', farbe: 'gelb', bild: c => box(6, 28, 88, 44, c) + [14, 34, 54].map(x => box(x, 36, 14, 14, P)).join('') + box(76, 36, 10, 36, T) + rad(26, 74, 10) + rad(62, 74, 10) },
  { name: 'die Lokomotive', farbe: 'blau', bild: c => box(50, 22, 34, 50, c) + box(58, 30, 18, 16, P) + box(12, 44, 38, 28, T) + box(20, 24, 10, 20, c) + poly('12,72 2,72 12,56', c) + rad(24, 76, 9) + rad(46, 76, 9) + rad(70, 74, 12) },
  { name: 'der Lastwagen', farbe: 'gruen', bild: c => box(6, 30, 54, 42, c) + box(62, 44, 30, 28, T) + box(72, 50, 14, 10, P) + rad(22, 76, 10) + rad(46, 76, 10) + rad(78, 76, 10) },
  { name: 'der Traktor', farbe: 'gruen', bild: c => box(12, 46, 46, 20, c) + box(48, 20, 30, 34, c) + box(54, 26, 18, 16, P) + box(20, 28, 6, 18, T) + rad(24, 76, 10) + rad(68, 68, 18) },
  { name: 'das Segelboot', farbe: 'blau', bild: c => poly('8,64 92,64 78,84 22,84', T) + box(47, 10, 4, 54, T) + poly('55,12 55,58 90,58', c) + poly('43,26 43,58 16,58', c === C.gelb ? C.rot : C.gelb) },
  { name: 'die Rakete', farbe: 'rot', bild: c => poly('50,6 66,34 34,34', T) + box(34, 34, 32, 40, c) + `<circle cx="50" cy="50" r="8" fill="${P}"/>` + poly('34,54 34,82 16,82', T) + poly('66,54 66,82 84,82', T) + poly('40,74 60,74 50,96', c === C.gelb ? C.rot : C.gelb) },
  { name: 'das Flugzeug', farbe: 'blau', bild: c => `<rect x="6" y="42" width="84" height="18" rx="9" fill="${c}"/>` + poly('40,50 62,50 44,88 32,88', T) + poly('44,44 60,44 52,18 44,18', T) + poly('8,44 24,44 14,22 6,22', c) + `<circle cx="78" cy="50" r="4" fill="${P}"/>` },
  { name: 'der Helikopter', farbe: 'gelb', bild: c => box(10, 24, 72, 4, T) + box(44, 28, 4, 10, T) + box(62, 54, 32, 6, c) + `<circle cx="46" cy="58" r="22" fill="${c}"/><path d="M46 58V40A18 18 0 0 0 28 58Z" fill="${P}"/><circle cx="92" cy="56" r="7" fill="${T}"/>` + box(34, 78, 4, 8, T) + box(54, 78, 4, 8, T) + box(24, 86, 46, 4, T) },
  { name: 'das Velo', farbe: 'rot', bild: c => `<g fill="none" stroke-width="5"><g stroke="${T}"><circle cx="24" cy="66" r="18"/><circle cx="76" cy="66" r="18"/></g><g stroke="${c}"><polygon points="24,66 42,38 68,38 50,66"/><path d="M68 38L76 66M68 38V26M62 26H76M42 38V30M34 30H50"/></g></g>` },
  { name: 'das Schiff', farbe: 'rot', bild: c => poly('4,58 96,58 84,82 14,82', c) + box(26, 42, 48, 16, T) + box(34, 22, 12, 20, c) + box(54, 22, 12, 20, c) + [36, 50, 64].map(x => `<circle cx="${x}" cy="50" r="3" fill="${P}"/>`).join('') },
  { name: 'der Heissluftballon', farbe: 'rot', bild: c => `<circle cx="50" cy="38" r="32" fill="${c}"/><path d="M50 6A32 32 0 0 1 50 70Z" fill="${T}"/><path d="M30 63L42 80M70 63L58 80" stroke="${T}" stroke-width="3"/>` + box(40, 80, 20, 14, T) },
];
const fz = (v, farbe) => svg(v.bild(C[farbe || v.farbe]), 'fz');

const PFEIL = d => `<polygon points="50,14 90,82 10,82" transform="rotate(${d * 90} 50 50)"/>`;
const ICON = {
  tonAn: `<polygon points="10,36 32,36 56,14 56,86 32,64 10,64" fill="${T}"/><path d="M68 30A24 24 0 0 1 68 70" fill="none" stroke="${T}" stroke-width="9"/>`,
  tonAus: `<polygon points="10,36 32,36 56,14 56,86 32,64 10,64" fill="${T}"/><path d="M66 36L92 64M92 36L66 64" stroke="${C.rot}" stroke-width="9"/>`,
  heim: poly('50,8 96,50 4,50', C.rot) + box(18, 50, 64, 40, T),
  weiter: poly('8,36 52,36 52,12 94,50 52,88 52,64 8,64', P),
  los: `<g fill="${P}">${PFEIL(1)}</g>`,
  weg: box(8, 20, 84, 60, T) + `<path d="M36 36L64 64M64 36L36 64" stroke="${P}" stroke-width="9"/>`,
};

/* ---------- Helfer ---------- */
const $ = s => document.querySelector(s);
const rnd = n => Math.floor(Math.random() * n);
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = (a, n) => shuffle(a).slice(0, n);
function el(tag, cls, html) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
}
function wobble(n) { n.classList.remove('wobble'); void n.offsetWidth; n.classList.add('wobble'); }

/* ---------- Speicher ---------- */
const S = { stars: 0, sound: true, level: 0, at: 0 };
try {
  const old = JSON.parse(localStorage.getItem('raetselbuch') || '{}');
  if (old.level == null && old.hard) old.level = 1;
  delete old.hard;
  Object.assign(S, old);
} catch (e) {}
function save() { try { localStorage.setItem('raetselbuch', JSON.stringify(S)); } catch (e) {} }

/* ---------- Ton ---------- */
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
// Keine Stimme: die Aufgabe steht als Satz in der Kopfzeile
function tell(text) { $('#hint').textContent = text || ''; }

/* ---------- Gemeinsame Bausteine ---------- */
let mode = null, queue = [], current = null, solved = false, frozen = false, round = 0;

// Antippen zählt nur, solange das Rätsel offen und nicht gesperrt ist
function tap(n, fn) { n.addEventListener('click', () => { if (!frozen && !solved) fn(); }); }
// Falsche Antwort. Auf «schwer» gibt es kein Durchprobieren: es kommt ein neues Rätsel.
function fail(n) {
  no(); wobble(n);
  if (S.level < 2) return;
  frozen = true;
  const r = round;
  setTimeout(() => { if (r === round) show(current); }, 800);
}
// Auswahlreihe: genau eine Antwort stimmt
function choose(stage, items, done, cls) {
  stage.style.setProperty('--n', items.length);
  const row = el('div', 'row');
  shuffle(items).forEach(it => {
    const b = el('button', 'pick ' + (cls || ''), it.html);
    tap(b, () => { if (!it.right) return fail(b); b.classList.add('right'); ok(); done(b); });
    row.append(b);
  });
  stage.append(row);
}
// Zufälliges Mosaik: count gefärbte Felder, jede Farbe kommt vor
function muster(cols, rows, count, farben) {
  const g = Array(cols * rows).fill('');
  pick(g.map((_, i) => i), count).forEach((i, k) => { g[i] = farben[k % farben.length]; });
  return g;
}
function bild(cols, rows, g) {
  const b = el('div', 'mosaik', g.map(f => `<i${f ? ` style="background:${C[f]}"` : ''}></i>`).join(''));
  b.style.setProperty('--cols', cols);
  return b;
}
// Mosaik zum Ausmalen: Farbe wählen, Feld antippen (nochmals antippen löscht)
function painter(cols, rows, farben, onChange) {
  const b = el('div', 'mosaik malen'), pal = el('div', 'row palette'), val = Array(cols * rows).fill('');
  b.style.setProperty('--cols', cols);
  let cur = farben[0];
  const cells = val.map((_, i) => {
    const c = el('button');
    tap(c, () => { val[i] = val[i] === cur ? '' : cur; c.style.background = val[i] ? C[val[i]] : ''; tone(440, 0, .05); onChange(val); });
    b.append(c); return c;
  });
  const chips = farben.map(f => {
    const c = el('button', 'farbe' + (f === cur ? ' sel' : '')); c.style.background = C[f];
    tap(c, () => { cur = f; chips.forEach(o => o.classList.toggle('sel', o === c)); tone(520, 0, .05); });
    pal.append(c); return c;
  });
  if (farben.length < 2) pal.hidden = true;
  return { box: b, pal, clear() { val.fill(''); cells.forEach(c => { c.style.background = ''; }); } };
}

/* ---------- Rätsel ---------- */
const KINDS = [
  { id: 'memory', title: 'memory', color: 'blau', say: 'Finde die gleichen Paare.',
    icon: box(8, 22, 38, 56, P) + box(54, 22, 38, 56, T) + `<circle cx="27" cy="50" r="11" fill="${T}"/>`,
    build(stage, done) {
      const L = S.level, pairs = [6, 8, 10][L], cols = L === 2 ? 5 : 4;
      // Auf «schwer» gibt es jedes Fahrzeug in zwei Farben: genau hinschauen
      const kinds = L === 2 ? pick(FAHRZEUGE, 5).flatMap(v => pick(FARBEN, 2).map(f => [v, f])) : pick(FAHRZEUGE, pairs).map(v => [v, v.farbe]);
      const b = el('div', 'board');
      b.style.setProperty('--cols', cols); b.style.setProperty('--rows', pairs * 2 / cols);
      let open = [], left = pairs;
      shuffle(kinds.flatMap(k => [k, k])).forEach(k => {
        const c = el('button', 'card', `<i class="face">${fz(k[0], k[1])}</i>`);
        tap(c, () => {
          if (c.classList.contains('open')) return;
          c.classList.add('open'); tone(520, 0, .08); open.push([c, k]);
          if (open.length < 2) return;
          const [[a, ka], [bb, kb]] = open; open = [];
          if (ka === kb) {
            a.classList.add('found'); bb.classList.add('found'); ok();
            if (--left === 0) done();
          } else {
            frozen = true;
            const r = round;
            setTimeout(() => { if (r !== round) return; a.classList.remove('open'); bb.classList.remove('open'); frozen = false; }, 800);
          }
        });
        b.append(c);
      });
      stage.append(b);
    } },

  { id: 'zwilling', title: 'zwillinge', color: 'rot', say: 'Zwei Bilder sind genau gleich. Finde sie.',
    icon: `<circle cx="28" cy="50" r="20" fill="${P}"/><circle cx="72" cy="50" r="20" fill="${P}"/>` + box(21, 43, 14, 14, T) + box(65, 43, 14, 14, T),
    build(stage, done) {
      const L = S.level, n = [9, 12, 20][L], cols = [3, 4, 5][L];
      const outer = L === 2 ? pick(FORMEN, 2) : FORMEN, farben = L === 2 ? pick(FARBEN, 2) : FARBEN;
      const inner = L === 0 ? ['', 'kreis', 'quadrat'] : ['kreis', 'quadrat', 'dreieck'];
      const one = a => a[rnd(a.length)];
      const set = new Set();
      while (set.size < n - 1) set.add([one(outer), one(farben), one(inner), L ? one(['tinte', 'papier']) : 'tinte', L ? rnd(4) * 90 : 0].join('|'));
      const keys = [...set];
      const draw = key => {
        const [o, oc, i, ic, rot] = key.split('|'), [x, y, s] = L ? [36, 68, .24] : [50, 60, .3];
        return svg(`<g transform="rotate(${rot} 50 50)">${form(o, oc)}${i ? form(i, ic, `translate(${x - 50 * s} ${y - 50 * s}) scale(${s})`) : ''}</g>`);
      };
      const b = el('div', 'board');
      b.style.setProperty('--cols', cols); b.style.setProperty('--rows', n / cols);
      let sel = null;
      shuffle([...keys, keys[0]]).forEach(key => {
        const c = el('button', 'pick', draw(key));
        tap(c, () => {
          if (c === sel) { c.classList.remove('sel'); sel = null; return; }
          if (!sel) { sel = c; c.classList.add('sel'); tone(520, 0, .06); return; }
          const other = sel; sel = null; other.classList.remove('sel');
          if (other._key !== key) { no(); wobble(c); wobble(other); return; }
          c.classList.add('right'); other.classList.add('right'); ok(); done();
        });
        c._key = key; b.append(c);
      });
      stage.append(b);
    } },

  { id: 'schichten', title: 'schichten', color: 'gelb', say: 'Welche Form liegt zuunterst? Tippe die Formen von unten nach oben an.',
    icon: box(10, 34, 46, 46, T) + `<circle cx="58" cy="44" r="26" fill="${P}"/>` + poly('66,40 92,84 40,84', T),
    build(stage, done) {
      const L = S.level, n = [3, 4, 5][L], step = [46, 38, 31][L], a = Math.random() * Math.PI * 2;
      const items = shuffle([...FARBEN, 'tinte']).slice(0, n).map((f, i) => {
        const d = (i - (n - 1) / 2) * step;
        return { k: FORMEN[rnd(4)], f, rot: rnd(4) * 90, x: 150 + Math.cos(a) * d + rnd(17) - 8, y: 150 + Math.sin(a) * d + rnd(17) - 8 };
      });
      const pic = el('div', 'stapel', svg(items.map(it => form(it.k, it.f, `translate(${it.x - 65} ${it.y - 65}) scale(1.3) rotate(${it.rot} 50 50)`)).join(''), '', '0 0 300 300'));
      stage.style.setProperty('--n', n);
      const row = el('div', 'row');
      let p = 0;
      const btns = [];
      shuffle(items).forEach(it => {
        const b = el('button', 'pick', svg(form(it.k, it.f, `rotate(${it.rot} 50 50)`)) + '<b></b>');
        tap(b, () => {
          if (b.classList.contains('right')) return;
          if (it !== items[p]) {
            no(); wobble(b);
            if (L) { p = 0; btns.forEach(o => { o.classList.remove('right'); o.lastChild.textContent = ''; }); }
            return;
          }
          b.classList.add('right'); b.lastChild.textContent = ++p; tone(440 + p * 60, 0, .1);
          if (p === n) { ok(); done(); }
        });
        btns.push(b); row.append(b);
      });
      stage.append(pic, row);
    } },

  { id: 'spiegel', title: 'spiegel', color: 'gruen', say: 'Male das Spiegelbild auf die andere Seite der roten Linie.',
    icon: `<path d="M42 22A28 28 0 0 0 42 78Z" fill="${T}"/>` + box(47, 8, 6, 84, P) + `<path d="M58 22A28 28 0 0 1 58 78Z" fill="${P}"/>`,
    build(stage, done) {
      const L = S.level, quer = L === 2 && rnd(2) === 1;
      const W = quer ? 5 : [3, 4, 4][L], H = quer ? 3 : [4, 4, 5][L];
      const farben = pick(['blau', 'gruen', 'gelb', 'tinte'], [1, 2, 3][L]);
      const src = muster(W, H, [5, 7, 10][L], farben);
      const target = src.map((_, i) => { const r = Math.floor(i / W), c = i % W; return quer ? src[(H - 1 - r) * W + c] : src[r * W + W - 1 - c]; });
      stage.style.setProperty('--gc', quer ? W : 2 * W + 1); stage.style.setProperty('--gr', quer ? 2 * H + 1 : H);
      const p = painter(W, H, farben, val => { if (String(val) === String(target)) { ok(); done(); } });
      const wrap = el('div', 'spiegel' + (quer ? ' quer' : ''));
      wrap.append(bild(W, H, src), el('i', 'achse'), p.box);
      stage.append(wrap, p.pal);
    } },

  { id: 'bauplan', title: 'bauplan', color: 'blau',
    icon: box(14, 14, 34, 34, P) + box(52, 14, 34, 34, T) + box(14, 52, 34, 34, T) + box(52, 52, 34, 34, P),
    build(stage, done) {
      const L = S.level, n = [3, 4, 5][L], count = [4, 6, 9][L], farben = pick(FARBEN, [1, 2, 3][L]), r = round;
      const target = muster(n, n, count, farben), pic = bild(n, n, target);
      stage.style.setProperty('--gc', n); stage.style.setProperty('--gr', n);
      const p = painter(n, n, farben, val => {
        if (String(val) === String(target)) { ok(); return done(); }
        if (val.filter(Boolean).length >= count) { no(); wobble(p.box); setTimeout(() => { if (r === round) reveal(1800); }, 450); frozen = true; }
      });
      // Bild zeigen, dann verdecken: nachgebaut wird aus dem Kopf
      function reveal(ms) {
        frozen = true; p.clear();
        p.box.hidden = true; p.pal.style.visibility = 'hidden'; pic.hidden = false;
        setTimeout(() => {
          if (r !== round) return;
          pic.hidden = true; p.box.hidden = false; p.pal.style.visibility = ''; frozen = false;
          tell('Baue das Bild aus dem Kopf nach.');
        }, ms);
      }
      stage.append(pic, p.box, p.pal);
      reveal([2600, 3200, 3800][L]);
      return 'Merke dir das Bild.';
    } },

  { id: 'muster', title: 'muster', color: 'rot', say: 'Welches Bild fehlt im Muster?',
    icon: [0, 1, 2].flatMap(r => [0, 1, 2].map(c => r === 2 && c === 2 ? box(68, 68, 20, 20, T) : `<circle cx="${22 + c * 28}" cy="${22 + r * 28}" r="10" fill="${P}"/>`)).join(''),
    build(stage, done) {
      const L = S.level, fs = pick(FORMEN, 3), cs = pick(FARBEN, 3), flip = rnd(2);
      // leicht: Form je Zeile, Farbe je Spalte. mittel: dazu die Anzahl schräg. schwer: Form und Farbe wandern beide schräg.
      const at = (r, c) => {
        if (flip) [r, c] = [c, r];
        return L === 0 ? [fs[r], cs[c], 1] : L === 1 ? [fs[r], cs[c], 1 + (r + c) % 3] : [fs[(r + c) % 3], cs[(r + 2 * c) % 3], 1 + c];
      };
      const draw = ([f, c, k]) => svg(L === 0 ? form(f, c, 'translate(14 14) scale(.72)') :
        Array.from({ length: k }, (_, j) => form(f, c, `translate(${50 + (j - (k - 1) / 2) * 31 - 14} 36) scale(.28)`)).join(''));
      const gap = L === 0 ? 8 : rnd(9), right = at(Math.floor(gap / 3), gap % 3);
      const m = el('div', 'matrix');
      for (let i = 0; i < 9; i++) m.append(el('div', i === gap ? 'gap' : '', i === gap ? '?' : draw(at(Math.floor(i / 3), i % 3))));
      const wrong = new Map();
      while (wrong.size < [3, 3, 5][L]) {
        const w = [...right];
        for (let t = 0; t < (L === 2 ? 1 + rnd(2) : 1); t++) {
          const a = rnd(L ? 3 : 2);
          w[a] = a === 0 ? fs[rnd(3)] : a === 1 ? cs[rnd(3)] : 1 + rnd(3);
        }
        if (String(w) !== String(right)) wrong.set(String(w), w);
      }
      stage.append(m);
      choose(stage, [{ html: draw(right), right: true }, ...[...wrong.values()].map(w => ({ html: draw(w) }))], () => {
        const g = m.querySelector('.gap'); g.innerHTML = draw(right); g.classList.add('filled');
        done();
      });
    } },

  { id: 'drehung', title: 'drehung', color: 'gelb', say: 'Welches Bild ist das gleiche, nur gedreht?',
    icon: box(14, 14, 24, 72, T) + box(38, 62, 30, 24, T) + `<path d="M56 16A30 30 0 0 1 86 46" fill="none" stroke="${P}" stroke-width="8"/>` + poly('74,44 98,44 86,60', P),
    build(stage, done) {
      const L = S.level, n = [3, 3, 4][L], count = [4, 5, 7][L], farben = pick(FARBEN, [2, 2, 3][L]);
      const rot = g => g.map((_, i) => g[(n - 1 - i % n) * n + Math.floor(i / n)]); // 90 Grad im Uhrzeigersinn
      const mir = g => g.map((_, i) => g[Math.floor(i / n) * n + n - 1 - i % n]);
      const all = g => { const o = []; for (let k = 0, h = g; k < 4; k++, h = rot(h)) o.push(h, mir(h)); return o; };
      // Nur Bilder ohne Symmetrie: sonst wäre ein Spiegelbild auch eine Drehung
      let g, forms;
      do { g = muster(n, n, count, farben); forms = all(g); } while (new Set(forms.map(String)).size < 8);
      const draw = h => svg(box(0, 0, n * 10, n * 10, P) + h.map((f, i) => {
        if (!f) return '';
        const x = i % n * 10, y = Math.floor(i / n) * 10;
        return f === farben[0] ? `<circle cx="${x + 5}" cy="${y + 5}" r="5" fill="${C[f]}"/>` : box(x, y, 10, 10, C[f]);
      }).join(''), 'gitter', `0 0 ${n * 10} ${n * 10}`);
      const items = [{ html: draw(forms[2 * (1 + rnd(3))]), right: true }];
      pick([1, 3, 5, 7], [2, 3, 3][L]).forEach(i => items.push({ html: draw(forms[i]) }));
      if (L === 2) {
        // Zwei Fälschungen: richtig gedreht, aber ein Feld ist verrutscht
        const known = new Set(forms.map(String));
        while (items.length < 6) {
          const h = [...g], full = pick(h.map((f, i) => f ? i : -1).filter(i => i >= 0), 1)[0], empty = pick(h.map((f, i) => f ? -1 : i).filter(i => i >= 0), 1)[0];
          h[empty] = h[full]; h[full] = '';
          const v = all(h)[2 * rnd(4)];
          if (!known.has(String(v))) { known.add(String(v)); items.push({ html: draw(v) }); }
        }
      }
      stage.append(el('div', 'vorlage', draw(g)));
      choose(stage, items, done);
    } },

  { id: 'fracht', title: 'fracht', color: 'gruen',
    icon: box(10, 30, 80, 38, P) + rad(30, 74, 10) + rad(70, 74, 10) + [30, 50, 70].map(x => `<circle cx="${x}" cy="48" r="6" fill="${T}"/>`).join(''),
    build(stage, done) {
      const L = S.level, n = [4, 5, 6][L], [lo, hi] = [[1, 5], [2, 8], [3, 9]][L], take = [2, 2 + rnd(2), 3][L];
      let vals;
      do { vals = Array.from({ length: n }, () => lo + rnd(hi - lo + 1)); } while (new Set(vals).size < n - 1);
      const target = pick(vals.map((_, i) => i), take).reduce((s, i) => s + vals[i], 0);
      const dots = k => svg(Array.from({ length: k }, (_, i) => `<circle cx="${12 + i % 3 * 18}" cy="${12 + Math.floor(i / 3) * 18}" r="7" fill="${T}"/>`).join(''), 'punkte', '0 0 60 60');
      stage.style.setProperty('--n', n);
      const head = el('div', 'row zug', fz(FAHRZEUGE[2]) + `<span class="ziel">${target}</span>`);
      const row = el('div', 'row');
      const sel = new Set();
      vals.forEach((v, i) => {
        const b = el('button', 'pick wagen', L === 2 ? `<b>${v}</b>` : dots(v) + (L ? `<b>${v}</b>` : ''));
        tap(b, () => {
          if (sel.has(i)) { sel.delete(i); b.classList.remove('sel'); return; }
          sel.add(i); b.classList.add('sel'); tone(440 + sel.size * 60, 0, .08);
          const sum = [...sel].reduce((s, j) => s + vals[j], 0);
          if (sum === target) { [...row.children].forEach((o, j) => { if (sel.has(j)) o.classList.add('right'); }); ok(); done(); }
          else if (sum > target) { sel.clear(); [...row.children].forEach(o => o.classList.remove('sel')); fail(row); }
        });
        row.append(b);
      });
      stage.append(head, row);
      return `Welche Wagen ergeben zusammen genau ${target}? Tippe sie an.`;
    } },

  { id: 'kurier', title: 'kurier', color: 'blau', say: 'Tippe die Pfeile für den ganzen Weg zum gelben Kreis. Dann drücke auf Los.',
    icon: box(10, 62, 24, 24, T) + `<path d="M22 62V26H62" fill="none" stroke="${P}" stroke-width="8"/><circle cx="76" cy="26" r="15" fill="${P}"/>`,
    build(stage, done) {
      const L = S.level, W = [4, 5, 6][L], H = [3, 4, 5][L], r = round;
      const DX = [0, 1, 0, -1], DY = [-1, 0, 1, 0];
      const nb = (i, d) => { const x = i % W + DX[d], y = Math.floor(i / W) + DY[d]; return x < 0 || y < 0 || x >= W || y >= H ? -1 : y * W + x; };
      let start, goal, blocked, dist;
      do {
        const cells = shuffle(Array.from({ length: W * H }, (_, i) => i));
        [start, goal] = cells; blocked = new Set(cells.slice(2, 2 + [2, 5, 9][L]));
        const d = new Map([[start, 0]]), q = [start];
        for (let h = 0; h < q.length; h++) for (let k = 0; k < 4; k++) {
          const j = nb(q[h], k);
          if (j >= 0 && !blocked.has(j) && !d.has(j)) { d.set(j, d.get(q[h]) + 1); q.push(j); }
        }
        dist = d.get(goal);
      } while (!(dist >= [4, 6, 9][L]));
      const max = dist + [2, 1, 0][L], v = pick(FAHRZEUGE, 1)[0], xy = i => [i % W * 100, Math.floor(i / W) * 100];
      let s = box(0, 0, W * 100, H * 100, P) + '<path class="linien" d="';
      for (let x = 1; x < W; x++) s += `M${x * 100} 0V${H * 100}`;
      for (let y = 1; y < H; y++) s += `M0 ${y * 100}H${W * 100}`;
      s += '"/>' + [...blocked].map(i => box(...xy(i), 100, 100, T)).join('');
      s += `<circle cx="${xy(goal)[0] + 50}" cy="${xy(goal)[1] + 50}" r="34" fill="${C.gelb}"/>`;
      s += `<g class="kfz"><svg x="12" y="12" width="76" height="76" viewBox="0 0 100 100">${v.bild(C[v.farbe === 'gelb' ? 'rot' : v.farbe])}</svg></g>`;
      s += `<rect class="rahmen" width="${W * 100}" height="${H * 100}"/>`;
      const board = el('div', 'feld', svg(s, '', `0 0 ${W * 100} ${H * 100}`));
      board.style.setProperty('--w', W); board.style.setProperty('--h', H);
      const car = board.querySelector('.kfz');
      const place = i => { const [x, y] = xy(i); car.style.transform = `translate(${x}px,${y}px)`; };
      place(start);
      const prog = [], slots = el('div', 'slots'), ctrl = el('div', 'row ctrl');
      slots.style.setProperty('--n', max);
      const draw = () => { slots.innerHTML = Array.from({ length: max }, (_, i) => `<i>${prog[i] != null ? svg(PFEIL(prog[i])) : ''}</i>`).join(''); };
      draw();
      let running = false;
      [3, 0, 2, 1].forEach(d => {
        const b = el('button', 'btn', svg(PFEIL(d)));
        tap(b, () => { if (running) return; if (prog.length >= max) { no(); wobble(slots); return; } prog.push(d); draw(); tone(480, 0, .05); });
        ctrl.append(b);
      });
      const del = el('button', 'btn', svg(ICON.weg)), go = el('button', 'btn go', svg(ICON.los));
      tap(del, () => { if (running) return; prog.pop(); draw(); });
      tap(go, () => {
        if (running || !prog.length) return;
        running = true;
        let pos = start, k = 0;
        const step = () => {
          if (r !== round) return;
          const j = k < prog.length ? nb(pos, prog[k]) : -1;
          if (j < 0 || blocked.has(j)) { // Wand, Rand oder Befehle zu Ende
            no(); wobble(board);
            setTimeout(() => { if (r !== round) return; place(start); if (L === 2) { prog.length = 0; draw(); } running = false; }, 700);
            return;
          }
          pos = j; k++; place(pos); tone(330 + k * 30, 0, .08);
          if (pos === goal) { ok(); done(); return; }
          setTimeout(step, 360);
        };
        step();
      });
      ctrl.append(del, go);
      stage.append(board, slots, ctrl);
    } },

  { id: 'inventur', title: 'inventur', color: 'rot',
    icon: `<circle cx="26" cy="30" r="14" fill="${P}"/><circle cx="70" cy="66" r="14" fill="${P}"/><circle cx="30" cy="72" r="14" fill="${T}"/>` + poly('68,14 86,46 50,46', T),
    build(stage, done) {
      const L = S.level, total = [10, 16, 22][L], n = [3, 4, 5][L] + rnd([3, 4, 5][L]);
      const tf = pick(FORMEN, 1)[0], tc = pick(FARBEN, 1)[0], of = FORMEN.filter(f => f !== tf), oc = FARBEN.filter(c => c !== tc);
      const items = [];
      const add = (f, c) => {
        const s = L === 2 ? 26 + rnd(15) : [46, 38][L];
        let x, y, t = 0;
        do { x = s / 2 + 4 + Math.random() * (392 - s); y = s / 2 + 4 + Math.random() * (232 - s); }
        while (++t < 400 && items.some(o => Math.hypot(o.x - x, o.y - y) < (o.s + s) / 2 * (L === 2 ? .9 : 1.1)));
        items.push({ f, c, s, x, y, rot: L ? rnd(4) * 90 : 0 });
      };
      for (let i = 0; i < n; i++) add(tf, tc);
      // Die übrigen gleichen dem Gesuchten in Form oder Farbe
      for (let i = n; i < total; i++) i % 2 ? add(tf, oc[rnd(3)]) : add(of[rnd(3)], L ? tc : FARBEN[rnd(4)]);
      const pic = el('div', 'lager', svg(shuffle(items).map(o => form(o.f, o.c, `translate(${o.x - o.s / 2} ${o.y - o.s / 2}) scale(${o.s / 100}) rotate(${o.rot} 50 50)`)).join(''), '', '0 0 400 240'));
      // Aufeinanderfolgende Zahlen; die richtige steht an zufälliger Stelle, auch am Rand
      const k = [3, 4, 5][L], first = Math.max(1, n - rnd(k)), opts = Array.from({ length: k }, (_, i) => first + i);
      stage.append(el('div', 'frage', svg(form(tf, tc)) + '<b>?</b>'), pic);
      choose(stage, opts.map(v => ({ html: `<b>${v}</b>`, right: v === n })), done, 'num');
      // Zahlen bleiben in der Reihenfolge
      const row = stage.lastChild;
      [...row.children].sort((a, b) => a.textContent - b.textContent).forEach(b => row.append(b));
      return `Wie viele ${FARBNAME[tc]} ${FORMNAME[tf]} zählst du?`;
    } },
];

/* ---------- Ablauf ---------- */
const home = $('#home'), play = $('#play'), stage = $('#stage'), cheer = $('#cheer');
const STUFEN = ['leicht', 'mittel', 'schwer'];

function garageSize() { return Math.min(FAHRZEUGE.length, Math.floor(S.stars / 3)); }
function refresh() {
  document.querySelectorAll('.starcount').forEach(n => { n.textContent = S.stars; });
  $('#sound').innerHTML = svg(S.sound ? ICON.tonAn : ICON.tonAus);
  $('#level').innerHTML = `<span class="lv">${[0, 1, 2].map(i => `<i${i <= S.level ? ' class="on"' : ''}></i>`).join('')}</span><span>${STUFEN[S.level]}</span>`;
  const g = garageSize();
  $('#garage').innerHTML = FAHRZEUGE.map((v, i) => `<span class="${i < g ? '' : 'locked'}">${fz(v)}</span>`).join('');
}

function show(kind) {
  current = kind; solved = false; frozen = false; round++;
  cheer.hidden = true;
  stage.innerHTML = ''; stage.removeAttribute('style'); stage.className = kind.id;
  tell(kind.build(stage, onSolved) || kind.say);
  $('#task').textContent = kind.title;
}
function nextPuzzle() {
  if (mode !== 'mix') return show(mode);
  if (!queue.length) { queue = shuffle(KINDS); if (queue[0] === current) queue.push(queue.shift()); }
  show(queue.shift());
}
function onSolved() {
  if (solved) return;
  solved = true;
  const before = garageSize();
  S.stars++; save(); refresh();
  const gained = garageSize() > before ? FAHRZEUGE[before] : null, r = round;
  setTimeout(() => {
    if (r !== round) return; // inzwischen wurde weitergeblättert
    win(); confetti();
    $('#prize').innerHTML = gained ? `${fz(gained)}<small>neu in deiner garage</small>` : '<i class="dot"></i>';
    cheer.hidden = false;
    document.querySelectorAll('.stars').forEach(wobble);
  }, 650);
}
function confetti() {
  for (let i = 0; i < 18; i++) {
    const c = el('span', 'confetti ' + ['kreis', 'quadrat', 'dreieck'][i % 3]);
    const a = Math.random() * Math.PI * 2, d = 25 + Math.random() * 30;
    c.style.background = C[FARBEN[i % 4]];
    c.style.setProperty('--dx', Math.cos(a) * d + 'vmin');
    c.style.setProperty('--dy', Math.sin(a) * d + 'vmin');
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

/* ---------- Bauen: Gleise, Strassen und Stadt frei auf ein Raster legen, dann fahren Lok und Autos ---------- */
// Seiten eines Feldes: 0 oben, 1 rechts, 2 unten, 3 links. Jedes Teil ist für Drehung 0 gezeichnet.
const BW = 12, BH = 8, GRAU = '#b9b5aa';
const linie = (d, f, w, extra) => `<path d="${d}" fill="none" stroke="${f}" stroke-width="${w}"${extra || ''}/>`;
const SCHWELLEN = [10, 30, 50, 70, 90].map(x => `M${x} 36V64`).join('');
const BOGEN = 'M0 50A50 50 0 0 1 50 100';
const BOGENSCHWELLEN = [-75, -45, -15].map(g => { const a = g * Math.PI / 180, c = Math.cos(a), s = Math.sin(a); return `M${36 * c} ${100 + 36 * s}L${64 * c} ${100 + 64 * s}`; }).join('');
const gleis = f => linie(SCHWELLEN, f || T, 5) + linie('M0 50H100', f || T, 7);
const gleisbogen = f => linie(BOGENSCHWELLEN, f || T, 5) + linie(BOGEN, f || T, 7);
const strich = ' stroke-dasharray="12 13" stroke-dashoffset="6"';
const fenster = (xs, ys, w, h) => ys.flatMap(y => xs.map(x => box(x, y, w, h, P))).join('');
const TEILE = {
  gerade: { gleis: [[3, 1]], bild: () => gleis() },
  kurve: { gleis: [[3, 2]], bild: () => gleisbogen() },
  kreuzung: { gleis: [[3, 1], [0, 2]], bild: () => gleis() + `<g transform="rotate(90 50 50)">${gleis()}</g>` },
  // Weiche: von links kommend geht es je nach Stellung geradeaus oder nach unten
  weiche: { gleis: [[3, 1], [3, 2]], weiche: true, bild: s => s ? gleis(GRAU) + gleisbogen() : gleisbogen(GRAU) + gleis() },
  bahnhof: { gleis: [[3, 1]], bild: () => box(8, 6, 84, 22, C.gelb) + box(8, 0, 84, 8, T) + box(40, 10, 20, 14, C.rot) + gleis() },
  tunnel: { gleis: [[3, 1]], bild: () => gleis(), drueber: `<path d="M22 86V46A28 28 0 0 1 78 46V86Z" fill="${T}"/>` + box(40, 8, 20, 10, C.rot) },
  bruecke: { gleis: [[3, 1]], bild: () => box(0, 0, 100, 100, C.blau) + linie('M8 16H40M58 86H92', P, 5) + box(0, 30, 100, 40, P) + gleis() + box(0, 26, 100, 6, C.gelb) + box(0, 68, 100, 6, C.gelb) },
  uebergang: { gleis: [[3, 1]], strasse: [[0, 2]], bild: () => linie('M50 0V100', T, 40) + gleis() + linie('M30 50H70', P, 7) + linie('M50 36V64', P, 5) + box(14, 14, 8, 8, C.rot) + box(78, 78, 8, 8, C.rot) },
  strasse: { strasse: [[3, 1]], bild: () => linie('M0 50H100', T, 40) + linie('M0 50H100', P, 4, strich) },
  skurve: { strasse: [[3, 2]], bild: () => linie(BOGEN, T, 40) + linie(BOGEN, P, 4, ' stroke-dasharray="12 14" stroke-dashoffset="6"') },
  skreuz: { strasse: [[3, 1], [0, 2], [3, 0], [0, 1], [1, 2], [2, 3]], bild: () => linie('M0 50H100M50 0V100', T, 40) },
  // Stadt und Landschaft: nochmals antippen wechselt die Ausführung
  haus: { arten: 3, bild: s => box(20, 46, 60, 42, C[['rot', 'blau', 'gelb'][s]]) + poly('10,46 50,12 90,46', T) + box(44, 62, 14, 26, P) },
  hochhaus: { arten: 3, bild: s => box(26, 8, 48, 80, C[['blau', 'rot', 'tinte'][s]]) + fenster([34, 54], [16, 32, 48, 64], 12, 9) },
  fabrik: { arten: 2, bild: s => box(70, 10, 12, 44, T) + poly('10,54 10,34 36,54 36,34 62,54', C[['rot', 'blau'][s]]) + box(10, 54, 80, 34, C[['rot', 'blau'][s]]) + fenster([20, 44, 68], [64], 12, 12) },
  baum: { arten: 3, bild: s => box(46, 56, 8, 32, T) + [`<circle cx="50" cy="38" r="26" fill="${C.gruen}"/>`, poly('50,8 80,62 20,62', C.gruen), `<circle cx="34" cy="44" r="18" fill="${C.gruen}"/><circle cx="64" cy="38" r="22" fill="${C.gruen}"/>`][s] },
  wasser: { arten: 2, bild: s => box(0, 0, 100, 100, C.blau) + (s ? '' : linie('M12 30H48M52 60H88M20 84H44', P, 5)) },
  wiese: { arten: 3, bild: s => box(0, 0, 100, 100, C.gruen) + (s === 1 ? `<circle cx="28" cy="34" r="7" fill="${C.gelb}"/><circle cx="68" cy="62" r="7" fill="${C.gelb}"/><circle cx="40" cy="78" r="7" fill="${P}"/>` : s === 2 ? `<circle cx="50" cy="50" r="30" fill="${C.gelb}"/>` : '') },
};
const TEILNAMEN = Object.keys(TEILE);
const BAU = { id: 'bauen', title: 'bauen', color: 'tinte', icon: box(10, 56, 80, 30, P) + box(20, 26, 26, 30, C.gelb) + poly('52,56 71,20 90,56', C.rot) };

const bau = $('#bau'), brett = $('#brett'), palette = $('#teile');
let B = { cur: 0, plots: [0, 1, 2, 3].map(() => Array(BW * BH).fill(null)) };
try { const alt = JSON.parse(localStorage.getItem('raetselbuch-bau')); if (alt && alt.plots.length === 4 && alt.plots.every(p => p.length === BW * BH)) B = alt; } catch (e) {}
const bauSave = () => { try { localStorage.setItem('raetselbuch-bau', JSON.stringify(B)); } catch (e) {} };
let werkzeug = 'gerade', faehrt = false, fahrer = [], bauLauf = 0;
const feld = () => B.plots[B.cur];

function seiten(c, m) { return c && TEILE[c[0]] && TEILE[c[0]][m] ? TEILE[c[0]][m].map(([a, b]) => [(a + c[1]) % 4, (b + c[1]) % 4]) : []; }
function nachbar(i, s) { const x = i % BW + [0, 1, 0, -1][s], y = Math.floor(i / BW) + [-1, 0, 1, 0][s]; return x < 0 || y < 0 || x >= BW || y >= BH ? -1 : y * BW + x; }
const offen = (i, m, s) => i >= 0 && seiten(feld()[i], m).some(p => p.includes(s));
// Wohin geht es von der Einfahrtseite aus? Bevorzugt dorthin, wo es weitergeht.
function ausfahrt(i, m, ein) {
  const c = feld()[i];
  let aus = seiten(c, m).filter(p => p.includes(ein)).map(p => p[0] === ein ? p[1] : p[0]);
  if (TEILE[c[0]].weiche && ein === (3 + c[1]) % 4) aus = [((c[2] ? 2 : 1) + c[1]) % 4];
  const gut = aus.filter(s => offen(nachbar(i, s), m, (s + 2) % 4));
  const wahl = gut.length ? gut : aus;
  return wahl.length ? wahl[rnd(wahl.length)] : -1;
}
const MITTE = [[50, 0], [100, 50], [50, 100], [0, 50]];
function punkt(a, b, t) {
  const [x1, y1] = MITTE[a], [x2, y2] = MITTE[b];
  if ((a + 2) % 4 === b) return [x1 + (x2 - x1) * t, y1 + (y2 - y1) * t];
  // Bogen um die gemeinsame Ecke
  const ex = a % 2 ? x1 : x2, ey = a % 2 ? y2 : y1, w1 = Math.atan2(y1 - ey, x1 - ex);
  let d = Math.atan2(y2 - ey, x2 - ex) - w1;
  if (d > Math.PI) d -= 2 * Math.PI; else if (d < -Math.PI) d += 2 * Math.PI;
  return [ex + 50 * Math.cos(w1 + d * t), ey + 50 * Math.sin(w1 + d * t)];
}

function zeichneBrett() {
  let raster = '';
  for (let x = 1; x < BW; x++) raster += `M${x * 100} 0V${BH * 100}`;
  for (let y = 1; y < BH; y++) raster += `M0 ${y * 100}H${BW * 100}`;
  let teile = '', drueber = '';
  feld().forEach((c, i) => {
    if (!c || !TEILE[c[0]]) return;
    const d = TEILE[c[0]], t = `translate(${i % BW * 100} ${Math.floor(i / BW) * 100})` + (d.arten ? '' : ` rotate(${c[1] * 90} 50 50)`);
    teile += `<g transform="${t}">${d.bild(d.arten ? c[1] % d.arten : c[2])}</g>`;
    if (d.drueber) drueber += `<g transform="${t}">${d.drueber}</g>`;
  });
  brett.innerHTML = svg(box(0, 0, BW * 100, BH * 100, '#fff') + linie(raster, '#e4e1d6', 2) + teile + '<g id="fahrer"></g>' + drueber + `<rect width="${BW * 100}" height="${BH * 100}" fill="none" stroke="${T}" stroke-width="6"/>`, '', `-3 -3 ${BW * 100 + 6} ${BH * 100 + 6}`);
}
function zeichneLeiste() {
  $('#plaetze').innerHTML = B.plots.map((p, i) => `<button class="btn${i === B.cur ? ' sel' : ''}" data-i="${i}" aria-label="Bauplatz ${i + 1}">${i + 1}</button>`).join('');
  $('#los').innerHTML = svg(faehrt ? box(22, 22, 56, 56, P) : ICON.los);
  $('#los').classList.toggle('stop', faehrt);
  palette.classList.toggle('aus', faehrt);
  palette.querySelectorAll('button').forEach(b => b.classList.toggle('sel', b.dataset.t === werkzeug));
}

// Setzen: leeres oder anderes Feld bekommt das Teil; dasselbe Teil nochmals antippen dreht es bzw. wechselt die Ausführung
function setze(i, neu) {
  const f = feld(), c = f[i];
  if (werkzeug === 'weg') { if (!c) return; f[i] = null; }
  else if (c && c[0] === werkzeug) { if (!neu) return; c[1] = (c[1] + 1) % (TEILE[werkzeug].arten || 4); }
  else f[i] = [werkzeug, 0, 0];
  tone(werkzeug === 'weg' ? 300 : 520, 0, .05); bauSave(); zeichneBrett();
}
function zelle(e) {
  const s = brett.firstChild, q = new DOMPoint(e.clientX, e.clientY).matrixTransform(s.getScreenCTM().inverse());
  const x = Math.floor(q.x / 100), y = Math.floor(q.y / 100);
  return x < 0 || y < 0 || x >= BW || y >= BH ? -1 : y * BW + x;
}
let zieht = false, letzte = -1;
brett.addEventListener('pointerdown', e => {
  const i = zelle(e);
  if (i < 0) return;
  if (faehrt) { // während der Fahrt stellt Antippen die Weichen
    const c = feld()[i];
    if (c && TEILE[c[0]].weiche) { c[2] = c[2] ? 0 : 1; tone(600, 0, .06); bauSave(); zeichneBrett(); zeichneFahrer(); }
    return;
  }
  zieht = true; letzte = i; setze(i, true);
});
brett.addEventListener('pointermove', e => { if (!zieht || faehrt) return; const i = zelle(e); if (i >= 0 && i !== letzte) { letzte = i; setze(i, false); } });
['pointerup', 'pointercancel', 'pointerleave'].forEach(n => brett.addEventListener(n, () => { zieht = false; }));

// Fahren: an jedem Bahnhof startet eine Lok (sonst eine auf dem ersten Gleis), auf den Strassen bis zu zwei Autos
function zeichneFahrer() {
  const g = brett.querySelector('#fahrer');
  if (!g) return;
  g.innerHTML = fahrer.map(v => `<g transform="translate(${v.x} ${v.y})"><g transform="translate(-32 -44) scale(.64)"><g${v.rechts === v.linksbild ? ' transform="translate(100 0) scale(-1 1)"' : ''}>${v.bild}</g></g></g>`).join('');
}
function losfahren() {
  const f = feld(), mit = m => f.map((c, i) => seiten(c, m).length ? i : -1).filter(i => i >= 0);
  const gleise = mit('gleis'), strassen = mit('strasse'), bahnhoefe = gleise.filter(i => f[i][0] === 'bahnhof').slice(0, 3);
  const neu = (i, m, bild, linksbild) => { const ein = seiten(f[i], m)[0][0]; return { i, m, ein, aus: ausfahrt(i, m, ein), t: .5, bild, linksbild, rechts: true, x: 0, y: 0 }; };
  fahrer = (bahnhoefe.length ? bahnhoefe : gleise.slice(0, 1)).map((i, k) => neu(i, 'gleis', FAHRZEUGE[2].bild(C[['blau', 'rot', 'gruen'][k]]), true));
  if (strassen.length) fahrer.push(neu(strassen[0], 'strasse', FAHRZEUGE[0].bild(C.rot), false));
  if (strassen.length > 5) fahrer.push(neu(strassen[strassen.length - 1], 'strasse', FAHRZEUGE[1].bild(C.gelb), false));
  if (!fahrer.length) { no(); wobble(brett); return; }
  faehrt = true; zeichneLeiste(); tone(392, 0, .18, 'triangle', .1); tone(392, .25, .3, 'triangle', .1);
  const lauf = ++bauLauf;
  let zuvor = performance.now();
  const bild = jetzt => {
    if (lauf !== bauLauf || !faehrt) return;
    const dt = Math.min(.1, (jetzt - zuvor) / 1000); zuvor = jetzt;
    fahrer.forEach(v => {
      if (v.aus < 0) { [v.x, v.y] = [v.i % BW * 100 + 50, Math.floor(v.i / BW) * 100 + 50]; return; }
      v.t += dt * (v.m === 'gleis' ? 1.9 : 2.3);
      while (v.t >= 1) {
        v.t -= 1;
        const n = nachbar(v.i, v.aus);
        // Geht es weiter, ins nächste Feld; sonst am Ende wenden
        if (offen(n, v.m, (v.aus + 2) % 4)) { v.i = n; v.ein = (v.aus + 2) % 4; } else v.ein = v.aus;
        v.aus = ausfahrt(v.i, v.m, v.ein);
        if (v.aus < 0) break;
      }
      if (v.aus < 0) return;
      const [px, py] = punkt(v.ein, v.aus, v.t), x = v.i % BW * 100 + px, y = Math.floor(v.i / BW) * 100 + py;
      if (Math.abs(x - v.x) > .5) v.rechts = x > v.x;
      v.x = x; v.y = y;
    });
    zeichneFahrer();
    requestAnimationFrame(bild);
  };
  requestAnimationFrame(bild);
}
function anhalten() { faehrt = false; bauLauf++; fahrer = []; zeichneFahrer(); zeichneLeiste(); }

palette.innerHTML = TEILNAMEN.map(t => `<button data-t="${t}" aria-label="${t}">${svg(TEILE[t].bild(0) + (TEILE[t].drueber || ''))}</button>`).join('') + `<button data-t="weg" aria-label="entfernen">${svg(ICON.weg)}</button>`;
palette.addEventListener('click', e => { const b = e.target.closest('button'); if (!b || faehrt) return; werkzeug = b.dataset.t; tone(520, 0, .05); zeichneLeiste(); });
$('#plaetze').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; anhalten(); B.cur = +b.dataset.i; bauSave(); zeichneBrett(); zeichneLeiste(); });
$('#los').addEventListener('click', () => { if (faehrt) anhalten(); else losfahren(); });
// Leeren braucht zwei Antipper, damit nichts aus Versehen verschwindet
let leerenBereit = 0;
$('#leeren').innerHTML = svg(box(20, 30, 60, 58, T) + box(12, 16, 76, 10, T) + box(40, 6, 20, 10, T));
$('#leeren').addEventListener('click', e => {
  const b = e.currentTarget;
  if (Date.now() - leerenBereit > 2500) { leerenBereit = Date.now(); b.classList.add('sicher'); setTimeout(() => b.classList.remove('sicher'), 2500); return; }
  leerenBereit = 0; b.classList.remove('sicher'); anhalten(); B.plots[B.cur] = Array(BW * BH).fill(null); bauSave(); zeichneBrett(); no();
});
$('#bauheim').innerHTML = svg(ICON.heim);
$('#bauheim').addEventListener('click', () => { anhalten(); bau.hidden = true; home.hidden = false; buildMap(); });
function openBau() { home.hidden = true; bau.hidden = false; zeichneBrett(); zeichneLeiste(); }

// Hauptmenü: eine Insel mit Gleisring. Die Lok fährt zur angetippten Station, dort beginnt das Rätsel.
const map = $('#map');
let driving = false, lokAngle = 0;
function buildMap() {
  const hoch = innerHeight > innerWidth, VW = hoch ? 700 : 1000, VH = hoch ? 1000 : 700, cx = VW / 2, cy = VH / 2;
  const [gx, gy] = hoch ? [176, 310] : [310, 168], [sx, sy] = hoch ? [262, 415] : [415, 268];
  const ORTE = [...KINDS, BAU], ang = i => i / ORTE.length * Math.PI * 2 - Math.PI / 2;
  let schwellen = '';
  for (let i = 0; i < 64; i++) {
    const a = i / 64 * Math.PI * 2, x = cx + gx * Math.cos(a), y = cy + gy * Math.sin(a);
    const nx = gy * Math.cos(a), ny = gx * Math.sin(a), nl = Math.hypot(nx, ny) / 13;
    schwellen += `M${x - nx / nl} ${y - ny / nl}L${x + nx / nl} ${y + ny / nl}`;
  }
  const stations = ORTE.map((k, i) => {
    const a = ang(i), x = cx + sx * Math.cos(a), y = cy + sy * Math.sin(a), oben = Math.sin(a) < -.01;
    return `<g class="station" data-i="${i}" transform="translate(${x - 48} ${y - 48})">${box(0, 0, 96, 96, C[k.color])}<svg x="12" y="12" width="72" height="72" viewBox="0 0 100 100">${k.icon}</svg><text x="48" y="${oben ? -10 : 119}">${k.title}</text></g>`;
  }).join('');
  map.innerHTML = svg(`
    <rect x="6" y="6" width="${VW - 12}" height="${VH - 12}" rx="210" fill="${P}"/>
    <ellipse cx="${cx}" cy="${cy}" rx="${gx}" ry="${gy}" fill="${C.gelb}"/>
    <path d="${schwellen}" stroke="${T}" stroke-width="5"/>
    <ellipse cx="${cx}" cy="${cy}" rx="${gx}" ry="${gy}" fill="none" stroke="${T}" stroke-width="6"/>
    <g transform="translate(${cx} ${cy}) scale(${hoch ? .78 : 1})">
      ${poly('-170,70 -96,-104 -22,70', C.rot)}${poly('-84,70 -24,-56 36,70', T)}
      <path d="M176 70H86A90 90 0 0 1 176 -20Z" fill="${C.gruen}"/>${box(118, 22, 30, 48, C.blau)}
      <g class="station" data-i="mix"><circle cx="40" cy="26" r="56" fill="${T}"/><circle cx="22" cy="14" r="20" fill="${C.rot}"/>${box(32, 14, 36, 36, C.blau)}${poly('12,58 36,16 60,58', C.gelb)}<text x="40" y="108">alles gemischt</text></g>
    </g>
    ${stations}
    <g class="lok"><g transform="translate(-35 -57) scale(.7)"><g>${FAHRZEUGE[2].bild(C.blau)}</g></g></g>`, '', `0 0 ${VW} ${VH}`);
  const lok = map.querySelector('.lok'), body = lok.firstChild.firstChild;
  // Die Lok ist nach links gezeichnet; fährt sie nach rechts, wird sie gespiegelt
  const put = (a, rechts) => {
    lokAngle = a;
    lok.setAttribute('transform', `translate(${cx + gx * Math.cos(a)} ${cy + gy * Math.sin(a)})`);
    body.setAttribute('transform', rechts ? 'translate(100 0) scale(-1 1)' : '');
  };
  put(ang(S.at % ORTE.length), true);
  const drive = (to, then) => {
    const from = lokAngle, dur = Math.min(2600, 350 + Math.abs(to - from) * 650), t0 = performance.now();
    if (Math.abs(to - from) < .01) return then();
    driving = true; tone(392, 0, .18, 'triangle', .1); tone(392, .25, .3, 'triangle', .1);
    const frame = now => {
      if (!lok.isConnected) { driving = false; return; }
      const t = Math.min(1, (now - t0) / dur), e = t < .5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t), a = from + (to - from) * e;
      put(a, (Math.sin(a) < 0) === (to > from));
      if (t < 1) return requestAnimationFrame(frame);
      driving = false; then();
    };
    requestAnimationFrame(frame);
  };
  map.querySelectorAll('.station').forEach(g => g.addEventListener('click', () => {
    if (driving) return;
    // «alles gemischt»: eine ganze Runde um die Insel
    if (g.dataset.i === 'mix') return drive(lokAngle + Math.PI * 2, () => start('mix'));
    const i = +g.dataset.i;
    let d = (ang(i) - lokAngle) % (Math.PI * 2);
    if (d > Math.PI) d -= Math.PI * 2; else if (d < -Math.PI) d += Math.PI * 2;
    drive(lokAngle + d, () => { S.at = i; save(); if (ORTE[i] === BAU) openBau(); else start(ORTE[i]); });
  }));
}
$('#back').innerHTML = svg(ICON.heim);
$('#next').innerHTML = svg(ICON.weiter);

$('#sound').addEventListener('click', () => { S.sound = !S.sound; save(); refresh(); if (S.sound) ok(); });
$('#level').addEventListener('click', () => { S.level = (S.level + 1) % 3; save(); refresh(); tone(440 + S.level * 220, 0, .15); });
$('#back').addEventListener('click', () => { round++; play.hidden = true; home.hidden = false; buildMap(); });
$('#next').addEventListener('click', nextPuzzle);

// Nach dem Drehen des iPads die Seite neu aufbauen (die Grössen stimmen sonst nicht mehr)
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => { if (!home.hidden) { if (!driving) buildMap(); } else if (play.hidden) return; else if (!solved && current) show(current); }, 250);
});
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('gesturestart', e => e.preventDefault());
document.addEventListener('dblclick', e => e.preventDefault());

refresh();
buildMap();

// Offline: lokal nur mit ?sw=1, damit beim Entwickeln nichts Altes aus dem Speicher kommt
const local = ['localhost', '127.0.0.1'].includes(location.hostname);
if ('serviceWorker' in navigator && (!local || location.search.includes('sw=1'))) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
