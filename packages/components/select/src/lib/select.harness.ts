import { ComponentHarness } from '@angular/cdk/testing';

/** Test harness for a single option inside a `<brk-select>` panel. */
export class BrkOptionHarness extends ComponentHarness {
  static hostSelector = '.brk-option';

  async getText(): Promise<string> {
    return (await this.host()).text();
  }

  async isSelected(): Promise<boolean> {
    return (await this.host())
      .getAttribute('aria-selected')
      .then((value) => value === 'true');
  }

  async click(): Promise<void> {
    return (await this.host()).click();
  }
}

/** Test harness for `BrkSelectComponent`. */
export class BrkSelectHarness extends ComponentHarness {
  static hostSelector = 'brk-select';

  private readonly _panel = this.locatorFor('.brk-select__panel');

  async getDisplayedText(): Promise<string> {
    const value = await this.locatorFor('.brk-select__value')();
    return (await value.text()).trim();
  }

  async isOpen(): Promise<boolean> {
    return (await this.host())
      .getAttribute('aria-expanded')
      .then((value) => value === 'true');
  }

  async isDisabled(): Promise<boolean> {
    return (await this.host())
      .getAttribute('aria-disabled')
      .then((value) => value === 'true');
  }

  async open(): Promise<void> {
    if (!(await this.isOpen())) {
      await (await this.host()).click();
    }
  }

  /**
   * Options are queried from the document root, not this harness's own
   * subtree: once open, `brk-select` moves its panel into the CDK overlay
   * container (appended to `document.body`) via `DomPortal`, so the
   * options are no longer descendants of `<brk-select>` at all.
   */
  async getOptions(): Promise<BrkOptionHarness[]> {
    return this.documentRootLocatorFactory().locatorForAll(BrkOptionHarness)();
  }

  async selectOptionByText(text: string): Promise<void> {
    await this.open();
    const options = await this.getOptions();
    for (const option of options) {
      if ((await option.getText()) === text) {
        await option.click();
        return;
      }
    }
    throw new Error(`No option with text "${text}" found`);
  }

  async getPanel() {
    return this._panel();
  }
}
