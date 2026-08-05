# App Design System

A single, standardized design system for the org's applications and
websites: one set of design tokens driving an Angular Material component
library, a Tailwind CSS preset, and Bootstrap 5 overrides - so
Angular, Tailwind, Bootstrap, and plain-HTML/JS apps across the org share
one visual language and one accessibility bar (WCAG 2.1/2.2 AA).

## Packages

| Package | What it is |
| --- | --- |
| [`packages/tokens`](packages/tokens) | Design tokens (color, typography, spacing, elevation, radius, motion) - the single source of truth, built with Style Dictionary into CSS custom properties, SCSS variables, and JSON. |
| [`packages/theme-angular-material`](packages/theme-angular-material) | Wires the tokens' brand palettes into Angular Material's M3 `mat.theme()`. |
| [`packages/tailwind-preset`](packages/tailwind-preset) | Tailwind v3 preset generated from the tokens. |
| [`packages/bootstrap-overrides`](packages/bootstrap-overrides) | Bootstrap 5 Sass variable overrides + a runtime theme bridge. |
| [`packages/date-utils`](packages/date-utils) | Framework-agnostic dayjs wrapper (org-standard formats, timezones). |
| [`packages/date-adapter-angular`](packages/date-adapter-angular) | dayjs `DateAdapter` for Angular Material's datepicker. |
| [`packages/components/core`](packages/components/core), [`button`](packages/components/button), [`form-field`](packages/components/form-field) | The Angular component library. |
| [`apps/docs`](apps/docs) | Storybook documentation site. |
| [`apps/playground-tailwind`](apps/playground-tailwind), [`apps/playground-bootstrap`](apps/playground-bootstrap) | Manual QA sandboxes proving the non-Angular consumers stay visually consistent. |

## Theming

Every consumer re-themes by setting `data-theme` on the document root:

```ts
import { setTheme } from '@app-design-system/tokens';
setTheme('dark'); // 'light' | 'dark' | 'high-contrast'
```

## Getting started

```sh
pnpm install
pnpm exec nx run tokens:build       # build the tokens first - everything else depends on it
pnpm exec nx run-many -t build      # build everything
pnpm exec nx run-many -t test       # run all unit tests
pnpm exec nx run docs:storybook     # component playground + docs
```

## Status

This is the initial build-out: tokens, theming, the Angular component
library (button, form-field), the Storybook docs site, and the
Tailwind/Bootstrap playgrounds. Not yet wired: LambdaTest cross-browser/
visual-regression CI, Changesets-based publishing to a package registry,
and governance docs (CONTRIBUTING.md, RFC process) - see the project plan
for the full phased roadmap.
