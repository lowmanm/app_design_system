# Migrating this repo to its permanent company home

This design system is currently being developed in a personal GitHub repo
(`lowmanm/app_design_system`), with the intent to move it into the actual
company's GitHub org once it's ready. Nothing in the codebase hardcodes
`lowmanm` or `app_design_system` (verified by grep across the repo) - the
only things that need to change at move time are the npm package scope and
the git remote. This is a checklist for that day, so nothing gets forgotten.

## 1. Move the code

```sh
git remote set-url origin <new-company-repo-url>
git push -u origin claude/org-design-system-dt8wmb   # or whatever branch/history strategy you choose
```

Confirm the new repo is created **private** (matching the current
assumption) unless the company wants it public.

## 2. Rename the npm scope

GitHub Packages requires published packages' npm scope to match the GitHub
org/user that owns the repo. Every package here is currently scoped
`@app-design-system/*`, which only works if the new repo is owned by a
GitHub org literally named `app-design-system`. If the real org has a
different name, rename the scope everywhere:

```sh
# from the repo root, after deciding the real scope (e.g. @acme):
grep -rl "@app-design-system" --include="*.json" --include="*.ts" --include="*.scss" --include="*.md" --include="*.mjs" . \
  | grep -v node_modules \
  | xargs sed -i 's/@app-design-system/@acme/g'
```

Then update `tsconfig.base.json`'s `paths` entries (the sed above covers
these too, since they're plain text) and re-run `pnpm install` so pnpm's
workspace symlinks pick up the renamed packages. Verify with
`nx run-many -t lint test build`.

## 3. Confirm the GitHub Packages registry still resolves

`publishConfig.registry` in each package.json points at
`https://npm.pkg.github.com` - this doesn't need to change, it's
account-agnostic. Just confirm the new repo's GitHub Actions have package
write permission (Settings > Actions > General > Workflow permissions) once
the release workflow is added (see README's "Status" section for what's
still pending).

## 4. Replace placeholder content with the company's real values

- **Brand colors**: `packages/tokens/scripts/generate-palettes.mjs`'s
  `BRANDS` map uses placeholder seed colors approximating
  azure-blue/rose-red/cyan-orange. Swap in the company's real
  per-business-unit brand colors, then rerun
  `nx run tokens:build && nx run theme-angular-material:build && nx run bootstrap-overrides:build`.
- **Component prefix**: components use a `brk-` prefix
  (`BrkButtonComponent`, `<brk-form-field>`, ...) per an explicit choice -
  double check this is still the intended prefix before publishing widely,
  since renaming it later is a breaking change for every consumer.
- **License**: every package.json currently says `MIT`. Confirm this is
  what the company wants for an internal design system (vs. e.g.
  `UNLICENSED`/proprietary) before the first publish.
- **Root `package.json` name** (`@app-design-system/source`): cosmetic,
  rename if desired.

## 5. Still-pending items (not migration-specific, just not built yet)

The release pipeline itself is built and verified end-to-end by
`pnpm release:dry-run` - the only thing standing between it and a real
publish is the scope/org mismatch in step 2 above.

- A GitHub Pages (or other) deploy of the Storybook docs site.
- The separate custom showcase/guidelines website (typography, colors,
  spacing, writing-style guides) - Storybook already carries some of this
  under "Guides/*" (see `apps/docs/src/guides/`), decide whether that's
  sufficient or a dedicated site is still wanted.
