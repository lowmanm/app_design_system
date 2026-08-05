import { Directive, ElementRef, Input, OnDestroy, ViewContainerRef, inject } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Subscription, merge } from 'rxjs';
import { take } from 'rxjs/operators';
import { BrkMenuComponent } from './menu';

/**
 * Connects a trigger element (typically a `brkButton`) to a `<brk-menu>`,
 * opening it in a CDK Overlay positioned below the trigger (flipping above
 * if there isn't room) on click or ArrowDown.
 *
 * ```html
 * <button brkButton variant="outlined" [brkMenuTriggerFor]="appMenu">
 *   Workspace
 * </button>
 * <brk-menu #appMenu>...</brk-menu>
 * ```
 */
@Directive({
  selector: '[brkMenuTriggerFor]',
  standalone: true,
  host: {
    'aria-haspopup': 'menu',
    '[attr.aria-expanded]': 'isOpen()',
    '(click)': 'toggle()',
    '(keydown.arrowDown)': '_onArrowDown($event)',
  },
})
export class BrkMenuTriggerDirective implements OnDestroy {
  @Input('brkMenuTriggerFor') menu!: BrkMenuComponent;

  private readonly overlay = inject(Overlay);
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly viewContainerRef = inject(ViewContainerRef);

  private overlayRef?: OverlayRef;
  private closeSubscription?: Subscription;

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

    const overlayRef = this.overlay.create({
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo(this.elementRef)
        .withPositions([
          { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 6 },
          { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -6 },
        ])
        .withFlexibleDimensions(false)
        .withPush(true),
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      minWidth: this.elementRef.nativeElement.getBoundingClientRect().width,
    });
    this.overlayRef = overlayRef;

    const portal = new TemplatePortal(this.menu.templateRef, this.viewContainerRef);
    overlayRef.attach(portal);

    this.closeSubscription = merge(
      this.menu.closed,
      overlayRef.outsidePointerEvents(),
      overlayRef.detachments(),
    )
      .pipe(take(1))
      .subscribe(() => this.close());

    // Wait a tick for the portal content to actually be in the DOM before
    // trying to move focus into it.
    queueMicrotask(() => this.menu.focusFirstItem());
  }

  close(): void {
    if (!this.overlayRef) {
      return;
    }
    this.overlayRef.detach();
    this.closeSubscription?.unsubscribe();
    this.elementRef.nativeElement.focus();
  }

  protected _onArrowDown(event: Event): void {
    event.preventDefault();
    this.open();
  }

  ngOnDestroy(): void {
    this.overlayRef?.dispose();
    this.closeSubscription?.unsubscribe();
  }
}
