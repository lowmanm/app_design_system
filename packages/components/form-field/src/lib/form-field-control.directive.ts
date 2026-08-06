import { Directive, ElementRef, inject } from '@angular/core';

let nextControlId = 0;

/**
 * Marks the native form control (`<input>`, `<select>`, `<textarea>`)
 * projected into `<brk-form-field>` so the form field can wire up
 * `id`/`for`, `aria-describedby` (hint + error), and `aria-invalid` -
 * without the consumer having to manage those associations by hand.
 *
 * `describedByIds` and `invalid` are set imperatively by the parent
 * `BrkFormFieldComponent` (via `@ContentChild`), not bound as `@Input`s -
 * consumers never set them directly.
 */
@Directive({
  selector:
    'input[brkFormFieldControl], select[brkFormFieldControl], textarea[brkFormFieldControl]',
  standalone: true,
  host: {
    '[id]': 'id',
    '[attr.aria-describedby]': 'describedByIds || null',
    '[attr.aria-invalid]': 'invalid || null',
  },
})
export class BrkFormFieldControlDirective {
  readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly id = `brk-form-field-control-${nextControlId++}`;

  describedByIds = '';
  invalid = false;
}
