import { ComponentHarness } from '@angular/cdk/testing';

/**
 * Locates the tooltip *panel*, not the `brkTooltip`-hosting trigger - the
 * panel only exists in the DOM (portaled to `document.body`, outside the
 * trigger's own subtree) while visible, so find it with a document-root
 * loader after dispatching the real hover/focus event that shows it:
 *
 * ```ts
 * trigger.dispatchEvent(new Event('focus'));
 * await vi.advanceTimersByTimeAsync(500);
 * const tooltip = await TestbedHarnessEnvironment
 *   .documentRootLoader(fixture)
 *   .getHarness(BrkTooltipHarness);
 * ```
 */
export class BrkTooltipHarness extends ComponentHarness {
  static hostSelector = '.brk-tooltip';

  async getText(): Promise<string> {
    return (await this.host()).text();
  }
}
