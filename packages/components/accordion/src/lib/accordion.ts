import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  contentChildren,
  effect,
  input,
  signal,
} from '@angular/core';
import { BrkAccordionItemComponent } from './accordion-item';

/**
 * A vertically stacked set of expand/collapse panels - the ARIA disclosure
 * pattern, one header button per panel. Single-open (exclusive) by
 * default, matching the common "FAQ list" expectation that opening one
 * item closes whichever was open; pass `multi` to allow several open at
 * once.
 *
 * Owns which item(s) are expanded and pushes that down into each
 * `BrkAccordionItemComponent`, the same shape `brk-tabs` uses for its
 * selected index - but unlike tabs, each item renders its *own* header
 * button in its own template rather than this component rendering them
 * all, since accordion headers are full-width stacked blocks, not a
 * side-by-side row. That's why the relationship is two-way: an item calls
 * back into `toggle()` here on click, rather than this component owning
 * every click handler directly.
 *
 * ```html
 * <brk-accordion>
 *   <brk-accordion-item header="What's included?">
 *     Everything in the Pro plan, plus priority support.
 *   </brk-accordion-item>
 *   <brk-accordion-item header="Can I cancel anytime?">
 *     Yes, from your billing settings.
 *   </brk-accordion-item>
 * </brk-accordion>
 * ```
 */
@Component({
  selector: 'brk-accordion',
  template: `<ng-content />`,
  host: { class: 'brk-accordion' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrkAccordionComponent {
  /** Allows more than one item open at once. Default `false` (exclusive/single-open). */
  readonly multi = input(false, { transform: booleanAttribute });

  protected readonly items = contentChildren(BrkAccordionItemComponent);
  private readonly expandedIndices = signal<ReadonlySet<number>>(new Set());

  constructor() {
    effect(() => {
      const expanded = this.expandedIndices();
      for (const [i, item] of this.items().entries()) {
        item.expanded.set(expanded.has(i));
      }
    });
  }

  toggle(item: BrkAccordionItemComponent): void {
    const index = this.items().indexOf(item);
    if (index === -1) {
      return;
    }
    const next = new Set(this.expandedIndices());
    if (next.has(index)) {
      next.delete(index);
    } else {
      if (!this.multi()) {
        next.clear();
      }
      next.add(index);
    }
    this.expandedIndices.set(next);
  }
}
