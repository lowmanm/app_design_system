# @app-design-system/tokens

The single source of truth for the design system's visual language. Every
other package (Angular Material theme, Tailwind preset, Bootstrap overrides,
components) derives from the output built here - no design decision is ever
duplicated per framework.

## Structure

- `src/reference/{typography,spacing,radius,elevation,motion}.json` - raw
  scales shared by every business unit's brand.
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
