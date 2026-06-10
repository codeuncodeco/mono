/* MONO — global theme engine.
   Loads synchronously in <head>, before the stylesheets, so saved
   preferences (theme, typeface, scale, radius, structure, icon set)
   apply before first paint on every page. The site is the preview.

   Persistence: localStorage["mono-prefs"] (JSON). The legacy
   "mono-theme" key is read once and kept in sync for old links. */
(function () {
  "use strict";

  var FONTS = {
    "Space Mono": {
      stack: "'Space Mono', ui-monospace, monospace",
      weights: [400, 700],
      gfont:
        "https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap",
    },
    "JetBrains Mono": {
      stack: "'JetBrains Mono', ui-monospace, monospace",
      weights: [300, 400, 500, 700, 800],
      gfont:
        "https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap",
    },
    "IBM Plex Mono": {
      stack: "'IBM Plex Mono', ui-monospace, monospace",
      weights: [400, 700],
      gfont:
        "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,700;1,400&display=swap",
    },
    "Fragment Mono": {
      stack: "'Fragment Mono', ui-monospace, monospace",
      weights: [400],
      gfont:
        "https://fonts.googleapis.com/css2?family=Fragment+Mono:ital@0;1&display=swap",
    },
    "Courier Prime": {
      stack: "'Courier Prime', ui-monospace, monospace",
      weights: [400, 700],
      gfont:
        "https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400;1,700&display=swap",
    },
    "Spline Sans Mono": {
      stack: "'Spline Sans Mono', ui-monospace, monospace",
      weights: [300, 400, 500, 700],
      gfont:
        "https://fonts.googleapis.com/css2?family=Spline+Sans+Mono:ital,wght@0,300..700;1,300..700&display=swap",
    },
  };

  /* Four icon libraries that suit a monochrome system. Each renders a
     canonical name (see js/mono-icons.js) through its own class scheme. */
  var ICON_SETS = {
    lucide: {
      label: "Lucide",
      css: "https://cdn.jsdelivr.net/npm/lucide-static@0.563.0/font/lucide.css",
      prefix: "icon-",
      base: "",
    },
    tabler: {
      label: "Tabler",
      css: "https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.31.0/dist/tabler-icons.min.css",
      prefix: "ti-",
      base: "ti",
    },
    phosphor: {
      label: "Phosphor",
      css: "https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.1/src/regular/style.css",
      prefix: "ph-",
      base: "ph",
    },
    material: {
      label: "Material",
      css: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block",
      ligature: true,
      base: "material-symbols-outlined",
    },
  };

  var DEFAULTS = {
    theme: "light", /* light | dark | system */
    font: "Space Mono",
    base: 16,
    ratio: 1.25,
    weight: 700,
    tracking: 0,
    leading: 1.6,
    radius: 0,
    structure: "soft", /* outlined | soft | minimal */
    icons: "lucide",
  };

  var STEPS = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7];

  function readPrefs() {
    var prefs = {};
    try {
      prefs = JSON.parse(localStorage.getItem("mono-prefs") || "{}") || {};
      if (!prefs.theme) {
        /* migrate the pre-v2 key */
        var legacy = localStorage.getItem("mono-theme");
        if (legacy) prefs.theme = legacy;
      }
    } catch (e) {
      /* storage unavailable (file://, private mode) — run on defaults */
    }
    var merged = {};
    for (var k in DEFAULTS) {
      merged[k] = prefs[k] !== undefined ? prefs[k] : DEFAULTS[k];
    }
    if (!FONTS[merged.font]) merged.font = DEFAULTS.font;
    if (!ICON_SETS[merged.icons]) merged.icons = DEFAULTS.icons;
    return merged;
  }

  var prefs = readPrefs();
  var systemDark = null;
  try {
    systemDark = window.matchMedia("(prefers-color-scheme: dark)");
  } catch (e) {
    /* no matchMedia — "system" falls back to light */
  }

  function stepRem(base, ratio, n) {
    /* base is px; express steps in rem against the 16px root */
    var rem = (base * Math.pow(ratio, n)) / 16;
    return Math.round(rem * 1000) / 1000 + "rem";
  }

  function stepVars(p) {
    var vars = {};
    STEPS.forEach(function (n) {
      vars["--step-" + (n < 0 ? "-" + Math.abs(n) : n)] = stepRem(
        p.base,
        p.ratio,
        n
      );
    });
    return vars;
  }

  function resolvedTheme() {
    if (prefs.theme === "system") {
      return systemDark && systemDark.matches ? "dark" : "light";
    }
    return prefs.theme;
  }

  function ensureLink(id, href) {
    var link = document.getElementById(id);
    if (!link) {
      link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      (document.head || document.documentElement).appendChild(link);
    }
    if (link.getAttribute("href") !== href) link.setAttribute("href", href);
  }

  function apply() {
    var root = document.documentElement;
    root.dataset.theme = resolvedTheme();
    root.dataset.structure = prefs.structure;

    var vars = stepVars(prefs);
    vars["--font-mono"] = FONTS[prefs.font].stack;
    vars["--leading"] = String(prefs.leading);
    vars["--tracking"] = prefs.tracking + "em";
    vars["--weight-bold"] = String(prefs.weight);
    vars["--radius"] = prefs.radius + "px";
    Object.keys(vars).forEach(function (k) {
      root.style.setProperty(k, vars[k]);
    });

    /* Typeface: pages ship Space Mono; anything else loads on demand. */
    if (prefs.font !== "Space Mono") {
      ensureLink("mono-font-css", FONTS[prefs.font].gfont);
    }

    /* Icon library stylesheet for the active set. */
    ensureLink("mono-icon-css", ICON_SETS[prefs.icons].css);
  }

  function save() {
    try {
      localStorage.setItem("mono-prefs", JSON.stringify(prefs));
      localStorage.setItem("mono-theme", resolvedTheme());
    } catch (e) {
      /* storage unavailable — settings still apply for this page */
    }
  }

  var listeners = [];

  function set(patch) {
    Object.keys(patch || {}).forEach(function (k) {
      if (k in DEFAULTS) prefs[k] = patch[k];
    });
    apply();
    save();
    listeners.forEach(function (fn) {
      fn(get());
    });
  }

  function get() {
    var copy = {};
    for (var k in prefs) copy[k] = prefs[k];
    copy.resolvedTheme = resolvedTheme();
    return copy;
  }

  function reset() {
    var fresh = {};
    for (var k in DEFAULTS) fresh[k] = DEFAULTS[k];
    prefs = fresh;
    apply();
    save();
    listeners.forEach(function (fn) {
      fn(get());
    });
  }

  /* Take-home snippet: a fonts link + the resolved tokens. Pure CSS —
     paste into any project, MONO or not. */
  function cssSnippet() {
    var lines = [];
    lines.push("<!-- 1. Typeface -->");
    lines.push('<link href="' + FONTS[prefs.font].gfont + '" rel="stylesheet" />');
    if (!ICON_SETS[prefs.icons].ligature || prefs.icons === "material") {
      lines.push("");
      lines.push("<!-- 2. Icons — " + ICON_SETS[prefs.icons].label + " -->");
      lines.push('<link href="' + ICON_SETS[prefs.icons].css + '" rel="stylesheet" />');
    }
    lines.push("");
    lines.push("/* 3. MONO tokens — drop into your stylesheet */");
    lines.push(":root {");
    lines.push("  --font-mono: " + FONTS[prefs.font].stack + ";");
    var vars = stepVars(prefs);
    Object.keys(vars).forEach(function (k) {
      lines.push("  " + k + ": " + vars[k] + ";");
    });
    lines.push("  --leading: " + prefs.leading + ";");
    lines.push("  --leading-tight: 1.1;");
    lines.push("  --tracking: " + prefs.tracking + "em;");
    lines.push("  --tracking-wide: 0.12em;");
    lines.push("  --weight-bold: " + prefs.weight + ";");
    lines.push("  --radius: " + prefs.radius + "px;");
    lines.push("  --measure: 65ch;");
    lines.push("}");
    lines.push('/* structure + theme ride on <html>: */');
    lines.push(
      '/* <html data-theme="' +
        resolvedTheme() +
        '" data-structure="' +
        prefs.structure +
        '"> */'
    );
    return lines.join("\n");
  }

  function onChange(fn) {
    listeners.push(fn);
  }

  if (systemDark && systemDark.addEventListener) {
    systemDark.addEventListener("change", function () {
      if (prefs.theme === "system") {
        apply();
        listeners.forEach(function (fn) {
          fn(get());
        });
      }
    });
  }

  window.monoTheme = {
    FONTS: FONTS,
    ICON_SETS: ICON_SETS,
    DEFAULTS: DEFAULTS,
    get: get,
    set: set,
    reset: reset,
    apply: apply,
    onChange: onChange,
    cssSnippet: cssSnippet,
  };

  apply();
})();
