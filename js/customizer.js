/* MONO customizer — controls → CSS custom properties on the preview pane,
   plus a regenerated take-home snippet. Vanilla JS. */
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

  var STEPS = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7];

  var controls = {
    font: document.getElementById("ctl-font"),
    base: document.getElementById("ctl-base"),
    ratio: document.getElementById("ctl-ratio"),
    weight: document.getElementById("ctl-weight"),
    tracking: document.getElementById("ctl-tracking"),
    leading: document.getElementById("ctl-leading"),
    invert: document.getElementById("ctl-invert"),
    border: document.getElementById("ctl-border"),
  };
  var outputs = {
    base: document.getElementById("ctl-base-out"),
    tracking: document.getElementById("ctl-tracking-out"),
    leading: document.getElementById("ctl-leading-out"),
    border: document.getElementById("ctl-border-out"),
  };
  var preview = document.getElementById("customizer-preview");
  var snippet = document.getElementById("customizer-output");
  var form = document.getElementById("customizer-form");

  function stepRem(base, ratio, n) {
    /* base is px; express steps in rem against the 16px root */
    var rem = (base * Math.pow(ratio, n)) / 16;
    return Math.round(rem * 1000) / 1000 + "rem";
  }

  /* Only offer weights the chosen font actually has. */
  function filterWeights(fontName) {
    var available = FONTS[fontName].weights;
    var current = parseInt(controls.weight.value, 10);
    Array.prototype.forEach.call(controls.weight.options, function (opt) {
      opt.disabled = available.indexOf(parseInt(opt.value, 10)) === -1;
    });
    if (available.indexOf(current) === -1) {
      /* fall back to the heaviest available weight */
      controls.weight.value = String(available[available.length - 1]);
    }
  }

  function readState() {
    return {
      font: controls.font.value,
      base: parseFloat(controls.base.value),
      ratio: parseFloat(controls.ratio.value),
      weight: parseInt(controls.weight.value, 10),
      tracking: parseFloat(controls.tracking.value),
      leading: parseFloat(controls.leading.value),
      invert: controls.invert.checked,
      border: parseInt(controls.border.value, 10),
    };
  }

  function buildVars(s) {
    var vars = {
      "--font-mono": FONTS[s.font].stack,
      "--leading": String(s.leading),
      "--tracking": s.tracking + "em",
      "--border-w": s.border + "px",
      "--heading-weight": String(s.weight),
      "--paper": s.invert ? "#0a0a0a" : "#ffffff",
      "--ink": s.invert ? "#fafafa" : "#0a0a0a",
    };
    STEPS.forEach(function (n) {
      vars["--step-" + (n < 0 ? "-" + Math.abs(n) : n)] = stepRem(
        s.base,
        s.ratio,
        n
      );
    });
    return vars;
  }

  function render() {
    var s = readState();
    filterWeights(s.font);
    s.weight = parseInt(controls.weight.value, 10);

    var vars = buildVars(s);
    Object.keys(vars).forEach(function (k) {
      preview.style.setProperty(k, vars[k]);
    });

    outputs.base.textContent = s.base + "px";
    outputs.tracking.textContent = s.tracking + "em";
    outputs.leading.textContent = String(s.leading);
    outputs.border.textContent = s.border + "px";

    renderSnippet(s, vars);
  }

  function renderSnippet(s, vars) {
    var lines = [];
    lines.push("<!-- 1. Load your typeface -->");
    lines.push('<link href="' + FONTS[s.font].gfont + '" rel="stylesheet" />');
    lines.push("");
    lines.push("/* 2. MONO tokens — drop into your stylesheet */");
    lines.push(":root {");
    Object.keys(vars).forEach(function (k) {
      if (k === "--heading-weight") return;
      var v = vars[k];
      lines.push("  " + k + ": " + v + ";");
    });
    lines.push("  --leading-tight: 1.1;");
    lines.push("  --tracking-wide: 0.12em;");
    lines.push("  --measure: 65ch;");
    lines.push("}");
    lines.push("h1, h2, h3, h4 { font-weight: " + s.weight + "; }");
    lines.push("");
    lines.push("// 3. Tailwind CDN config — set after the CDN script tag");
    lines.push("tailwind.config = { theme: { extend: {");
    lines.push("  colors: { ink: 'var(--ink)', paper: 'var(--paper)' },");
    lines.push("  fontFamily: { mono: ['var(--font-mono)'] },");
    lines.push("  fontSize: {");
    STEPS.forEach(function (n) {
      var key = "step-" + (n < 0 ? "-" + Math.abs(n) : n);
      lines.push("    '" + key + "': 'var(--" + key + ")',");
    });
    lines.push("  },");
    lines.push("} } };");
    snippet.textContent = lines.join("\n");
  }

  form.addEventListener("input", render);
  form.addEventListener("reset", function () {
    /* let the form reset its values first, then re-render */
    setTimeout(render, 0);
  });

  render();
})();
