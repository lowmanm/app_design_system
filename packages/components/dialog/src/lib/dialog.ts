import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { BrkIconComponent } from '@app-design-system/icon';

/**
 * The token-styled container for a dialog's content - put this inside the
 * component you pass to `BrkDialogService.open()`:
 *
 * ```ts
 * @Component({
 *   imports: [BrkDialogComponent, BrkDialogTitleDirective, BrkDialogContentDirective, BrkDialogActionsDirective, BrkButtonDirective],
 *   template: `
 *     <brk-dialog>
 *       <h2 brkDialogTitle>Delete project?</h2>
 *       <p brkDialogContent>This can't be undone.</p>
 *       <div brkDialogActions>
 *         <button brkButton variant="text" (click)="dialogRef.close(false)">Cancel</button>
 *         <button brkButton (click)="dialogRef.close(true)">Delete</button>
 *       </div>
 *     </brk-dialog>
 *   `,
 * })
 * class ConfirmDeleteDialog {
 *   readonly dialogRef = inject(DialogRef<boolean>);
 * }
 * ```
 *
 * Split into a separate component from `BrkDialogService` (rather than the
 * service rendering a fixed template itself) because dialog content is
 * arbitrary and per-use, the same reason `brk-card`'s slots exist instead
 * of a `title`/`body` string API - a confirm dialog and a form dialog need
 * genuinely different markup, not just different text in fixed positions.
 *
 * Renders its own close ("X") button, wired to `DialogRef.close()` - not
 * an input to opt out of, since a modal dialog without a visible way to
 * dismiss it besides Escape/backdrop-click is a real usability gap, not a
 * style choice.
 */
@Component({
  selector: 'brk-dialog',
  imports: [BrkIconComponent],
  template: `
    <button
      type="button"
      class="brk-dialog__close"
      aria-label="Close dialog"
      (click)="dialogRef?.close()"
    >
      <brk-icon name="close" size="sm" />
    </button>
    <ng-content select="[brkDialogTitle]" />
    <ng-content select="[brkDialogContent]" />
    <ng-content select="[brkDialogActions]" />
  `,
  styleUrl: './dialog.css',
  host: { class: 'brk-dialog' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  // `.brk-dialog__title`/`__content`/`__actions` in dialog.css must reach
  // BrkDialogTitleDirective/ContentDirective/ActionsDirective's host
  // elements, which live in the *consumer's* dialog-content component's
  // template, not this one's - the same reason brk-select's panel needs
  // ViewEncapsulation.None to style consumer-projected option elements.
  encapsulation: ViewEncapsulation.None,
})
export class BrkDialogComponent {
  protected readonly dialogRef = inject(DialogRef, { optional: true });
}
