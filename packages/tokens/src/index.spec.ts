import { describe, expect, it, vi } from 'vitest';
import { setTheme, THEME_NAMES } from './index';

describe('setTheme', () => {
  it('lists the supported theme names', () => {
    expect(THEME_NAMES).toEqual(['light', 'dark', 'high-contrast']);
  });

  it('writes data-theme onto the given root element', () => {
    const setAttribute = vi.fn();
    setTheme('dark', { setAttribute } as unknown as HTMLElement);
    expect(setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
  });
});
