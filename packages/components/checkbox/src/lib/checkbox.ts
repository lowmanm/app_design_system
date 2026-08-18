import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { ComponentSize } from '@app-design-system/core';

/**
 * Applies design-system checkbox styling to a native
 * `input[type="checkbox"]` - selecting the native element, like `brkButton`
 * does, rather than wrapping it in a custom element. That is the whole
 * reason this directive needs no `checked`/`disabled`/`indeterminate`
 * inputs and no `ControlValueAccessor` of its own: those already work by
 * plain Angular property binding, and Angular's own built-in
 * `CheckboxControlValueAccessor` (`[(ngModel)]`, `formControlName`)
 * already targets a real `input[type=checkbox]`, which this still
 * structurally is.
 *
 * **Always pair this with a real `<label>`.** An unlabeled checkbox has no
 * accessible name at all (WCAG 1.3.1, 4.1.2), and the label also enlarges
 * the effective click/tap target well beyond this element's own small box
 * (WCAG 2.5.8) - wrapping both in one `<label>` gets that for free, with
 * no `id`/`for` bookkeeping.
 *
 * ```html
 * <label>
 *   <input type="checkbox" brkCheckbox [(ngModel)]="agreed" />
 *   I agree to the terms
 * </label>
 *
 * <label>
 *   <input type="checkbox" brkCheckbox [checked]="allSelected()" [indeterminate]="someSelected()" />
 *   Select all
 * </label>
 * ```
 */
@Component({
  selector: 'input[type="checkbox"][brkCheckbox]',
  template: '',
  styleUrl: './checkbox.css',
  host: {
    class: 'brk-checkbox',
    '[class]': '"brk-checkbox--" + size()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrkCheckboxComponent {
  readonly size = input<ComponentSize>('md');
}
