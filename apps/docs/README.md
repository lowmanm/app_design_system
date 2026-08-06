# docs

Storybook documentation site for the design system - live component
playground, MDX docs, an accessibility panel (`@storybook/addon-a11y`) per
story, and a theme switcher (light/dark/high-contrast) in the toolbar.

## Running locally

```sh
nx run docs:storybook
```

## Building

```sh
nx run docs:build-storybook
```

Outputs a static site to `storybook-static/`, deployable to GitHub Pages.

## Why this project's Storybook wiring looks unusual

`@storybook/angular` v10 dropped support for being invoked directly via the
`storybook build`/`storybook dev` CLI (the pattern `@nx/storybook`'s
generator scaffolds by default) - Angular's Storybook integration now
_requires_ being run through a real Angular CLI/architect builder
(`@storybook/angular:build-storybook` / `@storybook/angular:start-storybook`),
so it can read build options (tsConfig, styles, polyfills) from an actual
Angular target via `context.getTargetOptions()`.

Because of that:

- `project.json` defines a `storybook-browser-target` using the legacy
  `@angular-devkit/build-angular:browser` executor purely so Storybook has
  an Angular target to introspect - it's never built directly, only
  referenced by `storybook`/`build-storybook`'s `browserTarget` option.
  (The app's real `build` target keeps using the modern
  `@angular/build:application` esbuild builder; `@storybook/angular`'s
  webpack5 integration doesn't understand that builder's option shape.)
- `storybook`/`build-storybook` targets use the `@storybook/angular:*`
  executors instead of `@nx/storybook`'s generated `nx:run-commands`
  wrappers.
- `.storybook/tsconfig.json`'s `include` was extended to cover
  `packages/components/**/*.stories.ts`, since the Angular AOT compiler
  needs every story file's component in its program - the SCSS load path
  for `@app-design-system/tokens`/`bootstrap` needed
  `stylePreprocessorOptions.includePaths: ['node_modules']` on the browser
  target for the same reason `sass --load-path=node_modules` is needed
  everywhere else in this repo.

If a future `@storybook/angular` release restores direct-CLI support (or
adds a real Vite builder for Angular), this can likely be simplified back
to `@nx/storybook`'s default output.
