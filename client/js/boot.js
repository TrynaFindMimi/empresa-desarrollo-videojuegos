/* ============================================================================
   BOOT — arranque del sistema: enciende el reloj único y ata cabos sueltos
   (enlaces de redes, etc.). Todo lo demás se suscribió solo.
   ========================================================================== */
(function () {
  "use strict";

  /* Enlaces sociales: sin destino real por ahora, no se va de la página. */
  document.querySelectorAll("[data-social]").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      a.classList.add("is-in"); /* sin saltos raros */
    });
  });

  /* Al cargar la página entera, el reloj re-mide (fuentes, layout tardío). */
  window.addEventListener("load", () => CLOCK.measure(), { once: true });

  CLOCK.start();
})();