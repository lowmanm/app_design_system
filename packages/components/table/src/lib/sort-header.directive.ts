import { Directive, computed, inject, input } from '@angular/core';
import { BrkSortDirective } from './sort.directive';

/**
 * Makes a `<th cdk-header-cell>` a clickable sort control, reporting its
 * state via `aria-sort` (the ARIA-correct place for it - on the header
 * cell itself, not a wrapping element) and a small CSS arrow indicator.
 * Requires a `brkSort` ancestor (usually on the table itself) and an
 * explicit column id, matching the column's own `cdkColumnDef` name:
 *
 * ```html
 * <th cdk-header-cell *cdkHeaderCellDef brkSortHeader="name">Name</th>
 * ```
 *
 * A `<th>` isn't natively focusable or clickable-with-Enter/Space the way
 * a `<button>` is, so this directive adds `tabindex="0"` and both handlers
 * itself, the same gap `brk-accordion`'s header button doesn't have
 * (buttons get that for free) but a table header cell does.
 */
@Directive({
  selector: '[brkSortHeader]',
  host: {
    class: 'brk-sort-header',
    tabindex: '0',
    '[class.brk-sort-header--active]': '_isActive()',
    '[class.brk-sort-header--asc]': '_isActive() && sort.direction() === "asc"',
    '[class.brk-sort-header--desc]':
      '_isActive() && sort.direction() === "desc"',
    '[attr.aria-sort]': '_ariaSort()',
    '(click)': 'sort.sort(id())',
    '(keydown.enter)': 'sort.sort(id())',
    '(keydown.space)': '_onSpace($event)',
  },
})
export class BrkSortHeaderDirective {
  protected readonly sort = inject(BrkSortDirective);

  /** Must match this column's `cdkColumnDef` name. */
  readonly id = input.required<string>({ alias: 'brkSortHeader' });

  protected readonly _isActive = computed(
    () => this.sort.active() === this.id(),
  );

  protected readonly _ariaSort = computed(
    (): 'ascending' | 'descending' | null => {
      if (!this._isActive()) {
        return null;
      }
      const direction = this.sort.direction();
      return direction === 'asc'
        ? 'ascending'
        : direction === 'desc'
          ? 'descending'
          : null;
    },
  );

  protected _onSpace(event: Event): void {
    // The default action for Space on a focusable, non-form element is to
    // scroll the page - not what a sort header click-equivalent should do.
    event.preventDefault();
    this.sort.sort(this.id());
  }
}
