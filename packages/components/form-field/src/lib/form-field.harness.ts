import { ComponentHarness } from '@angular/cdk/testing';

export class BrkFormFieldHarness extends ComponentHarness {
  static hostSelector = '.brk-form-field';

  async getLabelText(): Promise<string> {
    return (await this.locatorFor('.brk-form-field__label')()).text();
  }

  async getErrorText(): Promise<string | null> {
    const errors = await this.locatorForOptional('.brk-form-field__error')();
    return errors ? errors.text() : null;
  }
}
