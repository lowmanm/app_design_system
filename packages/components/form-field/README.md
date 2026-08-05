# @app-design-system/form-field

Wires a label, hint text, and error message to a projected native form
control - `<label for>` / `aria-describedby` / `aria-invalid` - so
consumers get these associations correct by construction (WCAG 1.3.1 Info
and Relationships, 3.3.1 Error Identification, 4.1.2 Name Role Value)
instead of wiring ids by hand.

## Usage

```html
<brk-form-field label="Email" hint="We'll never share it" [errorMessage]="emailError">
  <input brkFormFieldControl type="email" [(ngModel)]="email" />
</brk-form-field>
```

- The control (`<input>`/`<select>`/`<textarea>`) must have
  `brkFormFieldControl` applied.
- While `errorMessage` is empty, the hint (if any) is shown and referenced
  via `aria-describedby`.
- Once `errorMessage` is set, the hint is replaced by the error message
  (rendered with `role="alert"` so assistive tech announces it), and the
  control gets `aria-invalid="true"` plus `aria-describedby` pointing at the
  error text instead of the hint - never both, to avoid a stale
  `aria-describedby` reference to a hint element that's no longer rendered.

## Testing

`BrkFormFieldHarness` (Angular CDK `ComponentHarness`) exposes
`getLabelText()`/`getErrorText()` for consumers. This repo's own tests
assert directly against the rendered DOM (label `for`/input `id`,
`aria-describedby`, `aria-invalid`) since that's what actually matters for
accessibility correctness.

Run `nx test form-field` to execute the unit tests.
