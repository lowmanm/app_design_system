import { ChangeDetectionStrategy, Component, input } from '@angular/core';

let nextGroupId = 0;

/**
 * Groups a set of `brkRadio` inputs under one accessible name, using a
 * real `<fieldset>`/`<legend>` (WCAG 1.3.1) rather than `aria-labelledby`
 * pointing at a heading - a native fieldset/legend pair is understood by
 * every assistive technology without any ARIA at all.
 *
 * Also supplies the shared `name` every radio in the group needs to
 * coordinate as a single choice (Angular's own `RadioControlValueAccessor`
 * does the actual value coordination once the `name`s match - this
 * component's only job is to stop every consumer from inventing and
 * repeating that string by hand on each radio).
 *
 * ```html
 * <brk-radio-group label="Billing plan">
 *   <label><input type="radio" brkRadio value="free" [(ngModel)]="plan" /> Free</label>
 *   <label><input type="radio" brkRadio value="pro" [(ngModel)]="plan" /> Pro</label>
 * </brk-radio-group>
 * ```
 *
 * This component does not itself implement `ControlValueAccessor` - bind
 * `[(ngModel)]`/`formControlName` on the individual radios, or on a
 * containing form, exactly as you would with bare native radio inputs.
 * It is purely the fieldset/legend/name convenience, not a value owner.
 */
@Component({
  selector: 'brk-radio-group',
  template: `
    <fieldset class="brk-radio-group__fieldset">
      <legend class="brk-radio-group__legend">{{ label() }}</legend>
      <ng-content />
    </fieldset>
  `,
  styleUrl: './radio-group.css',
  host: { class: 'brk-radio-group' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrkRadioGroupComponent {
  readonly label = input.required<string>();

  /**
   * Defaults to a generated id, overridable when a stable name matters
   * (e.g. matching a reactive form's control name, or SSR hydration -
   * the same auto-id tradeoff `brk-form-field` already makes elsewhere
   * in this library).
   */
  readonly name = input(`brk-radio-group-${nextGroupId++}`);
}
