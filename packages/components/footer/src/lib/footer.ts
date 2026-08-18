import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The application-shell footer: brand, link columns, and a legal/copyright
 * row - the same three-region content-projection shape `brk-header` uses,
 * stacked vertically instead of laid out in one row since a footer's link
 * area is typically several columns, not a single flex row of nav items.
 *
 * ```html
 * <brk-footer>
 *   <div brkFooterBrand>
 *     <img src="logo.svg" alt="" width="24" height="24" />
 *     <span>Acme</span>
 *   </div>
 *   <div brkFooterLinks>
 *     <div>
 *       <h3>Product</h3>
 *       <a routerLink="/pricing">Pricing</a>
 *       <a routerLink="/changelog">Changelog</a>
 *     </div>
 *     <div>
 *       <h3>Company</h3>
 *       <a routerLink="/about">About</a>
 *       <a routerLink="/careers">Careers</a>
 *     </div>
 *   </div>
 *   <div brkFooterLegal>
 *     &copy; 2026 Acme, Inc.
 *   </div>
 * </brk-footer>
 * ```
 */
@Component({
  selector: 'brk-footer',
  template: `
    <div class="brk-footer__top">
      <div class="brk-footer__brand">
        <ng-content select="[brkFooterBrand]" />
      </div>
      <div class="brk-footer__links">
        <ng-content select="[brkFooterLinks]" />
      </div>
    </div>
    <div class="brk-footer__legal">
      <ng-content select="[brkFooterLegal]" />
    </div>
  `,
  styleUrl: './footer.css',
  host: {
    class: 'brk-footer',
    // A page's footer is a `contentinfo` landmark. Without it, screen-reader
    // users get no landmark to jump to, and `brk-footer` is a custom element
    // with no implicit role of its own - the same gap `brk-header` fills
    // with `role="banner"`.
    role: 'contentinfo',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrkFooterComponent {}
