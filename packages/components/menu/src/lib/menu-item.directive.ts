import { Directive, ElementRef, EventEmitter, Input, Output, booleanAttribute, inject } from '@angular/core';

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
 * two directives on the same host each injecting the other via
 * `self: true` as a real circular dependency and throws, regardless of
 * module import order.)
 */
@Directive({
  selector: '[brkMenuItem]',
  standalone: true,
  host: {
    class: 'brk-menu-item',
    role: 'menuitem',
    tabindex: '-1',
    '[class.brk-menu-item--danger]': 'danger',
    '[class.brk-menu-item--submenu]': '!!submenuTrigger',
    '[attr.aria-disabled]': 'disabled || null',
    '[attr.aria-haspopup]': 'submenuTrigger ? "menu" : null',
    '(click)': '_onActivate()',
    '(keydown.enter)': '_onActivate()',
    '(keydown.space)': '_onActivate($event)',
  },
})
export class BrkMenuItemDirective {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  /** Set by `BrkMenuTriggerDirective`'s constructor when co-located on the same element. */
  submenuTrigger?: { open(): void };

  /** Styles this item as a destructive action (e.g. "Sign out", "Delete report"). */
  @Input({ transform: booleanAttribute }) danger = false;
  @Input({ transform: booleanAttribute }) disabled = false;

  /**
   * Fires when the item is chosen (click, Enter, or Space) and it is *not*
   * a submenu trigger - a submenu trigger opens its submenu instead and
   * keeps the parent menu open.
   */
  @Output() readonly activated = new EventEmitter<void>();

  focus(): void {
    this.elementRef.nativeElement.focus();
  }

  getLabel(): string {
    return (this.elementRef.nativeElement.textContent || '').trim();
  }

  protected _onActivate(event?: Event): void {
    if (this.disabled) {
      return;
    }
    event?.preventDefault();
    if (this.submenuTrigger) {
      this.submenuTrigger.open();
      return;
    }
    this.activated.emit();
  }
}
