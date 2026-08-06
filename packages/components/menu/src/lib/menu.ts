import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  TemplateRef,
  contentChild,
  contentChildren,
  effect,
  input,
  output,
  viewChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { FocusKeyManager } from '@angular/cdk/a11y';
import { BrkMenuItemDirective } from './menu-item.directive';
import { BrkMenuContentDirective } from './menu-content.directive';
import { BrkMenuTriggerDirective } from './menu-trigger.directive';

/** Where the panel opens relative to its trigger - mirrors mat-menu's xPosition/yPosition/overlapTrigger. */
export type BrkMenuXPosition = 'before' | 'after';
export type BrkMenuYPosition = 'above' | 'below';

let nextMenuId = 0;

/**
 * A floating menu panel's *content* - the actual floating/positioning is
 * handled by `BrkMenuTriggerDirective` via CDK Overlay, which portals this
 * component's template out when the trigger opens it. Declare it as a
 * sibling of its trigger and connect them with `[brkMenuTriggerFor]`:
 *
 * ```html
 * <button brkButton variant="outlined" [brkMenuTriggerFor]="appMenu">
 *   Workspace
 * </button>
 * <brk-menu #appMenu>
 *   <button brkMenuItem (activated)="openSettings()">Profile settings</button>
 *   <button brkMenuItem danger (activated)="signOut()">Sign out</button>
 * </brk-menu>
 * ```
 *
 * Keyboard model follows the ARIA menu pattern: arrow keys move focus
 * (wrapping at the ends, skipping disabled items), typing jumps to a
 * matching item, ArrowRight opens a submenu and ArrowLeft returns to its
 * parent, Escape closes, and Tab closes rather than letting focus walk out
 * of an open overlay into the page behind it. Focus is real DOM focus
 * (roving tabindex) rather than `aria-activedescendant`.
 */
@Component({
  selector: 'brk-menu',
  imports: [NgTemplateOutlet],
  template: `
    <ng-template #templateRef>
      <div
        class="brk-menu"
        role="menu"
        tabindex="-1"
        [id]="panelId"
        [attr.aria-label]="ariaLabel() || null"
        (keydown)="_onKeydown($event)"
        (click)="_onPanelClick($event)"
      >
        @if (lazyContent()) {
          <ng-container *ngTemplateOutlet="lazyContent()!" />
        } @else {
          <ng-content />
        }
      </div>
    </ng-template>
  `,
  styleUrl: './menu.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrkMenuComponent implements OnDestroy {
  readonly templateRef =
    viewChild.required<TemplateRef<unknown>>('templateRef');
  readonly items = contentChildren(BrkMenuItemDirective, { descendants: true });
  private readonly submenuTriggers = contentChildren(BrkMenuTriggerDirective, {
    descendants: true,
  });
  protected readonly lazyContent = contentChild(BrkMenuContentDirective, {
    read: TemplateRef,
  });

  /** Which side of the trigger the panel opens toward horizontally. Default `'after'`. */
  readonly xPosition = input<BrkMenuXPosition>('after');
  /** Whether the panel opens above or below the trigger. Default `'below'`. */
  readonly yPosition = input<BrkMenuYPosition>('below');
  /** Opens the panel flush over the trigger instead of beside it. Default `false`. */
  readonly overlapTrigger = input(false);
  /** Accessible name for the panel, for menus whose trigger text is not descriptive. */
  readonly ariaLabel = input('');

  /** Fires on Escape, Tab, an outside click, or an item being activated - the trigger closes on this. */
  readonly closed = output<void>();

  /** Stable id so a trigger can point `aria-controls` at this panel. */
  readonly panelId = `brk-menu-${nextMenuId++}`;

  private keyManager?: FocusKeyManager<BrkMenuItemDirective>;
  private isAttached = false;

  constructor() {
    // Covers items arriving or changing *while the panel is open* - lazy
    // content driven by an async source populates after attach. Guarded on
    // isAttached so it cannot fire before onPanelAttached has done the
    // initial wiring, which would double-subscribe every item.
    effect(() => {
      this.items();
      if (this.isAttached) {
        this._syncItems();
      }
    });
  }

  /**
   * Called by a trigger once the panel is attached to the overlay and its
   * content exists. Menu items live inside the portaled template, so they
   * are not queryable before this point.
   *
   * The key manager is built here from a plain array snapshot rather than
   * once up-front from the items signal: the signal overload owns an
   * internal effect, and an overlay's view is attached to the ApplicationRef
   * rather than to this component, so that effect is not guaranteed to have
   * flushed by the time the panel is interactive.
   */
  onPanelAttached(): void {
    this.isAttached = true;
    this._syncItems();
    this.keyManager?.setFirstItemActive();
  }

  /** Called by a trigger when the panel is detached. */
  onPanelDetached(): void {
    this.isAttached = false;
    this.keyManager = undefined;
  }

  /** Closes every open submenu nested inside this menu - called before this menu itself closes. */
  closeAllSubmenus(): void {
    for (const trigger of this.submenuTriggers()) {
      trigger.close();
    }
  }

  /**
   * Closes the menu when an item is chosen. Delegated from the panel rather
   * than subscribed per item: the item set changes as the panel attaches,
   * detaches and lazily populates, and keeping per-item subscriptions in
   * step with that meant tearing them down and rebuilding on every
   * transition - overlapping rebuilds double-fired the close.
   *
   * A submenu trigger is excluded: choosing it opens its submenu and the
   * parent stays open. Disabled items never reach here (they carry the
   * native `disabled` attribute, so no click event is dispatched).
   */
  protected _onPanelClick(event: Event): void {
    const item = (event.target as Element | null)?.closest?.('.brk-menu-item');
    if (item && !item.classList.contains('brk-menu-item--submenu')) {
      this.closed.emit();
    }
  }

  protected _onKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        this.closed.emit();
        return;

      case 'Tab':
        // Without this, focus leaves the overlay while it is still open and
        // lands on the page behind it - the menu stays visible but is no
        // longer where the user is.
        this.closed.emit();
        return;

      case 'ArrowRight': {
        // Opens a submenu from its parent item, per the ARIA menu pattern.
        const active = this.keyManager?.activeItem;
        if (active?.submenuTrigger) {
          event.preventDefault();
          active.submenuTrigger.open();
        }
        return;
      }

      default:
        this.keyManager?.onKeydown(event);
    }
  }

  private _syncItems(): void {
    this.keyManager = new FocusKeyManager(this.items())
      .withWrap()
      .withTypeAhead();
    // The default skip predicate reads `item.disabled`, which
    // BrkMenuItemDirective exposes as a real boolean getter over its signal
    // input for exactly this reason - see the note there.
  }

  ngOnDestroy(): void {
    this.keyManager?.destroy();
  }
}
