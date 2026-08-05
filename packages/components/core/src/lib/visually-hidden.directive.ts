import { Directive } from '@angular/core';

/**
 * Visually hides an element while keeping it in the accessibility tree, so
 * assistive technology still announces it (e.g. a `<label>` that a design
 * only wants icon-visible). Prefer this over `display: none`/`visibility:
 * hidden`, which remove the content from screen readers too.
 *
 * Usage: `<span brkVisuallyHidden>Loading</span>`
 */
@Directive({
  selector: '[brkVisuallyHidden]',
  standalone: true,
  host: {
    class: 'brk-visually-hidden',
  },
})
export class VisuallyHiddenDirective {}
