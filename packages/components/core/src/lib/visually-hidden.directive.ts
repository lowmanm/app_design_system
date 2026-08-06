import { Directive } from '@angular/core';

/**
 * Visually hides an element while keeping it in the accessibility tree, so
 * assistive technology still announces it (e.g. a `<label>` that a design
 * only wants icon-visible). Prefer this over `display: none`/`visibility:
 * hidden`, which remove the content from screen readers too.
 *
 * Usage: `<span brkVisuallyHidden>Loading</span>`
 *
 * The clipping rules are applied as host style bindings rather than shipped
 * in a stylesheet, because a directive cannot carry styles - the previous
 * sibling .css file was never referenced by anything, so the class name was
 * applied but the element stayed fully visible. Inlining them means the
 * directive works on import, with no stylesheet for a consumer to forget.
 */
@Directive({
  selector: '[brkVisuallyHidden]',
  host: {
    class: 'brk-visually-hidden',
    '[style.position]': '"absolute"',
    '[style.width.px]': '1',
    '[style.height.px]': '1',
    '[style.padding.px]': '0',
    '[style.margin.px]': '-1',
    '[style.overflow]': '"hidden"',
    '[style.clip-path]': '"inset(50%)"',
    '[style.white-space]': '"nowrap"',
    '[style.border-width.px]': '0',
  },
})
export class BrkVisuallyHiddenDirective {}
