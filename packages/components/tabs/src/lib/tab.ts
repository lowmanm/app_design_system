import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  input,
  signal,
} from '@angular/core';

let nextTabId = 0;

/**
 * One tab: its own label *and* its own panel content in a single element,
 * rather than two parallel lists (a tablist of buttons, a list of panels)
 * a consumer has to keep in sync by index. `<brk-tabs>` renders the actual
 * tab buttons itself, reading `label()` off each content-child
 * `BrkTabComponent` - this component's own template holds only the panel.
 *
 * ```html
 * <brk-tabs ariaLabel="Account settings">
 *   <brk-tab label="Profile">Profile form goes here.</brk-tab>
 *   <brk-tab label="Billing">Billing form goes here.</brk-tab>
 * </brk-tabs>
 * ```
 */
@Component({
  selector: 'brk-tab',
  template: `
    <div
      class="brk-tab__panel"
      role="tabpanel"
      [id]="panelId"
      [attr.aria-labelledby]="tabId"
      [hidden]="!isActive()"
      tabindex="0"
    >
      <ng-content />
    </div>
  `,
  styleUrl: './tab.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrkTabComponent {
  /** The tab button's text. Rendered by the parent `<brk-tabs>`, not here. */
  readonly label = input.required<string>();
  readonly disabled = input(false, { transform: booleanAttribute });

  /** Set by `BrkTabsComponent`, which owns the selection state. */
  readonly isActive = signal(false);

  readonly tabId = `brk-tab-${nextTabId++}`;
  readonly panelId = `brk-tab-panel-${this.tabId}`;
}
