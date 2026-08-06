# App Design System

A single, standardized design system for the org's applications and
websites: one set of design tokens driving an Angular Material component
library, a Tailwind CSS preset, and Bootstrap 5 overrides - so Angular,
Tailwind, Bootstrap, and plain-HTML/JS apps across the org share one
visual language and one accessibility bar (WCAG 2.1/2.2 AA).

> **Currently developed in a personal repo, moving to the company's
> GitHub org later.** See [MIGRATION.md](MIGRATION.md) for the exact
> checklist (npm scope, brand colors, license) for that move - nothing
> else in the codebase is tied to this repo's current location.

## Packages

| Package                                                                                                                                                                                                                                                        | What it is                                                                                                                                                                                                                                               |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`packages/tokens`](packages/tokens)                                                                                                                                                                                                                           | Design tokens (color, typography, spacing, elevation, radius, motion) - the single source of truth, built with Style Dictionary. Color is per-business-unit brand (`azure-blue`, `rose-red`, `cyan-orange` - see its README); everything else is shared. |
| [`packages/theme-angular-material`](packages/theme-angular-material)                                                                                                                                                                                           | Wires each brand's tonal palette into Angular Material's M3 `mat.theme()` - one compiled theme file per brand.                                                                                                                                           |
| [`packages/tailwind-preset`](packages/tailwind-preset)                                                                                                                                                                                                         | Tailwind v3 preset generated from the tokens.                                                                                                                                                                                                            |
| [`packages/bootstrap-overrides`](packages/bootstrap-overrides)                                                                                                                                                                                                 | Bootstrap 5 Sass variable overrides + a runtime theme bridge - one compiled bundle per brand.                                                                                                                                                            |
| [`packages/date-utils`](packages/date-utils)                                                                                                                                                                                                                   | Framework-agnostic dayjs wrapper (org-standard formats, timezones).                                                                                                                                                                                      |
| [`packages/date-adapter-angular`](packages/date-adapter-angular)                                                                                                                                                                                               | dayjs `DateAdapter` for Angular Material's datepicker.                                                                                                                                                                                                   |
| [`packages/components/core`](packages/components/core), [`button`](packages/components/button), [`form-field`](packages/components/form-field), [`card`](packages/components/card), [`header`](packages/components/header), [`menu`](packages/components/menu) | The Angular component library (`brk-` prefixed selectors, e.g. `brk-form-field`, `brkButton`, `brk-menu`).                                                                                                                                               |
| [`apps/docs`](apps/docs)                                                                                                                                                                                                                                       | Storybook documentation site, in docs-only mode (one page per component) with Brand and Theme toolbar switchers - component stories plus prose "Guides/*" pages written in MDX.                                                                          |
| [`apps/playground-tailwind`](apps/playground-tailwind), [`apps/playground-bootstrap`](apps/playground-bootstrap)                                                                                                                                               | Manual QA sandboxes proving the non-Angular consumers stay visually consistent.                                                                                                                                                                          |

Every package above is a real, independently installable npm package
(`@app-design-system/*`, published to GitHub Packages - see "Installing"
below).

## Theming

**Brand** (business unit) is chosen once, at install time, by which
brand's files you load - see `packages/tokens`' README for the list and
how to add one. **Light/dark/high-contrast** mode, on the other hand, is
runtime-switchable by every consumer, by setting `data-theme` on the
document root:

```ts
import { setTheme } from '@app-design-system/tokens';
setTheme('dark'); // 'light' | 'dark' | 'high-contrast'
```

The Storybook docs site has toolbar switchers for **both** axes, so you can
preview every brand and mode without rebuilding. That brand switcher is a
docs-only affordance - it loads all brands' CSS at once behind a
`[data-brand]` attribute. Real apps still ship exactly one brand.

## Installing into an app

Packages are published to GitHub Packages (private, scoped to this repo's
GitHub org - see [MIGRATION.md](MIGRATION.md) if the scope doesn't match
where you've cloned this to). Consuming repos need a `.npmrc` mapping the
scope to that registry, then a normal `npm install`:

```ini
# consuming repo's .npmrc
@app-design-system:registry=https://npm.pkg.github.com
```

```sh
# Angular apps
npm install @app-design-system/tokens @app-design-system/theme-angular-material
npm install @app-design-system/core @app-design-system/button \
  @app-design-system/form-field @app-design-system/card \
  @app-design-system/header @app-design-system/menu

# Tailwind apps: tokens + the preset instead of the Material theme
npm install @app-design-system/tokens @app-design-system/tailwind-preset

# Bootstrap apps: tokens + the overrides instead
npm install @app-design-system/tokens @app-design-system/bootstrap-overrides
```

`@app-design-system/tokens` is required in every case - it supplies the
`--color-*`/`--space-*`/etc. custom properties every other package's output
references. Each package's own README has the specific import/wiring steps
(which `.scss` to load, which brand to pick).

## Developing this repo

```sh
pnpm install
pnpm exec nx run tokens:build       # build the tokens first - everything else depends on it
pnpm exec nx run-many -t build      # build everything
pnpm exec nx run-many -t test       # run all unit tests
pnpm exec nx run docs:storybook     # component playground + guides
```

## Status

Done: tokens (multi-brand), theming across Angular Material/Tailwind/
Bootstrap, the Angular component library (button, form-field, card, header,
menu), the Storybook docs site (component stories, brand/theme switchers,
and a Colors guide - more guides to come), the Tailwind/Bootstrap
playgrounds, and GitHub Packages publish config (Changesets) for every
package.

Not yet wired: the actual CI release workflow (Changesets version/publish
automation), a deploy of Storybook to GitHub Pages, LambdaTest
cross-browser/visual-regression CI, the separate custom showcase/
guidelines website, and governance docs (CONTRIBUTING.md, RFC process).
See [MIGRATION.md](MIGRATION.md) for the repo-move checklist.
