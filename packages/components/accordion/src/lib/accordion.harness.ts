import { ComponentHarness } from '@angular/cdk/testing';

/** Test harness for a single `<brk-accordion-item>`. */
export class BrkAccordionItemHarness extends ComponentHarness {
  static hostSelector = 'brk-accordion-item';

  private readonly _trigger = this.locatorFor('.brk-accordion-item__trigger');

  async getHeader(): Promise<string> {
    return (await this._trigger()).text();
  }

  async isExpanded(): Promise<boolean> {
    return (await this._trigger())
      .getAttribute('aria-expanded')
      .then((value) => value === 'true');
  }

  async toggle(): Promise<void> {
    return (await this._trigger()).click();
  }

  async getPanelText(): Promise<string> {
    const panel = await this.locatorFor('.brk-accordion-item__panel-inner')();
    return (await panel.text()).trim();
  }
}

/** Test harness for `BrkAccordionComponent`. */
export class BrkAccordionHarness extends ComponentHarness {
  static hostSelector = 'brk-accordion';

  async getItems(): Promise<BrkAccordionItemHarness[]> {
    return this.locatorForAll(BrkAccordionItemHarness)();
  }
}
