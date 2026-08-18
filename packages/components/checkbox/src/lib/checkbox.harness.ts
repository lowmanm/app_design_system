import { ComponentHarness } from '@angular/cdk/testing';
import type { ComponentSize } from '@app-design-system/core';

/**
 * Test harness for a `brkCheckbox`-decorated native checkbox. Reads the
 * real DOM state (`.checked`/`.disabled`/`.indeterminate`), not a directive
 * input - this directive deliberately declares none of those, so a
 * consumer's own binding is the only source of truth.
 */
export class BrkCheckboxHarness extends ComponentHarness {
  static hostSelector = 'input[type="checkbox"].brk-checkbox';

  async isChecked(): Promise<boolean> {
    return (await this.host()).getProperty<boolean>('checked');
  }

  async isIndeterminate(): Promise<boolean> {
    return (await this.host()).getProperty<boolean>('indeterminate');
  }

  async isDisabled(): Promise<boolean> {
    return (await this.host()).getProperty<boolean>('disabled');
  }

  async getSize(): Promise<ComponentSize | null> {
    const host = await this.host();
    for (const size of ['sm', 'md', 'lg'] as const) {
      if (await host.hasClass(`brk-checkbox--${size}`)) {
        return size;
      }
    }
    return null;
  }

  async toggle(): Promise<void> {
    return (await this.host()).click();
  }
}
