// Style Dictionary build: transforms the reference/semantic token source of
// truth into every consumer's format - CSS custom properties (universal
// contract), SCSS variables/maps (for Bootstrap consumers), and a flat JSON
// token map (consumed by the Tailwind preset package). Every non-Angular and
// Angular consumer ultimately derives from these same generated values.
import StyleDictionary from 'style-dictionary';
import { formats, transformGroups } from 'style-dictionary/enums';

const { cssVariables, scssVariables, jsonNested } = formats;
const { css, scss } = transformGroups;

const THEMES = [
  { name: 'light', selector: ':root, [data-theme="light"]', file: 'src/semantic/color.light.json' },
  { name: 'dark', selector: '[data-theme="dark"]', file: 'src/semantic/color.dark.json' },
  { name: 'high-contrast', selector: '[data-theme="high-contrast"]', file: 'src/semantic/color.hc.json' },
];

const CORE_SOURCE = [
  'src/reference/typography.json',
  'src/reference/spacing.json',
  'src/reference/radius.json',
  'src/reference/elevation.json',
  'src/reference/motion.json',
];

async function buildCore() {
  const sd = new StyleDictionary({
    source: CORE_SOURCE,
    platforms: {
      css: {
        transformGroup: css,
        buildPath: 'dist/css/',
        files: [{ destination: 'core.css', format: cssVariables, options: { selector: ':root' } }],
      },
      scss: {
        transformGroup: scss,
        buildPath: 'dist/scss/',
        files: [{ destination: '_core.scss', format: scssVariables }],
      },
      json: {
        transformGroup: css,
        buildPath: 'dist/json/',
        files: [{ destination: 'core.json', format: jsonNested }],
      },
    },
  });
  await sd.buildAllPlatforms();
}

async function buildTheme({ name, selector, file }) {
  // Palette (reference) tokens are sourced only to resolve semantic
  // references (outputReferences: false bakes them to literal hex) - they
  // are deliberately excluded from every theme's own output via the filter
  // below so the raw 0-100 tonal scale isn't duplicated three times over.
  const semanticOnly = (token) => token.filePath === file;
  const sd = new StyleDictionary({
    source: ['src/reference/color.json', file],
    platforms: {
      css: {
        transformGroup: css,
        buildPath: 'dist/css/',
        files: [
          {
            destination: `theme-${name}.css`,
            format: cssVariables,
            filter: semanticOnly,
            options: { selector, outputReferences: false },
          },
        ],
      },
      scss: {
        transformGroup: scss,
        buildPath: 'dist/scss/',
        files: [
          {
            destination: `_theme-${name}.scss`,
            format: scssVariables,
            filter: semanticOnly,
            options: { outputReferences: false },
          },
        ],
      },
      json: {
        transformGroup: css,
        buildPath: 'dist/json/',
        files: [{ destination: `theme-${name}.json`, format: jsonNested, filter: semanticOnly }],
      },
    },
  });
  await sd.buildAllPlatforms();
}

async function buildPalette() {
  // The full 0-100 tonal scale, emitted once (unscoped) for advanced
  // consumers (e.g. data-visualization) that need finer-grained tones than
  // the semantic layer exposes. Most consumers should use the theme files.
  const sd = new StyleDictionary({
    source: ['src/reference/color.json'],
    platforms: {
      css: {
        transformGroup: css,
        buildPath: 'dist/css/',
        files: [{ destination: 'palette.css', format: cssVariables, options: { selector: ':root' } }],
      },
      scss: {
        transformGroup: scss,
        buildPath: 'dist/scss/',
        files: [{ destination: '_palette.scss', format: scssVariables }],
      },
      json: {
        transformGroup: css,
        buildPath: 'dist/json/',
        files: [{ destination: 'palette.json', format: jsonNested }],
      },
    },
  });
  await sd.buildAllPlatforms();
}

console.log('Building design tokens...');
await buildCore();
await buildPalette();
for (const theme of THEMES) {
  await buildTheme(theme);
}
console.log('Token build complete -> dist/css, dist/scss, dist/json');
