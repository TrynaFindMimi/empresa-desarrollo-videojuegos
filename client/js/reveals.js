/* ============================================================================
   REVEALS — dos observadores de enmarcado:
   1. Atención: [data-reveal] recibe .is-in al entrar en el cono de lectura.
   2. Focal spotlight: las secciones fuera de la banda central quedan atenuadas
      (data-dim). El CSS degrada esto a todo-luz bajo reduced-motion.
   ========================================================================== */
(function () {
  "use strict";

  /* ---- Revelaciones (entrada única) ---- */
  const revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && revealEls.length) {
    const rev = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (en.isIntersecting) {
            en.target.classList.add("is-in");
            rev.unobserve(en.target);
          }
        }
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => rev.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-in"));
  }

  /* ---- Spotlight por banda central ---- */
  const scenes = document.querySelectorAll("[data-scene]");
  if ("IntersectionObserver" in window && scenes.length) {
    const view = (en) => {
      en.forEach((entry) => {
        entry.target.setAttribute("data-dim", String(!entry.isIntersecting));
      });
    };
    const spot = new IntersectionObserver(view, {
      rootMargin: "-20% 0px -20% 0px",
      threshold: 0
    });
    scenes.forEach((el) => spot.observe(el));
  }
})();