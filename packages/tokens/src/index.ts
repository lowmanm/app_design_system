export const THEME_NAMES = ['light', 'dark', 'high-contrast'] as const;
export type ThemeName = (typeof THEME_NAMES)[number];

/**
 * Business-unit brand names, mirroring Angular Material's own prebuilt-theme
 * naming (azure-blue.css, rose-red.css, ...). Unlike light/dark/high-contrast
 * mode, brand is chosen once at install time, not switched at runtime - each
 * brand is a separate CSS/SCSS bundle under `dist/{css,scss,json}/brands/
 * <brand>/`, and a team picks the one for their business unit. See
 * packages/tokens/scripts/generate-palettes.mjs's BRANDS map to add one.
 */
export const BRAND_NAMES = ['azure-blue', 'rose-red', 'cyan-orange'] as const;
export type BrandName = (typeof BRAND_NAMES)[number];

/**
 * Sets the active theme by writing `data-theme` on the document root. Every
 * generated theme CSS file (dist/css/brands/<brand>/theme-*.css) is scoped
 * to `[data-theme="<name>"]`, so this one attribute switches every consumer
 * - Angular, Tailwind, Bootstrap, or plain HTML - that has loaded the
 * tokens CSS, with no per-framework theming logic required.
 */
export function setTheme(theme: ThemeName, root: HTMLElement = document.documentElement): void {
  root.setAttribute('data-theme', theme);
}
