/* ============================================================================
   INSTRUMENTS — dos instrumentos que narran estado:
   1. Métricas del arsenal: barras que se "cargan" con el scroll (scrub,
      ease none — el scrollbar es el reloj).
   2. Contadores de la ficha: count-up al entrar en el cono de lectura.
   Bajo reduced-motion ambos se entregan llenos/estáticos.
   ========================================================================== */
(function () {
  "use strict";

  /* ---- Barras del arsenal ---- */
  const meters = Array.prototype.slice.call(document.querySelectorAll(".meter i"));
  const arsenal = document.getElementById("arsenal");

  if (meters.length && arsenal) {
    const targets = meters.map((i) => Number(i.parentElement.parentElement.dataset.meter) / 100);

    if (CFG.reducedMotion()) {
      meters.forEach((el, idx) => { el.style.transform = "scaleX(" + targets[idx] + ")"; });
    } else {
      CLOCK.each(() => {
        const r = arsenal.getBoundingClientRect();
        const vh = window.innerHeight;
        const denom = vh + r.height;
        if (denom <= 0) return;
        let p = (vh - r.top) / denom;
        p = p < 0 ? 0 : p > 1 ? 1 : p;
        for (let idx = 0; idx < meters.length; idx++) {
          /* la barra llega a plena carga mientras el panel se enfoca */
          const c = p < 0.55 ? p / 0.55 : 1;
          meters[idx].style.transform = "scaleX(" + (c * targets[idx]).toFixed(3) + ")";
        }
      });
    }
  }

  /* ---- Count-up de la ficha ---- */
  const counters = document.querySelectorAll("[data-count]");
  if (counters.length) {
    const dur = CFG.reducedMotion() ? 0 : 800;
    const animate = (el) => {
      const target = Number(el.dataset.count);
      if (dur === 0) {
        el.textContent = target;
        return;
      }
      const t0 = performance.now();
      const easeOut = (t) => 1 - Math.pow(1 - t, 3);
      const stepFn = (now) => {
        const t = UTIL.clamp01((now - t0) / dur);
        el.textContent = Math.round(target * easeOut(t));
        if (t < 1) requestAnimationFrame(stepFn);
      };
      requestAnimationFrame(stepFn);
    };

    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          for (const en of entries) {
            if (en.isIntersecting) {
              animate(en.target);
              io.unobserve(en.target);
            }
          }
        },
        { threshold: 0.6 }
      );
      counters.forEach((el) => io.observe(el));
    } else {
      counters.forEach(animate);
    }
  }
})();