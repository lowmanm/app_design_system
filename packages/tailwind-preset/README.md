# @app-design-system/tailwind-preset

A Tailwind CSS v3 preset generated from `@app-design-system/tokens` - lets
Tailwind-based apps in the org use the same design tokens as the Angular
component library, without hand-copying values.

## Usage

Load the design system's tokens CSS (for the variable values and theme
switching) alongside the Tailwind preset (for the utility-class names):

```js
// tailwind.config.js
module.exports = {
  presets: [require('@app-design-system/tailwind-preset')],
  content: [/* your app's content globs */],
};
```

```html
<link rel="stylesheet" href="node_modules/@app-design-system/tokens/css/core.css" />
<link rel="stylesheet" href="node_modules/@app-design-system/tokens/css/theme-light.css" />
<link rel="stylesheet" href="node_modules/@app-design-system/tokens/css/theme-dark.css" />
```

Now `bg-primary`, `text-on-surface`, `rounded-md`, `shadow-2`, etc. are all
backed by `var(--...)` references into the tokens CSS - switching
`document.documentElement.dataset.theme` between `'light'`/`'dark'`/
`'high-contrast'` re-themes Tailwind utility classes with no rebuild, exactly
as it does for the Angular Material theme and Bootstrap overrides.

## Build

```sh
nx run tokens:build            # tokens must be built first
nx run tailwind-preset:build   # regenerates dist/preset.{cjs,mjs}
```

## Running unit tests

Run `nx test tailwind-preset` to execute the unit tests via [Vitest](https://vitest.dev/).
