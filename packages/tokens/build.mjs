// Style Dictionary build: transforms the reference/semantic token source of
// truth into every consumer's format - CSS custom properties (universal
// contract), SCSS variables/maps (for Bootstrap consumers), and a flat JSON
// token map (consumed by the Tailwind preset package). Every non-Angular and
// Angular consumer ultimately derives from these same generated values.
//
// Color is brand-specific (see scripts/generate-palettes.mjs and BRANDS
// below) - typography/spacing/radius/elevation/motion are shared across
// every business unit's brand, so "core" builds once, unscoped by brand.
import StyleDictionary from 'style-dictionary';
import { formats, transformGroups } from 'style-dictionary/enums';
import { BRANDS } from './scripts/generate-palettes.mjs';

const { cssVariables, scssVariables, jsonNested } = formats;
const { css, scss } = transformGroups;

// Bootstrap (and plenty of hand-written CSS) builds translucent colors with
// `rgba(var(--x-rgb), .5)`, which needs a bare "r, g, b" triplet - a hex
// custom property cannot be used that way, and CSS has no runtime hex->rgb
// conversion. Emitting a companion `--color-*-rgb` for every semantic color
// is what lets those opacity utilities follow a runtime theme change instead
// of staying frozen at their compile-time value.
const CSS_RGB_TRIPLET_FORMAT = 'css/variables-with-rgb';

StyleDictionary.registerFormat({
  name: CSS_RGB_TRIPLET_FORMAT,
  format: async function ({ dictionary, file, options }) {
    const base = await StyleDictionary.hooks.formats[cssVariables]({
      dictionary,
      file,
      options,
      platform: {},
    });
    const triplets = dictionary.allTokens
      .filter((token) => /^#[0-9a-f]{6}$/i.test(String(token.$value)))
      .map((token) => {
        const hex = String(token.$value);
        const [r, g, b] = [1, 3, 5].map((i) =>
          parseInt(hex.slice(i, i + 2), 16),
        );
        return `  --${token.name}-rgb: ${r}, ${g}, ${b};`;
      });
    if (triplets.length === 0) {
      return base;
    }
    // Splice the triplets in before the closing brace of the block the base
    // formatter just produced, so both live under the same theme selector.
    const closing = base.lastIndexOf('}');
    return `${base.slice(0, closing)}${triplets.join('\n')}\n${base.slice(closing)}`;
  },
});

const THEMES = [
  {
    name: 'light',
    selector: ':root, [data-theme="light"]',
    file: 'src/semantic/color.light.json',
  },
  {
    name: 'dark',
    selector: '[data-theme="dark"]',
    file: 'src/semantic/color.dark.json',
  },
  {
    name: 'high-contrast',
    selector: '[data-theme="high-contrast"]',
    file: 'src/semantic/color.hc.json',
  },
];

const CORE_SOURCE = [
  'src/reference/typography.json',
  'src/reference/spacing.json',
  'src/reference/radius.json',
  'src/reference/elevation.json',
  'src/reference/motion.json',
  'src/reference/size.json',
];

async function buildCore() {
  const sd = new StyleDictionary({
    source: CORE_SOURCE,
    platforms: {
      css: {
        transformGroup: css,
        buildPath: 'dist/css/',
        files: [
          {
            destination: 'core.css',
            format: cssVariables,
            options: { selector: ':root' },
          },
        ],
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

async function buildBrandTheme(brand, { name, selector, file }) {
  const brandPalette = `src/reference/brands/${brand}/color.json`;
  // Palette (reference) tokens are sourced only to resolve semantic
  // references (outputReferences: false bakes them to literal hex) - they
  // are deliberately excluded from every theme's own output via the filter
  // below so the raw 0-100 tonal scale isn't duplicated three times over.
  const semanticOnly = (token) => token.filePath === file;
  const sd = new StyleDictionary({
    source: [brandPalette, file],
    platforms: {
      css: {
        transformGroup: css,
        buildPath: `dist/css/brands/${brand}/`,
        files: [
          {
            destination: `theme-${name}.css`,
            format: CSS_RGB_TRIPLET_FORMAT,
            filter: semanticOnly,
            options: { selector, outputReferences: false },
          },
        ],
      },
      scss: {
        transformGroup: scss,
        buildPath: `dist/scss/brands/${brand}/`,
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
        buildPath: `dist/json/brands/${brand}/`,
        files: [
          {
            destination: `theme-${name}.json`,
            format: jsonNested,
            filter: semanticOnly,
          },
        ],
      },
    },
  });
  await sd.buildAllPlatforms();
}

async function buildBrandPalette(brand) {
  // The full 0-100 tonal scale for this brand, emitted once (unscoped) for
  // advanced consumers (e.g. data-visualization, or theme-angular-material's
  // Sass palette generation) that need finer-grained tones than the
  // semantic layer exposes. Most consumers should use the theme files.
  const sd = new StyleDictionary({
    source: [`src/reference/brands/${brand}/color.json`],
    platforms: {
      css: {
        transformGroup: css,
        buildPath: `dist/css/brands/${brand}/`,
        files: [
          {
            destination: 'palette.css',
            format: cssVariables,
            options: { selector: ':root' },
          },
        ],
      },
      scss: {
        transformGroup: scss,
        buildPath: `dist/scss/brands/${brand}/`,
        files: [{ destination: '_palette.scss', format: scssVariables }],
      },
      json: {
        transformGroup: css,
        buildPath: `dist/json/brands/${brand}/`,
        files: [{ destination: 'palette.json', format: jsonNested }],
      },
    },
  });
  await sd.buildAllPlatforms();
}

console.log('Building design tokens...');
await buildCore();
for (const brand of Object.keys(BRANDS)) {
  await buildBrandPalette(brand);
  for (const theme of THEMES) {
    await buildBrandTheme(brand, theme);
  }
}
console.log(
  `Token build complete for brands: ${Object.keys(BRANDS).join(', ')} -> dist/css, dist/scss, dist/json`,
);
