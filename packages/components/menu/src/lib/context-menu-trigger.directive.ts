import {
  Directive,
  ElementRef,
  OnDestroy,
  ViewContainerRef,
  inject,
  input,
} from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { outputToObservable } from '@angular/core/rxjs-interop';
import {
  createConnectedOverlay,
  overlayCloseEvents,
} from '@app-design-system/core';
import type { Subscription } from 'rxjs';
import { BrkMenuComponent } from './menu';

/**
 * Opens a `<brk-menu>` at the cursor on right-click, instead of below a
 * clicked trigger element:
 *
 * ```html
 * <div class="report-row" [brkContextMenuTriggerFor]="rowMenu">...</div>
 * <brk-menu #rowMenu>
 *   <button brkMenuItem (activated)="rename()">Rename</button>
 *   <button brkMenuItem danger (activated)="delete()">Delete</button>
 * </brk-menu>
 * ```
 *
 * The host is made focusable (`tabindex="-1"` if it isn't already) and
 * responds to the keyboard context-menu affordances - Shift+F10 and the
 * dedicated ContextMenu key - because a mouse-only context menu is
 * unreachable for keyboard users (WCAG 2.1.1).
 */
@Directive({
  selector: '[brkContextMenuTriggerFor]',
  host: {
    '[attr.tabindex]': 'hostTabIndex',
    '(contextmenu)': '_onContextMenu($event)',
    '(keydown.shift.F10)': '_onKeyboardRequest($event)',
    '(keydown.ContextMenu)': '_onKeyboardRequest($event)',
  },
})
export class BrkContextMenuTriggerDirective implements OnDestroy {
  readonly menu = input.required<BrkMenuComponent>({
    alias: 'brkContextMenuTriggerFor',
  });

  private readonly overlay = inject(Overlay);
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly viewContainerRef = inject(ViewContainerRef);

  private overlayRef?: OverlayRef;
  private closeSubscription?: Subscription;

  /**
   * Only forces focusability when the host isn't already focusable - closing
   * the menu returns focus here, which is a no-op on an element that cannot
   * hold focus, and an interactive host (a link, a button) should keep its
   * own place in the tab order.
   */
  protected get hostTabIndex(): string | null {
    const el = this.elementRef.nativeElement;
    return el.hasAttribute('tabindex') || el.tabIndex >= 0 ? null : '-1';
  }

  protected _onContextMenu(event: MouseEvent): void {
    event.preventDefault();
    this._openAt(event.clientX, event.clientY);
  }

  protected _onKeyboardRequest(event: Event): void {
    event.preventDefault();
    // Anchor to the host element's corner, since there is no cursor.
    const rect = this.elementRef.nativeElement.getBoundingClientRect();
    this._openAt(rect.left, rect.bottom);
  }

  private _openAt(x: number, y: number): void {
    this.close();
    const menu = this.menu();

    const overlayRef = createConnectedOverlay(
      this.overlay,
      { x, y },
      {
        positions: [
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'top',
          },
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'bottom',
          },
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'end',
            overlayY: 'top',
          },
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'end',
            overlayY: 'bottom',
          },
        ],
        scrollStrategy: 'close',
      },
    );
    this.overlayRef = overlayRef;

    overlayRef.attach(
      new TemplatePortal(menu.templateRef(), this.viewContainerRef),
    );

    this.closeSubscription = overlayCloseEvents(
      overlayRef,
      outputToObservable(menu.closed),
    ).subscribe(() => this.close());
    queueMicrotask(() => menu.onPanelAttached());
  }

  close(): void {
    if (!this.overlayRef) {
      return;
    }
    const menu = this.menu();
    menu.closeAllSubmenus();
    this.overlayRef.detach();
    menu.onPanelDetached();
    this.closeSubscription?.unsubscribe();
    this.elementRef.nativeElement.focus();
  }

  ngOnDestroy(): void {
    this.overlayRef?.dispose();
    this.closeSubscription?.unsubscribe();
  }
}
