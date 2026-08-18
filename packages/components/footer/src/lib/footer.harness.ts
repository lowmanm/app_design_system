import { ComponentHarness } from '@angular/cdk/testing';

/** Test harness for `BrkFooterComponent` - consumers should test through this, not host DOM selectors. */
export class BrkFooterHarness extends ComponentHarness {
  static hostSelector = '.brk-footer';

  async getBrandText(): Promise<string> {
    return (await this.locatorFor('.brk-footer__brand')()).text();
  }

  async getLinkLabels(): Promise<string[]> {
    const links = await this.locatorForAll('.brk-footer__links a')();
    return Promise.all(links.map((link) => link.text()));
  }

  async getLegalText(): Promise<string> {
    return (await this.locatorFor('.brk-footer__legal')()).text();
  }
}
