# playground-bootstrap

A minimal Bootstrap 5 app proving `@app-design-system/bootstrap-overrides`
and `@app-design-system/tokens` produce the same visual language as the
Angular Material theme and Tailwind preset - no Angular involved.

```sh
nx serve playground-bootstrap
nx build playground-bootstrap
```

`src/styles.entry.scss` is compiled ahead of time by the `generate-styles`
target (`nx run playground-bootstrap:generate-styles`) into
`src/generated/styles.css`, which `index.html` links directly - Vite's
bundled Sass compiler doesn't currently resolve this repo's bare-package
`@import`s (`bootstrap/scss/...`, `@app-design-system/tokens/...`) via its
`css.preprocessorOptions.scss.loadPaths` config, even though the same
`loadPaths` value works when calling the `sass`/`sass-embedded` compiler
directly - so the pre-compile step sidesteps Vite's CSS pipeline for this
one file the same way a production app's own build step would.

Click the theme buttons to confirm light/dark/high-contrast switch
Bootstrap's own `--bs-*` variables via
`@app-design-system/bootstrap-overrides`' runtime theme bridge.
