import {
  Directive,
  ElementRef,
  booleanAttribute,
  inject,
  input,
  output,
} from '@angular/core';

/**
 * Marks a native `<button>` inside a `<brk-menu>` as an actionable item.
 * Kept as an attribute directive (not a wrapping component) so the menu
 * stays a plain list of real, native buttons - full keyboard/AT semantics
 * for free, same reasoning as `brkButton`.
 *
 * ```html
 * <brk-menu #appMenu>
 *   <button brkMenuItem (activated)="openSettings()">Profile settings</button>
 *   <button brkMenuItem danger (activated)="signOut()">Sign out</button>
 * </brk-menu>
 * ```
 *
 * Add `[brkMenuTriggerFor]` to the same button to turn it into a submenu
 * trigger instead - see `BrkMenuTriggerDirective`, which registers itself
 * here as `submenuTrigger` on construction. (This directive intentionally
 * does *not* inject `BrkMenuTriggerDirective` itself - Angular's DI treats
 * two directives on the same host each injecting the other via `self: true`
 * as a real circular dependency and throws, regardless of import order.)
 */
@Directive({
  selector: '[brkMenuItem]',
  host: {
    class: 'brk-menu-item',
    role: 'menuitem',
    tabindex: '-1',
    '[class.brk-menu-item--danger]': 'danger()',
    '[class.brk-menu-item--submenu]': '!!submenuTrigger',
    // The native attribute is what stops a click ever reaching a handler;
    // aria-disabled is what assistive tech announces. Bound as an attribute
    // rather than a property because a directive's host element type is not
    // known at compile time.
    '[attr.disabled]': 'isDisabled() || null',
    '[attr.aria-disabled]': 'isDisabled() || null',
    '[attr.aria-haspopup]': 'submenuTrigger ? "menu" : null',
    '(click)': '_onActivate()',
    '(keydown.enter)': '_onActivate()',
    '(keydown.space)': '_onActivate($event)',
    '(keydown.arrowLeft)': '_onArrowLeft($event)',
  },
})
export class BrkMenuItemDirective {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  /** Set by `BrkMenuTriggerDirective`'s constructor when co-located on the same element. */
  submenuTrigger?: { open(): void; close(): void };

  /** Styles this item as a destructive action (e.g. "Sign out", "Delete report"). */
  readonly danger = input(false, { transform: booleanAttribute });

  /**
   * Aliased to `disabled` for consumers, but named differently internally so
   * the plain `disabled` getter below can exist alongside it. CDK's
   * `ListKeyManagerOption` requires a boolean `disabled` property to skip an
   * item during arrow-key navigation; a signal named `disabled` would be a
   * *function* there - always truthy - which would make the key manager skip
   * every item in the menu.
   */
  readonly isDisabled = input(false, {
    transform: booleanAttribute,
    // eslint-disable-next-line @angular-eslint/no-input-rename
    alias: 'disabled',
  });

  get disabled(): boolean {
    return this.isDisabled();
  }

  /**
   * Fires when the item is chosen (click, Enter, or Space) and it is *not*
   * a submenu trigger - a submenu trigger opens its submenu instead and
   * keeps the parent menu open.
   */
  readonly activated = output<void>();

  focus(): void {
    this.elementRef.nativeElement.focus();
  }

  getLabel(): string {
    return (this.elementRef.nativeElement.textContent || '').trim();
  }

  protected _onActivate(event?: Event): void {
    if (this.isDisabled()) {
      return;
    }
    event?.preventDefault();
    if (this.submenuTrigger) {
      this.submenuTrigger.open();
      return;
    }
    this.activated.emit();
  }

  /** ARIA menu pattern: ArrowLeft closes an open submenu and returns to its parent item. */
  protected _onArrowLeft(event: Event): void {
    if (this.submenuTrigger) {
      event.preventDefault();
      this.submenuTrigger.close();
    }
  }
}
