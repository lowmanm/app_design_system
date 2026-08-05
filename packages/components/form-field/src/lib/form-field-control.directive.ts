import { Directive, ElementRef, inject } from '@angular/core';

let nextControlId = 0;

/**
 * Marks the native form control (`<input>`, `<select>`, `<textarea>`)
 * projected into `<ads-form-field>` so the form field can wire up
 * `id`/`for`, `aria-describedby` (hint + error), and `aria-invalid` -
 * without the consumer having to manage those associations by hand.
 *
 * `describedByIds` and `invalid` are set imperatively by the parent
 * `AdsFormFieldComponent` (via `@ContentChild`), not bound as `@Input`s -
 * consumers never set them directly.
 */
@Directive({
  selector: 'input[adsFormFieldControl], select[adsFormFieldControl], textarea[adsFormFieldControl]',
  standalone: true,
  host: {
    '[id]': 'id',
    '[attr.aria-describedby]': 'describedByIds || null',
    '[attr.aria-invalid]': 'invalid || null',
  },
})
export class AdsFormFieldControlDirective {
  readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly id = `ads-form-field-control-${nextControlId++}`;

  describedByIds = '';
  invalid = false;
}
