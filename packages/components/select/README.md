# @app-design-system/select

A single-select dropdown - the WAI-ARIA "select-only combobox" pattern
(`role="combobox"` over a `listbox` popup), built the way `brk-menu` was:
CDK overlay positioning and a key manager, not a hidden native `<select>`.

```sh
npm install @app-design-system/select
```

## Usage

```html
<brk-select placeholder="Choose a country" ariaLabel="Country" [(ngModel)]="country">
  <div brkOption value="us">United States</div>
  <div brkOption value="ca">Canada</div>
</brk-select>
```

**`ariaLabel` is required in practice.** A `role="combobox"` element needs
an accessible name (WCAG 4.1.2) - the same requirement `brk-checkbox` has
for a `<label>`, just met a different way here since there's no native
element to wrap for a free association.

| Input         | Type      | Default     | Notes                                                   |
| ------------- | --------- | ----------- | ------------------------------------------------------- |
| `placeholder` | `string`  | `'Select…'` | Shown when nothing is selected.                         |
| `ariaLabel`   | `string`  | —           | Accessible name, when the visible text isn't enough.    |
| `disabled`    | `boolean` | `false`     | Plain binding, independent of reactive-forms disabling. |

`brkOption`'s only inputs are `value` (required, compared with `===`) and
`disabled`.

**Unlike `brk-checkbox`/`brk-radio`/`brk-switch`, this package does
implement its own `ControlValueAccessor`.** Select is not a native form
element the way those are, so there is no built-in Angular accessor to
lean on - `[(ngModel)]` and `formControlName` work because this component
provides one itself.

## Single-select only

There is no multi-select and no `compareWith` (object-identity comparison
for non-primitive values) in this version - values compare with `===`,
which is exactly right for strings/numbers/enums and wrong for comparing
two different object instances that represent "the same" selection. Both
are real, deliberately deferred gaps, not oversights - see the Table
component if you need multi-selection today (its `SelectionModel`-based
row selection is the multi-select building block this package doesn't
yet have).

## How it differs from `brk-menu`, and why

Both use CDK Overlay, but the keyboard/focus model is genuinely different,
matching each one's actual ARIA role:

- **Menu** (`role="menu"`) moves real DOM focus onto each item as arrow
  keys are pressed - `FocusKeyManager`, roving tabindex. That's the correct
  ARIA menu pattern.
- **Select** (`role="combobox"`) keeps focus on the combobox itself the
  entire time, and points `aria-activedescendant` at the highlighted
  option instead - `ActiveDescendantKeyManager`. That's the WAI-ARIA APG's
  actual select-only combobox pattern; moving real focus into the options
  here would be a deviation from it, not an equally-valid alternative.

The other structural difference: menu's panel content is deferred into an
unattached `<ng-template>` until a trigger portals it, so menu items don't
exist as directive instances while the menu is closed - fine for a menu,
since nothing needs to read a closed menu's contents. A select does: the
closed control has to show the _selected option's label_. So `brk-select`
renders its options normally, as real always-instantiated content, and
moves the already-rendered panel element into the CDK overlay with a
`DomPortal` when opening (and back out when closing) rather than portaling
a template. The options are the same DOM nodes throughout; they're
relocated, not re-created.

## Testing

`BrkSelectHarness` and `BrkOptionHarness` (Angular CDK `ComponentHarness`)
cover opening, reading the displayed value, iterating and selecting options
by text, and reading selected/disabled state.
