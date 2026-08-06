import { ComponentHarness } from '@angular/cdk/testing';

/** Test harness for BrkHeaderComponent - consumers should test through this, not host DOM selectors. */
export class BrkHeaderHarness extends ComponentHarness {
  static hostSelector = '.brk-header';

  async getNavLinkLabels(): Promise<string[]> {
    const links = await this.locatorForAll('.brk-header__nav a')();
    return Promise.all(links.map((link) => link.text()));
  }

  async getActiveNavLinkLabel(): Promise<string | null> {
    const links = await this.locatorForAll('.brk-header__nav a')();
    for (const link of links) {
      if (
        (await link.hasClass('is-active')) ||
        (await link.getAttribute('aria-current')) === 'page'
      ) {
        return link.text();
      }
    }
    return null;
  }
}
