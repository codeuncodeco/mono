/* MONO — shared behaviors. Vanilla JS, no dependencies.
   Wires up: invert toggle, mobile menu, tabs, modals, dropdowns,
   tooltips-on-focus, toasts, copy buttons, range outputs. */
(function () {
  "use strict";

  /* ----- INVERT (ink/paper swap, persisted) ------------------------------ */
  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("mono-theme", theme);
    } catch (e) {
      /* storage unavailable — toggle still works for this page */
    }
    document.querySelectorAll("[data-mono-invert]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    });
  }

  document.querySelectorAll("[data-mono-invert]").forEach(function (btn) {
    btn.setAttribute(
      "aria-pressed",
      document.documentElement.dataset.theme === "dark" ? "true" : "false"
    );
    btn.addEventListener("click", function () {
      var next =
        document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      setTheme(next);
    });
  });

  /* ----- MOBILE MENU ------------------------------------------------------ */
  var menuBtn = document.querySelector("[data-mono-menu]");
  var menu = menuBtn && document.getElementById(menuBtn.getAttribute("aria-controls"));

  function closeMenu() {
    if (!menu || menu.hidden) return;
    menu.hidden = true;
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.textContent = "MENU";
    menuBtn.focus();
  }

  if (menuBtn && menu) {
    menuBtn.addEventListener("click", function () {
      var open = menu.hidden;
      menu.hidden = !open;
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
      menuBtn.textContent = open ? "CLOSE" : "MENU";
      if (open) {
        var first = menu.querySelector("a");
        if (first) first.focus();
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

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

  document.querySelectorAll("dialog").forEach(function (dialog) {
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
