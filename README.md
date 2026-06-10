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

- **Design tokens** — one stylesheet of CSS custom properties (`css/mono.css`): ink/paper, a nine-step gray ramp, a modular type scale, spacing rhythm, border weights, and measure
- **Components** — buttons, inputs, selects, checkboxes, radios, switches, ranges, file inputs, validation patterns, tables, tabs, accordions, modals, dropdowns, tooltips, and toasts — all monochrome, all accessible
- **Inversion** — one `data-theme="dark"` attribute swaps ink and paper site-wide (the INVERT button in the nav, persisted to localStorage)
- **Typography** — six curated monospace faces, switchable with a single CSS variable
- **Customizer** — tune font, base size, scale ratio, weight, tracking, leading, and borders live, then copy your theme as tokens
- **Examples** — four complete pages (login, article, dashboard, pricing) built with zero page-local CSS

## Pages

- `index.html` — Home: the system at a glance
- `components.html` — Every component, live, with copyable code
- `typography.html` — The specimen book: roster, scale, weight, tracking, leading, measure
- `layout.html` — The twelve-column grid as a spec sheet
- `gallery.html` — Typographic compositions from the system's own tokens
- `customizer.html` — Live theme tuning + take-home token snippet
- `examples.html` — Index of real-world example pages (`examples/`)
- `about.html` — Manifesto, process, FAQ, colophon

## The type roster

All monospace, all on Google Fonts. Space Mono is the default; switch faces by changing `--font-mono`.

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
# Open any HTML file in your browser — no build step
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

    <!-- 2. Tailwind CDN + MONO config (config must come right after the CDN) -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="js/mono-config.js"></script>

    <!-- 3. MONO tokens + components -->
    <link rel="stylesheet" href="css/mono.css" />
    <script src="js/mono.js" defer></script>
  </head>
  <body class="bg-paper text-ink min-h-screen">
    <!-- Your design genius goes here -->
    <button class="btn">Hello, ink</button>
  </body>
</html>
```

### House rules

- Use the token utilities — `bg-paper`, `text-ink`, `border-ink`, `text-gray-500` — never `bg-white` or `text-black`. That's what lets one attribute invert the whole site.
- Type sizes are scale steps: `text-step--2` through `text-step-7`. Nothing in between.
- Tailwind slash-opacity (`bg-ink/50`) does **not** work with `var()` colors; the one translucent thing in the system (the modal backdrop) lives in `mono.css`.
- Borders: `border` is the system 2px; `border-hairline` is 1px.

## Design tokens

Everything hangs off CSS custom properties in `css/mono.css`:

| Token                        | Default                | Role                              |
| ---------------------------- | ---------------------- | --------------------------------- |
| `--ink` / `--paper`          | `#0a0a0a` / `#ffffff`  | Text and surfaces; swap to invert |
| `--gray-100` … `--gray-900`  | neutral ramp           | Everything between ink and paper  |
| `--font-mono`                | Space Mono             | The face, everywhere              |
| `--step--2` … `--step-7`     | 1rem base, 1.25 ratio  | The modular type scale            |
| `--leading` / `--tracking`   | 1.6 / 0em              | Body rhythm                       |
| `--border-w` / `--border-w-hairline` | 2px / 1px       | The two rule weights              |
| `--space-1` … `--space-8`    | 4px … 96px             | Spacing rhythm                    |
| `--measure`                  | 65ch                   | Maximum prose width               |

Generate your own set with the [customizer](https://mono.layogtima.com/customizer.html).

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
- Built with [Tailwind CSS](https://tailwindcss.com/)
