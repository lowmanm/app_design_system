import { ComponentHarness } from '@angular/cdk/testing';

/** Test harness for AdsButtonComponent - consumers should test through this, not host DOM selectors. */
export class AdsButtonHarness extends ComponentHarness {
  static hostSelector = '.ads-button';

  async click(): Promise<void> {
    return (await this.host()).click();
  }

  async getText(): Promise<string> {
    return (await this.host()).text();
  }

  async isDisabled(): Promise<boolean> {
    const disabled = await (await this.host()).getAttribute('disabled');
    return disabled != null;
  }
}
