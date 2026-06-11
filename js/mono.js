/* MONO — shared behaviors. Vanilla JS, no dependencies.
   Wires up: invert toggle, the phone tab bar + mega sheet, tabs, modals,
   dropdowns, tooltips-on-focus, toasts, copy buttons, range outputs. */
(function () {
  "use strict";

  /* ----- INVERT (ink/paper swap, persisted via monoTheme) ---------------- */
  function syncInvertButtons() {
    var dark = document.documentElement.dataset.theme === "dark";
    document.querySelectorAll("[data-mono-invert]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", dark ? "true" : "false");
    });
  }

  document.querySelectorAll("[data-mono-invert]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var next =
        document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      if (window.monoTheme) {
        window.monoTheme.set({ theme: next });
      } else {
        document.documentElement.dataset.theme = next;
      }
      syncInvertButtons();
    });
  });
  syncInvertButtons();
  if (window.monoTheme) window.monoTheme.onChange(syncInvertButtons);

  /* ----- SITE TAB BAR + MEGA SHEET (phones) -------------------------------
     Injected on pages that declare data-mono-nav on <body>, so the eight
     site pages share one source of truth. Example pages ship their own
     static tab bars instead. ----------------------------------------------- */
  var PAGES = [
    { href: "index.html", icon: "home", title: "Home", short: "HOME", desc: "The thesis, the index, the system in one screen." },
    { href: "components.html", icon: "grid", title: "Components", short: "KIT", desc: "Buttons to toasts — accessible and copy-paste ready." },
    { href: "typography.html", icon: "type", title: "Typography", short: "TYPE", desc: "Six faces, one scale, and the quiet rules of text." },
    { href: "layout.html", icon: "layout", title: "Layout", desc: "The twelve-column grid as a spec sheet." },
    { href: "gallery.html", icon: "image", title: "Gallery", desc: "Typographic compositions built from the tokens." },
    { href: "customizer.html", icon: "tune", title: "Customizer", desc: "The tune layer, documented token by token." },
    { href: "examples.html", icon: "file", title: "Examples", desc: "Login, article, dashboard, pricing — real pages." },
    { href: "about.html", icon: "info", title: "About", desc: "The manifesto: why constraint is the point." },
  ];
  var TABBAR_ITEMS = ["index.html", "components.html", "typography.html"];

  function currentPage() {
    var path = location.pathname.split("/").pop() || "index.html";
    return path;
  }

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === "text") node.textContent = attrs[k];
      else node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) {
      node.appendChild(c);
    });
    return node;
  }

  function icon(name) {
    return el("i", { class: "icon", "data-icon": name, "aria-hidden": "true" });
  }

  function buildSiteNav() {
    var here = currentPage();

    /* Tab bar: three destinations + TUNE + MORE */
    var bar = el("nav", { class: "tabbar lg:hidden", "aria-label": "Primary" });
    TABBAR_ITEMS.forEach(function (href) {
      var page = PAGES.filter(function (p) { return p.href === href; })[0];
      var a = el("a", { class: "tabbar-item", href: page.href }, [
        icon(page.icon),
        el("span", { text: page.short || page.title.toUpperCase() }),
      ]);
      if (here === page.href) a.setAttribute("aria-current", "page");
      bar.appendChild(a);
    });
    var tuneBtn = el(
      "button",
      { class: "tabbar-item", type: "button", "data-mono-tune-open": "" },
      [icon("tune"), el("span", { text: "TUNE" })]
    );
    bar.appendChild(tuneBtn);
    var moreBtn = el(
      "button",
      {
        class: "tabbar-item",
        type: "button",
        "aria-expanded": "false",
        "data-mono-sheet-open": "mono-site-sheet",
      },
      [icon("more"), el("span", { text: "MORE" })]
    );
    if (here !== "" && TABBAR_ITEMS.indexOf(here) === -1) {
      moreBtn.setAttribute("aria-current", "true");
    }
    bar.appendChild(moreBtn);

    /* Mega sheet: every page with an icon and a one-liner, plus quick
       theme/structure toggles. */
    var sheet = el("dialog", {
      class: "sheet",
      id: "mono-site-sheet",
      "aria-label": "All pages and quick settings",
    });
    sheet.appendChild(el("div", { class: "sheet-handle", "aria-hidden": "true" }));

    var head = el("div", { class: "flex items-center justify-between mb-2" });
    head.appendChild(el("p", { class: "meta", text: "MONO — everywhere" }));
    var closeBtn = el(
      "button",
      { class: "btn-icon", type: "button", "data-mono-sheet-close": "", "aria-label": "Close menu" },
      [icon("close")]
    );
    head.appendChild(closeBtn);
    sheet.appendChild(head);

    var grid = el("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-1" });
    PAGES.forEach(function (page) {
      var link = el("a", { class: "sheet-link", href: page.href }, [
        icon(page.icon),
        el("span", {}, [
          el("span", { class: "sheet-link-title block", text: page.title.toUpperCase() }),
          el("span", { class: "sheet-link-desc block", text: page.desc }),
        ]),
      ]);
      if (here === page.href) link.setAttribute("aria-current", "page");
      grid.appendChild(link);
    });
    sheet.appendChild(grid);

    /* Quick toggles */
    var quick = el("div", { class: "mt-4 pt-4 grid grid-cols-2 gap-3", style: "border-top: 1px solid var(--divider)" });
    quick.appendChild(buildQuickSeg("Theme", "theme", [
      ["light", "LIGHT"],
      ["dark", "DARK"],
      ["system", "AUTO"],
    ]));
    quick.appendChild(buildQuickSeg("Structure", "structure", [
      ["outlined", "LINES"],
      ["soft", "SOFT"],
      ["minimal", "MIN"],
    ]));
    sheet.appendChild(quick);

    document.body.appendChild(bar);
    document.body.appendChild(sheet);
    document.body.classList.add("has-tabbar", "tabbar-tune");
    if (window.monoIcons) window.monoIcons.apply(document.body);
  }

  function buildQuickSeg(label, key, options) {
    var wrap = el("div", {});
    wrap.appendChild(el("p", { class: "tune-label mb-1", text: label }));
    var seg = el("div", { class: "seg", role: "group", "aria-label": label });
    options.forEach(function (opt) {
      var b = el("button", { type: "button", text: opt[1], "data-value": opt[0] });
      seg.appendChild(b);
      b.addEventListener("click", function () {
        if (window.monoTheme) {
          var patch = {};
          patch[key] = opt[0];
          window.monoTheme.set(patch);
        }
        syncSeg();
      });
    });
    function syncSeg() {
      if (!window.monoTheme) return;
      var val = window.monoTheme.get()[key];
      seg.querySelectorAll("button").forEach(function (b) {
        b.setAttribute("aria-pressed", b.getAttribute("data-value") === val ? "true" : "false");
      });
    }
    syncSeg();
    if (window.monoTheme) window.monoTheme.onChange(syncSeg);
    wrap.appendChild(seg);
    return wrap;
  }

  if (document.body.hasAttribute("data-mono-nav")) {
    buildSiteNav();
  }

  /* ----- SHEETS (bottom sheets via native <dialog>) ----------------------- */
  function wireSheets() {
    document.querySelectorAll("[data-mono-sheet-open]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var sheet = document.getElementById(
          btn.getAttribute("data-mono-sheet-open")
        );
        if (!sheet) return;
        sheet.showModal();
        btn.setAttribute("aria-expanded", "true");
        sheet.addEventListener(
          "close",
          function () {
            btn.setAttribute("aria-expanded", "false");
          },
          { once: true }
        );
      });
    });

    document.querySelectorAll("dialog.sheet").forEach(function (sheet) {
      sheet.addEventListener("click", function (e) {
        if (e.target === sheet) sheet.close();
      });
      sheet.querySelectorAll("[data-mono-sheet-close]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          sheet.close();
        });
      });
      /* navigating away should close it, so back-button users don't
         return to an open sheet */
      sheet.querySelectorAll("a[href]").forEach(function (a) {
        a.addEventListener("click", function () {
          sheet.close();
        });
      });
    });
  }
  wireSheets();

  /* ----- TABS (roving tabindex, arrow keys) ------------------------------- */
  document.querySelectorAll("[role='tablist']").forEach(function (tablist) {
    var tabs = Array.prototype.slice.call(
      tablist.querySelectorAll("[role='tab']")
    );

    function select(tab) {
      tabs.forEach(function (t) {
        var selected = t === tab;
        t.setAttribute("aria-selected", selected ? "true" : "false");
        t.tabIndex = selected ? 0 : -1;
        var panel = document.getElementById(t.getAttribute("aria-controls"));
        if (panel) panel.hidden = !selected;
      });
      tab.focus();
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () {
        select(tab);
      });
      tab.addEventListener("keydown", function (e) {
        var next = null;
        if (e.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
        if (e.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
        if (e.key === "Home") next = tabs[0];
        if (e.key === "End") next = tabs[tabs.length - 1];
        if (next) {
          e.preventDefault();
          select(next);
        }
      });
    });
  });

  /* ----- MODAL (native <dialog>) ------------------------------------------ */
  document.querySelectorAll("[data-mono-modal-open]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var dialog = document.getElementById(
        btn.getAttribute("data-mono-modal-open")
      );
      if (dialog) dialog.showModal();
    });
  });

  document.querySelectorAll("dialog:not(.sheet):not(.tune)").forEach(function (dialog) {
    /* click on the backdrop (the dialog element itself) closes it */
    dialog.addEventListener("click", function (e) {
      if (e.target === dialog) dialog.close();
    });
    dialog.querySelectorAll("[data-mono-modal-close]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        dialog.close();
      });
    });
  });

  /* ----- DROPDOWN ----------------------------------------------------------- */
  document.querySelectorAll("[data-mono-dropdown]").forEach(function (root) {
    var btn = root.querySelector("button[aria-expanded]");
    var panel = root.querySelector(".dropdown-menu");
    if (!btn || !panel) return;

    function close() {
      panel.hidden = true;
      btn.setAttribute("aria-expanded", "false");
    }

    btn.addEventListener("click", function () {
      var open = panel.hidden;
      panel.hidden = !open;
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("click", function (e) {
      if (!root.contains(e.target)) close();
    });
    root.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        close();
        btn.focus();
      }
    });
  });

  /* ----- TOAST -------------------------------------------------------------- */
  function toast(message, duration) {
    var region = document.querySelector(".toast-region");
    if (!region) {
      region = document.createElement("div");
      region.className = "toast-region";
      region.setAttribute("role", "status");
      region.setAttribute("aria-live", "polite");
      document.body.appendChild(region);
    }
    var item = document.createElement("div");
    item.className = "toast";
    item.textContent = message;
    region.appendChild(item);
    setTimeout(function () {
      item.remove();
    }, duration || 4000);
  }

  document.querySelectorAll("[data-mono-toast]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      toast(btn.getAttribute("data-mono-toast"));
    });
  });

  /* ----- COPY --------------------------------------------------------------- */
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).catch(function () {
        return copyTextFallback(text);
      });
    }
    return copyTextFallback(text);
  }

  /* for file://, older browsers, and denied clipboard permissions */
  function copyTextFallback(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
    } finally {
      ta.remove();
    }
    return Promise.resolve();
  }

  document.querySelectorAll("[data-mono-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var target = document.getElementById(btn.getAttribute("data-mono-copy"));
      if (!target) return;
      copyText(target.textContent.trim()).then(function () {
        var original = btn.textContent;
        btn.textContent = "COPIED";
        setTimeout(function () {
          btn.textContent = original;
        }, 1500);
      });
    });
  });

  /* ----- RANGE VALUE OUTPUT --------------------------------------------------- */
  document.querySelectorAll("input[type='range'][data-mono-output]").forEach(
    function (range) {
      var out = document.getElementById(range.getAttribute("data-mono-output"));
      if (!out) return;
      var render = function () {
        out.textContent = range.value + (range.dataset.unit || "");
      };
      range.addEventListener("input", render);
      render();
    }
  );

  /* expose the toast for example pages */
  window.mono = { toast: toast, copyText: copyText };
})();
