'use strict';

/* =========================================================
   Rainbow Run: a side-scrolling unicorn platformer (canvas)
   Tap / Space to jump, tap again in the air to double jump.
   ========================================================= */
const RainbowRun = (() => {
  const VH = 540, GY = 440, G = 2600, JV = -900, PW = 56, PH = 60, PX = 170, RUN_TIME = 60;
  const RAINBOW = ['#ff5f8f', '#ff9a3d', '#ffd93d', '#5ee0a0', '#4fb3ff', '#a77bff'];
  let cv, ctx, dpr = 1, VW = 960, scale = 1, ox = 0, oy = 0;
  let s = null, opts = null, raf = 0, lastTs = 0;

  const rand = (a, b) => a + Math.random() * (b - a);
  const hash = n => { const x = Math.sin(n * 12.9898) * 43758.5453; return x - Math.floor(x); };
  const overlap = (ax, ay, aw, ah, bx, by, bw, bh) => ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;

  /* ---------- setup ---------- */
  function resize() {
    const r = cv.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = Math.max(1, Math.round(r.width * dpr));
    cv.height = Math.max(1, Math.round(r.height * dpr));
    VW = Math.max(820, Math.min(1400, r.width / Math.max(1, r.height) * VH));
    scale = Math.min(r.width / VW, r.height / VH) * dpr;
    ox = (cv.width - VW * scale) / 2;
    oy = (cv.height - VH * scale) / 2;
  }

  function newState() {
    const clouds = [];
    for (let i = 0; i < 8; i++) clouds.push({ x: rand(0, 1800), y: rand(40, 210), k: rand(0.6, 1.2) });
    return {
      t: 0, time: RUN_TIME, camX: 0, speed: 330, lives: 3, score: 0, gems: 0, stomps: 0,
      p: { x: PX, y: GY - PH, vy: 0, ground: true, jumps: 0, coyote: 0, inv: 0, falling: false },
      grounds: [{ x: -400, w: 1500 }], plats: [], items: [], enemies: [], parts: [], floats: [], clouds,
      genX: 1100, trailT: 0, shake: 0, countdown: 3, paused: false, over: false, endT: 0, survived: false,
    };
  }

  const item = (type, x, y) => ({ type, x, y, got: false, ph: Math.random() * 6 });

  function generate() {
    while (s.genX < s.camX + VW + 600) {
      const diff = Math.min(1, s.t / 50);
      const gap = rand(90, 140 + diff * 60);
      const w = rand(420, 900 - diff * 250);
      const x = s.genX + gap;
      // sparkle arc guiding the jump across the gap
      for (let i = 0; i < 5; i++) {
        const f = (i + 0.5) / 5;
        s.items.push(item('sparkle', s.genX - 40 + f * (gap + 80), GY - 70 - Math.sin(f * Math.PI) * 110));
      }
      s.grounds.push({ x, w });
      if (w > 500 && Math.random() < 0.6) {
        const pw = rand(150, 230), px = x + rand(120, w - pw - 60), py = GY - rand(130, 175);
        s.plats.push({ x: px, y: py, w: pw });
        const k = Math.floor(pw / 50);
        for (let i = 0; i < k; i++) s.items.push(item(Math.random() < 0.18 ? 'gem' : 'sparkle', px + 25 + i * 50, py - 36));
      } else {
        const k = 3 + (Math.random() * 3 | 0), sx = x + rand(80, Math.max(90, w - k * 50 - 40));
        for (let i = 0; i < k; i++) s.items.push(item('sparkle', sx + i * 48, GY - 40));
      }
      if (w > 480 && Math.random() < 0.35 + diff * 0.4) {
        const ex = x + rand(w * 0.45, w - 100);
        s.enemies.push({ x: ex, y: GY - 46, w: 58, h: 46, vx: -rand(40, 90), minX: x + 30, maxX: x + w - 30, alive: true, dead: 0 });
      }
      if (s.lives < 3 && Math.random() < 0.12) s.items.push(item('heart', x + w / 2, GY - 210));
      s.genX = x + w;
    }
  }

  /* ---------- gameplay ---------- */
  function jump() {
    if (!s || s.over || s.paused || s.countdown > 0) return;
    const p = s.p;
    if (p.falling) return;
    if (p.ground || p.coyote > 0) {
      p.vy = JV; p.jumps = 1; p.ground = false; p.coyote = 0; opts.sound.jump();
    } else if (p.jumps < 2) {
      p.vy = JV * 0.88; p.jumps = 2; opts.sound.jump(1.3);
      burst(p.x + PW / 2, p.y + PH, 10, 220);
    }
  }

  function land(y) {
    const p = s.p;
    if (!p.ground && p.vy > 400) burst(p.x + PW / 2, y, 6, 120, '#ffffff');
    p.y = y - PH; p.vy = 0; p.ground = true; p.jumps = 0; p.coyote = 0.1;
  }

  function addScore(n, x, y, label) {
    s.score += n;
    s.floats.push({ x, y, text: label || `+${n}`, life: 1 });
  }

  function burst(x, y, n, sp, color) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, v = rand(sp * 0.4, sp);
      s.parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 60, life: rand(0.4, 0.8), r: rand(3, 6), c: color || RAINBOW[i % 6] });
    }
  }

  function hurt() {
    const p = s.p;
    s.lives--; p.inv = 1.6; p.vy = -520; p.ground = false; s.shake = 0.3;
    opts.sound.hurt();
    if (s.lives <= 0) finish(false);
  }

  function fellInPit() {
    s.lives--; s.shake = 0.3; opts.sound.hurt();
    if (s.lives <= 0) { finish(false); return; }
    const p = s.p;
    const g = s.grounds.find(g => g.x + g.w > p.x + 100) || s.grounds[s.grounds.length - 1];
    const nx = Math.max(p.x, g.x + 30);
    s.camX = nx - PX; p.x = nx;
    p.y = GY - PH - 160; p.vy = 0; p.falling = false; p.ground = false; p.jumps = 1; p.inv = 2;
    s.enemies.forEach(e => { if (e.x > nx - 60 && e.x < nx + 420) { e.alive = false; e.dead = 9; } });
  }

  function finish(survived) {
    if (s.over) return;
    s.over = true; s.survived = survived; s.endT = 0;
    if (survived) { s.score += 15; s.floats.push({ x: s.p.x + 30, y: s.p.y - 20, text: '+15 🏰', life: 1.4 }); opts.sound.gem(); }
  }

  function update(dt) {
    updateFx(dt);
    if (s.countdown > 0) { s.countdown -= dt; return; }
    s.t += dt; s.time -= dt;
    if (s.time <= 0) { s.time = 0; finish(true); return; }
    s.speed = Math.min(520, 330 + s.t * 3.2);
    s.camX += s.speed * dt;
    generate();

    const p = s.p;
    p.x = s.camX + PX;
    p.inv = Math.max(0, p.inv - dt);
    p.coyote -= dt;
    const prevB = p.y + PH;
    p.vy = Math.min(1400, p.vy + G * dt * (p.vy > 0 ? 1.15 : 1));
    p.y += p.vy * dt;
    const wasGround = p.ground;
    p.ground = false;
    if (p.vy >= 0 && !p.falling) {
      const fl = p.x + 14, fr = p.x + PW - 10;
      for (const g of s.grounds) {
        if (fr > g.x && fl < g.x + g.w && prevB <= GY + 2 && p.y + PH >= GY) { land(GY); break; }
      }
      if (!p.ground) for (const pl of s.plats) {
        if (fr > pl.x && fl < pl.x + pl.w && prevB <= pl.y + 2 && p.y + PH >= pl.y) { land(pl.y); break; }
      }
    }
    if (wasGround && !p.ground && p.jumps === 0) p.coyote = 0.1;
    if (!p.ground && p.y + PH > GY + 8) p.falling = true;
    if (p.y > VH + 60) { fellInPit(); if (s.over) return; }

    // rainbow trail
    s.trailT -= dt;
    if (s.trailT <= 0) {
      s.trailT = 0.025;
      s.parts.push({ x: p.x + 2, y: p.y + PH - 32 + rand(-4, 4), vx: -40, vy: rand(-20, 20), life: 0.5, r: 5, c: RAINBOW[(s.t * 20 | 0) % 6] });
    }

    // enemies
    for (const e of s.enemies) {
      if (!e.alive) { e.dead += dt; continue; }
      e.x += e.vx * dt;
      if (e.x < e.minX) { e.x = e.minX; e.vx = Math.abs(e.vx); }
      else if (e.x + e.w > e.maxX) { e.x = e.maxX - e.w; e.vx = -Math.abs(e.vx); }
      if (overlap(p.x + 10, p.y + 8, PW - 20, PH - 10, e.x + 6, e.y + 8, e.w - 12, e.h - 8)) {
        if (p.vy > 0 && prevB <= e.y + 20) {
          e.alive = false; p.vy = JV * 0.65; p.jumps = 1; s.stomps++;
          addScore(3, e.x + e.w / 2, e.y - 10, '+3 🌈');
          burst(e.x + e.w / 2, e.y + 10, 16, 260);
          opts.sound.stomp();
        } else if (p.inv <= 0) hurt();
        if (s.over) return;
      }
    }

    // collectibles
    const cx = p.x + PW / 2, cy = p.y + PH / 2;
    for (const it of s.items) {
      if (it.got) continue;
      if (Math.abs(it.x - cx) < 40 && Math.abs(it.y - cy) < 44) {
        it.got = true;
        if (it.type === 'sparkle') { addScore(1, it.x, it.y); opts.sound.collect(); }
        else if (it.type === 'gem') { s.gems++; addScore(5, it.x, it.y, '+5 💎'); opts.sound.gem(); burst(it.x, it.y, 10, 180, '#8fe9ff'); }
        else if (it.type === 'heart') { s.lives = Math.min(3, s.lives + 1); s.floats.push({ x: it.x, y: it.y, text: '+1 💖', life: 1 }); opts.sound.gem(); }
      }
    }

    // clean up things far behind the camera
    const cut = s.camX - 300;
    s.grounds = s.grounds.filter(g => g.x + g.w > cut);
    s.plats = s.plats.filter(pl => pl.x + pl.w > cut);
    s.items = s.items.filter(it => !it.got && it.x > cut);
    s.enemies = s.enemies.filter(e => e.x + e.w > cut && e.dead < 1);
  }

  function updateFx(dt) {
    s.shake = Math.max(0, s.shake - dt);
    for (const q of s.parts) { q.x += q.vx * dt; q.y += q.vy * dt; q.vy += 300 * dt; q.life -= dt; }
    s.parts = s.parts.filter(q => q.life > 0).slice(-220);
    for (const f of s.floats) { f.y -= 60 * dt; f.life -= dt; }
    s.floats = s.floats.filter(f => f.life > 0);
  }

  /* ---------- drawing helpers ---------- */
  function circ(x, y, r, fill) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill(); }
  function ell(x, y, rx, ry, fill, rot = 0, stroke) {
    ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill();
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.stroke(); }
  }
  function rr(x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  function heartPath(x, y, sz) {
    ctx.beginPath(); ctx.moveTo(x, y + sz * 0.35);
    ctx.bezierCurveTo(x - sz, y - sz * 0.4, x - sz * 0.45, y - sz * 1.05, x, y - sz * 0.5);
    ctx.bezierCurveTo(x + sz * 0.45, y - sz * 1.05, x + sz, y - sz * 0.4, x, y + sz * 0.35);
  }
  function starPath(x, y, r, rot) {
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const a = rot + i * Math.PI / 4, d = i % 2 ? r * 0.38 : r;
      ctx.lineTo(x + Math.cos(a) * d, y + Math.sin(a) * d);
    }
    ctx.closePath();
  }
  function text(str, x, y, size, fill = '#fff', align = 'center', stroke = 'rgba(80,40,130,.85)') {
    ctx.font = `700 ${size}px Fredoka, system-ui, sans-serif`;
    ctx.textAlign = align; ctx.textBaseline = 'middle';
    ctx.lineJoin = 'round'; ctx.lineWidth = size / 5; ctx.strokeStyle = stroke; ctx.strokeText(str, x, y);
    ctx.fillStyle = fill; ctx.fillText(str, x, y);
  }
  function puffCloud(x, y, k, fill) {
    ctx.fillStyle = fill; ctx.beginPath();
    ctx.arc(x, y, 26 * k, 0, Math.PI * 2); ctx.arc(x + 30 * k, y - 12 * k, 32 * k, 0, Math.PI * 2);
    ctx.arc(x + 64 * k, y, 24 * k, 0, Math.PI * 2); ctx.rect(x, y - 4 * k, 64 * k, 28 * k);
    ctx.fill();
  }

  /* ---------- scene ---------- */
  function drawBackground() {
    const sky = ctx.createLinearGradient(0, 0, 0, VH);
    sky.addColorStop(0, '#8ec5ff'); sky.addColorStop(0.55, '#d4bfff'); sky.addColorStop(1, '#ffd1e8');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, VW, VH);

    // sun
    const sx = VW - 150, sy = 95;
    const glow = ctx.createRadialGradient(sx, sy, 10, sx, sy, 110);
    glow.addColorStop(0, 'rgba(255,245,180,.95)'); glow.addColorStop(1, 'rgba(255,245,180,0)');
    ctx.fillStyle = glow; ctx.fillRect(sx - 110, sy - 110, 220, 220);
    circ(sx, sy, 40, '#fff3a8');

    // big rainbow
    const rx = VW * 0.42 - (s.camX * 0.02) % 200;
    ctx.globalAlpha = 0.42; ctx.lineWidth = 16;
    RAINBOW.forEach((c, i) => { ctx.strokeStyle = c; ctx.beginPath(); ctx.arc(rx, 420, 330 - i * 16, Math.PI, 0); ctx.stroke(); });
    ctx.globalAlpha = 1;

    // clouds
    for (const c of s.clouds) {
      const span = VW + 400;
      const x = ((c.x - s.camX * 0.12 * c.k) % span + span) % span - 200;
      puffCloud(x, c.y, c.k, 'rgba(255,255,255,.85)');
    }

    // far hills + castle
    hills(0.22, 365, 42, 260, '#c3a9f5');
    const span = 2600, cx = ((1500 - s.camX * 0.22) % span + span) % span - 300;
    castle(cx, 330);
    // near hills
    hills(0.45, 405, 26, 180, '#a6e8cc');
  }

  function hills(k, base, amp, period, color) {
    ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(0, VH);
    for (let x = 0; x <= VW + 20; x += 20) {
      const wx = x + s.camX * k;
      ctx.lineTo(x, base - Math.sin(wx / period) * amp - Math.sin(wx / (period * 0.37)) * amp * 0.3);
    }
    ctx.lineTo(VW, VH); ctx.closePath(); ctx.fill();
  }

  function castle(x, y) {
    ctx.fillStyle = '#f4e9ff';
    ctx.fillRect(x, y - 70, 160, 90);
    [[x - 16, 36, 120], [x + 62, 36, 150], [x + 140, 36, 120]].forEach(([tx, w, h]) => {
      ctx.fillStyle = '#f4e9ff'; ctx.fillRect(tx, y - h + 20, w, h);
      ctx.fillStyle = '#ff8ac4'; ctx.beginPath(); ctx.moveTo(tx - 6, y - h + 22); ctx.lineTo(tx + w / 2, y - h - 30); ctx.lineTo(tx + w + 6, y - h + 22); ctx.fill();
      ctx.strokeStyle = '#a77bff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(tx + w / 2, y - h - 30); ctx.lineTo(tx + w / 2, y - h - 48); ctx.stroke();
      ctx.fillStyle = '#ffd93d'; ctx.beginPath(); ctx.moveTo(tx + w / 2, y - h - 48); ctx.lineTo(tx + w / 2 + 14, y - h - 42); ctx.lineTo(tx + w / 2, y - h - 36); ctx.fill();
    });
    ctx.fillStyle = '#c9b0f2';
    rr(x + 62, y - 30, 36, 50, 16); ctx.fill();
    circ(x + 20, y - 40, 7, '#c9b0f2'); circ(x + 140, y - 40, 7, '#c9b0f2');
  }

  function drawGround(g) {
    const soil = ctx.createLinearGradient(0, GY, 0, VH);
    soil.addColorStop(0, '#ffb3d6'); soil.addColorStop(1, '#e48cc0');
    ctx.fillStyle = soil; rr(g.x, GY, g.w, VH - GY + 30, 14); ctx.fill();
    // candy stripes
    ctx.save(); rr(g.x, GY, g.w, VH - GY + 30, 14); ctx.clip();
    ctx.strokeStyle = 'rgba(255,255,255,.28)'; ctx.lineWidth = 14;
    for (let x = g.x - 120; x < g.x + g.w + 40; x += 48) { ctx.beginPath(); ctx.moveTo(x, VH); ctx.lineTo(x + 100, GY); ctx.stroke(); }
    ctx.restore();
    // grass top with scallops
    ctx.fillStyle = '#7ee2a8'; rr(g.x - 4, GY - 6, g.w + 8, 20, 10); ctx.fill();
    ctx.fillStyle = '#7ee2a8';
    for (let x = g.x + 8; x < g.x + g.w - 4; x += 22) { ctx.beginPath(); ctx.arc(x, GY + 13, 9, 0, Math.PI); ctx.fill(); }
    ctx.fillStyle = 'rgba(255,255,255,.35)'; rr(g.x + 4, GY - 4, g.w - 8, 5, 3); ctx.fill();
    // flowers
    for (let x = Math.ceil(g.x / 70) * 70 + 20; x < g.x + g.w - 20; x += 70) {
      const h = hash(x);
      if (h < 0.4) {
        ctx.strokeStyle = '#4fbf7f'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, GY - 4); ctx.lineTo(x, GY - 16); ctx.stroke();
        const c = RAINBOW[(h * 60 | 0) % 6];
        for (let i = 0; i < 5; i++) { const a = i * 1.2566; circ(x + Math.cos(a) * 5, GY - 18 + Math.sin(a) * 5, 4, c); }
        circ(x, GY - 18, 3, '#fff7b0');
      }
    }
  }

  function drawPlatform(pl) {
    ctx.fillStyle = 'rgba(120,80,180,.15)'; rr(pl.x + 6, pl.y + 10, pl.w, 22, 11); ctx.fill();
    ctx.fillStyle = '#ffffff'; rr(pl.x, pl.y, pl.w, 22, 11); ctx.fill();
    for (let x = pl.x + 18; x < pl.x + pl.w - 10; x += 30) circ(x, pl.y + 4, 13, '#ffffff');
    ctx.fillStyle = 'rgba(200,180,255,.45)'; rr(pl.x + 6, pl.y + 14, pl.w - 12, 6, 3); ctx.fill();
  }

  function drawItem(it) {
    const bob = Math.sin(s.t * 4 + it.ph) * 5, x = it.x, y = it.y + bob;
    if (it.type === 'sparkle') {
      starPath(x, y, 13, s.t * 2 + it.ph); ctx.fillStyle = '#ffe066'; ctx.fill();
      ctx.lineWidth = 2.5; ctx.strokeStyle = '#ffb000'; ctx.stroke();
      circ(x - 3, y - 3, 2.5, '#fff');
    } else if (it.type === 'gem') {
      ctx.beginPath(); ctx.moveTo(x, y - 17); ctx.lineTo(x + 14, y - 4); ctx.lineTo(x, y + 17); ctx.lineTo(x - 14, y - 4); ctx.closePath();
      const gr = ctx.createLinearGradient(x - 14, y - 17, x + 14, y + 17);
      gr.addColorStop(0, '#9ef4ff'); gr.addColorStop(1, '#a77bff');
      ctx.fillStyle = gr; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.5; ctx.stroke();
    } else if (it.type === 'heart') {
      heartPath(x, y + 6, 20); ctx.fillStyle = '#ff5fa2'; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.stroke();
    }
  }

  function drawEnemy(e) {
    const cx = e.x + e.w / 2, by = e.y + e.h;
    if (!e.alive) {
      // squished cloud turns into a tiny rainbow
      const a = Math.max(0, 1 - e.dead * 1.6);
      ctx.globalAlpha = a;
      ell(cx, by - 6, 30 + e.dead * 20, 6, '#b9b9d6');
      ctx.lineWidth = 4;
      RAINBOW.forEach((c, i) => { ctx.strokeStyle = c; ctx.beginPath(); ctx.arc(cx, by - 4, 28 - i * 4 + e.dead * 10, Math.PI, 0); ctx.stroke(); });
      ctx.globalAlpha = 1;
      return;
    }
    const step = Math.sin(s.t * 12 + e.x) * 3;
    // feet
    ell(cx - 12, by - 3 + step, 8, 5, '#5f5f86'); ell(cx + 12, by - 3 - step, 8, 5, '#5f5f86');
    // body
    ctx.fillStyle = '#9090b8'; ctx.beginPath();
    ctx.arc(cx - 16, by - 20, 15, 0, Math.PI * 2); ctx.arc(cx, by - 30, 19, 0, Math.PI * 2); ctx.arc(cx + 16, by - 20, 15, 0, Math.PI * 2);
    ctx.rect(cx - 16, by - 22, 32, 16); ctx.fill();
    // face (looks toward travel direction)
    const d = e.vx < 0 ? -3 : 3;
    circ(cx - 8 + d, by - 27, 5.5, '#fff'); circ(cx + 8 + d, by - 27, 5.5, '#fff');
    circ(cx - 8 + d * 1.5, by - 26, 2.8, '#2d2448'); circ(cx + 8 + d * 1.5, by - 26, 2.8, '#2d2448');
    ctx.strokeStyle = '#2d2448'; ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(cx - 14 + d, by - 37); ctx.lineTo(cx - 3 + d, by - 33); ctx.moveTo(cx + 14 + d, by - 37); ctx.lineTo(cx + 3 + d, by - 33); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx + d, by - 14, 5, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
  }

  function drawUnicorn() {
    const p = s.p, col = opts.color;
    if (p.inv > 0 && Math.floor(p.inv * 12) % 2 === 0) return;
    const cx = p.x + PW / 2, by = p.y + PH;
    ctx.save();
    const tilt = p.ground ? 0 : Math.max(-0.25, Math.min(0.3, p.vy / 2600));
    ctx.translate(cx, by - 30); ctx.rotate(tilt); ctx.translate(-cx, -(by - 30));
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const run = p.ground ? Math.sin(s.t * 22) : 0;
    const outline = 'rgba(90,60,130,.35)';

    // tail
    const wave = Math.sin(s.t * 10) * 4;
    [col.mane, col.mane2, col.mane].forEach((c, i) => {
      ctx.strokeStyle = c; ctx.lineWidth = 7 - i;
      ctx.beginPath(); ctx.moveTo(cx - 26, by - 38 + i * 3);
      ctx.quadraticCurveTo(cx - 44, by - 46 + i * 6 + wave, cx - 48, by - 24 + i * 5 - wave); ctx.stroke();
    });

    // legs
    ctx.strokeStyle = shade(col.body); ctx.lineWidth = 8;
    const legs = p.ground
      ? [[cx - 18, run * 7], [cx - 9, -run * 7], [cx + 8, -run * 7], [cx + 17, run * 7]]
      : [[cx - 18, -9], [cx - 9, -6], [cx + 8, 8], [cx + 17, 10]];
    for (const [lx, sw] of legs) {
      ctx.beginPath(); ctx.moveTo(lx, by - 24); ctx.lineTo(lx + sw, by - (p.ground ? 3 : 9)); ctx.stroke();
    }
    ctx.strokeStyle = col.mane; ctx.lineWidth = 8;
    for (const [lx, sw] of legs) { const ey = by - (p.ground ? 3 : 9); ctx.beginPath(); ctx.moveTo(lx + sw, ey); ctx.lineTo(lx + sw, ey + 0.5); ctx.stroke(); }

    // body, neck, head
    ell(cx - 4, by - 32, 29, 17, col.body, 0, outline);
    ell(cx + 15, by - 46, 10, 17, col.body, 0.5);
    ell(cx + 23, by - 58, 14, 12, col.body, 0, outline);
    ell(cx + 33, by - 53, 10, 8, col.body, 0, outline);
    ell(cx + 15, by - 46, 8, 14, col.body, 0.5); // hide seam between neck & body
    // ear
    ctx.fillStyle = col.body; ctx.strokeStyle = outline; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cx + 13, by - 65); ctx.lineTo(cx + 15, by - 80); ctx.lineTo(cx + 22, by - 68); ctx.closePath(); ctx.fill(); ctx.stroke();
    // horn
    ctx.fillStyle = '#ffd45e'; ctx.strokeStyle = '#e5a900';
    ctx.beginPath(); ctx.moveTo(cx + 21, by - 68); ctx.lineTo(cx + 33, by - 92); ctx.lineTo(cx + 28, by - 66); ctx.closePath(); ctx.fill(); ctx.stroke();
    // mane
    [[cx + 12, by - 68, 7.5, col.mane], [cx + 7, by - 59, 7.5, col.mane2], [cx + 3, by - 50, 7, col.mane], [cx + 1, by - 41, 6, col.mane2], [cx + 18, by - 70, 5.5, col.mane2]]
      .forEach(([x, y, r, c]) => circ(x, y, r, c));
    // face
    circ(cx + 26, by - 60, 3, '#3b2a4a'); circ(cx + 27, by - 61.2, 1.1, '#fff');
    ctx.globalAlpha = 0.6; circ(cx + 30, by - 53, 3.6, '#ff9ec7'); ctx.globalAlpha = 1;
    circ(cx + 39, by - 54, 1.4, '#3b2a4a');
    ctx.strokeStyle = '#3b2a4a'; ctx.lineWidth = 1.8;
    ctx.beginPath(); ctx.arc(cx + 35, by - 51, 3.5, 0.2, Math.PI * 0.8); ctx.stroke();
    ctx.restore();
  }

  function shade(hex) {
    const n = parseInt(hex.slice(1), 16);
    const f = v => Math.max(0, Math.round(v * 0.9));
    return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`;
  }

  function drawHud() {
    for (let i = 0; i < 3; i++) {
      heartPath(36 + i * 42, 46, 18);
      ctx.fillStyle = i < s.lives ? '#ff5fa2' : 'rgba(255,255,255,.4)'; ctx.fill();
      ctx.lineWidth = 3; ctx.strokeStyle = '#fff'; ctx.stroke();
    }
    ctx.fillStyle = 'rgba(255,255,255,.75)';
    rr(VW / 2 - 66, 16, 132, 44, 22); ctx.fill();
    text(`⏱ ${Math.ceil(s.time)}`, VW / 2, 39, 26, s.time <= 10 ? '#ff5f8f' : '#6a3fc8', 'center', 'rgba(255,255,255,0)');
    ctx.fillStyle = 'rgba(255,255,255,.75)';
    rr(VW - 250, 16, 150, 44, 22); ctx.fill();
    text(`✨ ${s.score}`, VW - 175, 39, 26, '#6a3fc8', 'center', 'rgba(255,255,255,0)');
    // progress to castle
    const pr = 1 - s.time / RUN_TIME;
    ctx.fillStyle = 'rgba(255,255,255,.55)'; rr(VW / 2 - 120, 70, 240, 10, 5); ctx.fill();
    ctx.fillStyle = '#ff8ac4'; rr(VW / 2 - 120, 70, Math.max(10, 240 * pr), 10, 5); ctx.fill();
    ctx.font = '20px system-ui'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('🏰', VW / 2 + 136, 74);
  }

  function draw() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#3a2766'; ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.setTransform(scale, 0, 0, scale, ox, oy);
    ctx.save();
    ctx.beginPath(); ctx.rect(0, 0, VW, VH); ctx.clip();
    if (s.shake > 0) ctx.translate(rand(-6, 6) * s.shake * 3, rand(-6, 6) * s.shake * 3);
    drawBackground();

    ctx.save();
    ctx.translate(-s.camX, 0);
    const vis = (x, w) => x + w > s.camX - 100 && x < s.camX + VW + 100;
    s.plats.forEach(pl => vis(pl.x, pl.w) && drawPlatform(pl));
    s.items.forEach(it => !it.got && vis(it.x - 20, 40) && drawItem(it));
    s.enemies.forEach(e => vis(e.x, e.w) && drawEnemy(e));
    for (const q of s.parts) { ctx.globalAlpha = Math.max(0, q.life * 1.6); circ(q.x, q.y, q.r, q.c); }
    ctx.globalAlpha = 1;
    drawUnicorn();
    s.grounds.forEach(g => vis(g.x, g.w) && drawGround(g)); // drawn after the unicorn so pits swallow it
    for (const f of s.floats) { ctx.globalAlpha = Math.min(1, f.life * 2); text(f.text, f.x, f.y, 22, '#fff'); }
    ctx.globalAlpha = 1;
    ctx.restore();

    drawHud();

    if (s.countdown > 0) {
      ctx.fillStyle = 'rgba(60,30,110,.25)'; ctx.fillRect(0, 0, VW, VH);
      const n = Math.ceil(s.countdown);
      text(n > 0 ? String(n) : 'GO!', VW / 2, VH / 2 - 40, 110, '#ffe066');
      text('Tap anywhere to jump · tap again in the air to double jump!', VW / 2, VH / 2 + 50, 26);
      text('Bounce on the grumpy clouds to cheer them up 🌈', VW / 2, VH / 2 + 88, 22);
    }
    if (s.over) {
      ctx.fillStyle = `rgba(60,30,110,${Math.min(0.45, s.endT)})`; ctx.fillRect(0, 0, VW, VH);
      text(s.survived ? '🏰 You reached the castle!' : '💫 Great run!', VW / 2, VH / 2 - 20, 60, '#ffe066');
      text(`✨ ${s.score} sparkles`, VW / 2, VH / 2 + 50, 34);
    }
    ctx.restore();
  }

  /* ---------- loop & input ---------- */
  function loop(ts) {
    raf = requestAnimationFrame(loop);
    const dt = Math.min(0.033, ((ts - lastTs) / 1000) || 0);
    lastTs = ts;
    if (s.over) {
      s.endT += dt; updateFx(dt);
      if (s.endT > 1.8) { const res = { score: s.score, gems: s.gems, stomps: s.stomps, survived: s.survived }; stop(); opts.onEnd(res); return; }
    } else if (!s.paused) update(dt);
    draw();
  }

  function onPointer(e) {
    if (e.target.closest('button') || e.target.closest('.pause-menu')) return;
    e.preventDefault(); jump();
  }
  function onKey(e) {
    if (['Space', 'ArrowUp', 'KeyW'].includes(e.code)) { e.preventDefault(); jump(); }
    else if (e.code === 'Escape' || e.code === 'KeyP') document.getElementById(s.paused ? 'btnResume' : 'btnPause').click();
  }
  function onVisibility() { if (document.hidden && s && !s.over && !s.paused) document.getElementById('btnPause').click(); }

  function start(canvas, o) {
    cv = canvas; ctx = cv.getContext('2d'); opts = o;
    s = newState();
    const isTouch = matchMedia('(pointer: coarse)').matches;
    if (isTouch && document.documentElement.requestFullscreen && !document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => screen.orientation?.lock?.('landscape')).catch(() => {});
    }
    resize();
    generate();
    window.addEventListener('resize', resize);
    cv.parentElement.addEventListener('pointerdown', onPointer);
    window.addEventListener('keydown', onKey);
    document.addEventListener('visibilitychange', onVisibility);
    lastTs = performance.now();
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(loop);
  }

  function stop() {
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', resize);
    cv.parentElement.removeEventListener('pointerdown', onPointer);
    window.removeEventListener('keydown', onKey);
    document.removeEventListener('visibilitychange', onVisibility);
    try { screen.orientation?.unlock?.(); } catch (e) { /* not supported */ }
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  }

  return {
    start,
    pause() { if (s && !s.over) s.paused = true; },
    resume() { if (s) { s.paused = false; lastTs = performance.now(); } },
    quit() { if (s && !s.over) { s.paused = false; finish(false); } },
  };
})();
