import { ComponentHarness } from '@angular/cdk/testing';
import type { ComponentSize } from '@app-design-system/core';

/**
 * Test harness for a `brkSwitch`-decorated native checkbox. Reads real DOM
 * state, not a directive input - this directive declares none of the
 * on/off state itself, exactly like `brk-checkbox`.
 */
export class BrkSwitchHarness extends ComponentHarness {
  static hostSelector = 'input[type="checkbox"].brk-switch';

  async isOn(): Promise<boolean> {
    return (await this.host()).getProperty<boolean>('checked');
  }

  async isDisabled(): Promise<boolean> {
    return (await this.host()).getProperty<boolean>('disabled');
  }

  async getRole(): Promise<string | null> {
    return (await this.host()).getAttribute('role');
  }

  async getSize(): Promise<ComponentSize | null> {
    const host = await this.host();
    for (const size of ['sm', 'md', 'lg'] as const) {
      if (await host.hasClass(`brk-switch--${size}`)) {
        return size;
      }
    }
    return null;
  }

  async toggle(): Promise<void> {
    return (await this.host()).click();
  }
}
