/* ============================================================================
   CURSOR — retícula que acompaña al puntero (sólo puntero fino y con
   movimiento permitido). Decorativo: se degrada por completo en táctil y en
   prefers-reduced-motion.
   ========================================================================== */
(function () {
  "use strict";

  if (CFG.reducedMotion() || CFG.coarse()) return;

  const el = document.getElementById("cursor");
  if (!el) return;

  document.documentElement.classList.add("cursor-on");
  el.style.display = "block";

  let tx = window.innerWidth / 2;
  let ty = window.innerHeight / 2;
  let px = tx;
  let py = ty;
  let visible = false;

  window.addEventListener("pointermove", (e) => {
    tx = e.clientX;
    ty = e.clientY;
    if (!visible) {
      visible = true;
      px = tx;
      py = ty;
      el.style.opacity = "1";
    }
  }, { passive: true });

  window.addEventListener("pointerdown", () => el.classList.add("is-pressed"));
  window.addEventListener("pointerup", () => el.classList.remove("is-pressed"));
  document.addEventListener("mouseleave", () => { visible = false; el.style.opacity = "0"; });
  document.addEventListener("mouseenter", () => { visible = true; el.style.opacity = "1"; });

  (function follow() {
    px += (tx - px) * 0.22;
    py += (ty - py) * 0.22;
    el.style.transform = "translate(" + px + "px," + py + "px)";
    requestAnimationFrame(follow);
  })();
})();