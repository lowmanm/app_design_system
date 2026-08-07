import { ComponentHarness } from '@angular/cdk/testing';
import type { IconSize } from './icon';

/**
 * Test harness for `BrkIconComponent`. Consumers should test through this
 * rather than querying host DOM directly, so their tests survive internal
 * markup changes.
 */
export class BrkIconHarness extends ComponentHarness {
  static hostSelector = 'brk-icon';

  /** The Material Symbols glyph name, e.g. `settings`. */
  async getName(): Promise<string> {
    return (await this.host()).text();
  }

  async getSize(): Promise<IconSize | null> {
    const host = await this.host();
    for (const size of ['sm', 'md', 'lg', 'xl'] as const) {
      if (await host.hasClass(`brk-icon--${size}`)) {
        return size;
      }
    }
    return null;
  }

  /**
   * The icon's accessible name, or `null` when it is decorative. Reading the
   * attribute rather than the `label` input is deliberate - what matters is
   * what assistive technology actually sees.
   */
  async getLabel(): Promise<string | null> {
    return (await this.host()).getAttribute('aria-label');
  }

  /** Whether the icon is hidden from assistive technology. */
  async isDecorative(): Promise<boolean> {
    return (await this.host())
      .getAttribute('aria-hidden')
      .then((value) => value === 'true');
  }

  /**
   * The resolved `font-variation-settings`, which is where every visual
   * variant of an icon actually lives - `filled`, `weight` and `grade` all
   * render through this one property rather than through classes.
   *
   * Axis names are normalised to double quotes. A real browser serialises
   * them that way; jsdom hands back whatever was written, so without this a
   * test that passes under Karma fails under Vitest for no reason a reader
   * of the test could guess.
   */
  async getVariationSettings(): Promise<string> {
    const value = await (
      await this.host()
    ).getCssValue('font-variation-settings');
    return value.replace(/'/g, '"');
  }
}
