/* MONO — shared Tailwind CDN config + theme restore.
   Must load synchronously, immediately after the Tailwind CDN script. */

/* Restore inversion before first paint to avoid a theme flash. */
(function () {
  var theme = "light";
  try {
    theme = localStorage.getItem("mono-theme") || "light";
  } catch (e) {
    /* storage unavailable (file://, private mode) — default to light */
  }
  document.documentElement.dataset.theme = theme;
})();

/* Every Tailwind color/size below resolves to a CSS custom property from
   css/mono.css, so the INVERT toggle and the customizer drive everything.
   Note: slash-opacity utilities (bg-ink/50) do NOT work with var() colors. */
tailwind.config = {
  theme: {
    extend: {
      colors: {
        ink: "var(--ink)",
        paper: "var(--paper)",
        gray: {
          100: "var(--gray-100)",
          200: "var(--gray-200)",
          300: "var(--gray-300)",
          400: "var(--gray-400)",
          500: "var(--gray-500)",
          600: "var(--gray-600)",
          700: "var(--gray-700)",
          800: "var(--gray-800)",
          900: "var(--gray-900)",
        },
      },
      fontFamily: {
        mono: ["var(--font-mono)"],
      },
      fontSize: {
        "step--2": ["var(--step--2)", "var(--leading)"],
        "step--1": ["var(--step--1)", "var(--leading)"],
        "step-0": ["var(--step-0)", "var(--leading)"],
        "step-1": ["var(--step-1)", "var(--leading)"],
        "step-2": ["var(--step-2)", "var(--leading-tight)"],
        "step-3": ["var(--step-3)", "var(--leading-tight)"],
        "step-4": ["var(--step-4)", "var(--leading-tight)"],
        "step-5": ["var(--step-5)", "var(--leading-tight)"],
        "step-6": ["var(--step-6)", "var(--leading-tight)"],
        "step-7": ["var(--step-7)", "1"],
      },
      borderWidth: {
        DEFAULT: "var(--border-w)",
        hairline: "var(--border-w-hairline)",
      },
      letterSpacing: {
        wide: "var(--tracking-wide)",
      },
      maxWidth: {
        measure: "var(--measure)",
      },
    },
  },
};
