---
'@app-design-system/theme-angular-material': minor
'@app-design-system/tokens': minor
'@app-design-system/header': minor
'@app-design-system/icon': minor
'@app-design-system/menu': minor
---

Foundations: shipped typefaces, a semantic type scale, and an icon system.

`@app-design-system/tokens` now ships the typefaces it had only named. Inter
and JetBrains Mono are self-hosted as `css/fonts.css` + `fonts/*.woff2`;
previously every consumer silently fell back to `system-ui`. It also gains a
semantic type scale (`--type-{display,headline,title,body,label}-{lg,md,sm}-*`),
a letter-spacing scale, icon-size tokens, `.brk-type-*` utility classes and a
`brk-type()` Sass mixin.

`@app-design-system/theme-angular-material` bridges Material's `--mat-sys-*`
typography roles to that scale, so Angular, Tailwind and Bootstrap consumers
render headings at the same size.

New `@app-design-system/icon`: `<brk-icon>` and a `.brk-icon` class over
Material Symbols Outlined, self-hosted. Icons are decorative by default and
inherit their colour. `header` and `menu` use it in their stories.

Both new stylesheets must be loaded by consumers - see each package's README.
