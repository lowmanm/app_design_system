import { Directive } from '@angular/core';

/**
 * The dialog's scrollable body - marks whatever holds the dialog's main
 * content so `dialog.css` can cap its height and let it scroll
 * independently of the title/actions, which always stay visible.
 */
@Directive({
  selector: '[brkDialogContent]',
  host: { class: 'brk-dialog__content' },
})
export class BrkDialogContentDirective {}
