// Ships the typefaces the tokens only *named* until now.
//
// reference/typography.json has always declared `Inter` and `JetBrains
// Mono`, but nothing in this repo ever supplied them - no @font-face, no
// CDN link - so every consumer silently fell through to `system-ui` and the
// design system had never actually rendered in its own typeface.
//
// This copies the variable woff2 files out of the @fontsource-variable
// packages and emits a dist/css/fonts.css that declares them. Two rewrites
// make that output usable, and both matter:
//
//   1. Fontsource names its variable families `Inter Variable` /
//      `JetBrains Mono Variable`. The tokens say `Inter` / `JetBrains
//      Mono`. Shipping fontsource's CSS unedited would declare a family
//      nothing references - the exact silent fallback this fixes - so the
//      family name is rewritten to whatever typography.json declares.
//      typography.json stays the single source of truth for the name.
//   2. `url(./files/x.woff2)` becomes `url(../fonts/x.woff2)`, relative to
//      the emitted CSS's own location in dist/css/.
//
// Only the `wght` (weight-axis) cuts are shipped: they are what the type
// scale in semantic/typography.json actually varies (400-700), and they are
// ~35% smaller than the equivalent `opsz`/`standard` cuts. Every unicode
// subset is included - each is a separate @font-face gated by
// `unicode-range`, so a Latin-only page downloads only the Latin file and
// the others cost nothing at runtime.
// Run: node scripts/generate-fonts.mjs
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

const packageDir = resolve(__dirname, '..');
const fontsOutDir = resolve(packageDir, 'dist/fonts');
const cssOutFile = resolve(packageDir, 'dist/css/fonts.css');

const FONTS = [
  { package: '@fontsource-variable/inter', tokenPath: ['sans'] },
  { package: '@fontsource-variable/jetbrains-mono', tokenPath: ['mono'] },
];

// Both axis cuts per font: upright and italic. Fontsource splits them into
// separate stylesheets, and omitting the italic one leaves the browser to
// synthesise a slanted fake.
const AXIS_STYLESHEETS = ['wght.css', 'wght-italic.css'];

/**
 * The family name typography.json declares, e.g. `Inter`, without the
 * fallback stack and without the quoting the CSS value carries.
 */
function declaredFamily(typography, [key]) {
  const value = typography.font.family[key]?.$value;
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(
      `reference/typography.json has no font.family.${key} array to take a family name from.`,
    );
  }
  return String(value[0]).replace(/^['"]|['"]$/g, '');
}

export function generateFonts() {
  const typography = JSON.parse(
    readFileSync(resolve(packageDir, 'src/reference/typography.json'), 'utf8'),
  );

  mkdirSync(fontsOutDir, { recursive: true });
  mkdirSync(dirname(cssOutFile), { recursive: true });

  const blocks = [];
  let copied = 0;

  for (const font of FONTS) {
    const family = declaredFamily(typography, font.tokenPath);
    const fontPackageDir = dirname(
      require.resolve(`${font.package}/package.json`),
    );

    for (const stylesheet of AXIS_STYLESHEETS) {
      const source = readFileSync(resolve(fontPackageDir, stylesheet), 'utf8');

      // Copy every woff2 this stylesheet references, then re-point the URL
      // at where it now lives relative to dist/css/fonts.css.
      const rewritten = source.replace(
        /url\(\.\/files\/([\w.-]+\.woff2)\)/g,
        (_match, file) => {
          copyFileSync(
            resolve(fontPackageDir, 'files', file),
            resolve(fontsOutDir, file),
          );
          copied += 1;
          return `url(../fonts/${file})`;
        },
      );

      blocks.push(
        rewritten.replace(
          /font-family:\s*'[^']+'/g,
          `font-family: '${family}'`,
        ),
      );
    }
  }

  writeFileSync(
    cssOutFile,
    `/**\n * Do not edit directly, this file was auto-generated.\n */\n\n${blocks
      .join('\n')
      .trim()}\n`,
  );

  console.log(
    `Fonts: ${copied} woff2 files -> dist/fonts, @font-face rules -> dist/css/fonts.css`,
  );
}

// Only run when executed directly - build.mjs imports and calls this so a
// single Nx target owns all of dist/, rather than two targets writing into
// the same output directory and clobbering each other's cache restore.
if (
  process.argv[1] &&
  import.meta.url === new URL(`file://${process.argv[1]}`).href
) {
  generateFonts();
}
