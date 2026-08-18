import type {
  ConnectedPosition,
  FlexibleConnectedPositionStrategyOrigin,
  Overlay,
  OverlayRef,
} from '@angular/cdk/overlay';
import { merge, type Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';

/**
 * Shared by every trigger-based floating panel in the library (menu,
 * select, tooltip): create a CDK `OverlayRef` anchored to a trigger, with
 * fallback positions and push-into-viewport behavior. What differs between
 * consumers - the position list itself, whether the panel matches the
 * trigger's width, which scroll strategy fits the interaction - stays a
 * parameter here rather than becoming a fork of this function, which is
 * what building each consumer's overlay by hand already produced once (menu
 * needed the same six lines rewritten three times across its own trigger
 * directives before this was factored out).
 */
export interface ConnectedOverlayOptions {
  /** Fallback position list, most-preferred first. */
  positions: ConnectedPosition[];
  /**
   * Matches the panel's minimum width to the origin's - the usual choice
   * for a dropdown (select), never for a menu or tooltip, which size to
   * their own content.
   */
  minWidth?: number | string;
  /**
   * `'reposition'` (default) tracks the trigger on scroll/resize - correct
   * for anything that stays open while the page scrolls (select, tooltip).
   * `'close'` dismisses instead - correct for a menu anchored to a
   * transient point (a right-click location) that scrolling invalidates.
   */
  scrollStrategy?: 'reposition' | 'close';
}

export function createConnectedOverlay(
  overlay: Overlay,
  origin: FlexibleConnectedPositionStrategyOrigin,
  options: ConnectedOverlayOptions,
): OverlayRef {
  const { positions, minWidth, scrollStrategy = 'reposition' } = options;
  return overlay.create({
    positionStrategy: overlay
      .position()
      .flexibleConnectedTo(origin)
      .withPositions(positions)
      .withFlexibleDimensions(false)
      .withPush(true),
    scrollStrategy:
      scrollStrategy === 'close'
        ? overlay.scrollStrategies.close()
        : overlay.scrollStrategies.reposition(),
    minWidth,
  });
}

/**
 * The stream that should close a triggered overlay: whatever the panel's
 * own "close yourself" signal is (Escape, an item chosen, ...), or a
 * genuine outside click. "Outside" excludes clicks anywhere inside *any*
 * overlay pane, not just this one - without that, clicking inside a nested
 * overlay (e.g. a menu's submenu, a separate pane positioned outside the
 * parent's own) would register as an outside click on the parent and close
 * it out from under the nested one.
 *
 * `internalClose$` is the caller's own close signal, already adapted to an
 * Observable - an Angular `output()` is an `OutputEmitterRef`, not an
 * Observable, and merging it directly fails silently rather than erroring,
 * so callers must pass `outputToObservable(x.closed)` rather than `x.closed`.
 */
export function overlayCloseEvents(
  overlayRef: OverlayRef,
  internalClose$: Observable<unknown>,
): Observable<unknown> {
  return merge(
    internalClose$,
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
