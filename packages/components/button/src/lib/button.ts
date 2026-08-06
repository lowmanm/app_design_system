import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatRipple } from '@angular/material/core';
import type { ComponentSize, ComponentVariant } from '@app-design-system/core';

/**
 * Applies design-system button styling and behavior to a native `<button>`
 * or `<a>` element - selecting the native element (like Angular Material's
 * own `button[mat-button]` components do) rather than wrapping it in a
 * custom element, so native button/link semantics, keyboard behavior, and
 * every ARIA attribute a consumer sets keep working with zero extra effort.
 *
 * ```html
 * <button brkButton variant="filled">Save</button>
 * <a brkButton variant="text" href="/cancel">Cancel</a>
 * ```
 */
@Component({
  selector: 'button[brkButton], a[brkButton]',
  // MatRipple is applied as a host directive, which does not require (and is
  // not satisfied by) a template `imports` entry - the template is just
  // <ng-content />, so nothing here uses it as a directive.
  hostDirectives: [MatRipple],
  host: {
    class: 'brk-button',
    '[class]': '"brk-button--" + variant() + " brk-button--" + size()',
  },
  template: `<ng-content />`,
  styleUrl: './button.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrkButtonComponent {
  readonly variant = input<ComponentVariant>('filled');
  readonly size = input<ComponentSize>('md');
}
