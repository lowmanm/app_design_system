# @app-design-system/bootstrap-overrides

Lets Bootstrap 5-based apps in the org use the same design tokens as the
Angular component library and the Tailwind preset - one compiled bundle per
business-unit brand.

## Usage

Pick the brand matching your business unit (see
`@app-design-system/tokens`' README for the brand list):

```scss
// your-app/styles.scss
@import '@app-design-system/bootstrap-overrides/src/themes/azure-blue';
// or: .../src/themes/rose-red
// or: .../src/themes/cyan-orange
```

This compiles Bootstrap with `$theme-colors`, spacing, radii, shadows, and
typography all sourced from that brand's `@app-design-system/tokens` output
(baked to the _light_ theme's values, since Sass compiles once, ahead of
time).

Then load the runtime bridge (plain CSS, no Sass) after your compiled
Bootstrap CSS and the tokens' theme CSS:

```html
<link rel="stylesheet" href="dist/azure-blue.css" />
<link rel="stylesheet" href="node_modules/@app-design-system/tokens/css/brands/azure-blue/theme-dark.css" />
<link rel="stylesheet" href="node_modules/@app-design-system/bootstrap-overrides/src/runtime-theme-bridge.css" />
```

The bridge maps Bootstrap's own `--bs-*` custom properties to the tokens'
`--color-*`/`--radius-*`/etc. variables, so calling
`@app-design-system/tokens`' `setTheme('dark')` re-themes Bootstrap
components at runtime - no Sass recompile needed. This covers Bootstrap's
global palette and body/border variables; components with colors baked
directly into compiled Sass (rather than referencing a `var(--bs-*)`) will
still show the light theme's compile-time value until Bootstrap's own use of
custom properties for that component improves.

## Build

Requires Sass load-paths pointed at `node_modules` so `@import
"@app-design-system/tokens/dist/scss/..."` and `@import
"bootstrap/scss/bootstrap"` resolve, exactly like any other Sass package
import:

```sh
nx run tokens:build              # tokens must be built first
nx run bootstrap-overrides:build # compiles dist/<brand>.css per brand
```
