import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { ComponentSize } from '@app-design-system/core';

/**
 * Applies design-system toggle-switch styling to a native
 * `input[type="checkbox"]` - selecting the native element, like
 * `brkCheckbox` does, so it needs no `checked`/`disabled` inputs and no
 * `ControlValueAccessor`: Angular's own built-in
 * `CheckboxControlValueAccessor` already targets a real
 * `input[type=checkbox]`, which this still structurally is - a switch is a
 * checkbox with a different visual and a different announced role, not a
 * different form control.
 *
 * `role="switch"` is set here, not left for the consumer to remember -
 * without it, a screen reader announces "checkbox" for something that
 * visually and behaviorally reads as on/off, which is the ARIA switch
 * pattern's entire reason to exist.
 *
 * ```html
 * <label>
 *   <input type="checkbox" brkSwitch [(ngModel)]="notificationsEnabled" />
 *   Email notifications
 * </label>
 * ```
 */
@Component({
  selector: 'input[type="checkbox"][brkSwitch]',
  template: '',
  styleUrl: './switch.css',
  host: {
    class: 'brk-switch',
    role: 'switch',
    '[class]': '"brk-switch--" + size()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrkSwitchComponent {
  readonly size = input<ComponentSize>('md');
}
