import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import type { ComponentSize } from '@app-design-system/core';
import { BrkRadioGroupComponent } from './radio-group';

/**
 * Applies design-system radio styling to a native `input[type="radio"]` -
 * selecting the native element, like `brkButton` and `brkCheckbox` do,
 * rather than wrapping it in a custom element. As with checkbox, this
 * needs no `checked`/`disabled` inputs and no `ControlValueAccessor`:
 * Angular's own built-in `RadioControlValueAccessor` already coordinates
 * a same-`name` group of real `input[type=radio]` elements (one selected
 * value across all of them, via its internal registry), which is exactly
 * what these still structurally are.
 *
 * Inside a `<brk-radio-group>`, `name` is supplied automatically - do not
 * also set it by hand, that would just fight the group. Used standalone,
 * set `name` yourself the same way you would on a bare native radio.
 *
 * ```html
 * <brk-radio-group label="Billing plan">
 *   <label><input type="radio" brkRadio value="free" [(ngModel)]="plan" /> Free</label>
 *   <label><input type="radio" brkRadio value="pro" [(ngModel)]="plan" /> Pro</label>
 * </brk-radio-group>
 * ```
 */
@Component({
  selector: 'input[type="radio"][brkRadio]',
  template: '',
  styleUrl: './radio.css',
  host: {
    class: 'brk-radio',
    '[class]': '"brk-radio--" + size()',
    '[attr.name]': 'group?.name() ?? null',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrkRadioComponent {
  protected readonly group = inject(BrkRadioGroupComponent, {
    optional: true,
  });

  readonly size = input<ComponentSize>('md');
}
