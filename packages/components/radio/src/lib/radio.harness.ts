import { ComponentHarness } from '@angular/cdk/testing';
import type { ComponentSize } from '@app-design-system/core';

/** Test harness for a `brkRadio`-decorated native radio input. */
export class BrkRadioHarness extends ComponentHarness {
  static hostSelector = 'input[type="radio"].brk-radio';

  async isChecked(): Promise<boolean> {
    return (await this.host()).getProperty<boolean>('checked');
  }

  async isDisabled(): Promise<boolean> {
    return (await this.host()).getProperty<boolean>('disabled');
  }

  async getName(): Promise<string> {
    return (await this.host()).getProperty<string>('name');
  }

  async getValue(): Promise<string> {
    return (await this.host()).getProperty<string>('value');
  }

  async getSize(): Promise<ComponentSize | null> {
    const host = await this.host();
    for (const size of ['sm', 'md', 'lg'] as const) {
      if (await host.hasClass(`brk-radio--${size}`)) {
        return size;
      }
    }
    return null;
  }

  async select(): Promise<void> {
    return (await this.host()).click();
  }
}
