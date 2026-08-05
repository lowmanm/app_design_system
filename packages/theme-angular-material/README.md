# @app-design-system/theme-angular-material

Wires each business unit's brand tonal palette (from
`@app-design-system/tokens`) into Angular Material's M3 `mat.theme()` API,
so Material components use the org's real brand colors instead of
Material's bundled placeholder palettes - with the same light/dark/
high-contrast `data-theme` switching as every other consumer.

## Usage

Pick the `.scss` matching your business unit's brand and import it once
(brand is chosen at import time, not switchable at runtime - see
`@app-design-system/tokens`' README for the brand list):

```scss
// your-app/src/styles.scss
@import '@app-design-system/theme-angular-material/src/themes/azure-blue';
// or: .../src/themes/rose-red
// or: .../src/themes/cyan-orange
```

Then toggle light/dark/high-contrast at runtime the same way as any other
consumer:

```ts
import { setTheme } from '@app-design-system/tokens';
setTheme('dark');
```

## How it works

1. `build.mjs` reads `../tokens/dist/json/brands/<brand>/palette.json` for
   every brand and writes `generated/<brand>/app-palettes.scss`, shaped
   exactly as `mat.define-theme()`/`mat.theme()` expect a color config's
   `primary` palette: tone keys 0-100 at the map root, with
   `secondary`/`neutral`/`neutral-variant`/`error` nested inside.
2. `src/_theme-mixin.scss` defines `app-theme($primary-palette,
   $tertiary-palette)`, calling `mat.theme()` with those palettes once per
   `[data-theme]` value. `mat.theme()` emits Material's "system" tokens as
   runtime CSS custom properties (`--mat-sys-*`) that every Material
   component references - so switching `data-theme` re-themes Material
   components with no Sass recompile.
3. `src/themes/<brand>.scss` is a small per-brand entry point that
   `@include`s the mixin with that brand's generated palette - mirroring
   Angular Material's own separate `azure-blue.css`/`rose-red.css`/...
   files. `compile-themes.mjs` compiles each to `dist/<brand>.css`.
4. High-contrast has no Material `theme-type` equivalent, so the mixin's
   high-contrast block manually points select `--mat-sys-*` variables at
   the tokens package's own `--color-*` values instead of deriving a third
   M3 role mapping - this part is brand-agnostic, since it references
   variable *names* whose *values* come from whichever brand's tokens CSS
   the consuming app has loaded.

See `src/_theme-mixin.scss` for the note on why an Angular Material button
and a Tailwind button, while visually consistent, aren't driven by one
identical color-role source (Material computes its own M3 role mapping;
the tokens package hand-authors an analogous one for non-Angular
consumers).

## Build

```sh
nx run tokens:build                        # tokens must be built first
nx run theme-angular-material:build        # regenerates palettes + compiles dist/<brand>.css per brand
```
