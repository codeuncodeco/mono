# MONO

![Minimalist design system](https://mono.layogtima.com/images/screenshot.png)

## What is MONO?

MONO is a stripped-down design system that embraces the power of black, white, and the shades between. It's about removing color as a distraction to focus on what really matters: solid design fundamentals.

Think of it as design on hard mode—if it works in monochrome, it'll work anywhere.

> "Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away." - Antoine de Saint-Exupéry

## Core Principles

### Reduction

Strip away the non-essential. Color, decoration, complexity-gone.

### Refinement

Perfect what remains: typography, spacing, and proportion.

### Rhythm

Create patterns and relationships with limited elements.

### Reaction

Test how users respond. Does it communicate? Does it connect?

## What's in the box

- **Design tokens** — one stylesheet of CSS custom properties (`css/mono.css`): ink/paper, layered surfaces, a nine-step gray ramp, a modular type scale, spacing rhythm, rule weights, corner radius, and measure
- **Components** — buttons, inputs, selects, checkboxes, radios, switches, ranges, file inputs, validation patterns, tables (scrolling and stacked), tabs, accordions, modals, dropdowns, tooltips, toasts, panels, a phone tab bar, and bottom sheets — all monochrome, all accessible
- **The TUNE layer** — a global customizer on every page (slide-over on desktop, bottom sheet on phones): theme, structure, corners, typeface, scale, weight, rhythm, and icon set. Everything applies live, persists in localStorage, and exports as plain CSS
- **Dark mode** — layered grays, not flat black: the page, raised surfaces, and overlays each get their own tier. `data-theme="dark"`, persisted, with an AUTO option that follows the system
- **Structure axis** — `data-structure="outlined | soft | minimal"`: boxes drawn in ink, surfaces built from shades (the default), or pure negative space
- **Corner radius** — one `--radius` token, 0–16px; 0 keeps the brutalist default and everything from checkboxes to sheets follows proportionally
- **Icons** — one canonical vocabulary rendered by your choice of Lucide, Tabler, Phosphor, or Material Symbols: `<i class="icon" data-icon="settings"></i>`
- **Typography** — six curated monospace faces, switchable live
- **Phone navigation** — an app-style bottom tab bar with icons plus a mega-menu sheet; the site itself runs on it
- **Examples** — four complete pages (login, article, dashboard, pricing) built with zero page-local CSS

## Pages

- `index.html` — Home: the system at a glance
- `components.html` — Every component, live, with copyable code
- `typography.html` — The specimen book: roster, scale, weight, tracking, leading, measure
- `layout.html` — The twelve-column grid as a spec sheet
- `gallery.html` — Typographic compositions from the system's own tokens
- `customizer.html` — The TUNE layer, documented control by control
- `examples.html` — Index of real-world example pages (`examples/`)
- `about.html` — Manifesto, process, FAQ, colophon

## The type roster

All monospace, all on Google Fonts. Space Mono is the default; switch faces in the TUNE panel or by changing `--font-mono`.

| Face             | Weights         | Character                  |
| ---------------- | --------------- | -------------------------- |
| Space Mono       | 400, 700 + ital | Geometric, a little spacey |
| JetBrains Mono   | 100–800 + ital  | Tall x-height, engineered  |
| IBM Plex Mono    | 400, 700 + ital | Corporate, warm            |
| Fragment Mono    | 400 + ital      | A Helvetica for code       |
| Courier Prime    | 400, 700 + ital | The screenplay face        |
| Spline Sans Mono | 300–700 + ital  | Grotesque, compact         |

## Quick Start

```bash
git clone https://github.com/layogtima/mono.git
cd mono
# Open any HTML file in your browser — no build step needed to *use* the site
```

Tailwind is precompiled into the repo (`css/base.css` + `css/utilities.css`), so the site has **no runtime CDN dependency**. If you change utility classes in the markup, regenerate them once:

```bash
npm install
npm run build:css
```

### Basic Template

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MONO Project</title>

    <!-- 1. Typeface -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap"
      rel="stylesheet"
    />

    <!-- 2. Theme engine (synchronous, before the stylesheets: applies saved
            theme/structure/type/radius/icons before first paint) -->
    <script src="js/mono-theme.js"></script>

    <!-- 3. Styles: preflight, MONO tokens + components, utilities -->
    <link rel="stylesheet" href="css/base.css" />
    <link rel="stylesheet" href="css/mono.css" />
    <link rel="stylesheet" href="css/utilities.css" />

    <!-- 4. Behaviors: icons, components, and the TUNE layer -->
    <script src="js/mono-icons.js" defer></script>
    <script src="js/mono.js" defer></script>
    <script src="js/customizer.js" defer></script>
  </head>
  <body class="bg-paper text-ink min-h-screen">
    <!-- Your design genius goes here -->
    <button class="btn">Hello, ink</button>
    <i class="icon" data-icon="check" aria-hidden="true"></i>
  </body>
</html>
```

Don't want the whole system? Open the TUNE panel on the site, dial in a theme, and **COPY CSS** — you get a fonts link and a resolved `:root` token block that works anywhere.

### House rules

- Use the token utilities — `bg-paper`, `text-ink`, `border-divider`, `bg-surface-1`, `text-gray-500` — never `bg-white` or `text-black`. That's what lets one attribute restyle the whole site.
- Type sizes are scale steps: `text-step--2` through `text-step-7` (plus `text-step-display` for big fluid numbers). Nothing in between.
- Tailwind slash-opacity (`bg-ink/50`) does **not** work with `var()` colors; the translucent things in the system (backdrops, the tab bar blur) live in `mono.css`.
- Borders: `border` follows the structure axis (`--divider-w`), `border-2` is the fixed 2px rule, `border-hairline` is 1px.
- Wide tables get a `.table-scroll` wrapper; phone-first tables use `.table-stack` with `data-label` on each cell.

## Design tokens

Everything hangs off CSS custom properties in `css/mono.css`:

| Token                                 | Default                | Role                                       |
| ------------------------------------- | ---------------------- | ------------------------------------------ |
| `--ink` / `--paper`                   | `#0f0f0f` / `#ffffff`  | Text and the page                          |
| `--surface-1` / `--surface-2`         | `#f5f5f5` / `#ebebeb`  | Raised tiers — cards, menus, sheets        |
| `--ink-muted` / `--ink-faint`         | `#5f5f5f` / `#979797`  | Secondary and tertiary text                |
| `--edge` / `--divider`                | hairline grays         | Implied structure; follows `data-structure` |
| `--gray-100` … `--gray-900`           | neutral ramp           | Everything between ink and paper           |
| `--font-mono`                         | Space Mono             | The face, everywhere                       |
| `--step--2` … `--step-7`              | 1rem base, 1.25 ratio  | The modular type scale                     |
| `--step-display`                      | fluid clamp            | Stat numbers that never overflow a phone   |
| `--leading` / `--tracking`            | 1.6 / 0em              | Body rhythm                                |
| `--weight-bold`                       | 700                    | Every bold on the site                     |
| `--radius`                            | 0px                    | Corners, from checkboxes to sheets         |
| `--border-w` / `--border-w-hairline`  | 2px / 1px              | The two rule weights                       |
| `--space-1` … `--space-8`             | 4px … 96px             | Spacing rhythm                             |
| `--measure`                           | 65ch                   | Maximum prose width                        |

Dark mode (`data-theme="dark"`) re-points the whole set at layered grays — page `#161616`, surfaces `#1f1f1f` / `#2a2a2a` — never flat black.

Generate your own set with the [TUNE panel](https://mono.layogtima.com/customizer.html).

## MONO in the Wild

Check out these projects already embracing the monochromatic revolution:

### [layogtima.com](https://layogtima.com)

Amit's portfolio showcasing UI/UX design, hardware consulting, and flow artistry. Minimal and focused, just like its creator's attention span.

### [sm0.dev](https://www.sm0.dev/)

Shreshth's corner of the internet-web development, visualizations, and philosophical musings, all without the distraction of color.

### [seeds.layogtima.com](https://seeds.layogtima.com/)

A personal guide to growing food in Bengaluru. Proving that even plants, which literally exist to provide color in nature, can be documented in black and white.

### [india.xonotic.au](https://india.xonotic.au/)

A landing page for our small Xonotic community in India, focused on trying to get arena shooter games back in style! `You like Quake/Unreal Tournament? You're in for a treat :)`

### [layogtima.com/drums](https://layogtima.com/drums/)

Do you like drums? Interactive drumset where you can drop a beat!

## Contribute

Got MONOCHROME magic to share?

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/monochrome-magic`)
3. Commit your changes (`git commit -m 'Add my B&W brilliance'`)
4. Push to the branch (`git push origin feature/monochrome-magic`)
5. Open a Pull Request

## License

GPL v3. Share it, improve it, build with it.

## Credits

- Created by [Amit](https://layogtima.com)
- Inspired by minimalism and constraint-driven design
- Built with [Tailwind CSS](https://tailwindcss.com/) (precompiled — no runtime CDN)
- Icons by [Lucide](https://lucide.dev), [Tabler](https://tabler.io/icons), [Phosphor](https://phosphoricons.com), and [Material Symbols](https://fonts.google.com/icons)
