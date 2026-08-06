# Architecture Review

A deep audit of this design system's architecture — simplicity,
modernization, and readiness for growth — carried out before the main
component build-out, together with the remediation it produced.

The audit covered three areas in parallel: the token and theming pipeline,
the component library and docs app, and workspace/CI/delivery
infrastructure. Findings below are stated as they were found; every one
marked **Fixed** was fixed in this pass and is covered by a test or a
verified build artifact.

---

## Verdict

**The architecture is sound. The correctness debt was not.**

The foundations were right, and they were right in the ways that are
expensive to change later: a genuine single-source-of-truth token pipeline
producing CSS custom properties as a cross-framework contract, Material 3
tonal palette math, real module boundaries with enforced dependency
constraints, components built on native elements rather than wrappers, and
clean git hygiene. None of that needed rework.

What sat on top of it would have caused real problems as the library grew.
Eight of twelve packages would have published broken. The accessibility
standard the README advertised was enforced nowhere. Adding a business unit
meant fifteen edits across thirteen files. Half the component library used
an API paradigm the other half had moved off. Adding a component meant
copying ten config files by hand — which is precisely how three
mutually-incompatible ESLint configs got into the repo.

None of these were visible as failures. Everything was green. That is what
made them worth finding before the build-out rather than during it.

---

## Strengths

These were verified during the audit and left alone.

**The token pipeline earns its place.** One Style Dictionary source produces
CSS custom properties, SCSS variables, and JSON, and every consumer —
Angular Material, Tailwind, Bootstrap, plain HTML — derives from it. Brand
palettes are generated with the same HCT/Material 3 tonal math Material's
own theme generator uses, so the `on-*` colour pairings are contrast-safe by
construction rather than by review.

**CSS custom properties as the contract is the right call.** It is what
makes runtime theme switching work identically across four consumer types
with no per-framework theming logic, and what makes the Storybook brand
switcher possible at all.

**Components extend the platform instead of hiding it.** `brkButton` selects
a real `<button>`/`<a>`; menu items are real `<button>`s. Native semantics,
keyboard behaviour, and consumer-set ARIA all keep working without the
library re-implementing them — the same technique Angular Material uses.

**`brk-form-field`'s accessibility wiring is genuinely good.** The
`aria-describedby` computation mirrors the template's conditions exactly, so
the attribute can never reference an element that is not rendered. That is a
subtle bug most implementations ship.

**Module boundaries are real, not decorative.** Seven `depConstraints`
covering every tag in use, with `scope:tokens` correctly pinned as a leaf.
This caught a genuine violation during the remediation — a cross-package
relative import — and rejected it.

**Git hygiene is clean.** Zero build outputs tracked, comprehensive
`.gitignore`, clean tree.

---

## Weaknesses and gaps

### Critical

**Eight of twelve packages would have published broken.** — _Fixed_
Every Angular component package plus `date-adapter-angular` declared no
`main`, `module`, `types`, or `exports`. Those fields are written by
ng-packagr into `dist/`, but Changesets publishes from the workspace package
directory — so a release would have shipped raw TypeScript with no entry
point. `@app-design-system/tokens` separately pointed `main` at a `.ts`
file. All now publish from built output via `publishConfig.directory`,
verified by packing every package and inspecting the tarballs: compiled
ESM, declarations, complete exports maps, `workspace:*` resolved to real
versions.

**The accessibility bar was advertised, not enforced.** — _Fixed_
The README claimed WCAG 2.1/2.2 AA. `jest-axe`, `axe-core` and
`@axe-core/playwright` were all installed and referenced by exactly zero
files. Storybook's a11y addon could show violations to whoever happened to
open the panel; CI ran `build-storybook`, which never executes a story.
There was no automated accessibility checking anywhere. A shared
`expectNoAxeViolations` helper now runs in every component spec, and the
helper is itself tested to both pass and fail.

**`menu` imported rxjs without declaring it.** — _Fixed_
Five source files, no peer dependency. It worked in the monorepo through
hoisting and would have failed on install for a consumer.

### High

**Half the component library used a different API paradigm.** — _Fixed_
`button`, `card` and `form-field` used signal inputs; the entire `menu`
package used decorator `@Input`/`@Output`/`@ViewChild`/`@ContentChildren`.
No component used `ChangeDetectionStrategy.OnPush`. Everything is now
signals with OnPush throughout.

