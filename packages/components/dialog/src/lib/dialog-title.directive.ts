import { Directive, OnDestroy, OnInit, inject } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';

let nextDialogTitleId = 0;

/**
 * The subset of `CdkDialogContainer`'s internal API this directive relies
 * on to register itself as the dialog's accessible name. Underscore-
 * prefixed because CDK doesn't publish it as a stable public contract, but
 * it's exactly the mechanism Angular Material's own `MatDialogTitle` uses
 * for the same purpose - there is no *other* supported way to give a
 * dynamically-instantiated title's id to `DialogConfig.ariaLabelledBy`,
 * since that config is set before the title (or its id) exists. Narrowed
 * to only the two methods actually called, rather than importing and
 * casting to the full `CdkDialogContainer` type, so a change to unrelated
 * internals elsewhere on that class can't affect this.
 */
interface AriaLabelledByContainer {
  _addAriaLabelledBy(id: string): void;
  _removeAriaLabelledBy(id: string): void;
}

/**
 * Marks a dialog's heading (e.g. `<h2 brkDialogTitle>`) as the element that
 * gives the dialog its accessible name (WCAG 2.4.6, 4.1.2) - required on
 * every `<brk-dialog>`, the same way `brk-select`'s `ariaLabel` is required
 * in practice despite being "just" an input.
 */
@Directive({
  selector: '[brkDialogTitle]',
  host: {
    class: 'brk-dialog__title',
    '[id]': 'id',
  },
})
export class BrkDialogTitleDirective implements OnInit, OnDestroy {
  private readonly dialogRef = inject(DialogRef, { optional: true });

  readonly id = `brk-dialog-title-${nextDialogTitleId++}`;

  ngOnInit(): void {
    // Deferred a tick: the container's own [attr.aria-labelledby] host
    // binding was already checked once during this attach, by the time a
    // projected child's ngOnInit runs - registering synchronously here
    // trips NG0100 (ExpressionChangedAfterItHasBeenCheckedError) against
    // that ancestor view. A microtask applies it on the following cycle.
    queueMicrotask(() => {
      (
        this.dialogRef?.containerInstance as AriaLabelledByContainer | undefined
      )?._addAriaLabelledBy(this.id);
    });
  }

  ngOnDestroy(): void {
    (
      this.dialogRef?.containerInstance as AriaLabelledByContainer | undefined
    )?._removeAriaLabelledBy(this.id);
  }
}
