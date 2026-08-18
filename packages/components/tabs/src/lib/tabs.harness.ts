import { ComponentHarness } from '@angular/cdk/testing';

/** Test harness for `BrkTabsComponent`. */
export class BrkTabsHarness extends ComponentHarness {
  static hostSelector = 'brk-tabs';

  private readonly _tabButtons = this.locatorForAll('.brk-tabs__tab');

  async getTabLabels(): Promise<string[]> {
    const buttons = await this._tabButtons();
    return Promise.all(buttons.map((b) => b.text()));
  }

  async getSelectedLabel(): Promise<string | undefined> {
    const buttons = await this._tabButtons();
    for (const button of buttons) {
      if ((await button.getAttribute('aria-selected')) === 'true') {
        return (await button.text()).trim();
      }
    }
    return undefined;
  }

  async selectTabByLabel(label: string): Promise<void> {
    const buttons = await this._tabButtons();
    for (const button of buttons) {
      if ((await button.text()).trim() === label) {
        await button.click();
        return;
      }
    }
    throw new Error(`No tab with label "${label}" found`);
  }

  async getVisiblePanelText(): Promise<string> {
    const panel = await this.locatorFor('.brk-tab__panel:not([hidden])')();
    return (await panel.text()).trim();
  }
}
