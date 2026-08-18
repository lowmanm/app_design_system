import {
  Directive,
  ElementRef,
  Injector,
  OnDestroy,
  inject,
  input,
  signal,
} from '@angular/core';
import {
  Overlay,
  type ConnectedPosition,
  type OverlayRef,
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { createConnectedOverlay } from '@app-design-system/core';
import { BrkTooltipPanelComponent } from './tooltip-panel';

export type BrkTooltipPosition = 'above' | 'below' | 'before' | 'after';

let nextTooltipId = 0;

/**
 * Shows on hover or focus after a short delay - the delay is what tells a
 * tooltip apart from content that's just always visible, and stops one
 * from flashing on every incidental mouse pass-over.
 */
const SHOW_DELAY_MS = 500;

/**
 * A text-only popup describing the host element - the WAI-ARIA "tooltip"
 * pattern (`role="tooltip"`, linked back via `aria-describedby`). Attach it
 * to whatever it describes, most often an icon-only `brkButton` that has
 * no visible label of its own:
 *
 * ```html
 * <button brkButton iconOnly brkTooltip="Delete">
 *   <brk-icon name="delete" />
 * </button>
 * ```
 *
 * **Text only, by contract, not just by omission.** The ARIA tooltip
 * pattern forbids interactive content - a tooltip a user would need to
 * click a link or a button inside is a popover, not a tooltip, and this
 * directive has no way to project markup into the popup at all (its
 * content is a plain `string` input). Reach for `brk-menu` or
 * `brk-dialog` instead if the content needs to be interactive.
 *
 * Shows on hover *and* focus (never hover-only - a keyboard user tabbing
 * to the trigger needs the same information a mouse user gets), and
 * Escape dismisses it without moving focus, per the ARIA tooltip pattern.
 */
@Directive({
  selector: '[brkTooltip]',
  host: {
    '[attr.aria-describedby]': 'isVisible() ? panelId : null',
    '(mouseenter)': '_scheduleShow()',
    '(mouseleave)': 'hide()',
    '(focus)': '_scheduleShow()',
    '(blur)': 'hide()',
    '(keydown.escape)': 'hide()',
  },
})
export class BrkTooltipDirective implements OnDestroy {
  readonly text = input.required<string>({ alias: 'brkTooltip' });
  readonly position = input<BrkTooltipPosition>('above', {
    alias: 'brkTooltipPosition',
  });

  private readonly overlay = inject(Overlay);
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly injector = inject(Injector);

  protected readonly panelId = `brk-tooltip-${nextTooltipId++}`;
  protected readonly isVisible = signal(false);

  private overlayRef?: OverlayRef;
  private showTimeoutId?: ReturnType<typeof setTimeout>;

  protected _scheduleShow(): void {
    if (this.overlayRef?.hasAttached()) {
      return;
    }
    clearTimeout(this.showTimeoutId);
    this.showTimeoutId = setTimeout(() => this._show(), SHOW_DELAY_MS);
  }

  private _show(): void {
    const overlayRef =
      this.overlayRef ??
      createConnectedOverlay(this.overlay, this.elementRef, {
        positions: this._buildPositions(),
      });
    this.overlayRef = overlayRef;

    const componentRef = overlayRef.attach(
      new ComponentPortal(BrkTooltipPanelComponent, null, this.injector),
    );
    componentRef.setInput('text', this.text());
    componentRef.setInput('panelId', this.panelId);
    this.isVisible.set(true);
  }

  hide(): void {
    clearTimeout(this.showTimeoutId);
    this.overlayRef?.dispose();
    this.overlayRef = undefined;
    this.isVisible.set(false);
  }

  private _buildPositions(): ConnectedPosition[] {
    switch (this.position()) {
      case 'below':
        return [
          {
            originX: 'center',
            originY: 'bottom',
            overlayX: 'center',
            overlayY: 'top',
            offsetY: 8,
          },
          {
            originX: 'center',
            originY: 'top',
            overlayX: 'center',
            overlayY: 'bottom',
            offsetY: -8,
          },
        ];
      case 'before':
        return [
          {
            originX: 'start',
            originY: 'center',
            overlayX: 'end',
            overlayY: 'center',
            offsetX: -8,
          },
          {
            originX: 'end',
            originY: 'center',
            overlayX: 'start',
            overlayY: 'center',
            offsetX: 8,
          },
        ];
      case 'after':
        return [
          {
            originX: 'end',
            originY: 'center',
            overlayX: 'start',
            overlayY: 'center',
            offsetX: 8,
          },
          {
            originX: 'start',
            originY: 'center',
            overlayX: 'end',
            overlayY: 'center',
            offsetX: -8,
          },
        ];
      case 'above':
      default:
        return [
          {
            originX: 'center',
            originY: 'top',
            overlayX: 'center',
            overlayY: 'bottom',
            offsetY: -8,
          },
          {
            originX: 'center',
            originY: 'bottom',
            overlayX: 'center',
            overlayY: 'top',
            offsetY: 8,
          },
        ];
    }
  }

  ngOnDestroy(): void {
    clearTimeout(this.showTimeoutId);
    this.overlayRef?.dispose();
  }
}
