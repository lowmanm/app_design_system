import { ComponentHarness } from '@angular/cdk/testing';

/**
 * Test harness for a `brk-menu` panel. Since the panel is portaled into the
 * CDK overlay container (outside the trigger's own DOM subtree), scope
 * queries for this to `TestbedHarnessEnvironment.documentRootLoader(...)`
 * rather than a loader rooted at the trigger's fixture.
 */
export class BrkMenuHarness extends ComponentHarness {
  static hostSelector = '.brk-menu';

  async getItemLabels(): Promise<string[]> {
    const items = await this.locatorForAll('.brk-menu-item')();
    return Promise.all(items.map((item) => item.text()));
  }

  async clickItem(label: string): Promise<void> {
    const items = await this.locatorForAll('.brk-menu-item')();
    for (const item of items) {
      if ((await item.text()).trim() === label) {
        await item.click();
        return;
      }
    }
    throw new Error(`No menu item with label "${label}"`);
  }
}
