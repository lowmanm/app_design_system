import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import {
  CDK_TABLE,
  CdkTable,
  DataRowOutlet,
  FooterRowOutlet,
  HeaderRowOutlet,
  NoDataRowOutlet,
  STICKY_POSITIONING_LISTENER,
} from '@angular/cdk/table';

/**
 * A styled `<table>` built directly on `@angular/cdk/table`'s `CdkTable`,
 * the same "extend, don't wrap" pattern Angular Material's own `mat-table`
 * uses. Columns, rows and cells are declared with CDK's **own** directives
 * (`cdkColumnDef`, `cdkHeaderCellDef`, `cdkCellDef`, `cdkHeaderRowDef`,
 * `cdkRowDef`, and the `cdk-header-cell`/`cdk-cell`/`cdk-header-row`/
 * `cdk-row` element selectors) rather than a bespoke re-wrapping of that
 * API - the same reasoning `brk-select`'s options use plain `[brkOption]`
 * instead of a full component, just at a larger scale:
 *
 * ```html
 * <table brkTable [dataSource]="rows">
 *   <ng-container cdkColumnDef="name">
 *     <th cdk-header-cell *cdkHeaderCellDef>Name</th>
 *     <td cdk-cell *cdkCellDef="let row">{{ row.name }}</td>
 *   </ng-container>
 *
 *   <tr cdk-header-row *cdkHeaderRowDef="displayedColumns"></tr>
 *   <tr cdk-row *cdkRowDef="let row; columns: displayedColumns"></tr>
 * </table>
 * ```
 *
 * Real `<table>`/`<tr>`/`<th>`/`<td>` elements throughout - the same
 * native-element payoff as `brk-checkbox`/`brk-radio`: correct table
 * semantics and an implicit ARIA grid-like structure for free, with zero
 * custom role reinvention. `BrkSortHeaderDirective` (sort) and
 * `BrkPaginatorComponent` (pagination) build on top; row selection has no
 * dedicated directive at all - it's `SelectionModel` from
 * `@angular/cdk/collections` plus literal `<brk-checkbox>` instances in the
 * consumer's own template (see this package's README).
 *
 * This component doesn't sort, select or paginate data itself - it renders
 * whatever `dataSource` currently holds. That stays true whether `dataSource`
 * is a plain array, an `Observable`, or a full `DataSource`, so client-side
 * and server-driven paging/sorting share the same contract: the consumer
 * reacts to `BrkSortDirective`'s `sortChange` / `BrkPaginatorComponent`'s
 * `page` events and supplies the (already sorted/paginated, or not) data.
 */
@Component({
  selector: 'table[brkTable]',
  exportAs: 'brkTable',
  imports: [HeaderRowOutlet, DataRowOutlet, NoDataRowOutlet, FooterRowOutlet],
  template: `
    <thead role="rowgroup">
      <ng-container headerRowOutlet />
    </thead>
    <tbody role="rowgroup">
      <ng-container rowOutlet />
      <ng-container noDataRowOutlet />
    </tbody>
    <tfoot role="rowgroup">
      <ng-container footerRowOutlet />
    </tfoot>
  `,
  styleUrl: './table.css',
  host: { class: 'brk-table' },
  providers: [
    // CdkColumnDef/CdkRowDef/etc. look their owning table up by these two
    // tokens, not by walking the DOM - both are required, matching what
    // MatTable itself provides when it extends CdkTable the same way.
    { provide: CdkTable, useExisting: BrkTableComponent },
    { provide: CDK_TABLE, useExisting: BrkTableComponent },
    { provide: STICKY_POSITIONING_LISTENER, useValue: null },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // .brk-table's descendant selectors (table.css) must reach the consumer's
  // own cdkCellDef/cdkHeaderCellDef templates, which render with the
  // consumer component's encapsulation, not this one's - same reason
  // brk-select's panel and brk-dialog need ViewEncapsulation.None.
  encapsulation: ViewEncapsulation.None,
})
export class BrkTableComponent<T> extends CdkTable<T> {}
