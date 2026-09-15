/* ============================================================================
   CHROME — instrumentos HUD del sistema: rail de progreso, badge de acto,
   navegación (toggle móvil + scrollspy).
   Sólo escribe DOM en cambios gruesos; en lo caliente lee el reloj.
   ========================================================================== */
(function () {
  "use strict";

  /* ---- Rail (derecha): fill = progreso global por fotograma ---- */
  const railFill = document.querySelector(".rail-fill");
  if (railFill) {
    CLOCK.each((s) => {
      railFill.style.transform = "scaleY(" + s.global.toFixed(4) + ")";
    });
  }

  /* ---- Badge de acto + scrollspy ---- */
  const actIndex = document.getElementById("actIndex");
  const actLabel = document.getElementById("actLabel");
  const navLinks = Array.prototype.slice.call(
    document.querySelectorAll(".menu-list a[data-nav]")
  );
  const NAV_OF_ACT = { 1: 0, 2: 1, 3: 2, 4: 3 }; // escena → índice en .menu-list

  function labelFor(act) {
    const scene = CFG.scenes[Math.min(act, CFG.scenes.length - 1)];
    return { num: String(act).padStart(2, "0"), label: scene.label || "" };
  }

  if (actIndex && actLabel) {
    const paint = (act) => {
      const l = labelFor(act);
      actIndex.textContent = l.num;
      actLabel.textContent = l.label;
    };
    CLOCK.subscribeAct((act) => {
      paint(act);
      const linkIdx = NAV_OF_ACT[act];
      navLinks.forEach((a, i) => {
        a.classList.toggle("is-active", i === linkIdx);
      });
    });
    paint(0);
  }

  /* ---- Menú móvil ---- */
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("menu");
  if (toggle && menu) {
    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
      menu.classList.toggle("is-open", open);
    };
    toggle.addEventListener("click", () => {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    menu.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => setOpen(false))
    );
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setOpen(false);
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) setOpen(false);
    });
  }
})();