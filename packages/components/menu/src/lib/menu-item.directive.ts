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
 */
@Directive({
  selector: '[brkMenuItem]',
  standalone: true,
  host: {
    class: 'brk-menu-item',
    role: 'menuitem',
    tabindex: '-1',
    '[class.brk-menu-item--danger]': 'danger',
    '[attr.aria-disabled]': 'disabled || null',
    '(click)': '_onActivate()',
    '(keydown.enter)': '_onActivate()',
    '(keydown.space)': '_onActivate($event)',
  },
})
export class BrkMenuItemDirective {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  /** Styles this item as a destructive action (e.g. "Sign out", "Delete report"). */
  @Input({ transform: booleanAttribute }) danger = false;
  @Input({ transform: booleanAttribute }) disabled = false;

  /** Fires when the item is chosen (click, Enter, or Space) - the menu closes on this. */
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
    this.activated.emit();
  }
}
