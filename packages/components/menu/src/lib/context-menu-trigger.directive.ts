import { Directive, ElementRef, Input, OnDestroy, ViewContainerRef, inject } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import type { Subscription } from 'rxjs';
import { BrkMenuComponent } from './menu';
import { menuCloseEvents } from './menu-overlay.util';

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
 */
@Directive({
  selector: '[brkContextMenuTriggerFor]',
  standalone: true,
  host: {
    '(contextmenu)': '_onContextMenu($event)',
  },
})
export class BrkContextMenuTriggerDirective implements OnDestroy {
  @Input('brkContextMenuTriggerFor') menu!: BrkMenuComponent;

  private readonly overlay = inject(Overlay);
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly viewContainerRef = inject(ViewContainerRef);

  private overlayRef?: OverlayRef;
  private closeSubscription?: Subscription;

  protected _onContextMenu(event: MouseEvent): void {
    event.preventDefault();
    this.close();

    const { clientX: x, clientY: y } = event;
    const overlayRef = this.overlay.create({
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo({ x, y })
        .withPositions([
          { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'top' },
          { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom' },
          { originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'top' },
          { originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'bottom' },
        ])
        .withFlexibleDimensions(false)
        .withPush(true),
      scrollStrategy: this.overlay.scrollStrategies.close(),
    });
    this.overlayRef = overlayRef;

    const portal = new TemplatePortal(this.menu.templateRef, this.viewContainerRef);
    overlayRef.attach(portal);

    this.closeSubscription = menuCloseEvents(this.menu, overlayRef).subscribe(() => this.close());
    queueMicrotask(() => this.menu.focusFirstItem());
  }

  close(): void {
    if (!this.overlayRef) {
      return;
    }
    this.menu.closeAllSubmenus();
    this.overlayRef.detach();
    this.closeSubscription?.unsubscribe();
    this.elementRef.nativeElement.focus();
  }

  ngOnDestroy(): void {
    this.overlayRef?.dispose();
    this.closeSubscription?.unsubscribe();
  }
}
