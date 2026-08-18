import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  OnDestroy,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  contentChildren,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { Overlay, type OverlayRef } from '@angular/cdk/overlay';
import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import { DomPortal } from '@angular/cdk/portal';
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms';
import {
  createConnectedOverlay,
  overlayCloseEvents,
} from '@app-design-system/core';
import { BrkIconComponent } from '@app-design-system/icon';
import type { Subscription } from 'rxjs';
import { Subject } from 'rxjs';
import { BrkOptionDirective } from './option.directive';

let nextSelectId = 0;

/**
 * A single-select dropdown - the ARIA "select-only combobox" pattern
 * (`role="combobox"` + a `listbox` popup), built the way `brk-menu` was:
 * CDK overlay positioning, a key manager driving arrow-key navigation, real
 * ARIA state instead of a hidden native `<select>`.
 *
 * Unlike `brk-checkbox`/`brk-radio`, this **does** implement
 * `ControlValueAccessor` by hand - it is not a native form element, so
 * there is no built-in Angular accessor to lean on the way those do.
 *
 * ```html
 * <brk-select placeholder="Choose a country" ariaLabel="Country" [(ngModel)]="country">
 *   <div brkOption value="us">United States</div>
 *   <div brkOption value="ca">Canada</div>
 * </brk-select>
 * ```
 *
 * **`ariaLabel` is required in practice.** A `role="combobox"` element
 * needs an accessible name (WCAG 4.1.2) the same way `brk-checkbox` needs
 * a `<label>` - the difference is this component has an input for it
 * because, unlike a checkbox, there's no way to get one for free by
 * wrapping it in a native element.
 *
 * Options are **not** deferred into an unattached `<ng-template>` the way
 * menu items are - they render normally as this component's own projected
 * content, always instantiated, so the closed control can read the
 * selected option's label at any time (menu never needs this: a menu
 * trigger's text is authored by the consumer, not derived from which item
 * was last chosen). Opening moves the already-rendered panel element into
 * the CDK overlay with a `DomPortal` rather than portaling a template, and
 * closing moves it back - the options are the same DOM nodes throughout,
 * never re-created.
 *
 * Ships single-select only. A value is compared with `===`; there is no
 * `compareWith` for object-identity comparison, and no multi-select.
 */