Converting the menu surfaced four latent bugs, each caught by a test:

- `output()` returns an `OutputEmitterRef`, not an Observable — merging it
  into the close stream silently never fired, so Escape, Tab and item
  activation all stopped closing the menu.
- CDK's `ListKeyManager` reads `item.disabled` as a boolean property. A
  signal input named `disabled` is a _function_ there — always truthy — so
  the key manager treated every item as disabled and skipped the entire
  menu, breaking all arrow-key navigation.
- Menu items live inside a portaled template and do not exist until the
  overlay attaches; the signal key manager's internal effect was not
  guaranteed to have flushed by the time the panel was interactive.
- `form-field`'s template still read `control?.id` after `control` became a
  signal, silently dropping the label's `for` attribute — the exact
  association the component exists to guarantee.

**Adding a brand took ~15 edits across 13 files.** — _Fixed_
Including six hand-transcribed hex values in Storybook's manager config,
which encoded not only colours but which tonal step each mode's primary maps
to. A seed change or a role-tone change would have desynced Storybook's
chrome from the components it frames, silently. It is now one edit to the
`BRANDS` map; everything else is generated. Verified: zero hand-written
brand lists remain outside the generator.

**The Material colour bridge covered 22 of 37 semantic roles.** — _Fixed_
The missing 15 — the entire success and warning families, the
surface-container ramp, `inverse-*`, `scrim` — meant Angular Material
silently fell back to its own derived values while Tailwind and Bootstrap
used the tokens. Divergence by omission, in the mixin written to prevent
divergence. A contract test now parses the token names the build emits and
fails if any consumer references one that does not exist, or if any semantic
role goes unbridged. Verified by deliberately typo-ing a reference.

**Bootstrap dropped every translucent colour on theme change.** — _Fixed_
The runtime bridge omitted all `--bs-*-rgb` triplets, which is how Bootstrap
builds `.bg-opacity-*`, `.text-bg-*`, `.link-*`, `.table-*` and every button
hover/active state. Those stayed frozen at their compile-time light-mode
colour after `setTheme('dark')`. CSS cannot convert hex to an rgb triplet,
so the tokens build now emits a `--color-*-rgb` companion for every semantic
colour.

**Spacing was never actually unified.** — _Fixed_
Bootstrap derived `$spacers` from its own multipliers, so `.p-2` did not
equal Tailwind's `p-2` or `var(--space-2)` — despite the README claiming one
shared spacing scale. Now mapped explicitly from the token scale.

