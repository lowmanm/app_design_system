import { ComponentHarness } from '@angular/cdk/testing';
import { BrkSelectHarness } from '@app-design-system/select';

/** Test harness for `BrkPaginatorComponent`. */
export class BrkPaginatorHarness extends ComponentHarness {
  static hostSelector = '.brk-paginator';

  private readonly _pageSizeSelect = this.locatorFor(BrkSelectHarness);
  private readonly _previousButton = this.locatorFor(
    '.brk-paginator__nav-button[aria-label="Previous page"]',
  );
  private readonly _nextButton = this.locatorFor(
    '.brk-paginator__nav-button[aria-label="Next page"]',
  );

  async getRangeLabel(): Promise<string> {
    return (await this.locatorFor('.brk-paginator__range')()).text();
  }

  async previousPage(): Promise<void> {
    await (await this._previousButton()).click();
  }

  async nextPage(): Promise<void> {
    await (await this._nextButton()).click();
  }

  async isPreviousDisabled(): Promise<boolean> {
    return (await this._previousButton()).getProperty<boolean>('disabled');
  }

  async isNextDisabled(): Promise<boolean> {
    return (await this._nextButton()).getProperty<boolean>('disabled');
  }

  async setPageSize(size: string): Promise<void> {
    const select = await this._pageSizeSelect();
    await select.selectOptionByText(size);
  }
}