@Component({
  selector: 'brk-select',
  imports: [BrkIconComponent],
  template: `
    <span
      class="brk-select__value"
      [class.brk-select__value--placeholder]="!selectedLabel()"
    >
      {{ selectedLabel() || placeholder() }}
    </span>
    <brk-icon
      name="arrow_drop_down"
      size="sm"
      class="brk-select__chevron"
      [class.brk-select__chevron--open]="isOpen()"
    />
    <!--
      Delegated click only, deliberately with no keydown/tabindex here: the
      select-only combobox pattern keeps real focus on the host the entire
      time (see the class doc comment on ActiveDescendantKeyManager vs
      FocusKeyManager) - this panel is never itself focused, so the
      generic "interactive element needs its own keyboard handler" lint
      rules don't apply to it.
    -->
    <!-- eslint-disable-next-line @angular-eslint/template/click-events-have-key-events, @angular-eslint/template/interactive-supports-focus -->
    <div
      #panel
      class="brk-select__panel"
      [class.brk-select__panel--open]="isOpen()"
      role="listbox"
      [id]="panelId"
      [attr.aria-label]="ariaLabel() || null"
      (click)="_onPanelClick($event)"
    >
      <ng-content />
    </div>
  `,
  styleUrl: './select.css',
  // brk-option's styling in select.css needs to reach elements projected
  // from the *consumer's* template, which normal per-component style
  // scoping would never match - see the comment on .brk-option there.
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'brk-select',
    role: 'combobox',
    'aria-haspopup': 'listbox',
    // The accessible name belongs on the combobox host, not the listbox
    // panel - a combobox with no name is what axe's aria-input-field-name
    // rule (and WCAG 4.1.2) actually flags.
    '[attr.aria-label]': 'ariaLabel() || null',
    '[attr.tabindex]': 'isDisabled() ? -1 : 0',
    '[attr.aria-expanded]': 'isOpen()',
    '[attr.aria-controls]': 'panelId',
    '[attr.aria-activedescendant]': 'isOpen() ? activeOptionId() : null',
    '[attr.aria-disabled]': 'isDisabled() || null',
    '(click)': '_onHostClick()',
    '(keydown)': '_onHostKeydown($event)',
    '(blur)': 'onTouched()',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: BrkSelectComponent,
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrkSelectComponent implements ControlValueAccessor, OnDestroy {
  private readonly overlay = inject(Overlay);
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly injector = inject(Injector);

  /** Shown when no option is selected. */
  readonly placeholder = input('Select…');
  /** Accessible name for the combobox, for a select whose own visible text isn't descriptive enough. */
  readonly ariaLabel = input('');
  /**
   * Plain-binding disable, independent of `setDisabledState()` below -
   * reactive/template-driven forms disable through the `ControlValueAccessor`
   * method instead, but a select disabled by ordinary UI state (nothing to
   * do with a form) needs an input to bind to, the same as every other
   * component in this library offers.
   */
  readonly disabledInput = input(false, {
    transform: booleanAttribute,
    // eslint-disable-next-line @angular-eslint/no-input-rename
    alias: 'disabled',
  });

  protected readonly panelRef =
    viewChild.required<ElementRef<HTMLElement>>('panel');
  protected readonly options = contentChildren(BrkOptionDirective, {
    descendants: true,
  });

  protected readonly panelId = `brk-select-panel-${nextSelectId++}`;
  protected readonly isOpen = signal(false);
  private readonly cvaDisabled = signal(false);
  /** Either source disabling it - the plain input or `setDisabledState()` - wins. */
  protected readonly isDisabled = computed(
    () => this.disabledInput() || this.cvaDisabled(),
  );
  private readonly value = signal<unknown>(undefined);
  private readonly activeOptionIdSignal = signal<string | null>(null);
  protected readonly activeOptionId = this.activeOptionIdSignal.asReadonly();

  protected readonly selectedLabel = signal<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (value: unknown) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected onTouched: () => void = () => {};

  private readonly keyManager: ActiveDescendantKeyManager<BrkOptionDirective>;
  private readonly keyManagerSubscription: Subscription;
  private readonly internalClose$ = new Subject<void>();
  private overlayRef?: OverlayRef;
  private closeSubscription?: Subscription;

  constructor() {
    this.keyManager = new ActiveDescendantKeyManager(
      this.options,
      this.injector,
    )
      .withWrap()
      .withTypeAhead();
    this.keyManagerSubscription = this.keyManager.change.subscribe(() => {
      this.activeOptionIdSignal.set(this.keyManager.activeItem?.id ?? null);
    });

    // Keeps every option's aria-selected, and this control's own displayed
    // label, in step with the value - whether that value arrived through
    // an option click or through writeValue() from outside.
    effect(() => {
      const current = this.value();
      const options = this.options();
      const match = options.find((option) => option.value() === current);
      for (const option of options) {
        option.selected.set(option === match);
      }
      this.selectedLabel.set(match?.getLabel() ?? null);
    });
  }

  writeValue(value: unknown): void {
    this.value.set(value);
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);
    if (isDisabled) {
      this.close();
    }
  }

  protected _onHostClick(): void {
    if (this.isDisabled()) {
      return;
    }
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  protected _onHostKeydown(event: KeyboardEvent): void {
    if (this.isDisabled()) {
      return;
    }

    if (!this.isOpen()) {
      if (
        event.key === 'ArrowDown' ||
        event.key === 'ArrowUp' ||
        event.key === 'Enter' ||
        event.key === ' '
      ) {
        event.preventDefault();
        this.open();
      }
      return;
    }

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        this.close();
        return;
      case 'Enter':
      case ' ':
        event.preventDefault();
        this._commitActiveOption();
        return;
      case 'Tab':
        // Combobox pattern: Tab commits/closes rather than leaving the
        // panel open while focus moves elsewhere on the page - focus never
        // moved into the panel to begin with, so there is nothing to
        // return it from.
        this.close();
        return;
      default:
        this.keyManager.onKeydown(event);
    }
  }

  protected _onPanelClick(event: Event): void {
    const el = (event.target as Element | null)?.closest?.('.brk-option');
    if (!el) {
      return;
    }
    const option = this.options().find(
      (o) => o.elementRef.nativeElement === el,
    );
    if (option && !option.disabled) {
      this._selectOption(option);
    }
  }

  private _commitActiveOption(): void {
    const active = this.keyManager.activeItem;
    if (active) {
      this._selectOption(active);
    } else {
      this.close();
    }
  }

  private _selectOption(option: BrkOptionDirective): void {
    const newValue = option.value();
    this.value.set(newValue);
    this.onChange(newValue);
    this.onTouched();
    this.close();
    this.elementRef.nativeElement.focus();
  }

  open(): void {
    if (this.isOpen() || this.isDisabled()) {
      return;
    }
    this.isOpen.set(true);

    const overlayRef = createConnectedOverlay(this.overlay, this.elementRef, {
      positions: [
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
          offsetY: 4,
        },
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom',
          offsetY: -4,
        },
      ],
      minWidth: this.elementRef.nativeElement.getBoundingClientRect().width,
    });
    this.overlayRef = overlayRef;
    overlayRef.attach(new DomPortal(this.panelRef()));

    this.closeSubscription = overlayCloseEvents(
      overlayRef,
      this.internalClose$,
    ).subscribe(() => this.close());

    // Highlights the current selection on open (or the first option if
    // nothing is selected yet), matching the ARIA APG select-only combobox
    // behavior - arrow keys then move relative to that, not from scratch.
    const current = this.options().find((o) => o.value() === this.value());
    if (current) {
      this.keyManager.setActiveItem(current);
    } else {
      this.keyManager.setFirstItemActive();
    }
  }

  close(): void {
    if (!this.isOpen()) {
      return;
    }
    this.isOpen.set(false);
    this.overlayRef?.detach();
    this.closeSubscription?.unsubscribe();
  }

  ngOnDestroy(): void {
    this.overlayRef?.dispose();
    this.closeSubscription?.unsubscribe();
    this.keyManagerSubscription.unsubscribe();
    this.keyManager.destroy();
  }
}
