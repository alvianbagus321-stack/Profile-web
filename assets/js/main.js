/* ═══════════════════════════════════════════
   ALVIAN.SPACE — main.js  (vanilla, no deps)
   ═══════════════════════════════════════════ */
(() => {
'use strict';
const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ───── 1. PRELOADER ───── */
(() => {
  const pre = $('#preloader'), bar = $('.loader-bar i'), pct = $('.loader-pct');
  let p = 0;
  const t = setInterval(() => {
    p += Math.random() * 13 + 4;
    if (p >= 100) { p = 100; clearInterval(t); setTimeout(() => { pre.classList.add('done'); document.body.classList.remove('locked'); }, 420); }
    bar.style.width = p + '%'; pct.textContent = Math.floor(p) + '%';
  }, 130);
  document.body.classList.add('locked');
})();

/* ───── 2. STARFIELD + SHOOTING STARS ───── */
(() => {
  const cv = $('#stars'), ctx = cv.getContext('2d');
  let W, H, stars = [], shooters = [], dpr = Math.min(devicePixelRatio || 1, 2);
  const mouse = { x: 0, y: 0 };

  function resize() {
    W = cv.width = innerWidth * dpr; H = cv.height = innerHeight * dpr;
    cv.style.width = innerWidth + 'px'; cv.style.height = innerHeight + 'px';
    const n = Math.min(340, Math.round(innerWidth * innerHeight / 5200));
    stars = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: (Math.random() * 1.5 + .3) * dpr,
      z: Math.random() * .8 + .2,
      tw: Math.random() * Math.PI * 2,
      c: ['#ffffff', '#bfe4ff', '#d9c6ff', '#ffe6bd'][Math.random() * 4 | 0]
    }));
  }
  addEventListener('resize', resize); resize();
  addEventListener('mousemove', e => { mouse.x = (e.clientX / innerWidth - .5); mouse.y = (e.clientY / innerHeight - .5); });

  let scrollY = 0;
  addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

  function shoot() {
    shooters.push({ x: Math.random() * W, y: Math.random() * H * .5, vx: (4 + Math.random() * 5) * dpr, vy: (2 + Math.random() * 2.4) * dpr, life: 1 });
    setTimeout(shoot, 2600 + Math.random() * 5200);
  }
  setTimeout(shoot, 2200);

  (function loop() {
    ctx.clearRect(0, 0, W, H);
    for (const s of stars) {
      s.tw += .022;
      const a = .35 + Math.abs(Math.sin(s.tw)) * .65;
      const px = s.x + mouse.x * 34 * s.z * dpr;
      const py = (s.y - scrollY * .22 * s.z * dpr) % H;
      ctx.globalAlpha = a; ctx.fillStyle = s.c;
      ctx.beginPath(); ctx.arc(px, py < 0 ? py + H : py, s.r, 0, 7); ctx.fill();
      if (s.r > 1.5 * dpr) { ctx.globalAlpha = a * .18; ctx.beginPath(); ctx.arc(px, py < 0 ? py + H : py, s.r * 4, 0, 7); ctx.fill(); }
    }
    shooters = shooters.filter(m => m.life > 0);
    for (const m of shooters) {
      m.x += m.vx; m.y += m.vy; m.life -= .012;
      const g = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * 16, m.y - m.vy * 16);
      g.addColorStop(0, `rgba(255,255,255,${m.life})`); g.addColorStop(1, 'rgba(120,200,255,0)');
      ctx.globalAlpha = 1; ctx.strokeStyle = g; ctx.lineWidth = 2 * dpr; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(m.x, m.y); ctx.lineTo(m.x - m.vx * 16, m.y - m.vy * 16); ctx.stroke();
    }
    requestAnimationFrame(loop);
  })();
})();

