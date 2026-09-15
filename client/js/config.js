/* ============================================================================
   CONFIG — fuentes de verdad del sistema.
   • Escenas en orden de DOM, con la formación, el pan de cámara (focusX) y la
     energía que le tocan a cada tramo del scroll (SCENES del sistema SHELEG).
   • Capacidades del dispositivo: reduced-motion y puntero grueso.
   Sin esta configuración no arranca nada; es el storyboard en datos.
   ========================================================================== */
(function (global) {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const coarsePointer = window.matchMedia("(pointer: coarse)");

  /* Pequeñas utilidades numéricas compartidas por todo el motor. */
  global.UTIL = {
    clamp01: (v) => (v < 0 ? 0 : v > 1 ? 1 : v),
    clamp: (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v),
    lerp: (a, b, t) => a + (b - a) * t,
    smoothstep: (t) => t * t * (3 - 2 * t),
    /* RNG con semilla: formaciones idénticas en cada sesión. */
    mulberry32(seed) {
      let a = seed >>> 0;
      return function () {
        a |= 0;
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    }
  };

  global.CFG = {
    reducedMotion: () => reducedMotion.matches,
    coarse: () => coarsePointer.matches,

    /* Una formación por escena. La clave importa sólo para legibilidad:
       el motor resuelve por índice, siguiendo el orden del DOM. */
    scenes: [
      { key: "top",       formation: "frame",        focusX: 0,   energy: 0.5 },
      { key: "studio",    formation: "orbit",        focusX: 0.35,energy: 0.55 },
      { key: "vision",    formation: "constellation",focusX: -0.3,energy: 0.6 },
      { key: "arsenal",   formation: "lattice",      focusX: 0,   energy: 0.55 },
      { key: "objectives",formation: "curve",        focusX: 0.3, energy: 0.65 },
      { key: "join",      formation: "leaf",         focusX: 0,   energy: 1 }
    ],

    /* Geometría del campo (igual estructura que la referencia: rejilla × capas). */
    field: {
      cols: 22,
      rows: 11,
      depth: 3,          // 22 × 11 × 3 = 726 puntos
      dprCap: 1.75
    },

    /* Física del morph (medidas de SHELEG; arcAmp es el único a calibrar). */
    motion: {
      hold: 0.82,        // 82% del tramo la formación se mantiene quieta
      chase: 0.028,      // factor de persecución de la forma
      cap: 0.04,         // tope de delta por fotograma (desplazamientos suaves)
      spread: 0.5,       // remolino por fase
      arcAmp: 0.16       // amplitud del arco perpendicular en el morph
    }
  };
})(window);