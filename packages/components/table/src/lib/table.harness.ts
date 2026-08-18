import {
  ComponentHarness,
  HarnessPredicate,
  type BaseHarnessFilters,
} from '@angular/cdk/testing';

export interface BrkSortHeaderHarnessFilters extends BaseHarnessFilters {
  /** Matches the column's `brkSortHeader="id"` value. */
  id?: string;
}

/** One `brkSortHeader` cell within a `BrkTableHarness`. */
export class BrkSortHeaderHarness extends ComponentHarness {
  static hostSelector = '.brk-sort-header';

  static with(
    options: BrkSortHeaderHarnessFilters = {},
  ): HarnessPredicate<BrkSortHeaderHarness> {
    return new HarnessPredicate(BrkSortHeaderHarness, options).addOption(
      'id',
      options.id,
      async (harness, id) =>
        (await (await harness.host()).getAttribute('brksortheader')) === id,
    );
  }

  async getText(): Promise<string> {
    return (await this.host()).text();
  }

  async getAriaSort(): Promise<string | null> {
    return (await this.host()).getAttribute('aria-sort');
  }

  async click(): Promise<void> {
    await (await this.host()).click();
  }
}

/**
 * Locates a `<table brkTable>` and reads its rendered rows/cells, or a
 * `brkSortHeader` cell by column id - consumers should test through this
 * rather than querying host DOM directly, so their tests survive internal
 * markup changes.
 */
export class BrkTableHarness extends ComponentHarness {
  static hostSelector = '.brk-table';

  private readonly _headerCells = this.locatorForAll('[cdk-header-cell]');
  private readonly _rows = this.locatorForAll('[cdk-row]');

  async getHeaderRowText(): Promise<string[]> {
    const cells = await this._headerCells();
    return Promise.all(cells.map((cell) => cell.text()));
  }

  async getRowCount(): Promise<number> {
    return (await this._rows()).length;
  }

  // `TestElement` (what `_rows()` resolves to) has no descendant-query
  // methods of its own - only a `LocatorFactory` (what `this` is) does -
  // so cells are scoped to one row via `:nth-of-type` from the harness's
  // own root rather than queried from an already-fetched row TestElement.
  async getRowText(rowIndex: number): Promise<string[]> {
    const cells = await this.locatorForAll(
      `[cdk-row]:nth-of-type(${rowIndex + 1}) [cdk-cell]`,
    )();
    if (cells.length === 0) {
      throw new Error(`No row at index ${rowIndex}`);
    }
    return Promise.all(cells.map((cell) => cell.text()));
  }

  async getAllRowsText(): Promise<string[][]> {
    const rowCount = await this.getRowCount();
    return Promise.all(
      Array.from({ length: rowCount }, (_, index) => this.getRowText(index)),
    );
  }

  async getSortHeader(id: string): Promise<BrkSortHeaderHarness> {
    return this.locatorFor(BrkSortHeaderHarness.with({ id }))();
  }
}
