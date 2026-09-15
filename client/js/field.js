/* ============================================================================
   FIELD — el campo de partículas (SHELEG, capa de formación).
   Una nube de puntos en canvas 2D cuyas posiciones objetivo cambian por escena.
   • Cada formación es geometría determinista con semilla: idéntica en sesiones.
   • El morph es el de SHELEG: persecución suavizada + remolino por fase +
     arco perpendicular. Nada hace crossfade: los puntos VUELAN a su puesto.
   • Un respiro ("breathing") sube con la velocidad del scroll.
   • Sólo lee el estado del reloj — nunca mide scroll por su cuenta.
   Under prefers-reduced-motion pinta un único fotograma quieto y se detiene.
   ========================================================================== */
(function () {
  "use strict";

  const canvas = document.getElementById("field");
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: true });
  const cfg = CFG.field;

  const N = cfg.cols * cfg.rows * cfg.depth;
  const FORMATIONS = CFG.scenes.length;

  /* Puntos de la nube: posición de arranque + rol de profundidad + fase. */
  const points = new Array(N);
  const seedRng = UTIL.mulberry32(4242);
  for (let l = 0; l < cfg.depth; l++) {
    for (let r = 0; r < cfg.rows; r++) {
      for (let c = 0; c < cfg.cols; c++) {
        const pi = (l * cfg.rows + r) * cfg.cols + c;
        points[pi] = {
          layer: l,
          phase: pi / N,               // fase 0..1 → el remolino "se pela" en ola
          size: 0.016 + l * 0.007,     // tamaño por profundidad
          alpha: 0.34 + l * 0.16
        };
      }
    }
  }

  /* ---- Constructores de formaciones (espacio mundo: x∈[-2,2], y∈[-1.4,1.4]) ---- */
  const lerp = UTIL.lerp;

  function frameForm() {
    const fx = new Float32Array(N);
    const fy = new Float32Array(N);
    const rng = UTIL.mulberry32(101);
    for (let i = 0; i < N; i++) {
      const rl = rng();
      let x, y;
      if (rl < 0.42) {                       // el borde del marco
        const side = (rng() * 4) | 0;
        if (side === 0) { x = lerp(-1.9, 1.9, rng()); y = 1.15; }
        else if (side === 1) { x = 1.9; y = lerp(1.15, -1.15, rng()); }
        else if (side === 2) { x = lerp(-1.9, 1.9, rng()); y = -1.15; }
        else { x = -1.9; y = lerp(1.15, -1.15, rng()); }
        const j = 0.05;
        x += (rng() - 0.5) * j; y += (rng() - 0.5) * j;
      } else if (rl < 0.52) {                // refuerzo en las esquinas
        const c = (rng() * 4) | 0;
        const cx = c === 0 || c === 3 ? -1.55 : 1.55;
        const cy = c < 2 ? 0.95 : -0.95;
        const a = rng() * Math.PI * 2, d = rng() * 0.42;
        x = cx + Math.cos(a) * d; y = cy + Math.sin(a) * d * 0.7;
      } else {                               // interior escaso
        x = lerp(-1.75, 1.75, rng());
        y = lerp(-1.0, 1.0, rng());
      }
      fx[i] = x; fy[i] = y;
    }
    return { fx, fy };
  }

  function orbitForm() {
    const fx = new Float32Array(N);
    const fy = new Float32Array(N);
    const rng = UTIL.mulberry32(202);
    for (let i = 0; i < N; i++) {
      const rl = rng();
      const a = rng() * Math.PI * 2;
      let r, y;
      if (rl < 0.44) { r = 0.72 + (rng() - 0.5) * 0.14; y = r * 0.78; }
      else if (rl < 0.82) { r = 1.18 + (rng() - 0.5) * 0.16; y = r * 0.66; }
      else { r = Math.sqrt(rng()) * 1.05; y = r * 0.85; }
      fx[i] = Math.cos(a) * r;
      fy[i] = Math.sin(a) * y;
    }
    return { fx, fy };
  }

  function constellationForm() {
    const fx = new Float32Array(N);
    const fy = new Float32Array(N);
    const rng = UTIL.mulberry32(303);
    const hubs = [[-1.2, 0.7], [0.2, 1.0], [1.4, 0.4],
                  [-1.5, -0.6], [0.1, -0.9], [1.3, -0.7]];
    for (let i = 0; i < N; i++) {
      const h = hubs[(rng() * hubs.length) | 0];
      const a = rng() * Math.PI * 2;
      const d = Math.pow(rng(), 0.8) * 1.0;
      fx[i] = h[0] + Math.cos(a) * d + (rng() - 0.5) * 0.16;
      fy[i] = h[1] + Math.sin(a) * d * 0.8 + (rng() - 0.5) * 0.16;
    }
    return { fx, fy };
  }

  function latticeForm() {
    const fx = new Float32Array(N);
    const fy = new Float32Array(N);
    const rng = UTIL.mulberry32(404);
    for (let i = 0; i < N; i++) {
      let x, y;
      if (rng() < 0.1) {
        x = lerp(-1.9, 1.9, rng()); y = lerp(-1.1, 1.1, rng());
      } else {
        const col = (rng() * 14) | 0;
        const row = (rng() * 5) | 0;
        x = -1.88 + col * (3.76 / 13) + (rng() - 0.5) * 0.05;
        y = -1.04 + row * (2.08 / 4) + (rng() - 0.5) * 0.05;
      }
      fx[i] = x; fy[i] = y;
    }
    return { fx, fy };
  }

  function curveForm() {
    const fx = new Float32Array(N);
    const fy = new Float32Array(N);
    const rng = UTIL.mulberry32(505);
    for (let i = 0; i < N; i++) {
      const u = rng();
      const x = -1.95 + u * 3.9;
      const yline = -0.95 + u * 1.7 + Math.sin(u * Math.PI * 2) * 0.16;
      let y;
      if (rng() < 0.22) y = yline + 0.55 + (rng() - 0.5) * 0.5;   // nube tenue debajo
      else y = yline + (rng() - 0.5) * 0.34;
      fx[i] = x; fy[i] = y;
    }
    return { fx, fy };
  }

  /* Hoja de Magic Leaf: vesica (lente con puntas) + nervadura + tallo,
     rotada hacia arriba-derecha. Es la firma de la escena final. */
  function leafForm() {
    const fx = new Float32Array(N);
    const fy = new Float32Array(N);
    const rng = UTIL.mulberry32(606);
    const rot = -0.8;                       // ~ -46°: apunta arriba-derecha
    const cr = Math.cos(rot), sr = Math.sin(rot);
    const TIP = 0.05, BASE = 1.78;
    const yScale = 0.63;
    for (let i = 0; i < N; i++) {
      const rl = rng();
      let x, y;
      if (rl < 0.06) {                      // tallo
        x = lerp(BASE - 0.06, 2.08, rng());
        y = (rng() - 0.5) * 0.1;
      } else if (rl < 0.82) {               // cuerpo de la hoja
        const u = TIP + Math.pow(rng(), 0.78) * (BASE - TIP);
        const half = yScale * Math.sqrt(Math.max(0, (u - TIP) * (BASE - u)));
        x = u;
        y = (rng() * 2 - 1) * half * 0.92;
      } else {                              // nervadura central
        const u = TIP + Math.sqrt(rng()) * (BASE - TIP);
        x = u;
        y = (rng() * 2 - 1) * 0.07;
      }
      fx[i] = x * cr - y * sr;
      fy[i] = x * sr + y * cr;
    }
    const minY = Math.min.apply(null, fy);
    const span = 2.2;
    for (let i = 0; i < N; i++) {
      fy[i] = ((fy[i] - minY) / span - 0.48) * 1.9;  // centra la hoja en ~0
    }
    return { fx, fy };
  }

  const BUILD = { frame: frameForm, orbit: orbitForm, constellation: constellationForm,
                  lattice: latticeForm, curve: curveForm, leaf: leafForm };

  const formations = CFG.scenes.map((s) => BUILD[s.formation]());

  /* ---- Estado de render (se persigue hacia el estado objetivo) ---- */
  let cForm = 0;
  let cFocus = 0;
  let running = true;

  let W = 0, H = 0, dpr = 1, unit = 1;

  function resize() {
    dpr = UTIL.clamp(window.devicePixelRatio || 1, 1, cfg.dprCap);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    unit = Math.min(W / 4.7, H / 2.9);
  }

  function drawStatic() {
    draw(0);                     // formación inicial, sin bucle
    running = false;
  }

  function draw(formTarget) {
    const s = CLOCK.get();
    cForm += UTIL.clamp((formTarget - cForm) * CFG.motion.chase, -CFG.motion.cap, CFG.motion.cap);
    cFocus += (s.focusX - cFocus) * 0.05;

    ctx.clearRect(0, 0, W, H);

    const i = Math.floor(cForm);
    const k = UTIL.clamp01(cForm - i);
    const ia = UTIL.clamp(i, 0, FORMATIONS - 1);
    const ib = UTIL.clamp(i + 1, 0, FORMATIONS - 1);
    const a = formations[ia];
    const b = formations[ib];
    const energy = UTIL.lerp(CFG.scenes[ia].energy, CFG.scenes[ib].energy, k);

    const scale = unit * (1 + s.velocity * 0.03) * (0.94 + s.global * 0.3);
    const offX = W * 0.5 + cFocus * W * 0.09;
    const offY = H * 0.5;
    const spread = CFG.motion.spread;
    const arcAmp = CFG.motion.arcAmp;

    for (let p = 0; p < N; p++) {
      const pt = points[p];
      const dx = b.fx[p] - a.fx[p];
      const dy = b.fy[p] - a.fy[p];
      let m = UTIL.clamp01((k - pt.phase * spread) / (1 - spread));
      m = UTIL.smoothstep(m);

      let x = a.fx[p] + dx * m;
      let y = a.fy[p] + dy * m;
      if (m > 0.001 && m < 0.999) {
        const len = Math.hypot(dx, dy) || 1e-6;
        const arc = Math.sin(m * Math.PI) * arcAmp * (pt.phase > 0.5 ? 1 : -1);
        x += (-dy / len) * arc;
        y += (dx / len) * arc;
      }

      ctx.globalAlpha = pt.alpha * energy;
      const cx = offX + x * scale;
      const cy = offY + y * scale;
      const r = Math.max(0.6, pt.size * scale);
      ctx.fillStyle = p % 6 === 0
        ? "rgba(107,179,255,1)"          // puntos llamativos (accent-bright)
        : "rgba(51,146,255,1)";          // señal (--accent)
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  /* ---- Bucle principal: consumidor del reloj ---- */
  function frameUpdate() {
    if (!running) return;
    draw(CLOCK.get().form);
  }

  /* ---- Contrato reduced-motion: un fotograma quieto y listo ---- */
  if (CFG.reducedMotion()) {
    resize();
    cForm = 0;
    cFocus = CFG.scenes[0].focusX;
    drawStatic();
    return;
  }

  resize();
  window.addEventListener("resize", resize);
  CLOCK.each(frameUpdate);

  /* Pausa amable cuando la pestaña no se ve. */
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) running = false;
    else { running = true; }
  });
})();