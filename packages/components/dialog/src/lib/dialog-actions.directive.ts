import { Directive } from '@angular/core';

/**
 * The dialog's action row - marks whatever holds its buttons so
 * `dialog.css` can give it a top divider and right-aligned spacing, the
 * same "footer with a divider for free" payoff `brkCardFooter` gives
 * `brk-card`.
 */
@Directive({
  selector: '[brkDialogActions]',
  host: { class: 'brk-dialog__actions' },
})
export class BrkDialogActionsDirective {}
