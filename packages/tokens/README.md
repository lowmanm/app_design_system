# @app-design-system/tokens

The single source of truth for the design system's visual language. Every
other package (Angular Material theme, Tailwind preset, Bootstrap overrides,
components) derives from the output built here - no design decision is ever
duplicated per framework.

## Structure

- `src/reference/{typography,tracking,spacing,radius,elevation,motion,size,icon}.json` -
  raw scales shared by every business unit's brand.
- `src/semantic/typography.json` - the semantic type scale (`type.body.md`,
  `type.headline.lg`, ...), aliasing the reference scale above. Unlike
  color, it is brand-agnostic, so it is built into `core.css` rather than
  per brand.
- `src/reference/brands/<brand>/color.json` - per-brand tonal color
  palette (`palette.*`), generated from that brand's seed colors. Treat
  these as generated output - edit `scripts/generate-palettes.mjs`'s
  `BRANDS` map and rerun the script instead of hand-editing hex values.
- `src/semantic/color.{light,dark,hc}.json` - semantic color roles
  (`color.primary`, `color.on-surface`, ...) that alias the reference
  palette per theme mode. Brand-agnostic: the same role mapping (e.g.
  "primary is tone 40 in light mode") applies no matter which brand's
  palette it resolves against.

## Brands

Business units pick a color theme at install time by importing that
brand's files - mirroring Angular Material's own prebuilt-theme naming
(`azure-blue.css`, `rose-red.css`, ...). Defined in `BRANDS` in
`scripts/generate-palettes.mjs`:

| Brand         | Primary seed | Tertiary seed    |
| ------------- | ------------ | ---------------- |
| `azure-blue`  | `#0B5FFF`    | _(auto-derived)_ |
| `rose-red`    | `#C2185B`    | _(auto-derived)_ |
| `cyan-orange` | `#00838F`    | `#F4511E`        |

These are placeholders - swap them for the org's real per-business-unit
brand colors when defined, and add new entries to `BRANDS` for additional
business units.

## Build

```sh
node scripts/generate-palettes.mjs   # regenerate src/reference/brands/*/color.json from BRANDS
node build.mjs                       # or: nx run tokens:build
```

Produces, per brand, per theme (`light` / `dark` / `high-contrast`) plus a
`palette` (full 0-100 tonal scale, for advanced consumers):

- `dist/css/brands/<brand>/*.css` - CSS custom properties, the universal
  contract every consumer (Angular, Tailwind, Bootstrap, plain HTML) reads
  from. Theme files are scoped to `[data-theme="<name>"]`; toggle
  light/dark/high-contrast via `setTheme()` from `src/index.ts` or by
  setting the attribute directly - brand itself isn't runtime-switchable,
  it's chosen by which brand's files you load.

Plus, built once and shared by every brand:

- `dist/css/core.css` - the brand-independent tokens: type scale, spacing,
  radius, elevation, motion, control sizes, icon sizes.
- `dist/css/typography.css` - `.brk-type-<role>` utility classes (e.g.
  `.brk-type-headline-lg`), for applying a whole type role at once.
- `dist/scss/_typography.scss` - the same thing as a Sass mixin:
  `@include tokens.brk-type('headline-lg')`. An unknown role name is a
  build-time `@error`, not a silently-empty `var()`.
- `dist/css/fonts.css` + `dist/fonts/*.woff2` - the typefaces themselves.

## Fonts

The tokens name `Inter` and `JetBrains Mono`, and this package ships them:
`dist/css/fonts.css` declares self-hosted `@font-face` rules built from the
`@fontsource-variable/*` packages by `scripts/generate-fonts.mjs`. Load it
before the rest:

```css
@import '@app-design-system/tokens/css/fonts.css';
@import '@app-design-system/tokens/css/core.css';
```

**Loading it is effectively required.** Without it `--font-family-sans`
resolves to its `system-ui` fallback and nothing warns you - the page just
quietly isn't in the design system's typeface. If your org standardises on
a different face, change `font.family` in
`src/reference/typography.json`; the generator reads the family name from
there, so the `@font-face` and the token can't disagree.

Self-hosted rather than CDN-linked on purpose: no third-party request at
runtime, builds work offline, and no visitor data leaves for a font host.
Only the weight-axis (`wght`) cuts ship, and each unicode subset is a
separate `@font-face` gated by `unicode-range`, so a Latin-only page
downloads ~50 KB per family and nothing else.

## Runtime API

Small, framework-agnostic, and safe to import during server-side rendering
(every function no-ops rather than throwing when there is no DOM):

```ts
import { initTheme, setTheme, getTheme, onThemeChange } from '@app-design-system/tokens';

// At startup, before first paint: stored preference -> OS preference -> light
initTheme({ persist: true });

// Later
setTheme('dark', { persist: true });
getTheme(); // 'dark'
const stop = onThemeChange((t) => console.log('theme is now', t));
```

| Function                    | Purpose                                                                              |
| --------------------------- | ------------------------------------------------------------------------------------ |
| `initTheme(options?)`       | Applies the stored preference, else the OS preference. Returns what it applied.      |
| `setTheme(theme, options?)` | Writes `data-theme`. `{ root }` scopes it to an element; `{ persist }` remembers it. |
| `getTheme(root?)`           | The theme currently applied, or `null`.                                              |
| `getSystemTheme()`          | What the OS asks for (`light`/`dark`; `high-contrast` is never inferred).            |
| `getStoredTheme()`          | The persisted preference, or `null`.                                                 |
| `onThemeChange(fn)`         | Subscribe to changes made via `setTheme`. Returns an unsubscribe function.           |

- `dist/scss/brands/<brand>/*.scss` - SCSS variables, consumed by
  `@app-design-system/bootstrap-overrides`.
- `dist/json/brands/<brand>/*.json` - flat JSON, consumed by
  `@app-design-system/tailwind-preset`.

Typography/spacing/radius/elevation/motion are shared across brands and
build once, unscoped, to `dist/{css,scss,json}/core.*`.

## Adding a brand

1. Add an entry to `BRANDS` in `scripts/generate-palettes.mjs` (a primary
   seed color, and optionally an explicit tertiary seed if the auto-derived
   one doesn't match the brand).
2. Run `node scripts/generate-palettes.mjs` then `node build.mjs` (or
   `nx run tokens:build`, `nx run theme-angular-material:build`,
   `nx run bootstrap-overrides:build` to refresh downstream brand bundles
   too).

## Adding a token

1. Add the raw value to the appropriate `src/reference/*.json` file (shared
   scales) or `src/reference/brands/<brand>/color.json` (brand palette).
2. If it's a color, add a semantic alias in each `src/semantic/color.*.json`
   file referencing the reference token (e.g. `{palette.primary.40}`).
3. Rerun the build. All downstream packages pick up the new value on their
   next build - nothing to change in Angular Material, Tailwind, or
   Bootstrap consumers.

## Running unit tests

Run `nx test tokens` to execute the unit tests via [Vitest](https://vitest.dev/).
