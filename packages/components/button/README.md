# @app-design-system/button

Applies design-system styling and behavior to a native `<button>` or `<a>`
element - selecting the native element (the same technique Angular
Material's own `button[mat-button]` components use) instead of wrapping it
in a custom element, so native semantics, keyboard behavior, and any ARIA
attribute a consumer sets keep working for free.

## Usage

```html
<button adsButton variant="filled" size="md">Save</button>
<button adsButton variant="outlined" size="lg" [disabled]="saving">Cancel</button>
<a adsButton variant="text" href="/help">Learn more</a>
```

- `variant`: `'filled' | 'outlined' | 'text'` (default `'filled'`)
- `size`: `'sm' | 'md' | 'lg'` (default `'md'`)

Colors and spacing come from `@app-design-system/theme-angular-material`'s
`--mat-sys-*` variables and `@app-design-system/tokens`' `--space-*`/
`--radius-*`/etc., so the button re-themes with `setTheme()` like everything
else in the system. Includes `MatRipple` for interaction feedback and a
visible focus ring for keyboard users.

## Testing

`AdsButtonHarness` (Angular CDK `ComponentHarness`) is exported for
consumers to test against instead of querying host DOM directly - use it in
a real browser (Karma) or Playwright component tests. This repo's own
Vitest+Analog unit tests exercise interactions via native DOM (`.click()`,
`classList`) instead, since CDK's harness dispatch relies on `PointerEvent`,
which this jsdom-based runner doesn't implement.

Run `nx test button` to execute the unit tests.
