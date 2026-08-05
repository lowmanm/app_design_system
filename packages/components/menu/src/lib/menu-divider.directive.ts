import { Directive } from '@angular/core';

/** A visual divider between groups of `brkMenuItem`s. Purely presentational - not focusable. */
@Directive({
  selector: '[brkMenuDivider]',
  standalone: true,
  host: {
    class: 'brk-menu-divider',
    role: 'separator',
  },
})
export class BrkMenuDividerDirective {}
