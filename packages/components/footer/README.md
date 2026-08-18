# @app-design-system/footer

The application-shell footer (`brk-footer`): brand, link columns, and a
legal/copyright row - the same three-region content-projection shape
`brk-header` uses, stacked vertically instead of laid out in one row.

```sh
npm install @app-design-system/footer
```

## Usage

```html
<brk-footer>
  <div brkFooterBrand>
    <img src="logo.svg" alt="" width="24" height="24" />
    <span>Acme</span>
  </div>
  <div brkFooterLinks>
    <div>
      <h3>Product</h3>
      <a routerLink="/pricing">Pricing</a>
      <a routerLink="/changelog">Changelog</a>
    </div>
    <div>
      <h3>Company</h3>
      <a routerLink="/about">About</a>
      <a routerLink="/careers">Careers</a>
    </div>
  </div>
  <div brkFooterLegal>&copy; 2026 Acme, Inc.</div>
</brk-footer>
```

`brkFooterLinks` is deliberately a single slot holding as many link-column
`<div>`s as needed, not a fixed number of named column slots - a footer's
number of link columns varies per app in a way `brk-header`'s single row of
actions doesn't.

`role="contentinfo"` is set explicitly: `<brk-footer>` is a custom element
with no implicit landmark role of its own, the same gap `brk-header` fills
with `role="banner"`. Without it, screen-reader users have no landmark to
jump to.

## Testing

`BrkFooterHarness` (Angular CDK `ComponentHarness`) is exported for
consumers to test against instead of querying host DOM directly.

Run `nx test footer` to execute the unit tests.
