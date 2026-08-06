// Shared helpers for the two packages that emit one compiled stylesheet per
// business-unit brand (theme-angular-material, bootstrap-overrides). Both
// previously carried byte-identical copies of the compile loop and their own
// hand-written per-brand entry files; both now generate those entries and
// share this loop, so adding a brand to packages/tokens' BRANDS map is the
// only edit required.
import * as sass from 'sass';
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { BRANDS } from '../../packages/tokens/scripts/generate-palettes.mjs';

export const brandNames = () => Object.keys(BRANDS);

/**
 * Writes one entry .scss per brand into `<packageDir>/src/themes/`.
 * `renderEntry(brand)` returns that file's contents.
 */
export function generateBrandEntries(packageDir, renderEntry) {
  const outDir = resolve(packageDir, 'src/themes');
  mkdirSync(outDir, { recursive: true });
  for (const brand of brandNames()) {
    writeFileSync(resolve(outDir, `${brand}.scss`), renderEntry(brand));
  }
  console.log(
    `Wrote src/themes/{${brandNames().join(',')}}.scss (${brandNames().length} brands)`,
  );
}

/** Compiles every `src/themes/<brand>.scss` to `dist/<brand>.css`. */
export function compileBrandThemes(packageDir) {
  const loadPaths = [
    resolve(packageDir, 'node_modules'),
    resolve(packageDir, '../../node_modules'),
  ];
  mkdirSync(resolve(packageDir, 'dist'), { recursive: true });

  for (const brand of brandNames()) {
    const result = sass.compile(
      resolve(packageDir, `src/themes/${brand}.scss`),
      { loadPaths, sourceMap: false },
    );
    writeFileSync(resolve(packageDir, `dist/${brand}.css`), result.css);
    console.log(`Wrote dist/${brand}.css`);
  }
}
