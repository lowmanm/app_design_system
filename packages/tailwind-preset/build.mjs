// Generates a plain CommonJS Tailwind preset from the tokens package's built
// JSON output. Deliberately emitted as static JS (not compiled from a .ts
// source consumers would need a bundler to read) so any Tailwind v3
// tailwind.config.js in the org - no matter its own toolchain - can
// `require('@app-design-system/tailwind-preset')` directly. Colors reference
// CSS custom properties (not literal hex) so toggling `data-theme` at
// runtime re-themes Tailwind utility classes too, with no rebuild.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const tokensJsonDir = resolve(__dirname, '../tokens/dist/json');

const readJson = (name) =>
  JSON.parse(readFileSync(resolve(tokensJsonDir, name), 'utf-8'));

const core = readJson('core.json');
// Every brand's theme file has the same semantic color *key* set (only the
// values differ per brand) - since this preset only emits var(--color-*)
// references, not values, which brand we read here doesn't matter.
const colorKeys = Object.keys(
  readJson('brands/azure-blue/theme-light.json').color,
);

const cssVar = (...parts) => `var(--${parts.join('-')})`;

const colors = Object.fromEntries(
  colorKeys.map((key) => [key, cssVar('color', key)]),
);
const spacing = Object.fromEntries(
  Object.keys(core.space).map((key) => [key, cssVar('space', key)]),
);
const borderRadius = Object.fromEntries(
  Object.keys(core.radius).map((key) => [key, cssVar('radius', key)]),
);
const boxShadow = Object.fromEntries(
  Object.keys(core.elevation).map((key) => [key, cssVar('elevation', key)]),
);
const fontSize = Object.fromEntries(
  Object.keys(core.font.size).map((key) => [key, cssVar('font-size', key)]),
);
const fontFamily = Object.fromEntries(
  Object.keys(core.font.family).map((key) => [
    key,
    [cssVar('font-family', key)],
  ]),
);
const fontWeight = Object.fromEntries(
  Object.keys(core.font.weight).map((key) => [key, cssVar('font-weight', key)]),
);
const transitionDuration = Object.fromEntries(
  Object.keys(core.motion.duration).map((key) => [
    key,
    cssVar('motion-duration', key),
  ]),
);
const transitionTimingFunction = Object.fromEntries(
  Object.keys(core.motion.easing).map((key) => [
    key,
    cssVar('motion-easing', key),
  ]),
);

const preset = {
  theme: {
    extend: {
      colors,
      spacing,
      borderRadius,
      boxShadow,
      fontSize,
      fontFamily,
      fontWeight,
      transitionDuration,
      transitionTimingFunction,
    },
  },
};

mkdirSync(resolve(__dirname, 'dist'), { recursive: true });
writeFileSync(
  resolve(__dirname, 'dist/preset.cjs'),
  `module.exports = ${JSON.stringify(preset, null, 2)};\n`,
);
writeFileSync(
  resolve(__dirname, 'dist/preset.mjs'),
  `export default ${JSON.stringify(preset, null, 2)};\n`,
);
console.log('Wrote dist/preset.cjs and dist/preset.mjs');
