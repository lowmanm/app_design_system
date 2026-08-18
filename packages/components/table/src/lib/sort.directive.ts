import { Directive, model, output } from '@angular/core';

/** `''` means unsorted - cycling past `desc` returns here, not back to `asc`. */
export type BrkSortDirection = 'asc' | 'desc' | '';

export interface BrkSortState {
  /** The `brkSortHeader` id of the column currently driving the sort. */
  active: string;
  direction: BrkSortDirection;
}

const DIRECTION_CYCLE: readonly BrkSortDirection[] = ['asc', 'desc', ''];

/**
 * Tracks which column a `<table brkTable>` is sorted by and in which
 * direction - put on the table itself, alongside `[dataSource]`. Reports
 * state only; it doesn't sort `dataSource`'s data. That keeps `brkTable` a
 * headless-friendly primitive the same way `brk-menu` doesn't own
 * application state either - the consumer reacts to `sortChange` and either
 * re-sorts a local array or requests already-sorted data from a server,
 * without the table needing two different APIs for those two cases:
 *
 * ```html
 * <table brkTable brkSort (sortChange)="onSortChange($event)" [dataSource]="rows">
 *   <ng-container cdkColumnDef="name">
 *     <th cdk-header-cell *cdkHeaderCellDef brkSortHeader="name">Name</th>
 *     <td cdk-cell *cdkCellDef="let row">{{ row.name }}</td>
 *   </ng-container>
 *   ...
 * </table>
 * ```
 */
@Directive({
  selector: '[brkSort]',
})
export class BrkSortDirective {
  /** The `brkSortHeader` id of the active column, or `''` if unsorted. */
  readonly active = model('');
  readonly direction = model<BrkSortDirection>('');

  readonly sortChange = output<BrkSortState>();

  /**
   * Cycles the given column's sort state: a different column becomes
   * active at `asc`; the active column advances asc -> desc -> unsorted.
   * Called by `BrkSortHeaderDirective` on click/Enter/Space.
   */
  sort(id: string): void {
    if (this.active() !== id) {
      this.active.set(id);
      this.direction.set('asc');
    } else {
      const nextIndex =
        (DIRECTION_CYCLE.indexOf(this.direction()) + 1) %
        DIRECTION_CYCLE.length;
      this.direction.set(DIRECTION_CYCLE[nextIndex]!);
    }
    if (this.direction() === '') {
      this.active.set('');
    }
    this.sortChange.emit({
      active: this.active(),
      direction: this.direction(),
    });
  }
}
