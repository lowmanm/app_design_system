# @app-design-system/header

The application-shell header (`brk-header`): a fixed-height bar with three
regions - brand, nav, and actions - laid out for you, so every app in the
org gets the same header structure instead of reinventing it per team.

## Usage

```html
<brk-header>
  <div brkHeaderBrand>
    <img src="logo.svg" alt="" width="28" height="28" />
    <span>Acme</span>
  </div>
  <a routerLink="/product" routerLinkActive="is-active">Product</a>
  <a routerLink="/docs" routerLinkActive="is-active">Docs</a>
  <div brkHeaderActions>
    <button brkButton variant="text" size="sm">Sign in</button>
    <button brkButton variant="filled" size="sm">Get started</button>
  </div>
</brk-header>
```

Nav links go directly as `brk-header`'s children, with no wrapping element -
`brkHeaderBrand`/`brkHeaderActions` claim their own content first, and
whatever's left lands in the nav region. (A wrapper around the links would
become the nav's only flex child and silently break its layout.)

Mark the current route's nav link with `aria-current="page"` or a plain
`is-active` class (e.g. from Angular Router's `routerLinkActive`) to get the
active-item underline for free - both are recognized.

The header uses a flat 1px bottom border rather than a shadow: it already
sits at the very top of the page's stacking order, so a shadow underneath it
would read as floating rather than grounded.

## Testing

`BrkHeaderHarness` (Angular CDK `ComponentHarness`) is exported for
consumers to test against instead of querying host DOM directly.

Run `nx test header` to execute the unit tests.
