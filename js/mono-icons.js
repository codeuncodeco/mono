/* MONO — icon adapter.
   One canonical vocabulary, four libraries. Markup stays constant:

     <i class="icon" data-icon="settings" aria-hidden="true"></i>

   The active set (a global preference, see js/mono-theme.js) decides how
   each name renders: a glyph class for the webfont sets, a ligature for
   Material Symbols. Switching sets re-renders every icon in place. */
(function () {
  "use strict";

  /* canonical → { lucide, tabler, phosphor, material } */
  var MAP = {
    home: ["house", "home", "house", "home"],
    menu: ["menu", "menu-2", "list", "menu"],
    close: ["x", "x", "x", "close"],
    search: ["search", "search", "magnifying-glass", "search"],
    settings: ["settings", "settings", "gear", "settings"],
    tune: ["sliders-horizontal", "adjustments-horizontal", "faders", "tune"],
    sun: ["sun", "sun", "sun", "light_mode"],
    moon: ["moon", "moon", "moon", "dark_mode"],
    contrast: ["contrast", "contrast", "circle-half", "contrast"],
    type: ["type", "typography", "text-aa", "text_fields"],
    grid: ["layout-grid", "layout-grid", "squares-four", "grid_view"],
    layout: ["layout-template", "layout-2", "layout", "view_quilt"],
    dashboard: ["layout-dashboard", "layout-dashboard", "chart-bar", "dashboard"],
    image: ["image", "photo", "image", "image"],
    code: ["code", "code", "code", "code"],
    copy: ["copy", "copy", "copy", "content_copy"],
    check: ["check", "check", "check", "check"],
    plus: ["plus", "plus", "plus", "add"],
    minus: ["minus", "minus", "minus", "remove"],
    "arrow-right": ["arrow-right", "arrow-right", "arrow-right", "arrow_forward"],
    "chevron-down": ["chevron-down", "chevron-down", "caret-down", "expand_more"],
    user: ["user", "user", "user", "person"],
    users: ["users", "users", "users", "group"],
    bell: ["bell", "bell", "bell", "notifications"],
    download: ["download", "download", "download", "download"],
    external: ["external-link", "external-link", "arrow-square-out", "open_in_new"],
    more: ["ellipsis", "dots", "dots-three", "more_horiz"],
    file: ["file-text", "file-text", "file-text", "description"],
    edit: ["pen", "pencil", "pencil-simple", "edit"],
    book: ["book-open", "book-2", "book-open", "menu_book"],
    info: ["info", "info-circle", "info", "info"],
  };

  var SET_INDEX = { lucide: 0, tabler: 1, phosphor: 2, material: 3 };

  function activeSet() {
    return window.monoTheme ? window.monoTheme.get().icons : "lucide";
  }

  function render(el, setKey) {
    var name = el.getAttribute("data-icon");
    if (!name || !MAP[name]) return;
    var libName = MAP[name][SET_INDEX[setKey]];
    var lib = window.monoTheme.ICON_SETS[setKey];
    var cls = "icon";
    /* keep author-added classes such as icon-sm / icon-lg */
    if (el.classList.contains("icon-sm")) cls += " icon-sm";
    if (el.classList.contains("icon-lg")) cls += " icon-lg";
    if (lib.ligature) {
      el.className = cls + " " + lib.base;
      el.textContent = libName;
    } else {
      el.className =
        cls + (lib.base ? " " + lib.base : "") + " " + lib.prefix + libName;
      el.textContent = "";
    }
  }

  function applyAll(root) {
    var setKey = activeSet();
    (root || document)
      .querySelectorAll("[data-icon]")
      .forEach(function (el) {
        render(el, setKey);
      });
  }

  window.monoIcons = { apply: applyAll, names: Object.keys(MAP) };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      applyAll();
    });
  } else {
    applyAll();
  }

  if (window.monoTheme) {
    window.monoTheme.onChange(function () {
      applyAll();
    });
  }
})();
