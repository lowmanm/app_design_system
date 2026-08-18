# @app-design-system/checkbox

Design-system checkbox styling applied directly to a native
`input[type="checkbox"]` - no wrapper element.

```sh
npm install @app-design-system/checkbox
```

## Usage

```html
<label>
  <input type="checkbox" brkCheckbox [(ngModel)]="agreed" />
  I agree to the terms
</label>
```

`brkCheckbox` selects the real `input[type="checkbox"]` (the same technique
`brkButton` uses for `<button>`/`<a>`), so:

- `[checked]`, `[indeterminate]`, `[disabled]` are plain Angular property
  bindings - there is no `checked`/`disabled`/`indeterminate` input on this
  directive to look up, because the native property already does the job.
- `[(ngModel)]` and `formControlName` work through Angular's own built-in
  `CheckboxControlValueAccessor`, unmodified - this package has no
  `ControlValueAccessor` of its own and doesn't need one.

The only input this directive adds is `size` (`sm | md | lg`, default `md`).

## Always pair it with a `<label>`

An unlabeled checkbox has no accessible name at all (WCAG 1.3.1, 4.1.2) -
wrap the input and its text in one `<label>` rather than using a separate
`for`/`id` pair. That wrapping also enlarges the effective click/tap target
well past this control's own small box (WCAG 2.5.8), which matters more
for a checkbox than almost any other control given how small its box is.

## How the mark is drawn

`appearance: none` plus CSS `background-image` (an embedded SVG data URI),
not the browser's unstylable native rendering and not `::before`/`::after` -
those pseudo-elements are not reliably rendered on replaced elements like
`<input>` across browsers. The SVG's `fill="currentColor"` resolves against
this element's own `color`, so the mark recolors with the theme (currently
`--mat-sys-on-primary`) without a second hand-maintained copy of the value.

## Testing

`BrkCheckboxHarness` (Angular CDK `ComponentHarness`) reads real DOM state
(`.checked`/`.indeterminate`/`.disabled`) rather than a directive input,
since this directive deliberately has none.
