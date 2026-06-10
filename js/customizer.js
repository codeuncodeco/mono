/* MONO — the TUNE layer. A global, persistent customizer injected on every
   page: slide-over on desktop, bottom sheet on phones. Every control writes
   straight to the live tokens via js/mono-theme.js and persists, so the
   whole site — every page, every visit — is the preview. */
(function () {
  "use strict";

  if (!window.monoTheme) return;
  var theme = window.monoTheme;

  var RATIOS = [
    ["1.125", "1.125 — major second"],
    ["1.2", "1.200 — minor third"],
    ["1.25", "1.250 — major third"],
    ["1.333", "1.333 — perfect fourth"],
    ["1.414", "1.414 — augmented fourth"],
    ["1.5", "1.500 — perfect fifth"],
    ["1.618", "1.618 — golden ratio"],
  ];

  var WEIGHTS = [
    ["300", "300 — light"],
    ["400", "400 — regular"],
    ["500", "500 — medium"],
    ["700", "700 — bold"],
    ["800", "800 — extra bold"],
  ];

  /* ----- markup ----------------------------------------------------------- */
  var fab = document.createElement("button");
  fab.type = "button";
  fab.className = "tune-fab";
  fab.setAttribute("aria-haspopup", "dialog");
  fab.setAttribute("aria-controls", "mono-tune");
  fab.innerHTML =
    '<i class="icon" data-icon="tune" aria-hidden="true"></i><span>Tune</span>';
  document.body.appendChild(fab);

  var panel = document.createElement("dialog");
  panel.className = "tune";
  panel.id = "mono-tune";
  panel.setAttribute("aria-label", "Tune MONO");

  function segHTML(id, options) {
    return (
      '<div class="seg" id="' + id + '">' +
      options
        .map(function (o) {
          return (
            '<button type="button" data-value="' + o[0] + '">' + o[1] + "</button>"
          );
        })
        .join("") +
      "</div>"
    );
  }

  function optionsHTML(options) {
    return options
      .map(function (o) {
        return '<option value="' + o[0] + '">' + o[1] + "</option>";
      })
      .join("");
  }

  panel.innerHTML =
    '<div class="tune-head">' +
    '<p class="text-step--1 font-bold tracking-wide">TUNE — yours on every page</p>' +
    '<button type="button" class="btn-icon" data-tune-close aria-label="Close tune panel">' +
    '<i class="icon" data-icon="close" aria-hidden="true"></i></button>' +
    "</div>" +
    '<div class="tune-body">' +
    /* theme + structure */
    '<div class="tune-row"><p class="tune-label" id="tune-theme-label">Theme</p>' +
    segHTML("tune-theme", [["light", "Light"], ["dark", "Dark"], ["system", "Auto"]]) +
    "</div>" +
    '<div class="tune-row"><p class="tune-label">Structure</p>' +
    segHTML("tune-structure", [["outlined", "Lines"], ["soft", "Soft"], ["minimal", "Min"]]) +
    '<p class="hint text-step--2">Lines boxes everything; soft builds from shades; min is whitespace only.</p>' +
    "</div>" +
    /* radius */
    '<div class="tune-row"><p class="tune-label"><span>Corners</span><output id="tune-radius-out"></output></p>' +
    segHTML("tune-radius-preset", [["0", "Sharp"], ["4", "Soft"], ["10", "Round"]]) +
    '<input type="range" class="range" id="tune-radius" min="0" max="16" step="1" aria-label="Corner radius in pixels" />' +
    "</div>" +
    /* type */
    '<div class="tune-row"><label class="tune-label" for="tune-font">Typeface</label>' +
    '<div class="select"><select id="tune-font">' +
    Object.keys(theme.FONTS)
      .map(function (f) {
        return "<option>" + f + "</option>";
      })
      .join("") +
    "</select></div></div>" +
    '<div class="tune-row"><label class="tune-label" for="tune-base"><span>Base size</span><output id="tune-base-out"></output></label>' +
    '<input type="range" class="range" id="tune-base" min="14" max="20" step="1" /></div>' +
    '<div class="tune-row"><label class="tune-label" for="tune-ratio">Scale ratio</label>' +
    '<div class="select"><select id="tune-ratio">' + optionsHTML(RATIOS) + "</select></div></div>" +
    '<div class="tune-row"><label class="tune-label" for="tune-weight">Bold weight</label>' +
    '<div class="select"><select id="tune-weight">' + optionsHTML(WEIGHTS) + "</select></div>" +
    '<p class="hint text-step--2">Weights the chosen face doesn’t ship are disabled.</p></div>' +
    '<div class="tune-row"><label class="tune-label" for="tune-tracking"><span>Tracking</span><output id="tune-tracking-out"></output></label>' +
    '<input type="range" class="range" id="tune-tracking" min="-0.05" max="0.15" step="0.01" /></div>' +
    '<div class="tune-row"><label class="tune-label" for="tune-leading"><span>Line height</span><output id="tune-leading-out"></output></label>' +
    '<input type="range" class="range" id="tune-leading" min="1.2" max="2" step="0.05" /></div>' +
    /* icons */
    '<div class="tune-row"><p class="tune-label">Icon set</p>' +
    segHTML("tune-icons", Object.keys(theme.ICON_SETS).map(function (k) {
      return [k, theme.ICON_SETS[k].label];
    })) +
    '<p class="text-step-1" id="tune-icon-strip" aria-hidden="true">' +
    ["home", "search", "settings", "bell", "user", "check"]
      .map(function (n) {
        return '<i class="icon" data-icon="' + n + '"></i> ';
      })
      .join("") +
    "</p></div>" +
    /* actions */
    '<div class="flex flex-wrap gap-3 pt-2">' +
    '<button type="button" class="btn btn-sm" id="tune-export">Copy CSS</button>' +
    '<button type="button" class="btn btn-secondary btn-sm" id="tune-reset">Reset</button>' +
    "</div>" +
    '<p class="hint text-step--2">Saved to this browser. Copy CSS takes the theme home as plain tokens.</p>' +
    "</div>";

  document.body.appendChild(panel);
  if (window.monoIcons) window.monoIcons.apply(panel);

  /* ----- open / close (non-modal: the page stays live) -------------------- */
  function openPanel() {
    if (!panel.open) panel.show();
    fab.setAttribute("aria-expanded", "true");
  }

  function closePanel() {
    if (panel.open) panel.close();
    fab.setAttribute("aria-expanded", "false");
  }

  fab.addEventListener("click", function () {
    panel.open ? closePanel() : openPanel();
  });

  document.querySelectorAll("[data-mono-tune-open]").forEach(function (btn) {
    btn.addEventListener("click", openPanel);
  });

  panel.querySelector("[data-tune-close]").addEventListener("click", closePanel);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && panel.open) closePanel();
  });

  /* ----- controls <-> prefs ------------------------------------------------ */
  var ctl = {
    font: panel.querySelector("#tune-font"),
    base: panel.querySelector("#tune-base"),
    ratio: panel.querySelector("#tune-ratio"),
    weight: panel.querySelector("#tune-weight"),
    tracking: panel.querySelector("#tune-tracking"),
    leading: panel.querySelector("#tune-leading"),
    radius: panel.querySelector("#tune-radius"),
  };
  var out = {
    base: panel.querySelector("#tune-base-out"),
    tracking: panel.querySelector("#tune-tracking-out"),
    leading: panel.querySelector("#tune-leading-out"),
    radius: panel.querySelector("#tune-radius-out"),
  };

  function wireSeg(id, key) {
    var seg = panel.querySelector("#" + id);
    seg.querySelectorAll("button").forEach(function (b) {
      b.addEventListener("click", function () {
        var patch = {};
        var v = b.getAttribute("data-value");
        patch[key] = key === "radius" ? parseInt(v, 10) : v;
        theme.set(patch);
      });
    });
  }

  wireSeg("tune-theme", "theme");
  wireSeg("tune-structure", "structure");
  wireSeg("tune-radius-preset", "radius");
  wireSeg("tune-icons", "icons");

  /* Only offer weights the chosen font actually has. */
  function filterWeights(fontName) {
    var available = theme.FONTS[fontName].weights;
    Array.prototype.forEach.call(ctl.weight.options, function (opt) {
      opt.disabled = available.indexOf(parseInt(opt.value, 10)) === -1;
    });
  }

  ctl.font.addEventListener("input", function () {
    var font = ctl.font.value;
    filterWeights(font);
    var patch = { font: font };
    var available = theme.FONTS[font].weights;
    if (available.indexOf(theme.get().weight) === -1) {
      patch.weight = available[available.length - 1];
    }
    theme.set(patch);
  });
  ctl.base.addEventListener("input", function () {
    theme.set({ base: parseFloat(ctl.base.value) });
  });
  ctl.ratio.addEventListener("input", function () {
    theme.set({ ratio: parseFloat(ctl.ratio.value) });
  });
  ctl.weight.addEventListener("input", function () {
    theme.set({ weight: parseInt(ctl.weight.value, 10) });
  });
  ctl.tracking.addEventListener("input", function () {
    theme.set({ tracking: parseFloat(ctl.tracking.value) });
  });
  ctl.leading.addEventListener("input", function () {
    theme.set({ leading: parseFloat(ctl.leading.value) });
  });
  ctl.radius.addEventListener("input", function () {
    theme.set({ radius: parseInt(ctl.radius.value, 10) });
  });

  panel.querySelector("#tune-export").addEventListener("click", function () {
    var copy = window.mono ? window.mono.copyText : null;
    var snippet = theme.cssSnippet();
    if (copy) {
      copy(snippet).then(function () {
        if (window.mono) window.mono.toast("Theme copied as CSS tokens.");
      });
    }
  });

  panel.querySelector("#tune-reset").addEventListener("click", function () {
    theme.reset();
    if (window.mono) window.mono.toast("Back to stock MONO.");
  });

  /* ----- reflect state ----------------------------------------------------- */
  function syncSegs(prefs) {
    [
      ["tune-theme", String(prefs.theme)],
      ["tune-structure", String(prefs.structure)],
      ["tune-radius-preset", String(prefs.radius)],
      ["tune-icons", String(prefs.icons)],
    ].forEach(function (pair) {
      panel
        .querySelectorAll("#" + pair[0] + " button")
        .forEach(function (b) {
          b.setAttribute(
            "aria-pressed",
            b.getAttribute("data-value") === pair[1] ? "true" : "false"
          );
        });
    });
  }

  function sync(prefs) {
    ctl.font.value = prefs.font;
    ctl.base.value = prefs.base;
    ctl.ratio.value = String(prefs.ratio);
    ctl.weight.value = String(prefs.weight);
    ctl.tracking.value = prefs.tracking;
    ctl.leading.value = prefs.leading;
    ctl.radius.value = prefs.radius;
    out.base.textContent = prefs.base + "px";
    out.tracking.textContent = prefs.tracking + "em";
    out.leading.textContent = String(prefs.leading);
    out.radius.textContent = prefs.radius + "px";
    filterWeights(prefs.font);
    syncSegs(prefs);
  }

  sync(theme.get());
  theme.onChange(sync);
})();
