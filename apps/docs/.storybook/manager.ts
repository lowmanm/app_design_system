// Themes Storybook's own chrome (sidebar, toolbar) to match the design
// system, instead of Storybook's default look - and keeps it in sync with
// the preview's Brand/Theme toolbar globals, so flipping either flips the
// *whole* page, not just the component canvas. Wired via `addons.register`
// listening for the core `GLOBALS_UPDATED` event, rather than a custom
// event emitted from preview.ts: GLOBALS_UPDATED is the manager's own
// event for "a global changed," guaranteed to fire here since the manager
// is what owns global state in the first place - a custom event emitted
// from inside the preview iframe turned out not to reliably cross back to
// the manager's channel instance.
//
// This file runs in an isolated "manager" bundle with no access to the
// app's own CSS custom properties, so the colors below are duplicated from
// packages/tokens' source of truth rather than read live - keep in sync
// with packages/tokens/src/semantic/color.{light,dark,hc}.json and
// .../reference/brands/*/color.json if those change.
import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming/create';
import { GLOBALS_UPDATED } from 'storybook/internal/core-events';

type Mode = 'light' | 'dark' | 'high-contrast';
type Brand = 'azure-blue' | 'rose-red' | 'cyan-orange';

const BRAND_PRIMARY: Record<Brand, Record<Mode, string>> = {
  'azure-blue': { light: '#003cac', dark: '#8da8ff', 'high-contrast': '#00297b' },
  'rose-red': { light: '#8f003f', dark: '#ff85a4', 'high-contrast': '#66002b' },
  'cyan-orange': { light: '#004f56', dark: '#21bccc', 'high-contrast': '#00363c' },
};

const BRAND_ON_PRIMARY: Record<Brand, Record<Mode, string>> = {
  'azure-blue': { light: '#ffffff', dark: '#00164d', 'high-contrast': '#ffffff' },
  'rose-red': { light: '#ffffff', dark: '#3f0018', 'high-contrast': '#ffffff' },
  'cyan-orange': { light: '#ffffff', dark: '#001f23', 'high-contrast': '#ffffff' },
};

const MODE_BASE = {
  light: {
    base: 'light' as const,
    appBg: '#f5f7fb',
    appContentBg: '#ffffff',
    appPreviewBg: '#ffffff',
    appBorderColor: '#e1e5ec',
    textColor: '#0f172a',
    textInverseColor: '#ffffff',
    textMutedColor: '#67717f',
    barBg: '#ffffff',
    barTextColor: '#67717f',
    inputBg: '#ffffff',
    inputBorder: '#e1e5ec',
    inputTextColor: '#0f172a',
  },
  dark: {
    base: 'dark' as const,
    appBg: '#0e1420',
    appContentBg: '#151c2a',
    appPreviewBg: '#151c2a',
    appBorderColor: '#232c3d',
    textColor: '#eef1f7',
    textInverseColor: '#0e1420',
    textMutedColor: '#8b94a6',
    barBg: '#151c2a',
    barTextColor: '#8b94a6',
    inputBg: '#0e1420',
    inputBorder: '#232c3d',
    inputTextColor: '#eef1f7',
  },
  'high-contrast': {
    base: 'light' as const,
    appBg: '#ffffff',
    appContentBg: '#ffffff',
    appPreviewBg: '#ffffff',
    appBorderColor: '#000000',
    textColor: '#000000',
    textInverseColor: '#ffffff',
    textMutedColor: '#000000',
    barBg: '#ffffff',
    barTextColor: '#000000',
    inputBg: '#ffffff',
    inputBorder: '#000000',
    inputTextColor: '#000000',
  },
} satisfies Record<Mode, Record<string, unknown>>;

function logoDataUri(bg: string, fg: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28"><rect width="28" height="28" rx="6" fill="${bg}"/><text x="14" y="19.5" font-family="Arial, sans-serif" font-size="14" font-weight="700" fill="${fg}" text-anchor="middle">B</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function isBrand(value: unknown): value is Brand {
  return value === 'azure-blue' || value === 'rose-red' || value === 'cyan-orange';
}

function isMode(value: unknown): value is Mode {
  return value === 'light' || value === 'dark' || value === 'high-contrast';
}

function buildTheme(brand: Brand, mode: Mode) {
  const primary = BRAND_PRIMARY[brand][mode];
  const onPrimary = BRAND_ON_PRIMARY[brand][mode];
  const base = MODE_BASE[mode];
  return create({
    ...base,
    colorPrimary: primary,
    colorSecondary: primary,
    barSelectedColor: primary,
    barHoverColor: primary,
    appBorderRadius: 8,
    fontBase:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    fontCode: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace',
    inputBorderRadius: 6,
    brandTitle: 'App Design System',
    brandUrl: '.',
    brandImage: logoDataUri(primary, onPrimary),
    brandTarget: '_self',
  });
}

const DEFAULT_BRAND: Brand = 'azure-blue';
const DEFAULT_MODE: Mode = 'light';

addons.setConfig({ theme: buildTheme(DEFAULT_BRAND, DEFAULT_MODE) });

addons.register('brk/theme-sync', (api) => {
  api.on(GLOBALS_UPDATED, ({ globals }: { globals: Record<string, unknown> }) => {
    const brand = isBrand(globals['brand']) ? globals['brand'] : DEFAULT_BRAND;
    const mode = isMode(globals['theme']) ? globals['theme'] : DEFAULT_MODE;
    addons.setConfig({ theme: buildTheme(brand, mode) });
  });
});
