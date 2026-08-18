---
'@app-design-system/core': minor
'@app-design-system/menu': patch
'@app-design-system/checkbox': minor
'@app-design-system/radio': minor
'@app-design-system/switch': minor
'@app-design-system/select': minor
'@app-design-system/tabs': minor
'@app-design-system/accordion': minor
'@app-design-system/tooltip': minor
'@app-design-system/dialog': minor
'@app-design-system/table': minor
'@app-design-system/footer': minor
---

Component build-out: form controls, structural components, a full-featured
table, and a footer, scaffolded against the current placeholder brand
tokens per the agreed sequencing (visual/brand retuning is a separate,
later phase once real org brand values land).

`@app-design-system/core` gains `createConnectedOverlay`/
`overlayCloseEvents`, the shared CDK-overlay-positioning utility extracted
from `menu` (which now consumes it - a pure refactor, no behavior change)
and reused by `select` and `tooltip`.

**Form controls**: `checkbox`, `radio`, `switch` style a real native
`<input type="checkbox">`/`<input type="radio">` directly - no wrapper
element, so native form participation, keyboard behavior, and (for radio)
same-`name` grouping come for free. `select` is the one genuinely new
pattern: a custom ARIA combobox+listbox built the way `menu` was, with a
hand-written `ControlValueAccessor` since it isn't a native form element.

**Structural**: `tabs` (ARIA tabs pattern, automatic activation),
`accordion` (ARIA disclosure pattern, single- or multi-open, a
`grid-template-rows` collapse animation), `tooltip` (an attribute
directive, not a component - text-only by contract, shows on hover and
focus alike), and `dialog` (`BrkDialogService` wraps `@angular/cdk/dialog`'s
`Dialog` directly rather than hand-rolling focus-trap/overlay logic, modal
only this pass).

**Table**: `BrkTableComponent` extends `@angular/cdk/table`'s `CdkTable`
directly, the same pattern Angular Material's `mat-table` uses. Columns
are declared with CDK's own directives, not a re-wrapped API.
`BrkSortDirective`/`BrkSortHeaderDirective` are hand-built (state only, no
mat-sort dependency); row selection is a documented `SelectionModel` +
`<brk-checkbox>` recipe, not a bespoke directive; `BrkPaginatorComponent`
is bundled in the same package.

**Footer**: `BrkFooterComponent` mirrors `header`'s brand/links/legal
content-projection shape, with an explicit `role="contentinfo"` landmark.

Every component ships with a CDK `ComponentHarness`, an axe accessibility
assertion, and a Storybook story - see each package's README for usage,
accessibility notes, and testing guidance.
