// Regenerates one reference/brands/<brand>/color.json per business-unit
// brand, using the same tonal-palette (HCT) algorithm that backs Material
// 3's Theme Builder. Mirrors Angular Material's own prebuilt-theme naming
// (azure-blue, rose-red, cyan-orange) - swap the seed hex values below for
// the org's real per-business-unit brand colors when they're defined; these
// are reasonable placeholders approximating each name.
// Run: node scripts/generate-palettes.mjs
import {
  CorePalette,
  TonalPalette,
  argbFromHex,
  hexFromArgb,
} from '@material/material-color-utilities';
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Shared across every brand - not part of the M3 core role set, but every
// app design system needs them, so they're derived the same tonal way from
// their own fixed seeds rather than varying per brand.
const SUCCESS_SEED_HEX = '#1E8E3E';
const WARNING_SEED_HEX = '#B8860B';

// Each brand is defined by a primary seed color (secondary/neutral/
// neutral-variant/error all auto-derive from it via CorePalette, the same
// HCT hue-rotation math Material's own theme generator uses) and an
// optional explicit tertiary seed, for brands like "cyan-orange" whose
// second hue isn't what auto-derivation from the primary alone would give.
export const BRANDS = {
  'azure-blue': { primary: '#0B5FFF' },
  'rose-red': { primary: '#C2185B' },
  'cyan-orange': { primary: '#00838F', tertiary: '#F4511E' },
};

const TONES = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100];

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

function generateBrandPalettes() {
  const successPalette = CorePalette.of(argbFromHex(SUCCESS_SEED_HEX));
  const warningPalette = CorePalette.of(argbFromHex(WARNING_SEED_HEX));

  for (const [brand, { primary, tertiary }] of Object.entries(BRANDS)) {
    const corePalette = CorePalette.of(argbFromHex(primary));
    const tertiaryPalette = tertiary
      ? TonalPalette.fromInt(argbFromHex(tertiary))
      : corePalette.a3;

    const tokens = {
      palette: {
        $description: `Reference-tier tonal color palette (0-100) for the "${brand}" brand, generated from seed colors via HCT/Material-3 tonal palette math. Do not edit by hand - rerun generate-palettes.mjs after changing BRANDS.`,
        primary: paletteToJson(corePalette.a1),
        secondary: paletteToJson(corePalette.a2),
        tertiary: paletteToJson(tertiaryPalette),
        neutral: paletteToJson(corePalette.n1),
        'neutral-variant': paletteToJson(corePalette.n2),
        error: paletteToJson(corePalette.error),
        success: paletteToJson(successPalette.a1),
        warning: paletteToJson(warningPalette.a1),
      },
    };

    const outDir = resolve(__dirname, `../src/reference/brands/${brand}`);
    mkdirSync(outDir, { recursive: true });
    const outFile = resolve(outDir, 'color.json');
    writeFileSync(outFile, `${JSON.stringify(tokens, null, 2)}\n`);
    console.log(
      `Wrote ${outFile} (primary ${primary}${tertiary ? `, tertiary ${tertiary}` : ''})`,
    );
  }
}

// Only run when executed directly (`node generate-palettes.mjs`) - other
// packages import this module just for the BRANDS list and must not trigger
// tokens' own file-writing as a side effect of that import.
if (
  process.argv[1] &&
  import.meta.url === new URL(`file://${process.argv[1]}`).href
) {
  generateBrandPalettes();
}
