# @app-design-system/theme-angular-material

Wires the org's brand tonal palettes (from `@app-design-system/tokens`) into
Angular Material's M3 `mat.theme()` API, so Material components use the
org's brand colors instead of Material's bundled placeholder palettes -
with the same light/dark/high-contrast `data-theme` switching as every
other consumer.

## Usage

```scss
// your-app/src/styles.scss
@import '@app-design-system/theme-angular-material/src/theme';
```

Then toggle themes at runtime the same way as any other consumer:

```ts
import { setTheme } from '@app-design-system/tokens';
setTheme('dark');
```

## How it works

1. `build.mjs` reads `../tokens/dist/json/palette.json` (the tonal palettes
   generated from brand seed colors) and writes `generated/_app-palettes.scss`,
   shaped exactly as `mat.define-theme()`/`mat.theme()` expect a color
   config's `primary` palette: tone keys 0-100 at the map root, with
   `secondary`/`neutral`/`neutral-variant`/`error` nested inside.
2. `src/theme.scss` calls `mat.theme()` with that palette, once per
   `[data-theme]` value. `mat.theme()` emits Material's "system" tokens as
   runtime CSS custom properties (`--mat-sys-*`) that every Material
   component references - so switching `data-theme` re-themes Material
   components with no Sass recompile.
3. High-contrast has no Material `theme-type` equivalent, so that block
   manually points select `--mat-sys-*` variables at the tokens package's
   own `--color-*` high-contrast values instead of deriving a third M3 role
   mapping.

See `src/theme.scss` for the note on why an Angular Material button and a
Tailwind button, while visually consistent, aren't driven by one identical
color-role source (Material computes its own M3 role mapping; the tokens
package hand-authors an analogous one for non-Angular consumers).

## Build

```sh
nx run tokens:build                        # tokens must be built first
nx run theme-angular-material:build        # regenerates palettes + compiles dist/theme.css
```