/* ───── 3. CURSOR ───── */
if (matchMedia('(hover:hover)').matches) {
  const dot = $('.cursor-dot'), ring = $('.cursor-ring');
  let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
  addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate(${mx}px,${my}px)`; });
  (function f() { rx += (mx - rx) * .16; ry += (my - ry) * .16; ring.style.transform = `translate(${rx}px,${ry}px)`; requestAnimationFrame(f); })();
  const grow = () => ring.classList.add('big'), shrink = () => ring.classList.remove('big');
  const bind = () => $$('[data-hover],a,button,input,textarea').forEach(el => { el.onmouseenter = grow; el.onmouseleave = shrink; });
  bind();
}

/* ───── 4. NAV ───── */
(() => {
  const nav = $('#nav'), burger = $('#burger'), links = $('.links'), prog = $('.scroll-progress i'), top = $('#toTop');
  burger.onclick = () => { burger.classList.toggle('on'); links.classList.toggle('open'); };
  $$('.links a').forEach(a => a.onclick = () => { burger.classList.remove('on'); links.classList.remove('open'); });
  top.onclick = () => scrollTo({ top: 0, behavior: 'smooth' });

  const secs = $$('section[id]');
  const onScroll = () => {
    const y = scrollY;
    nav.classList.toggle('solid', y > 40);
    top.classList.toggle('on', y > 500);
    prog.style.width = (y / (document.body.scrollHeight - innerHeight) * 100) + '%';
    let cur = '';
    secs.forEach(s => { if (y >= s.offsetTop - 160) cur = s.id; });
    $$('.links a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
})();

/* ───── 5. TYPING ───── */
(() => {
  const el = $('#typed');
  const words = ['Pelajar SMA Negeri 1 Babat', 'Kelas X-4', 'Space & Tech Enthusiast', 'Calon Penjelajah Masa Depan', 'Selalu Ingin Belajar'];
  let w = 0, i = 0, del = false;
  (function tick() {
    const word = words[w];
    el.textContent = del ? word.slice(0, --i) : word.slice(0, ++i);
    let d = del ? 45 : 85;
    if (!del && i === word.length) { d = 1700; del = true; }
    else if (del && i === 0) { del = false; w = (w + 1) % words.length; d = 320; }
    setTimeout(tick, d);
  })();
})();

/* ───── 6. REVEAL + COUNTERS + BARS ───── */
(() => {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    $$('.bar i', e.target).forEach(b => b.style.width = b.dataset.w + '%');
    $$('b[data-count]', e.target).forEach(n => {
      const to = +n.dataset.count; let c = 0;
      const step = () => { c += Math.max(1, to / 32); if (c >= to) return n.textContent = to; n.textContent = Math.floor(c); requestAnimationFrame(step); };
      step();
    });
    io.unobserve(e.target);
  }), { threshold: .16, rootMargin: '0px 0px -40px' });
  $$('.reveal').forEach(el => io.observe(el));
})();

/* ───── 7. HOLO CARD GLOW + HERO TILT ───── */
addEventListener('mousemove', e => {
  const c = e.target.closest?.('.holo');
  if (c) { const r = c.getBoundingClientRect(); c.style.setProperty('--mx', e.clientX - r.left + 'px'); c.style.setProperty('--my', e.clientY - r.top + 'px'); }
});
(() => {
  const stage = $('#tilt'); if (!stage || reduced) return;
  const hero = $('#home');
  hero.addEventListener('mousemove', e => {
    const r = hero.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    stage.style.transform = `perspective(900px) rotateY(${x * 16}deg) rotateX(${-y * 14}deg)`;
  });
  hero.addEventListener('mouseleave', () => stage.style.transform = '');
})();

/* ───── 8. SOLAR SYSTEM ───── */
(() => {
  const cv = $('#solar'); if (!cv) return;
  const ctx = cv.getContext('2d'), tip = $('#tooltip');
  const dpr = Math.min(devicePixelRatio || 1, 2);
  let W, H, cx, cy, unit;

  const planets = [
    { n: 'Identity',  d: 1.00, r: 8,  sp: 1.00, c: '#4de8ff', link: '#about',   t: 'Nama lengkapku Alvian Bagus Wijaksono. Aku siswa kelas X-4 di SMA Negeri 1 Babat, tinggal di Dusun Sreto, Ds. Pule, Kec. Modo, Kab. Lamongan.' },
    { n: 'Skills',    d: 1.42, r: 11, sp: .74,  c: '#9b5cff', link: '#skills',  t: 'Teknologi, desain, komunikasi, dan kerja tim. Semua modul masih terus di-upgrade setiap hari.' },
    { n: 'Journey',   d: 1.86, r: 13, sp: .55,  c: '#ffd166', link: '#journey', t: 'Perjalanan dari bangku SD sampai sekarang di SMA Negeri 1 Babat — dan misi berikutnya menuju masa depan.' },
    { n: 'Gallery',   d: 2.32, r: 10, sp: .42,  c: '#ff5cc8', link: '#gallery', t: 'Arsip visual: hal-hal yang aku suka, aku pelajari, dan aku impikan.' },
    { n: 'Contact',   d: 2.80, r: 12, sp: .33,  c: '#38ffa6', link: '#contact', t: 'Saluran komunikasi terbuka: 0857-2729-8747 (telepon / WhatsApp). Jangan ragu menyapa!' }
  ];

  let tiltX = 0.62, rotZ = 0, time = 0, paused = false, zoom = 1, hover = null;
  let drag = false, lx = 0, ly = 0;

  function resize() {
    const r = cv.getBoundingClientRect();
    W = cv.width = r.width * dpr; H = cv.height = r.height * dpr;
    cx = W / 2; cy = H / 2;
    unit = Math.min(W, H) / 7.6;
  }
  new ResizeObserver(resize).observe(cv); resize();

  const proj = (a, dist) => {
    const x = Math.cos(a + rotZ) * dist * unit * zoom;
    const yz = Math.sin(a + rotZ) * dist * unit * zoom;
    return { x: cx + x, y: cy + yz * tiltX, depth: yz };
  };

  function draw() {
    ctx.clearRect(0, 0, W, H);
    if (!paused) time += 0.0038;

    // orbit paths
    planets.forEach(p => {
      ctx.beginPath();
      for (let i = 0; i <= 90; i++) {
        const a = i / 90 * Math.PI * 2, q = proj(a, p.d);
        i ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y);
      }
      ctx.closePath();
      ctx.strokeStyle = hover === p ? 'rgba(255,255,255,.5)' : 'rgba(140,170,255,.2)';
      ctx.lineWidth = (hover === p ? 1.6 : 1) * dpr; ctx.stroke();
    });

    // sun
    const sr = 26 * dpr * zoom, pulse = 1 + Math.sin(time * 12) * .04;
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, sr * 5);
    g.addColorStop(0, 'rgba(255,225,150,.55)'); g.addColorStop(.4, 'rgba(255,140,60,.16)'); g.addColorStop(1, 'rgba(255,120,40,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, sr * 5, 0, 7); ctx.fill();
    const sg = ctx.createRadialGradient(cx - sr * .3, cy - sr * .3, sr * .1, cx, cy, sr);
    sg.addColorStop(0, '#fffbe8'); sg.addColorStop(.5, '#ffcf5c'); sg.addColorStop(1, '#ff8a1f');
    ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(cx, cy, sr * pulse, 0, 7); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.92)'; ctx.font = `700 ${11 * dpr}px Orbitron, sans-serif`;
    ctx.textAlign = 'center'; ctx.fillText('ALVIAN', cx, cy + sr * 2.4);

    // planets (depth sorted)
    const list = planets.map(p => {
      const a = time * p.sp * 6 + p.d * 2;
      const q = proj(a, p.d);
      return { p, ...q, a };
    }).sort((u, v) => u.depth - v.depth);

    list.forEach(o => {
      const p = o.p, scale = (1 + o.depth / (unit * 6)) * zoom;
      const rr = Math.max(4, p.r * dpr * scale);
      p._x = o.x; p._y = o.y; p._r = rr;

      ctx.globalAlpha = .35; ctx.fillStyle = p.c;
      ctx.beginPath(); ctx.arc(o.x, o.y, rr * (hover === p ? 3.2 : 2.2), 0, 7); ctx.fill();
      ctx.globalAlpha = 1;

      const pg = ctx.createRadialGradient(o.x - rr * .35, o.y - rr * .35, rr * .12, o.x, o.y, rr);
      pg.addColorStop(0, '#ffffff'); pg.addColorStop(.35, p.c); pg.addColorStop(1, 'rgba(0,0,0,.75)');
      ctx.fillStyle = pg; ctx.beginPath(); ctx.arc(o.x, o.y, rr, 0, 7); ctx.fill();

      if (p.n === 'Journey') { // ringed planet
        ctx.save(); ctx.translate(o.x, o.y); ctx.scale(1, .32);
        ctx.strokeStyle = 'rgba(255,230,170,.75)'; ctx.lineWidth = 1.6 * dpr;
        ctx.beginPath(); ctx.arc(0, 0, rr * 1.9, 0, 7); ctx.stroke(); ctx.restore();
      }

      ctx.fillStyle = hover === p ? '#fff' : 'rgba(200,215,255,.7)';
      ctx.font = `500 ${9 * dpr}px Orbitron, sans-serif`; ctx.textAlign = 'center';
      ctx.fillText(p.n.toUpperCase(), o.x, o.y - rr - 9 * dpr);
    });

    requestAnimationFrame(draw);
  }
  draw();

  const pos = e => {
    const r = cv.getBoundingClientRect();
    const t = e.touches ? e.touches[0] : e;
    return { x: (t.clientX - r.left) * dpr, y: (t.clientY - r.top) * dpr, cx: t.clientX - r.left, cy: t.clientY - r.top };
  };
  const hit = m => planets.find(p => Math.hypot(p._x - m.x, p._y - m.y) < Math.max(p._r * 2.2, 16 * dpr));

  cv.addEventListener('pointermove', e => {
    const m = pos(e);
    if (drag) {
      rotZ += (e.clientX - lx) * .006;
      tiltX = Math.max(.06, Math.min(1, tiltX + (e.clientY - ly) * .004));
      lx = e.clientX; ly = e.clientY; return;
    }
    hover = hit(m) || null;
    cv.style.cursor = hover ? 'pointer' : 'grab';
    if (hover) { tip.classList.add('on'); tip.textContent = hover.n; tip.style.left = m.cx + 'px'; tip.style.top = m.cy + 'px'; }
    else tip.classList.remove('on');
  });
  cv.addEventListener('pointerdown', e => { drag = true; lx = e.clientX; ly = e.clientY; cv.setPointerCapture(e.pointerId); });
  cv.addEventListener('pointerup', e => {
    drag = false;
    const m = pos(e), p = hit(m);
    if (p && Math.abs(e.clientX - lx) < 4) openModal(p);
  });
  cv.addEventListener('pointerleave', () => { drag = false; hover = null; tip.classList.remove('on'); });
  cv.addEventListener('wheel', e => { e.preventDefault(); zoom = Math.max(.55, Math.min(1.8, zoom - e.deltaY * .0012)); }, { passive: false });

  $('#pauseOrbit').onclick = function () { paused = !paused; this.textContent = paused ? '▶ Play' : '⏸ Pause'; };
  $('#resetOrbit').onclick = () => { tiltX = .62; rotZ = 0; zoom = 1; };

  /* modal */
  const modal = $('#modal');
  function openModal(p) {
    $('#modalTitle').textContent = p.n;
    $('#modalBody').textContent = p.t;
    $('#modalLink').setAttribute('href', p.link);
    $('.modal-planet i').style.setProperty('--pc', p.c);
    modal.classList.add('on'); modal.setAttribute('aria-hidden', 'false');
  }
  const close = () => { modal.classList.remove('on'); modal.setAttribute('aria-hidden', 'true'); };
  $('#modalClose').onclick = close;
  $('#modalLink').onclick = close;
  modal.onclick = e => { if (e.target === modal) close(); };
  addEventListener('keydown', e => e.key === 'Escape' && close());
})();

/* ───── 9. FORM → WHATSAPP ───── */
$('#msgForm').addEventListener('submit', e => {
  e.preventDefault();
  const n = $('#fName').value.trim(), f = $('#fFrom').value.trim(), m = $('#fMsg').value.trim();
  const txt = `Halo Alvian! 👋%0A%0ANama: ${encodeURIComponent(n)}${f ? `%0AAsal: ${encodeURIComponent(f)}` : ''}%0APesan: ${encodeURIComponent(m)}`;
  open(`https://wa.me/6285727298747?text=${txt}`, '_blank');
});

/* ───── 10. MISC ───── */
$('#yr').textContent = new Date().getFullYear();
console.log('%c🚀 ALVIAN.SPACE — welcome, explorer!', 'color:#4de8ff;font-size:15px;font-family:monospace');
})();
