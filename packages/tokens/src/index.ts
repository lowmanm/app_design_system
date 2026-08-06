export const THEME_NAMES = ['light', 'dark', 'high-contrast'] as const;
export type ThemeName = (typeof THEME_NAMES)[number];

// Generated from scripts/generate-palettes.mjs's BRANDS map - the single
// place a business-unit brand is declared. Add one there and rerun
// `nx run tokens:build`; everything downstream picks it up.
export { BRAND_NAMES, type BrandName } from './generated-brands';

/**
 * Sets the active theme by writing `data-theme` on the document root. Every
 * generated theme CSS file (dist/css/brands/<brand>/theme-*.css) is scoped
 * to `[data-theme="<name>"]`, so this one attribute switches every consumer
 * - Angular, Tailwind, Bootstrap, or plain HTML - that has loaded the
 * tokens CSS, with no per-framework theming logic required.
 */
export function setTheme(
  theme: ThemeName,
  root: HTMLElement = document.documentElement,
): void {
  root.setAttribute('data-theme', theme);
}
