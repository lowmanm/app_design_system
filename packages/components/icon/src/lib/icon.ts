import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  input,
  numberAttribute,
} from '@angular/core';
/**
 * Icon sizes, matching the `--icon-size-*` tokens.
 *
 * Deliberately not `ComponentSize` from `@app-design-system/core`: that is
 * the *control* scale (button and input heights, `--size-control-*`), which
 * has no `xl`. Icons legitimately need a step above `lg` for empty states
 * and feature blocks, and widening the shared scale would imply an `xl`
 * button that has no token behind it.
 */
export type IconSize = 'sm' | 'md' | 'lg' | 'xl';

/**
 * A single icon from the org's icon set (Material Symbols Outlined).
 *
 * ```html
 * <brk-icon name="settings" />
 * <brk-icon name="check_circle" size="lg" filled />
 * <brk-icon name="delete" label="Delete this row" />
 * ```
 *
 * Rendered as a ligature rather than an inline `<svg>`: the glyph name is
 * the element's text content, and the font substitutes the icon for it. That
 * is what makes the same markup work from Angular, Tailwind, Bootstrap and
 * plain HTML (see the `.brk-icon` class in this package's `icons.css`)
 * instead of needing a per-framework sprite loader.
 *
 * Icons are **decorative by default** - `aria-hidden`, invisible to a screen
 * reader - because the overwhelming majority sit next to their own text
 * label, and announcing "delete delete" is worse than announcing nothing.
 * Pass `label` for the minority that carry meaning on their own, such as an
 * icon-only button.
 */
@Component({
  selector: 'brk-icon',
  template: `{{ name() }}`,
  host: {
    class: 'brk-icon',
    '[class]': '"brk-icon--" + size()',
    '[style.font-variation-settings]': 'variationSettings()',
    // `translate="no"` stops a page translator from rewriting the ligature
    // text - a translated "settings" renders as tofu, or as literal words.
    translate: 'no',
    '[attr.aria-hidden]': 'label() ? null : "true"',
    '[attr.role]': 'label() ? "img" : null',
    '[attr.aria-label]': 'label() || null',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrkIconComponent {
  /**
   * The Material Symbols glyph name, e.g. `settings`, `chevron_right`,
   * `check_circle`. Deliberately typed as a plain string: the set has over
   * 3,000 names, and a union that wide measurably slows type-checking in
   * every consuming app. See this package's `icon-manifest.json` for the
   * curated set the docs catalogue.
   */
  readonly name = input.required<string>();

  /** Maps to the `--icon-size-*` tokens, so icons scale with the design system. */
  readonly size = input<IconSize>('md');

  /**
   * Accessible name. Supplying one makes the icon `role="img"`; leaving it
   * off keeps the icon decorative and hidden from assistive technology.
   */
  readonly label = input<string>();

  /** Solid rather than outlined - conventionally the "selected"/"active" state. */
  readonly filled = input(false, { transform: booleanAttribute });

  /** Stroke weight (100-700), for optically matching heavier or lighter text. */
  readonly weight = input(400, { transform: numberAttribute });

  /**
   * Emphasis adjustment (-25 to 200) without changing the icon's footprint.
   * Small positive grades help thin icons hold up on dark backgrounds.
   */
  readonly grade = input(0, { transform: numberAttribute });

  /**
   * Both the variable axes and the optical size, in one binding.
   *
   * `opsz` is driven from `size` rather than exposed separately: it exists so
   * a glyph's strokes stay optically correct as it scales, which is not a
   * decision a caller should have to make separately from picking a size.
   */
  protected readonly variationSettings = computed(
    () =>
      `'FILL' ${this.filled() ? 1 : 0}, 'wght' ${this.weight()}, ` +
      `'GRAD' ${this.grade()}, 'opsz' ${OPTICAL_SIZES[this.size()]}`,
  );
}

/**
 * Material Symbols' `opsz` axis is defined over 20-48 and is meant to track
 * the rendered pixel size. These are the `--icon-size-*` token values in px,
 * clamped into that range.
 */
const OPTICAL_SIZES: Record<IconSize, number> = {
  sm: 20,
  md: 24,
  lg: 32,
  xl: 40,
};
