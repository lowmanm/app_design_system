import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { BRAND_NAMES } from '@app-design-system/tokens';

// This package compiles Sass to CSS, so there is nothing importable to
// unit-test - these assert against the compiled output instead. They exist
// because the package previously had no test target at all: a Sass change
// that silently dropped the token bridge, or a brand whose theme file
// stopped being emitted, would have shipped with lint and build both green.
// Requires `nx run theme-angular-material:build` first (wired via the
// test target's dependsOn in project.json).

const distDir = resolve(dirname(fileURLToPath(import.meta.url)), '../dist');
const brands = [...BRAND_NAMES];
const readBrandCss = (brand: string) =>
  readFileSync(resolve(distDir, `${brand}.css`), 'utf8');

describe('compiled Angular Material themes', () => {
  it('emits one stylesheet per brand in the tokens brand list', () => {
    expect(brands.length).toBeGreaterThan(0);
    for (const brand of brands) {
      expect(() => readBrandCss(brand)).not.toThrow();
    }
  });

  it.each(brands)('%s defines all three theme modes', (brand) => {
    const css = readBrandCss(brand);
    expect(css).toContain('[data-theme=light]');
    expect(css).toContain('[data-theme=dark]');
    expect(css).toContain('[data-theme=high-contrast]');
  });

  it.each(brands)(
    '%s points Material colour roles at the tokens, not at hard-coded values',
    (brand) => {
      const css = readBrandCss(brand);
      // The bridge is what keeps Angular Material, Tailwind and Bootstrap
      // rendering the *same* colour rather than two similar ones derived by
      // different M3 role algorithms. If `mat.theme()`'s own literal output
      // were the last declaration to win, this would fail.
      expect(css).toContain('--mat-sys-primary: var(--color-primary)');
      expect(css).toContain('--mat-sys-on-surface: var(--color-on-surface)');
      expect(css).toContain('--mat-sys-error: var(--color-error)');
    },
  );

  it('gives each brand a distinct palette', () => {
    const palettes = brands.map((brand) => {
      const match = readBrandCss(brand).match(
        /--mat-sys-primary-container:\s*(#[0-9a-f]{6})/i,
      );
      return match?.[1];
    });
    expect(palettes.every(Boolean)).toBe(true);
    expect(new Set(palettes).size).toBe(brands.length);
  });
});
