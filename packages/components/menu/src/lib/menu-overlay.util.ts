import type { OverlayRef } from '@angular/cdk/overlay';
import { merge } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import type { BrkMenuComponent } from './menu';

/**
 * The stream that should close a menu's overlay: the menu emitting
 * `closed` (Escape, or an item being chosen), or a genuine outside click.
 * "Outside" excludes clicks anywhere inside *any* overlay pane, not just
 * this one - without that, clicking inside a nested submenu (a separate
 * overlay, positioned outside this menu's own pane) would register as an
 * outside click on the *parent* and close it out from under the submenu.
 */
export function menuCloseEvents(
  menu: BrkMenuComponent,
  overlayRef: OverlayRef,
) {
  return merge(
    menu.closed,
    overlayRef
      .outsidePointerEvents()
      .pipe(
        filter(
          (event) =>
            !(event.target as Element | null)?.closest?.('.cdk-overlay-pane'),
        ),
      ),
    overlayRef.detachments(),
  ).pipe(take(1));
}
