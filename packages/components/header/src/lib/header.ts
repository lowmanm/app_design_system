import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * The application-shell header: a fixed-height bar with three regions -
 * brand, nav, and actions. A flat 1px bottom border is used instead of a
 * shadow, since a header sits at the very top of the visual stack already;
 * a shadow underneath a top-of-page element reads as floating.
 *
 * Mark the current route's nav link with `aria-current="page"` (or a plain
 * `is-active` class, e.g. from `routerLinkActive`) to get the active-item
 * underline for free.
 *
 * ```html
 * <brk-header>
 *   <div brkHeaderBrand>
 *     <img src="logo.svg" alt="" width="28" height="28" />
 *     <span>Acme</span>
 *   </div>
 *   <a routerLink="/product" routerLinkActive="is-active">Product</a>
 *   <a routerLink="/docs" routerLinkActive="is-active">Docs</a>
 *   <div brkHeaderActions>
 *     <button brkButton variant="text" size="sm">Sign in</button>
 *     <button brkButton variant="filled" size="sm">Get started</button>
 *   </div>
 * </brk-header>
 * ```
 *
 * Nav links are placed directly as `brk-header`'s children (no wrapping
 * element) rather than under a third named slot - a wrapper wouldn't be
 * the only thing that could be projected there and it would become the
 * nav's *only* flex child, silently defeating the nav's own layout.
 * `brkHeaderBrand`/`brkHeaderActions` claim their own content first;
 * whatever's left over (the links) lands in the nav region.
 */
@Component({
  selector: 'brk-header',
  template: `
    <div class="brk-header__brand">
      <ng-content select="[brkHeaderBrand]" />
    </div>
    <nav class="brk-header__nav" [attr.aria-label]="navLabel()">
      <ng-content />
    </nav>
    <div class="brk-header__actions">
      <ng-content select="[brkHeaderActions]" />
    </div>
  `,
  styleUrl: './header.css',
  host: {
    class: 'brk-header',
    // A page's masthead is a `banner` landmark. Without it, screen-reader
    // users get no landmark to jump to, and `brk-header` is a custom element
    // with no implicit role of its own.
    role: 'banner',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrkHeaderComponent {
  /**
   * Accessible name for the nav region. Only worth changing when a page has
   * more than one navigation landmark, in which case they must be
   * distinguishable (WCAG 1.3.1, ARIA landmark practice).
   */
  readonly navLabel = input('Primary');
}
