import {
  AfterContentInit,
  Component,
  ContentChild,
  ContentChildren,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { FocusKeyManager } from '@angular/cdk/a11y';
import { Subscription } from 'rxjs';
import { BrkMenuItemDirective } from './menu-item.directive';
import { BrkMenuContentDirective } from './menu-content.directive';
import { BrkMenuTriggerDirective } from './menu-trigger.directive';

/** Where the panel opens relative to its trigger - mirrors mat-menu's xPosition/yPosition/overlapTrigger. */
export type BrkMenuXPosition = 'before' | 'after';
export type BrkMenuYPosition = 'above' | 'below';

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
 * Arrow keys move focus between items (wrapping at the ends), Escape and
 * outside-clicks close the menu and return focus to the trigger - the same
 * "roving tabindex" pattern as the ARIA menu authoring practice, using real
 * DOM focus rather than `aria-activedescendant`.
 */
@Component({
  selector: 'brk-menu',
  standalone: true,
  imports: [NgTemplateOutlet],
  template: `
    <ng-template #templateRef>
      <div
        class="brk-menu"
        role="menu"
        tabindex="-1"
        (keydown)="_onKeydown($event)"
      >
        @if (lazyContent) {
          <ng-container *ngTemplateOutlet="lazyContent" />
        } @else {
          <ng-content />
        }
      </div>
    </ng-template>
  `,
  styleUrl: './menu.css',
})
export class BrkMenuComponent implements AfterContentInit, OnDestroy {
  @ViewChild('templateRef', { static: true })
  readonly templateRef!: TemplateRef<unknown>;
  @ContentChildren(BrkMenuItemDirective, { descendants: true })
  readonly items!: QueryList<BrkMenuItemDirective>;
  @ContentChildren(BrkMenuTriggerDirective, { descendants: true })
  private readonly submenuTriggers?: QueryList<BrkMenuTriggerDirective>;
  @ContentChild(BrkMenuContentDirective, { read: TemplateRef })
  protected lazyContent?: TemplateRef<unknown>;

  /** Which side of the trigger the panel opens toward horizontally. Default `'after'`. */
  @Input() xPosition: BrkMenuXPosition = 'after';
  /** Whether the panel opens above or below the trigger. Default `'below'`. */
  @Input() yPosition: BrkMenuYPosition = 'below';
  /** Opens the panel flush over the trigger instead of beside it. Default `false`. */
  @Input() overlapTrigger = false;

  /** Fires on Escape, an outside click, or an item being activated - the trigger closes on this. */
  @Output() readonly closed = new EventEmitter<void>();

  private keyManager?: FocusKeyManager<BrkMenuItemDirective>;
  private itemSubscriptions = new Subscription();

  ngAfterContentInit(): void {
    this.keyManager = new FocusKeyManager(this.items)
      .withWrap()
      .withTypeAhead();
    this._subscribeToItemActivation();
    this.items.changes.subscribe(() => this._subscribeToItemActivation());
  }

  /** Called by the trigger once the panel is attached to the overlay and visible. */
  focusFirstItem(): void {
    this.keyManager?.setFirstItemActive();
  }

  /** Closes every open submenu nested inside this menu - called before this menu itself closes. */
  closeAllSubmenus(): void {
    this.submenuTriggers?.forEach((trigger) => trigger.close());
  }

  protected _onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.closed.emit();
      return;
    }
    this.keyManager?.onKeydown(event);
  }

  private _subscribeToItemActivation(): void {
    this.itemSubscriptions.unsubscribe();
    this.itemSubscriptions = new Subscription();
    this.items.forEach((item) =>
      this.itemSubscriptions.add(
        item.activated.subscribe(() => this.closed.emit()),
      ),
    );
  }

  ngOnDestroy(): void {
    this.itemSubscriptions.unsubscribe();
  }
}
