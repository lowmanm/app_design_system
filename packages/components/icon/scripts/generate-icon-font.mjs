// Emits this package's shipped stylesheet and the font it depends on.
//
// Two things come out of here, into the ng-packagr output directory so they
// publish alongside the compiled component:
//
//   dist/fonts/material-symbols-outlined.woff2   the variable font
//   dist/css/icons.css                           @font-face + `.brk-icon`
//
// The `.brk-icon` class carries *all* of the icon's styling, and
// BrkIconComponent deliberately has no stylesheet of its own. Material
// Symbols is a ligature font, so an icon is really just text in a particular
// family - and putting that in one global class is what lets Tailwind,
// Bootstrap and plain-HTML consumers write `<span class="brk-icon">settings
// </span>` and get exactly what the Angular component renders. Duplicating
// the rules into component styles would give the two consumers two
// independently-drifting definitions of the same thing.
//
// Sizes are emitted from @app-design-system/tokens' own `--icon-size-*`
// tokens rather than restated here, so the class list can't drift from the
// component's IconSize union.
// Run: node scripts/generate-icon-font.mjs
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

const packageDir = resolve(__dirname, '..');
// Written into the built package, not the source tree - this is publishable
// output, and it must sit next to the fesm bundles ng-packagr emits.
const distDir = resolve(packageDir, '../../../dist/packages/components/icon');

export const FONT_FAMILY = 'Material Symbols Outlined';
export const FONT_FILE = 'material-symbols-outlined.woff2';

// The `full` cut carries all four variable axes - FILL, wght, GRAD and opsz -
// which is what BrkIconComponent's inputs expose. It is ~3.8 MB, and that is
// a deliberate, documented choice; see this package's README under "Size".
// The narrower cuts fontsource also ships (`wght` alone, `fill` alone) are a
// third of the size but would leave documented inputs silently doing
// nothing, and a third of 3.8 MB is still not "small" - the deployment
// decision doesn't change, only the failure mode does.
const FONT_SOURCE = 'files/material-symbols-outlined-latin-full-normal.woff2';

/** The `--icon-size-*` token values, as `{ sm: '1.25rem', ... }`. */
function iconSizeTokens() {
  const coreCss = readFileSync(
    require.resolve('@app-design-system/tokens/css/core.css'),
    'utf8',
  );
  const sizes = Object.fromEntries(
    [...coreCss.matchAll(/--icon-size-(\w+):\s*([^;]+);/g)].map(
      ([, name, value]) => [name, value.trim()],
    ),
  );
  if (Object.keys(sizes).length === 0) {
    throw new Error(
      'No --icon-size-* tokens found in @app-design-system/tokens - has the token build run?',
    );
  }
  return sizes;
}

export function generateIconFont() {
  const fontPackageDir = dirname(
    require.resolve('@fontsource-variable/material-symbols-outlined/package.json'),
  );

  mkdirSync(resolve(distDir, 'fonts'), { recursive: true });
  mkdirSync(resolve(distDir, 'css'), { recursive: true });

  copyFileSync(
    resolve(fontPackageDir, FONT_SOURCE),
    resolve(distDir, 'fonts', FONT_FILE),
  );

  const sizes = iconSizeTokens();
  const sizeRules = Object.entries(sizes)
    .map(
      ([name, value]) =>
        `.brk-icon--${name}.brk-icon--${name} {\n  font-size: var(--icon-size-${name}, ${value});\n}`,
    )
    .join('\n\n');

  const css = `/**
 * Do not edit directly, this file was auto-generated.
 */

@font-face {
  font-family: '${FONT_FAMILY}';
  font-style: normal;
  /* \`block\` rather than \`swap\`, unlike the text fonts: until this font
     loads, the ligature text is the literal glyph name, so a fallback face
     would flash the word "settings" before showing the icon. A brief blank
     is the better failure. */
  font-display: block;
  font-weight: 100 700;
  src: url(../fonts/${FONT_FILE}) format('woff2-variations');
}

/*
 * The class is doubled deliberately, here and on every size modifier below.
 *
 * An icon is text that a font substitutes for a glyph, so \`font-family\`
 * isn't cosmetic here - lose it and the element renders the literal word
 * "settings". Ambient typography resets (Tailwind Preflight, Bootstrap
 * Reboot, a docs site's prose styles) routinely set font-family on
 * descendant elements at (0,1,0), which ties with a single class and then
 * wins on source order. Storybook's own docs reset does exactly this, via
 * \`:where()\` - which contributes zero specificity - and it silently beat
 * this file until the selectors were doubled.
 *
 * (0,2,0) clears that class of collision without \`!important\`, so a
 * consumer can still override any of it from a rule of their own.
 */
.brk-icon.brk-icon {
  font-family: '${FONT_FAMILY}';
  /* The variable \`wght\` axis carries weight; a bold parent must not also
     synthesise one on top of it. */
  font-weight: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  /* Ligature substitution is the whole mechanism - it maps the text
     "settings" to the glyph. Safari still needs the prefixed property. */
  font-feature-settings: 'liga';
  -webkit-font-feature-settings: 'liga';
  -webkit-font-smoothing: antialiased;
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;

  display: inline-block;
  flex-shrink: 0;
  /* A square box of exactly the font size, so surrounding layout is stable
     whether or not the font has loaded, and \`overflow: hidden\` keeps the
     un-substituted glyph name from spilling if it hasn't. */
  width: 1em;
  height: 1em;
  overflow: hidden;
  vertical-align: middle;

  direction: ltr;
  white-space: nowrap;
  word-wrap: normal;
  /* Icons take the colour of the text they sit beside - a menu item's icon
     should go red with a danger item without being told to. */
  color: inherit;
  user-select: none;
  font-size: var(--icon-size-md, ${sizes['md'] ?? '1.5rem'});
}

${sizeRules}
`;

  writeFileSync(resolve(distDir, 'css/icons.css'), css);

  console.log(
    `Icon font: ${FONT_FILE} -> dist/fonts, ${Object.keys(sizes).length} size classes -> dist/css/icons.css`,
  );
}

if (
  process.argv[1] &&
  import.meta.url === new URL(`file://${process.argv[1]}`).href
) {
  generateIconFont();
}
