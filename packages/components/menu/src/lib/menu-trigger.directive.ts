import {
  Directive,
  ElementRef,
  OnDestroy,
  ViewContainerRef,
  inject,
  input,
} from '@angular/core';
import {
  Overlay,
  OverlayRef,
  type ConnectedPosition,
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { outputToObservable } from '@angular/core/rxjs-interop';
import {
  createConnectedOverlay,
  overlayCloseEvents,
} from '@app-design-system/core';
import type { Subscription } from 'rxjs';
import { BrkMenuComponent } from './menu';
import { BrkMenuItemDirective } from './menu-item.directive';

/**
 * Connects a trigger element (typically a `brkButton`) to a `<brk-menu>`,
 * opening it in a CDK Overlay positioned per the menu's `xPosition`/
 * `yPosition`/`overlapTrigger` (flipping to the other side automatically
 * if there isn't room) on click or ArrowDown.
 *
 * ```html
 * <button brkButton variant="outlined" [brkMenuTriggerFor]="appMenu">
 *   Workspace
 * </button>
 * <brk-menu #appMenu>...</brk-menu>
 * ```
 *
 * Put it on a `brkMenuItem` instead of a standalone trigger to get a
 * **nested submenu** - it opens to the side of the item, and choosing the
 * item opens the submenu instead of closing the parent menu:
 *
 * ```html
 * <brk-menu #fileMenu>
 *   <button brkMenuItem [brkMenuTriggerFor]="shareMenu">Share</button>
 * </brk-menu>
 * <brk-menu #shareMenu>
 *   <button brkMenuItem (activated)="emailLink()">Email link</button>
 * </brk-menu>
 * ```
 */
@Directive({
  selector: '[brkMenuTriggerFor]',
  host: {
    'aria-haspopup': 'menu',
    '[attr.aria-expanded]': 'isOpen()',
    '[attr.aria-controls]': 'isOpen() ? menu().panelId : null',
    '(click)': 'toggle()',
    '(keydown.arrowDown)': '_onArrowDown($event)',
  },
})
export class BrkMenuTriggerDirective implements OnDestroy {
  readonly menu = input.required<BrkMenuComponent>({
    alias: 'brkMenuTriggerFor',
  });

  private readonly overlay = inject(Overlay);
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly viewContainerRef = inject(ViewContainerRef);
  // Present only when this trigger sits on the same button as a
  // `brkMenuItem` - i.e. this is a submenu, opening beside its parent item
  // rather than below a standalone trigger.
  private readonly parentMenuItem = inject(BrkMenuItemDirective, {
    optional: true,
    self: true,
  });

  private overlayRef?: OverlayRef;
  private closeSubscription?: Subscription;

  constructor() {
    if (this.parentMenuItem) {
      this.parentMenuItem.submenuTrigger = this;
    }
  }

  isOpen(): boolean {
    return !!this.overlayRef?.hasAttached();
  }

  toggle(): void {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  open(): void {
    if (this.isOpen()) {
      return;
    }
    const menu = this.menu();

    const overlayRef = createConnectedOverlay(this.overlay, this.elementRef, {
      positions: this._buildPositions(),
      minWidth: this.parentMenuItem
        ? undefined
        : this.elementRef.nativeElement.getBoundingClientRect().width,
    });
    this.overlayRef = overlayRef;

    overlayRef.attach(
      new TemplatePortal(menu.templateRef(), this.viewContainerRef),
    );

    this.closeSubscription = overlayCloseEvents(
      overlayRef,
      outputToObservable(menu.closed),
    ).subscribe(() => this.close());

    // Wait a tick for the portal content to actually be in the DOM before
    // trying to move focus into it.
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

  protected _onArrowDown(event: Event): void {
    event.preventDefault();
    this.open();
  }

  private _buildPositions(): ConnectedPosition[] {
    if (this.parentMenuItem) {
      // Submenu: open beside the item, top-aligned, flipping to the other
      // side if there isn't room.
      return [
        {
          originX: 'end',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'top',
          offsetX: 4,
        },
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'end',
          overlayY: 'top',
          offsetX: -4,
        },
      ];
    }

    const menu = this.menu();
    const originX = menu.xPosition() === 'before' ? 'end' : 'start';
    const overlayX = originX;
    const overlap = menu.overlapTrigger();

    if (menu.yPosition() === 'above') {
      return overlap
        ? [
            {
              originX,
              originY: 'bottom',
              overlayX,
              overlayY: 'bottom',
              offsetY: 0,
            },
            { originX, originY: 'top', overlayX, overlayY: 'top', offsetY: 0 },
          ]
        : [
            {
              originX,
              originY: 'top',
              overlayX,
              overlayY: 'bottom',
              offsetY: -6,
            },
            {
              originX,
              originY: 'bottom',
              overlayX,
              overlayY: 'top',
              offsetY: 6,
            },
          ];
    }
    return overlap
      ? [
          { originX, originY: 'top', overlayX, overlayY: 'top', offsetY: 0 },
          {
            originX,
            originY: 'bottom',
            overlayX,
            overlayY: 'bottom',
            offsetY: 0,
          },
        ]
      : [
          { originX, originY: 'bottom', overlayX, overlayY: 'top', offsetY: 6 },
          {
            originX,
            originY: 'top',
            overlayX,
            overlayY: 'bottom',
            offsetY: -6,
          },
        ];
  }

  ngOnDestroy(): void {
    this.overlayRef?.dispose();
    this.closeSubscription?.unsubscribe();
  }
}
