# @app-design-system/button

Applies design-system styling and behavior to a native `<button>` or `<a>`
element - selecting the native element (the same technique Angular
Material's own `button[mat-button]` components use) instead of wrapping it
in a custom element, so native semantics, keyboard behavior, and any ARIA
attribute a consumer sets keep working for free.

## Usage

```html
<button brkButton variant="filled" size="md">Save</button>
<button brkButton variant="tonal" size="md">Preview</button>
<button brkButton variant="outlined" size="lg" [disabled]="saving">Cancel</button>
<a brkButton variant="text" href="/help">Learn more</a>
<button brkButton variant="danger" size="md">Delete report</button>
```

- `variant`: `'filled' | 'tonal' | 'outlined' | 'text' | 'danger'` (default `'filled'`)
  - `filled`: the one dominant action on a screen.
  - `tonal`: a lower-emphasis filled action next to a `filled` primary.
  - `outlined` / `text`: lowest emphasis, for secondary or dismissive actions.
  - `danger`: same visual weight as `filled`, in the error role, for destructive actions.
- `size`: `'sm' | 'md' | 'lg'` (default `'md'`)

Colors and spacing come from `@app-design-system/theme-angular-material`'s
`--mat-sys-*` variables and `@app-design-system/tokens`' `--space-*`/
`--radius-*`/etc., so the button re-themes with `setTheme()` like everything
else in the system. Includes `MatRipple` for interaction feedback and a
visible focus ring for keyboard users.

## Testing

`BrkButtonHarness` (Angular CDK `ComponentHarness`) is exported for
consumers to test against instead of querying host DOM directly - use it in
a real browser (Karma) or Playwright component tests. This repo's own
Vitest+Analog unit tests exercise interactions via native DOM (`.click()`,
`classList`) instead, since CDK's harness dispatch relies on `PointerEvent`,
which this jsdom-based runner doesn't implement.

Run `nx test button` to execute the unit tests.
