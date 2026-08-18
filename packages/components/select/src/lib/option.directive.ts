import {
  Directive,
  ElementRef,
  booleanAttribute,
  inject,
  input,
  signal,
} from '@angular/core';
import type { Highlightable } from '@angular/cdk/a11y';

let nextOptionId = 0;

/**
 * Marks a native element inside a `<brk-select>` as a selectable option -
 * the select analogue of `brkMenuItem`. Kept as an attribute directive (not
 * a wrapping component), same reasoning as everywhere else in this
 * library: real element, full keyboard/AT semantics for free.
 *
 * ```html
 * <brk-select placeholder="Choose a country" [(ngModel)]="country">
 *   <div brkOption value="us">United States</div>
 *   <div brkOption value="ca">Canada</div>
 * </brk-select>
 * ```
 *
 * Implements CDK's `Highlightable` (not `ListKeyManagerOption` alone) -
 * `brk-select` uses `ActiveDescendantKeyManager`, not the
 * `FocusKeyManager` `brk-menu` uses. That is a deliberate difference, not
 * an inconsistency: a menu's ARIA role is `menu`/`menuitem`, where real DOM
 * focus is expected to move between items, but a `combobox`/`listbox`
 * keeps focus on the combobox itself and points `aria-activedescendant` at
 * the highlighted option instead - that is the WAI-ARIA APG's actual
 * "select-only combobox" pattern, and `ActiveDescendantKeyManager` is
 * CDK's primitive for exactly that model.
 */
@Directive({
  selector: '[brkOption]',
  host: {
    class: 'brk-option',
    role: 'option',
    tabindex: '-1',
    '[id]': 'id',
    '[attr.aria-selected]': 'selected()',
    '[attr.aria-disabled]': 'isDisabled() || null',
  },
})
export class BrkOptionDirective implements Highlightable {
  /** Read by `BrkSelectComponent` to match a clicked DOM node back to its directive instance. */
  readonly elementRef = inject(ElementRef<HTMLElement>);

  /** The value this option represents - compared with `===` against the select's model value. */
  readonly value = input.required<unknown>();

  readonly isDisabled = input(false, {
    transform: booleanAttribute,
    // eslint-disable-next-line @angular-eslint/no-input-rename
    alias: 'disabled',
  });

  /** Required by `ListKeyManagerOption` - a signal would be truthy here, always skipping the item. */
  get disabled(): boolean {
    return this.isDisabled();
  }

  readonly id = `brk-option-${nextOptionId++}`;

  /**
   * Set by `BrkSelectComponent` once it knows this option's value is the
   * current one. A signal, not a plain boolean - `BrkSelectComponent`
   * writes it from an `effect()`, and only a signal read inside this host
   * binding gets Angular to re-check it under OnPush: this directive's host
   * bindings belong to whichever template declared the option (the
   * consumer's, not the select's), so a plain mutated property here would
   * not reliably schedule a re-render at all.
   */
  readonly selected = signal(false);

  getLabel(): string {
    return (this.elementRef.nativeElement.textContent || '').trim();
  }

  setActiveStyles(): void {
    this.elementRef.nativeElement.classList.add('brk-option--active');
    // jsdom (unit tests) doesn't implement scrollIntoView at all.
    this.elementRef.nativeElement.scrollIntoView?.({ block: 'nearest' });
  }

  setInactiveStyles(): void {
    this.elementRef.nativeElement.classList.remove('brk-option--active');
  }
}
