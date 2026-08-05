import { Component, input } from '@angular/core';
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
 * <button adsButton variant="filled">Save</button>
 * <a adsButton variant="text" href="/cancel">Cancel</a>
 * ```
 */
@Component({
  selector: 'button[adsButton], a[adsButton]',
  standalone: true,
  imports: [MatRipple],
  hostDirectives: [MatRipple],
  host: {
    class: 'ads-button',
    '[class]': '"ads-button--" + variant() + " ads-button--" + size()',
  },
  template: `<ng-content />`,
  styleUrl: './button.css',
})
export class AdsButtonComponent {
  readonly variant = input<ComponentVariant>('filled');
  readonly size = input<ComponentSize>('md');
}
