import {
  AfterContentChecked,
  Component,
  ContentChild,
  input,
} from '@angular/core';
import { BrkFormFieldControlDirective } from './form-field-control.directive';

let nextFieldId = 0;

/**
 * Wires a label, hint text, and error message to a projected native form
 * control, handling the `<label for>` / `aria-describedby` / `aria-invalid`
 * associations (WCAG 1.3.1 Info and Relationships, 3.3.1 Error
 * Identification, 4.1.2 Name Role Value) so consumers get them correct by
 * construction rather than having to wire ids by hand.
 *
 * ```html
 * <brk-form-field label="Email" hint="We'll never share it" [errorMessage]="emailError">
 *   <input brkFormFieldControl type="email" [(ngModel)]="email" />
 * </brk-form-field>
 * ```
 */
@Component({
  selector: 'brk-form-field',
  standalone: true,
  templateUrl: './form-field.html',
  styleUrl: './form-field.css',
  host: { class: 'brk-form-field' },
})
export class BrkFormFieldComponent implements AfterContentChecked {
  readonly label = input.required<string>();
  readonly hint = input<string>('');
  readonly errorMessage = input<string>('');

  @ContentChild(BrkFormFieldControlDirective) control?: BrkFormFieldControlDirective;

  protected readonly hintId = `brk-form-field-hint-${nextFieldId}`;
  protected readonly errorId = `brk-form-field-error-${nextFieldId++}`;

  ngAfterContentChecked(): void {
    if (!this.control) {
      return;
    }
    const hasError = this.errorMessage().length > 0;
    const describedBy: string[] = [];
    // Mirrors the template's @if conditions exactly - the hint element is
    // only rendered when there's no error, so its id must only appear here
    // when it's actually present in the DOM.
    if (this.hint().length > 0 && !hasError) {
      describedBy.push(this.hintId);
    }
    if (hasError) {
      describedBy.push(this.errorId);
    }
    this.control.describedByIds = describedBy.join(' ');
    this.control.invalid = hasError;
  }
}
