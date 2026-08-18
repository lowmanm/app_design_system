import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * The floating bubble `BrkTooltipDirective` attaches to the CDK overlay.
 * Purely an implementation detail - never referenced directly by a
 * consumer's template, which is why it isn't exported from the package's
 * `index.ts`. `role="tooltip"` plus the `id` the directive links back to
 * the trigger via `aria-describedby` are what actually make this
 * accessible; the component itself is just a place to put them.
 */
@Component({
  selector: 'brk-tooltip-panel',
  template: `{{ text() }}`,
  styleUrl: './tooltip.css',
  host: {
    class: 'brk-tooltip',
    role: 'tooltip',
    '[id]': 'panelId()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrkTooltipPanelComponent {
  readonly text = input.required<string>();
  readonly panelId = input.required<string>();
}
