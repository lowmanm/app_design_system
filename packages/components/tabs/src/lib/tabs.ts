import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  contentChildren,
  effect,
  input,
  model,
  viewChildren,
} from '@angular/core';
import { BrkTabComponent } from './tab';

/**
 * Tabbed navigation, ARIA tabs pattern (`role="tablist"`/`"tab"`/`"tabpanel"`,
 * `aria-selected`, roving tabindex). No CDK Overlay involved - tab panels
 * are inline, not floating, unlike menu/select.
 *
 * Renders the tab *buttons* itself, reading `label()`/`disabled()` off
 * each projected `BrkTabComponent`, rather than using CDK's
 * `FocusKeyManager` the way menu/select do: those coordinate roving focus
 * across elements a *consumer* authors and controls individually, but
 * these buttons are entirely owned and rendered by this component, so
 * plain index arithmetic against `tabs()` is simpler and no less correct.
 *
 * Automatic activation (arrow keys immediately select the tab, not just
 * move a pending highlight) - the WAI-ARIA APG's default recommendation,
 * appropriate here since a tab panel is cheap local content, not something
 * that needs a separate commit step the way a combobox's overlay listbox
 * does.
 *
 * ```html
 * <brk-tabs ariaLabel="Account settings">
 *   <brk-tab label="Profile">Profile form.</brk-tab>
 *   <brk-tab label="Billing">Billing form.</brk-tab>
 * </brk-tabs>
 * ```
 */
@Component({
  selector: 'brk-tabs',
  template: `
    <!--
      The keydown listener here is delegation, catching events bubbled up
      from whichever tab button currently holds focus (roving tabindex) -
      the tablist div itself is deliberately never focused, per the ARIA
      tabs pattern, so it doesn't need a tabindex of its own.
    -->
    <!-- eslint-disable-next-line @angular-eslint/template/interactive-supports-focus -->
    <div
      class="brk-tabs__list"
      role="tablist"
      [attr.aria-label]="ariaLabel() || null"
      (keydown)="_onKeydown($event)"
    >
      @for (tab of tabs(); track tab.tabId; let i = $index) {
        <button
          #tabButton
          type="button"
          class="brk-tabs__tab"
          role="tab"
          [id]="tab.tabId"
          [attr.aria-controls]="tab.panelId"
          [attr.aria-selected]="i === selectedIndex()"
          [attr.aria-disabled]="tab.disabled() || null"
          [attr.tabindex]="i === selectedIndex() ? 0 : -1"
          [disabled]="tab.disabled()"
          (click)="_select(i)"
        >
          {{ tab.label() }}
        </button>
      }
    </div>
    <ng-content />
  `,
  styleUrl: './tabs.css',
  host: { class: 'brk-tabs' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrkTabsComponent {
  /** Accessible name for the tablist, when the surrounding page doesn't already name it (e.g. a heading right above). */
  readonly ariaLabel = input('');

  /** Two-way bindable: `[(selectedIndex)]="active"`. */
  readonly selectedIndex = model(0);

  protected readonly tabs = contentChildren(BrkTabComponent);
  private readonly tabButtons =
    viewChildren<ElementRef<HTMLButtonElement>>('tabButton');

  constructor() {
    // Keeps every tab's own isActive signal in step with the selected
    // index - BrkTabComponent reads that to show/hide its panel.
    effect(() => {
      const index = this.selectedIndex();
      for (const [i, tab] of this.tabs().entries()) {
        tab.isActive.set(i === index);
      }
    });
  }

  protected _select(index: number): void {
    const tab = this.tabs()[index];
    if (!tab || tab.disabled()) {
      return;
    }
    this.selectedIndex.set(index);
  }

  protected _onKeydown(event: KeyboardEvent): void {
    const tabs = this.tabs();
    if (tabs.length === 0) {
      return;
    }

    let next: number | undefined;
    switch (event.key) {
      case 'ArrowRight':
        next = this._nextEnabledIndex(this.selectedIndex(), 1);
        break;
      case 'ArrowLeft':
        next = this._nextEnabledIndex(this.selectedIndex(), -1);
        break;
      case 'Home':
        next = this._nextEnabledIndex(-1, 1);
        break;
      case 'End':
        next = this._nextEnabledIndex(tabs.length, -1);
        break;
      default:
        return;
    }

    event.preventDefault();
    if (next !== undefined) {
      this._select(next);
      this.tabButtons()[next]?.nativeElement.focus();
    }
  }

  /** Wraps, and skips disabled tabs - returns undefined only if every tab is disabled. */
  private _nextEnabledIndex(
    from: number,
    direction: 1 | -1,
  ): number | undefined {
    const tabs = this.tabs();
    for (let step = 1; step <= tabs.length; step++) {
      const index = (from + direction * step + tabs.length) % tabs.length;
      if (!tabs[index]?.disabled()) {
        return index;
      }
    }
    return undefined;
  }
}
