import { ComponentHarness } from '@angular/cdk/testing';

/**
 * Locates an open `<brk-dialog>` - portaled to `document.body` by CDK's
 * `Dialog`, outside the opener's own subtree, so look it up with a
 * document-root loader rather than the usual fixture-scoped one:
 *
 * ```ts
 * const harness = await TestbedHarnessEnvironment
 *   .documentRootLoader(fixture)
 *   .getHarness(BrkDialogHarness);
 * ```
 */
export class BrkDialogHarness extends ComponentHarness {
  static hostSelector = '.brk-dialog';

  async getTitleText(): Promise<string> {
    const title = await this.locatorForOptional('.brk-dialog__title')();
    return (await title?.text()) ?? '';
  }

  async getContentText(): Promise<string> {
    const content = await this.locatorForOptional('.brk-dialog__content')();
    return (await content?.text()) ?? '';
  }

  async clickClose(): Promise<void> {
    const closeButton = await this.locatorFor('.brk-dialog__close')();
    await closeButton.click();
  }
}
