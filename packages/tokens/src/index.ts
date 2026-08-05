export const THEME_NAMES = ['light', 'dark', 'high-contrast'] as const;
export type ThemeName = (typeof THEME_NAMES)[number];

/**
 * Sets the active theme by writing `data-theme` on the document root. Every
 * generated theme CSS file (dist/css/theme-*.css) is scoped to
 * `[data-theme="<name>"]`, so this one attribute switches every consumer -
 * Angular, Tailwind, Bootstrap, or plain HTML - that has loaded the tokens
 * CSS, with no per-framework theming logic required.
 */
export function setTheme(theme: ThemeName, root: HTMLElement = document.documentElement): void {
  root.setAttribute('data-theme', theme);
}
