/* MONO — Tailwind is precompiled (no CDN at runtime). Every color and size
   resolves to a CSS custom property from css/mono.css, so the theme engine
   and the tune panel drive everything live.
   Note: slash-opacity utilities (bg-ink/50) do NOT work with var() colors. */
module.exports = {
  content: ["./*.html", "./examples/*.html", "./js/*.js"],
  theme: {
    extend: {
      colors: {
        ink: "var(--ink)",
        paper: "var(--paper)",
        muted: "var(--ink-muted)",
        faint: "var(--ink-faint)",
        divider: "var(--divider)",
        edge: "var(--edge)",
        surface: {
          1: "var(--surface-1)",
          2: "var(--surface-2)",
        },
        overlay: "var(--overlay-bg)",
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
        "step-display": ["var(--step-display)", "var(--leading-tight)"],
      },
      fontWeight: {
        bold: "var(--weight-bold)",
      },
      borderWidth: {
        DEFAULT: "var(--divider-w)",
        hairline: "var(--border-w-hairline)",
        2: "var(--border-w)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        DEFAULT: "var(--radius)",
        lg: "var(--radius-lg)",
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
