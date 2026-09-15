/* ============================================================================
   CLOCK — el único reloj de la página (SHELEG, capa 1).
   Un bucle requestAnimationFrame mide el scroll y escribe un objeto de estado.
   Dos rutas de lectura:
     • CLOCK.each(fn)   — consumidores calientes por fotograma (campo, rail).
     • CLOCK.subscribeAct(fn) — se dispara sólo cuando cambia el acto entero.
   La formación "se mantiene 82% del tramo y luego morfa en la cola" vive aquí,
   en la medición, no en el render (es el secreto de la calma).
   ========================================================================== */
(function (global) {
  "use strict";

  const state = {
    global: 0,        // 0..1   progreso total de la página
    act: 0,           // entero — escena actual (estado grueso, para el badge)
    actProgress: 0,   // 0..1   dentro del tramo de la escena
    form: 0,          // continuo — forma objetivo (entero = hold; fracción = morph)
    focusX: 0,        // -1..1  pan de cámara derivado de las escenas
    velocity: 0,      // -1..1  velocidad suavizada del scroll
    scene: 0          // índice de escena (alias de act, por claridad)
  };

  const consumers = []; // por fotograma
  const actSubs = [];   // por cambio de acto
  const bounds = [];    // un tramo medida por escena

  let raf = 0;
  let lastAct = -1;
  let lastY = -1;
  let vel = 0;

  function measure() {
    const els = document.querySelectorAll("[data-scene]");
    const vh = window.innerHeight;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - vh);
    const tops = [];
    for (const el of els) {
      tops.push(el.getBoundingClientRect().top + window.scrollY - vh * 0.65);
    }
    bounds.length = 0;
    for (let i = 0; i < tops.length; i++) {
      const b0 = tops[i];
      const b1raw = i + 1 < tops.length ? tops[i + 1] : maxScroll;
      const b1 = Math.max(b0 + 40, b1raw);
      bounds.push({ b0, b1, len: b1 - b0 });
    }
  }

  function tick() {
    const y = window.scrollY;
    const vh = window.innerHeight;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - vh);

    /* velocidad = derivada suavizada, normalizada a ≈ -1..1 */
    const dy = lastY < 0 ? 0 : y - lastY;
    lastY = y;
    vel = vel * 0.86 + dy * 0.14;
    state.velocity = UTIL.clamp(vel / 120, -1, 1);

    state.global = maxScroll > 0 ? UTIL.clamp01(y / maxScroll) : 0;

    /* escena activa + progreso dentro de su tramo */
    let i = 0;
    let pr = 0;
    for (i = 0; i < bounds.length; i++) {
      const b = bounds[i];
      if (y < b.b0) { pr = 0; break; }
      if (y < b.b1) { pr = UTIL.clamp01((y - b.b0) / b.len); break; }
    }
    if (i >= bounds.length) { i = bounds.length - 1; pr = 1; }

    state.scene = i;
    state.act = i;
    state.actProgress = pr;

    /* HOLD 82% → cola suavizada → morf. El porcentaje de hold es el "secreto
       de la calma": la red se queda quieta casi todo el tramo. */
    const HOLD = CFG.motion.hold;
    let f = i;
    if (pr > HOLD) {
      f = i + UTIL.smoothstep(UTIL.clamp01((pr - HOLD) / (1 - HOLD)));
    }
    state.form = f;

    /* pan de cámara: funde entre la escena activa y la siguiente */
    const a = CFG.scenes[Math.min(i, CFG.scenes.length - 1)];
    const b = CFG.scenes[Math.min(i + 1, CFG.scenes.length - 1)];
    const w = UTIL.clamp01(f - i);
    state.focusX = UTIL.lerp(a.focusX, b.focusX, w);

    if (lastAct !== i) {
      lastAct = i;
      for (const fn of actSubs) fn(i);
    }

    for (const c of consumers) c(state);
    raf = requestAnimationFrame(tick);
  }

  global.CLOCK = {
    get: () => state,
    each(fn) { consumers.push(fn); },
    subscribeAct(fn) { actSubs.push(fn); },
    measure,
    start() {
      measure();
      window.addEventListener("resize", measure);
      if ("ResizeObserver" in window) {
        new ResizeObserver(measure).observe(document.body);
      }
      window.addEventListener("load", measure);
      lastY = -1;
      raf = requestAnimationFrame(tick);
    }
  };
})(window);