**Adding a component meant copying ten config files.** — _Fixed_
About 1,900 lines of near-identical boilerplate with nothing keeping it in
step. The consequences were already visible: three different
`eslint.config.mjs` variants (two of which would reject an attribute
selector like `brkButton`'s), two different build-target shapes, and
divergent `tsconfig.lib.json` exclude lists. There is now a generator,
smoke-tested by generating a package, confirming it lints/tests/builds, and
deleting it.

### Medium

**`core:build` was the only uncached build target** — and sat on the
critical path of five packages, so every build recomputed it. — _Fixed_;
`nx run-many -t build` now goes 0/18 → 18/18 cache hits on a re-run.

**Component builds busted their own cache** by declaring `src/**/*` as an
input while the compile excluded specs and stories — editing a story
invalidated a build that ignores stories. — _Fixed_ (uses the `production`
named input).

**`tsconfig.base.json` had no `strict` and targeted es2015** while declaring
es2020 libs and running TypeScript 6. Every Angular package set strictness
locally, so the loose base was masked — but `tokens` and `date-utils`
inherited it. — _Fixed_ (strict, es2022).

**Two packages had no tests at all.** `theme-angular-material` and
`bootstrap-overrides` had no vitest config, so the plugin inferred no test
target and `nx run-many -t test` silently skipped the entire theming layer.
— _Fixed_; both now assert against compiled output.

**Three date bugs.** — _Fixed_

- `toIso8601` returned `date.toISOString()`, converting to UTC: a date
  picked as the 15th in a negative-offset timezone serialized as the 14th.
  Angular Material's own contract is a calendar date.
- `parseDate` accepted `'03/45/2026'` by rolling the day into the next
  month, turning a typo into a plausible wrong date.
- `date-utils` and the adapter disagreed on the org's own short-date format
  (`M/D/YYYY` vs `MM/DD/YYYY`).

**The runtime theme API was one function.** — _Fixed_
No way to read the theme back, no system-preference detection, no
persistence, no change notification, and a default parameter that threw
under SSR. An app that never called `setTheme` rendered light regardless of
the user's OS setting. Now `getTheme`, `getSystemTheme`, `getStoredTheme`,
`initTheme` and `onThemeChange`, all DOM-guarded.

**Eleven dead dependencies**, including the entire Playwright stack (no
config, no e2e project) and `jest-axe` in a repo that runs Vitest. — _Fixed_

**Documentation described things that did not exist.** — _Fixed_
`theme-angular-material`'s README told consumers to import one `.scss` file;
following it verbatim produced colourless Material components, because the
themes re-point `--mat-sys-*` at tokens the README never mentioned loading.
`tailwind-preset`'s README pointed at a path that does not exist and never
mentioned choosing a brand. Both Sass packages' `index.ts` referenced files
that were never created.

**Prettier had never been run.** Configured, ignored, and never invoked —
so a formatting gate could not be added without first normalizing 75 files.
— _Fixed_, and `nx format:check` now runs in CI.

**CI had no cache, no `permissions`, no `concurrency`, and no format or type
check**, and ran Node 22 against `@types/node` 24. — _Fixed_

**The release pipeline was inert.** Changesets fully installed, zero
scripts, no workflow. — _Fixed_; `pnpm release:dry-run` packs all twelve
packages, and `release.yml` opens a version PR and publishes on merge.

**A visually-hidden directive that did not hide anything.** — _Fixed_
`VisuallyHiddenDirective` applied a class whose stylesheet was referenced by
nothing, so the element stayed fully visible. Styles are now applied via
host bindings, so it works on import.

---

## Deliberately deferred

Not oversights — judgement calls, recorded so they are not rediscovered.

- **Tailwind v4.** The preset targets v3, which the repo pins. v4 replaces
  the JS preset with CSS-first `@theme` and renames every namespace; that is
  a migration to plan, not a patch.
- **LambdaTest visual regression** and cross-browser CI. Needs the plan and
  budget tier decided first.
- **The separate showcase website.** Storybook currently carries the guides.
- **`date-utils` API breadth** — no `relativeTime`, `duration`, or
  comparison helpers yet. Add them when something needs them.
- **Playground modernization.** They deliberately hand-roll UI to prove
  token parity without Angular; they will drift from the component library
  by design.
- **Storybook test-runner.** Accessibility is enforced in Vitest instead,
  which runs on every commit rather than requiring a built Storybook.

---

## Before / after

| Dimension              | Before                                   | After                               |
| ---------------------- | ---------------------------------------- | ----------------------------------- |
| Publishable packages   | 4 of 12 correct                          | 12 of 12, verified by packing       |
| Component API          | Two paradigms; no OnPush                 | Signals throughout; OnPush on all 5 |
| a11y enforcement       | None (claimed in README)                 | axe in every component spec         |
| Adding a brand         | ~15 edits, 13 files, 6 copied hex values | 1 edit                              |
| Adding a component     | Copy ~10 files by hand                   | `nx g ./tools/generators:component` |
| Colour roles bridged   | 22 of 37                                 | 37 of 37, contract-tested           |
| Bootstrap dark mode    | Translucent colours frozen               | Follows the theme                   |
| Tests                  | ~41                                      | 95                                  |
| Packages without tests | 2                                        | 0                                   |
| Build cache            | `core:build` always cold                 | 18/18 hits                          |
| Release pipeline       | Installed, inert                         | Dry-run verified end to end         |
| TypeScript base        | Non-strict, es2015                       | Strict, es2022                      |
| Formatting             | Never run                                | Normalized, gated in CI             |

---

## What remains

One item blocks an actual release, and it is not technical: the npm scope
`@app-design-system` must match the GitHub org that owns the repo. That is
the top entry in [MIGRATION.md](../MIGRATION.md) and is unchanged by this
work.

Everything else on the roadmap — the remaining components, guides, icons,
typography — now starts from a foundation where the conventions are encoded
in a generator rather than in the last package someone copied.
