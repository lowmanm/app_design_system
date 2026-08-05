// Compiles each brand's Bootstrap theme entry file (src/themes/<brand>.scss)
// to dist/<brand>.css - one compiled Bootstrap build per business unit.
import * as sass from 'sass';
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { BRANDS } from '../tokens/scripts/generate-palettes.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const loadPaths = [resolve(__dirname, 'node_modules'), resolve(__dirname, '../../node_modules')];

mkdirSync(resolve(__dirname, 'dist'), { recursive: true });

for (const brand of Object.keys(BRANDS)) {
  const result = sass.compile(resolve(__dirname, `src/themes/${brand}.scss`), {
    loadPaths,
    sourceMap: false,
  });
  writeFileSync(resolve(__dirname, `dist/${brand}.css`), result.css);
  console.log(`Wrote dist/${brand}.css`);
}
