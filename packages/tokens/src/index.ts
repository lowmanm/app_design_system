export const THEME_NAMES = ['light', 'dark', 'high-contrast'] as const;
export type ThemeName = (typeof THEME_NAMES)[number];

// Generated from scripts/generate-palettes.mjs's BRANDS map - the single
// place a business-unit brand is declared. Add one there and rerun
// `nx run tokens:build`; everything downstream picks it up.
export { BRAND_NAMES, type BrandName } from './generated-brands';

const THEME_ATTRIBUTE = 'data-theme';
const STORAGE_KEY = 'app-design-system:theme';

/** Every function here is a no-op rather than a crash when there is no DOM (SSR, build-time prerender). */
const hasDom = (): boolean =>
  typeof document !== 'undefined' && !!document.documentElement;

const isThemeName = (value: unknown): value is ThemeName =>
  typeof value === 'string' &&
  (THEME_NAMES as readonly string[]).includes(value);

type ThemeListener = (theme: ThemeName) => void;
const listeners = new Set<ThemeListener>();

export interface SetThemeOptions {
  /** The element carrying the `data-theme` attribute. Defaults to `<html>`. */
  root?: HTMLElement;
  /** Remember this choice across page loads (localStorage). Defaults to `false`. */
  persist?: boolean;
}

/**
 * Sets the active theme by writing `data-theme` on the document root. Every
 * generated theme CSS file (dist/css/brands/<brand>/theme-*.css) is scoped
 * to `[data-theme="<name>"]`, so this one attribute switches every consumer
 * - Angular, Tailwind, Bootstrap, or plain HTML - that has loaded the
 * tokens CSS, with no per-framework theming logic required.
 */
export function setTheme(
  theme: ThemeName,
  options: SetThemeOptions = {},
): void {
  if (!hasDom()) {
    return;
  }
  const root = options.root ?? document.documentElement;
  root.setAttribute(THEME_ATTRIBUTE, theme);

  if (options.persist) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Private browsing and some embedded webviews reject writes. Losing
      // the preference across reloads is preferable to breaking the app.
    }
  }

  for (const listener of listeners) {
    listener(theme);
  }
}

/** The theme currently applied to `root`, or `null` if none has been set. */
export function getTheme(root?: HTMLElement): ThemeName | null {
  if (!hasDom()) {
    return null;
  }
  const value = (root ?? document.documentElement).getAttribute(
    THEME_ATTRIBUTE,
  );
  return isThemeName(value) ? value : null;
}

/**
 * The theme the user's OS is asking for. Note this only distinguishes
 * light from dark - `high-contrast` is an explicit choice, never inferred,
 * because `prefers-contrast` and `prefers-color-scheme` are independent and
 * a user wanting high contrast has not necessarily asked for a light theme.
 */
export function getSystemTheme(): ThemeName {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return 'light';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

/** The persisted preference from a previous visit, if there is one. */
export function getStoredTheme(): ThemeName | null {
  if (typeof localStorage === 'undefined') {
    return null;
  }
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return isThemeName(value) ? value : null;
  } catch {
    return null;
  }
}

/**
 * Applies the right theme at startup: the user's stored preference if they
 * have one, otherwise whatever their OS asks for. Call this once, as early
 * as possible - before first paint, ideally - to avoid a flash of the wrong
 * theme. Returns the theme it applied.
 */
export function initTheme(options: SetThemeOptions = {}): ThemeName {
  const theme = getStoredTheme() ?? getSystemTheme();
  setTheme(theme, options);
  return theme;
}

/**
 * Runs `listener` whenever the theme changes via `setTheme`. Returns an
 * unsubscribe function.
 *
 * Only observes changes made through this module - an app that writes
 * `data-theme` directly bypasses it. That is deliberate: a MutationObserver
 * would fire for unrelated attribute writes and cost every consumer, for a
 * case the design system does not ask anyone to support.
 */
export function onThemeChange(listener: ThemeListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
