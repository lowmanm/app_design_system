---
'@app-design-system/theme-angular-material': minor
'@app-design-system/bootstrap-overrides': minor
'@app-design-system/date-adapter-angular': minor
'@app-design-system/tailwind-preset': minor
'@app-design-system/form-field': minor
'@app-design-system/date-utils': minor
'@app-design-system/button': minor
'@app-design-system/header': minor
'@app-design-system/tokens': minor
'@app-design-system/core': minor
'@app-design-system/card': minor
'@app-design-system/menu': minor
---

Architecture remediation ahead of the component build-out.

**Packaging.** Eight packages previously had no entry points in their
published manifest and would have shipped raw TypeScript. They now publish
from their built output, with real `exports`/`types` and `workspace:`
versions resolved. `@app-design-system/tokens`' runtime API is compiled to
ESM+CJS instead of shipping `.ts`.

**Components.** All six are now signal-based with `OnPush` change detection
(the menu package was still decorator-based). Accessibility is enforced by
axe assertions in every component spec rather than claimed in a README:
`@app-design-system/core/testing` exports the helper. New: `banner`/`nav`
landmarks on the header, Tab-to-close and ArrowRight/ArrowLeft submenu
navigation on the menu, keyboard-reachable context menus, and natively
disabled menu items.

**Tokens.** All 37 semantic colour roles are now bridged to Angular
Material (was 22), so Angular, Tailwind and Bootstrap resolve to identical
colours. Bootstrap gains the `--bs-*-rgb` triplets its opacity utilities
need to follow a runtime theme change, and a `$spacers` map matching the
token scale. New `--size-control-*` and `--focus-ring-*` tokens.

**Breaking:** `setTheme(theme, root?)` is now `setTheme(theme, options?)`
where options is `{ root?, persist? }`. New `getTheme`, `getSystemTheme`,
`getStoredTheme`, `initTheme` and `onThemeChange`, all SSR-safe.
