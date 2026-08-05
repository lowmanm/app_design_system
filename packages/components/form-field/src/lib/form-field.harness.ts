import { ComponentHarness } from '@angular/cdk/testing';

export class AdsFormFieldHarness extends ComponentHarness {
  static hostSelector = '.ads-form-field';

  async getLabelText(): Promise<string> {
    return (await this.locatorFor('.ads-form-field__label')()).text();
  }

  async getErrorText(): Promise<string | null> {
    const errors = await this.locatorForOptional('.ads-form-field__error')();
    return errors ? errors.text() : null;
  }
}
