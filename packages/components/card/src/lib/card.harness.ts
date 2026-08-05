import { ComponentHarness } from '@angular/cdk/testing';

/** Test harness for BrkCardComponent - consumers should test through this, not host DOM selectors. */
export class BrkCardHarness extends ComponentHarness {
  static hostSelector = '.brk-card';

  async getText(): Promise<string> {
    return (await this.host()).text();
  }

  async getVariant(): Promise<'elevated' | 'outlined'> {
    const host = await this.host();
    const isOutlined = await host.hasClass('brk-card--outlined');
    return isOutlined ? 'outlined' : 'elevated';
  }
}
