// Themes Storybook's own chrome (sidebar, toolbar) to match the design
// system, and keeps it in sync with the preview's Brand/Theme toolbar
// globals, so flipping either flips the *whole* page rather than just the
// component canvas. Wired via `addons.register` listening for the core
// GLOBALS_UPDATED event, rather than a custom event emitted from preview.ts:
// GLOBALS_UPDATED is the manager's own event for "a global changed",
// guaranteed to fire here since the manager owns global state in the first
// place - a custom event emitted from inside the preview iframe turned out
// not to reliably cross back to the manager's channel instance.
//
// The manager runs in an isolated bundle with no access to the app's
// stylesheets, so it cannot read --color-* at runtime and needs literal
// values at build time. Those come from appearance-data.json, generated from
// packages/tokens by scripts/generate-appearance-data.mjs - previously they
// were hand-copied here, which meant this file silently encoded both 18 hex
// values and the tonal-step choice behind each one.
import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming/create';
import { GLOBALS_UPDATED } from 'storybook/internal/core-events';
import appearanceData from './appearance-data.json';

// A JSON import widens its arrays to string[], so the shape has to be
// restated here for indexing to typecheck. Field names must match what
// scripts/generate-appearance-data.mjs writes.
interface ChromeColors {
  primary: string;
  onPrimary: string;
  appBg: string;
  appContentBg: string;
  appBorderColor: string;
  textColor: string;
  textMutedColor: string;
  inverseText: string;
}
interface AppearanceData {
  brands: string[];
  modes: string[];
  themes: Record<string, Record<string, ChromeColors>>;
}

const appearance = appearanceData as AppearanceData;

type Mode = string;
type Brand = string;

const DEFAULT_BRAND: Brand = appearance.brands[0]!;
const DEFAULT_MODE: Mode = 'light';

const isBrand = (value: unknown): value is Brand =>
  typeof value === 'string' && appearance.brands.includes(value);

const isMode = (value: unknown): value is Mode =>
  typeof value === 'string' && appearance.modes.includes(value);

function buildTheme(brand: Brand, mode: Mode) {
  const t =
    appearance.themes[brand]?.[mode] ??
    appearance.themes[DEFAULT_BRAND]![DEFAULT_MODE]!;
  return create({
    // Storybook only understands light/dark for its own base styling;
    // high-contrast is a light-grounded theme, so it maps to 'light' and
    // gets its contrast from the token values below.
    base: mode === 'dark' ? 'dark' : 'light',
    colorPrimary: t.primary,
    colorSecondary: t.primary,
    appBg: t.appBg,
    appContentBg: t.appContentBg,
    appPreviewBg: t.appContentBg,
    appBorderColor: t.appBorderColor,
    appBorderRadius: 8,
    textColor: t.textColor,
    textInverseColor: t.inverseText,
    textMutedColor: t.textMutedColor,
    barBg: t.appContentBg,
    barTextColor: t.textMutedColor,
    barSelectedColor: t.primary,
    barHoverColor: t.primary,
    inputBg: t.appContentBg,
    inputBorder: t.appBorderColor,
    inputTextColor: t.textColor,
    inputBorderRadius: 6,
    fontBase:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    fontCode: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace',
    brandTitle: 'App Design System',
    brandUrl: '.',
    brandImage: logoDataUri(t.primary, t.onPrimary),
    brandTarget: '_self',
  });
}

function logoDataUri(bg: string, fg: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28"><rect width="28" height="28" rx="6" fill="${bg}"/><text x="14" y="19.5" font-family="Arial, sans-serif" font-size="14" font-weight="700" fill="${fg}" text-anchor="middle">B</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

addons.setConfig({ theme: buildTheme(DEFAULT_BRAND, DEFAULT_MODE) });

addons.register('brk/theme-sync', (api) => {
  api.on(
    GLOBALS_UPDATED,
    ({ globals }: { globals: Record<string, unknown> }) => {
      const brand = isBrand(globals['brand'])
        ? globals['brand']
        : DEFAULT_BRAND;
      const mode = isMode(globals['theme']) ? globals['theme'] : DEFAULT_MODE;
      addons.setConfig({ theme: buildTheme(brand, mode) });
    },
  );
});
