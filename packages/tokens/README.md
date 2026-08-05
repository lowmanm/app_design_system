# @app-design-system/tokens

The single source of truth for the design system's visual language. Every
other package (Angular Material theme, Tailwind preset, Bootstrap overrides,
components) derives from the output built here - no design decision is ever
duplicated per framework.

## Structure

- `src/reference/*.json` - raw scales: tonal color palettes (`palette.*`,
  generated from brand seed colors), typography, spacing, radius, elevation,
  motion. Treat `reference/color.json` as generated output - edit
  `scripts/generate-palettes.mjs`'s seed-color constants and rerun the script
  instead of hand-editing hex values.
- `src/semantic/color.{light,dark,hc}.json` - semantic color roles
  (`color.primary`, `color.on-surface`, ...) that alias the reference
  palette per theme mode.

## Build

```sh
node scripts/generate-palettes.mjs   # regenerate src/reference/color.json from seed colors
node build.mjs                       # or: nx run tokens:build
```

Produces, per theme (`light` / `dark` / `high-contrast`) plus a
theme-independent `core` (typography/spacing/radius/elevation/motion) and a
`palette` (full 0-100 tonal scale, for advanced consumers):

- `dist/css/*.css` - CSS custom properties, the universal contract every
  consumer (Angular, Tailwind, Bootstrap, plain HTML) reads from. Theme files
  are scoped to `[data-theme="<name>"]`; toggle via `setTheme()` from
  `src/index.ts` or by setting the attribute directly.
- `dist/scss/*.scss` - SCSS variables, consumed by
  `@app-design-system/bootstrap-overrides`.
- `dist/json/*.json` - flat JSON, consumed by
  `@app-design-system/tailwind-preset`.

## Adding a token

1. Add the raw value to the appropriate `src/reference/*.json` file (or
   regenerate the palette from a new seed color).
2. If it's a color, add a semantic alias in each `src/semantic/color.*.json`
   file referencing the reference token (e.g. `{palette.primary.40}`).
3. Rerun the build. All downstream packages pick up the new value on their
   next build - nothing to change in Angular Material, Tailwind, or
   Bootstrap consumers.

## Running unit tests

Run `nx test tokens` to execute the unit tests via [Vitest](https://vitest.dev/).
