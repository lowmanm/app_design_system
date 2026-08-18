# @app-design-system/table

A styled `<table>` built directly on `@angular/cdk/table`'s `CdkTable` -
the same "extend, don't wrap" pattern Angular Material's own `mat-table`
uses - plus `BrkSortDirective`/`BrkSortHeaderDirective` for sorting and
`BrkPaginatorComponent` for pagination.

```sh
npm install @app-design-system/table
```

## Usage

Columns, rows and cells are declared with CDK's **own** directives, not a
`brk`-prefixed re-wrapping of them - the column API is already right, and
duplicating it would just be more surface to keep in sync:

```html
<table brkTable brkSort (sortChange)="onSort($event)" [dataSource]="rows">
  <ng-container cdkColumnDef="name">
    <th cdk-header-cell *cdkHeaderCellDef brkSortHeader="name">Name</th>
    <td cdk-cell *cdkCellDef="let row">{{ row.name }}</td>
  </ng-container>

  <tr cdk-header-row *cdkHeaderRowDef="displayedColumns"></tr>
  <tr cdk-row *cdkRowDef="let row; columns: displayedColumns"></tr>
</table>

<brk-paginator [length]="rows.length" [(pageIndex)]="pageIndex" [(pageSize)]="pageSize" />
```

Import `BrkTableComponent` plus whichever CDK table directives your columns
use (`CdkColumnDef`, `CdkHeaderCellDef`, `CdkCellDef`, `CdkHeaderRowDef`,
`CdkRowDef`, `CdkHeaderCell`, `CdkCell`, `CdkHeaderRow`, `CdkRow`, ...) from
`@angular/cdk/table` directly.

**`brkTable` doesn't sort, select, or paginate its own data.** It renders
whatever `dataSource` currently holds - a plain array, an `Observable`, or a
full CDK `DataSource`. `BrkSortDirective` and `BrkPaginatorComponent` only
_report_ intent (`sortChange`, `page`); the consumer reacts to it, either by
re-slicing/re-sorting a local array or by requesting already-sorted,
already-paginated data from a server. Both flows use the exact same events,
so there's no separate "server mode" API.

## Sorting

`brkSort` goes on the table itself; `brkSortHeader="<columnId>"` goes on
each sortable `<th cdk-header-cell>`, matching that column's `cdkColumnDef`
name. Clicking (or Enter/Space, since a `<th>` isn't natively clickable the
way a `<button>` is) cycles ascending → descending → unsorted, sets
`aria-sort` on the header cell itself (the ARIA-correct place for it), and
emits `{ active, direction }` from `brkSort`'s `(sortChange)`.

## Selection

No dedicated directive - just `SelectionModel` from
`@angular/cdk/collections` plus literal `<brk-checkbox>` instances, the
same recipe as any other Angular app built on `CdkTable`:

```html
<ng-container cdkColumnDef="select">
  <th cdk-header-cell *cdkHeaderCellDef>
    <input type="checkbox" brkCheckbox [checked]="allSelected()" (change)="toggleAll()" aria-label="Select all" />
  </th>
  <td cdk-cell *cdkCellDef="let row">
    <input type="checkbox" brkCheckbox [checked]="selection.isSelected(row)" (change)="selection.toggle(row)" [attr.aria-label]="'Select ' + row.name" />
  </td>
</ng-container>

<tr cdk-row *cdkRowDef="let row; columns: displayedColumns" [class.brk-table__row--selected]="selection.isSelected(row)"></tr>
```

`.brk-table__row--selected` is opt-in styling for whatever row-selected
state you're already tracking - `brkTable` never applies it itself.

## Pagination

`BrkPaginatorComponent` is bundled here rather than its own package: it's
new UI (neither CDK nor Material ships a headless paginator to build on),
but it's paired one-to-one with `brkTable` in a way `brk-select` (which it
uses for the page-size control) isn't. Two-way `pageIndex`/`pageSize`, a
`length` input, and a `(page)` event mirroring the same intent-only contract
as `BrkSortDirective`.

## Testing

`BrkTableHarness` reads rendered header/row/cell text and locates a
`brkSortHeader` cell by column id; `BrkPaginatorHarness` drives the
page-size select and prev/next buttons and reads the range label. Both are
Angular CDK `ComponentHarness`es - test through them rather than querying
host DOM directly.

Run `nx test table` to execute the unit tests.
