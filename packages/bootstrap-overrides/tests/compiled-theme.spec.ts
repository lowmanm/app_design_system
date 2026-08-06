import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { BRAND_NAMES } from '@app-design-system/tokens';

// Compiled-output assertions, for the same reason as the sibling suite in
// packages/theme-angular-material: this package emits CSS rather than
// modules, and previously had no test target, so a Sass regression could
// ship with lint and build green.
// Requires `nx run bootstrap-overrides:build` first (wired via the test
// target's dependsOn in project.json).

const distDir = resolve(dirname(fileURLToPath(import.meta.url)), '../dist');
const brands = [...BRAND_NAMES];
const readBrandCss = (brand: string) =>
  readFileSync(resolve(distDir, `${brand}.css`), 'utf8');

describe('compiled Bootstrap themes', () => {
  it('emits one stylesheet per brand in the tokens brand list', () => {
    expect(brands.length).toBeGreaterThan(0);
    for (const brand of brands) {
      expect(() => readBrandCss(brand)).not.toThrow();
    }
  });

  it.each(brands)('%s compiles real Bootstrap component CSS', (brand) => {
    const css = readBrandCss(brand);
    expect(css).toContain('.btn-primary');
    expect(css).toContain('.form-control');
    expect(css).toContain('--bs-primary');
  });

  it.each(brands)('%s bakes its brand tokens in at compile time', (brand) => {
    // The per-brand bundle is Sass-compiled, so token values land as
    // literals here. Runtime theme switching is a separate concern, handled
    // by runtime-theme-bridge.css below - these two files are what a
    // Bootstrap consumer loads together.
    const css = readBrandCss(brand);
    expect(css).toMatch(/--bs-primary:\s*#[0-9a-f]{6}/i);
  });

  it('ships a runtime bridge that re-points Bootstrap at the live tokens', () => {
    // Without this file a consumer's `setTheme('dark')` would leave every
    // Bootstrap surface on its compile-time light-mode colour.
    const bridge = readFileSync(
      resolve(distDir, '../src/runtime-theme-bridge.css'),
      'utf8',
    );
    expect(bridge).toContain('--bs-body-bg: var(--color-surface)');
    expect(bridge).toContain('--bs-body-color: var(--color-on-surface)');
    expect(bridge).toContain('--bs-primary: var(--color-primary)');
  });

  it('gives each brand a distinct primary', () => {
    const primaries = brands.map((brand) => {
      const match = readBrandCss(brand).match(
        /--bs-primary:\s*(#[0-9a-f]{6})/i,
      );
      return match?.[1];
    });
    expect(primaries.every(Boolean)).toBe(true);
    expect(new Set(primaries).size).toBe(brands.length);
  });
});
