// Regenerates src/reference/color.json from brand seed colors using the same
// tonal-palette algorithm (HCT) that backs Material 3's Theme Builder.
// Run: node scripts/generate-palettes.mjs
import { CorePalette, argbFromHex, hexFromArgb } from '@material/material-color-utilities';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Placeholder brand seeds - swap for the org's real brand colors.
const SEED_HEX = '#0B5FFF';
// Success/warning aren't part of the core M3 role set, but every app design
// system needs them; we derive them the same tonal way from separate seeds.
const SUCCESS_SEED_HEX = '#1E8E3E';
const WARNING_SEED_HEX = '#B8860B';

const TONES = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100];

const corePalette = CorePalette.of(argbFromHex(SEED_HEX));
const successPalette = CorePalette.of(argbFromHex(SUCCESS_SEED_HEX));
const warningPalette = CorePalette.of(argbFromHex(WARNING_SEED_HEX));

const paletteToJson = (tonalPalette) => {
  const scale = {};
  for (const tone of TONES) {
    scale[String(tone)] = {
      $type: 'color',
      $value: hexFromArgb(tonalPalette.tone(tone)),
    };
  }
  return scale;
};

const tokens = {
  palette: {
    $description:
      'Reference-tier tonal color palettes (0-100), generated from brand seed colors via HCT/Material-3 tonal palette math. Do not edit by hand - rerun generate-palettes.mjs after changing SEED_HEX.',
    primary: paletteToJson(corePalette.a1),
    secondary: paletteToJson(corePalette.a2),
    tertiary: paletteToJson(corePalette.a3),
    neutral: paletteToJson(corePalette.n1),
    'neutral-variant': paletteToJson(corePalette.n2),
    error: paletteToJson(corePalette.error),
    success: paletteToJson(successPalette.a1),
    warning: paletteToJson(warningPalette.a1),
  },
};

const outFile = resolve(__dirname, '../src/reference/color.json');
writeFileSync(outFile, `${JSON.stringify(tokens, null, 2)}\n`);
console.log(`Wrote ${outFile} from seed ${SEED_HEX}`);
