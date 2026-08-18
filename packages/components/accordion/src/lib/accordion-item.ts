import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { BrkIconComponent } from '@app-design-system/icon';
import { BrkAccordionComponent } from './accordion';

let nextAccordionItemId = 0;

/**
 * One expand/collapse panel inside a `<brk-accordion>`. Renders its own
 * header button and panel region - see `BrkAccordionComponent`'s doc
 * comment for why that split differs from `brk-tabs`.
 */
@Component({
  selector: 'brk-accordion-item',
  imports: [BrkIconComponent],
  template: `
    <h3 class="brk-accordion-item__heading">
      <button
        type="button"
        class="brk-accordion-item__trigger"
        [id]="triggerId"
        [attr.aria-expanded]="expanded()"
        [attr.aria-controls]="panelId"
        (click)="_onToggle()"
      >
        <span class="brk-accordion-item__header-text">{{ header() }}</span>
        <brk-icon
          name="expand_more"
          size="sm"
          class="brk-accordion-item__chevron"
          [class.brk-accordion-item__chevron--open]="expanded()"
        />
      </button>
    </h3>
    <!--
      inert, not hidden: hidden forces display:none via the UA stylesheet,
      which can't be transitioned - the collapse animation in
      accordion-item.css relies on this staying a real, laid-out (if
      zero-height) box the whole time. inert instead removes the collapsed
      content from focus/AT reach without touching display, which is what
      a purely visual collapse still needs for a11y: without it, a
      keyboard user could Tab into content that's invisible.

      Bound via [attr.inert], not [inert]: the actual spec behavior is
      driven by the HTML attribute, and a property binding additionally
      requires the property to exist on the native node, which jsdom (this
      workspace's test DOM) doesn't implement - the attribute binding is
      both the fix and the more correct form.
    -->
    <div
      class="brk-accordion-item__panel"
      role="region"
      [id]="panelId"
      [attr.aria-labelledby]="triggerId"
      [class.brk-accordion-item__panel--open]="expanded()"
      [attr.inert]="expanded() ? null : ''"
    >
      <div class="brk-accordion-item__panel-inner">
        <ng-content />
      </div>
    </div>
  `,
  styleUrl: './accordion-item.css',
  host: { class: 'brk-accordion-item' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrkAccordionItemComponent {
  private readonly accordion = inject(BrkAccordionComponent);

  /** The header button's text. */
  readonly header = input.required<string>();

  /** Set by `BrkAccordionComponent`, which owns expand/collapse state. */
  readonly expanded = signal(false);

  protected readonly triggerId = `brk-accordion-trigger-${nextAccordionItemId}`;
  protected readonly panelId = `brk-accordion-panel-${nextAccordionItemId++}`;

  protected _onToggle(): void {
    this.accordion.toggle(this);
  }
}
