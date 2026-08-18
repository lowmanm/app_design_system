import { Injectable, inject } from '@angular/core';
import { Dialog, type DialogConfig, type DialogRef } from '@angular/cdk/dialog';
import type { ComponentType } from '@angular/cdk/portal';

/**
 * Opens a `<brk-dialog>`-based modal by wrapping `@angular/cdk/dialog`'s
 * `Dialog` directly, rather than hand-rolling overlay/focus-trap logic the
 * way `brk-menu` needed to. CDK `Dialog` already implements the modal
 * pattern correctly - focus trap, initial focus, restore-focus-on-close -
 * and re-deriving that by hand is both extra work and a real correctness
 * risk (a mis-trapped modal is one of the more common serious a11y bugs).
 *
 * ```ts
 * const dialogService = inject(BrkDialogService);
 * const dialogRef = dialogService.open(ConfirmDeleteDialog, {
 *   data: { projectName: 'design-system' },
 * });
 * dialogRef.closed.subscribe((confirmed) => { ... });
 * ```
 *
 * Ships modal-only this pass: `ariaModal` is forced `true` (CDK defaults
 * it to `false`, since it's redundant with the `aria-hidden` CDK already
 * applies to background content - forcing it here is a deliberate,
 * belt-and-braces choice for this system rather than a CDK default). A
 * non-modal drawer/side-panel variant is a different component, not a
 * config flag on this one, and is out of scope for now.
 */
@Injectable({ providedIn: 'root' })
export class BrkDialogService {
  private readonly dialog = inject(Dialog);

  open<R = unknown, D = unknown, C = unknown>(
    component: ComponentType<C>,
    config?: DialogConfig<D, DialogRef<R, C>>,
  ): DialogRef<R, C> {
    return this.dialog.open<R, D, C>(component, {
      ariaModal: true,
      ...config,
    });
  }
}
