import { ComponentHarness } from '@angular/cdk/testing';

/** Test harness for `BrkRadioGroupComponent`. */
export class BrkRadioGroupHarness extends ComponentHarness {
  static hostSelector = 'brk-radio-group';

  async getLegend(): Promise<string> {
    const legend = await this.locatorFor('legend')();
    return (await legend.text()).trim();
  }

  async getName(): Promise<string> {
    const radio = await this.locatorFor('input[type="radio"]')();
    return radio.getProperty<string>('name');
  }
}
