// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  BRAND_NAMES,
  THEME_NAMES,
  getStoredTheme,
  getSystemTheme,
  getTheme,
  initTheme,
  onThemeChange,
  setTheme,
} from './index';

const STORAGE_KEY = 'app-design-system:theme';

/** Stands in for `window.matchMedia`, which jsdom does not implement. */
function stubPrefersDark(prefersDark: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      matches: prefersDark && query.includes('dark'),
      media: query,
    })),
  );
}

beforeEach(() => {
  document.documentElement.removeAttribute('data-theme');
  localStorage.clear();
});

afterEach(() => {
  vi.unstubAllGlobals();
  // Without this the storage spy below leaks into later tests, which then
  // fail on their own setup rather than on what they assert.
  vi.restoreAllMocks();
});

describe('theme names', () => {
  it('lists the supported themes and brands', () => {
    expect(THEME_NAMES).toEqual(['light', 'dark', 'high-contrast']);
    expect(BRAND_NAMES.length).toBeGreaterThan(0);
  });
});

describe('setTheme / getTheme', () => {
  it('writes data-theme onto the document root by default', () => {
    setTheme('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(getTheme()).toBe('dark');
  });

  it('can target a specific root element', () => {
    const root = document.createElement('div');
    setTheme('high-contrast', { root });
    expect(root.getAttribute('data-theme')).toBe('high-contrast');
    // The document root is untouched, so a scoped theme cannot leak.
    expect(getTheme()).toBeNull();
    expect(getTheme(root)).toBe('high-contrast');
  });

  it('returns null rather than a bogus theme when the attribute is unrecognised', () => {
    document.documentElement.setAttribute('data-theme', 'chartreuse');
    expect(getTheme()).toBeNull();
  });

  it('does not persist unless asked', () => {
    setTheme('dark');
    expect(getStoredTheme()).toBeNull();

    setTheme('dark', { persist: true });
    expect(getStoredTheme()).toBe('dark');
  });

  it('survives storage being unavailable', () => {
    // Private browsing and some embedded webviews throw on write.
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });
    expect(() => setTheme('dark', { persist: true })).not.toThrow();
    expect(getTheme()).toBe('dark');
  });
});

describe('getSystemTheme', () => {
  it('reports dark when the OS asks for it', () => {
    stubPrefersDark(true);
    expect(getSystemTheme()).toBe('dark');
  });

  it('falls back to light when the OS asks for light or cannot be queried', () => {
    stubPrefersDark(false);
    expect(getSystemTheme()).toBe('light');

    vi.stubGlobal('matchMedia', undefined);
    expect(getSystemTheme()).toBe('light');
  });
});

describe('initTheme', () => {
  it('prefers a stored choice over the system preference', () => {
    localStorage.setItem(STORAGE_KEY, 'high-contrast');
    stubPrefersDark(true);
    expect(initTheme()).toBe('high-contrast');
    expect(getTheme()).toBe('high-contrast');
  });

  it('falls back to the system preference when nothing is stored', () => {
    stubPrefersDark(true);
    expect(initTheme()).toBe('dark');
    expect(getTheme()).toBe('dark');
  });

  it('ignores a corrupted stored value', () => {
    localStorage.setItem(STORAGE_KEY, 'not-a-theme');
    stubPrefersDark(false);
    expect(initTheme()).toBe('light');
  });
});

describe('onThemeChange', () => {
  it('notifies subscribers and can be unsubscribed', () => {
    const seen: string[] = [];
    const unsubscribe = onThemeChange((theme) => seen.push(theme));

    setTheme('dark');
    setTheme('light');
    unsubscribe();
    setTheme('high-contrast');

    expect(seen).toEqual(['dark', 'light']);
  });
});
