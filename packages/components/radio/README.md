# @app-design-system/radio

Radio button styling applied directly to a native `input[type="radio"]`,
plus `<brk-radio-group>` for the fieldset/legend and shared `name`.

```sh
npm install @app-design-system/radio
```

## Usage

```html
<brk-radio-group label="Billing plan">
  <label><input type="radio" brkRadio value="free" [(ngModel)]="plan" /> Free</label>
  <label><input type="radio" brkRadio value="pro" [(ngModel)]="plan" /> Pro</label>
</brk-radio-group>
```

`brkRadio` selects the real `input[type="radio"]` (the same technique
`brkButton`/`brkCheckbox` use), so `[checked]`/`[disabled]` are plain
Angular property bindings, and `[(ngModel)]`/`formControlName` work through
Angular's own built-in `RadioControlValueAccessor` - unmodified. This
package has no `ControlValueAccessor` of its own. **Bind `[(ngModel)]` (or
`formControlName`) on every individual radio, all to the same model
property** - not on `<brk-radio-group>`, which has no value accessor at
all. Angular's accessor is what coordinates same-`name` radios into a
single selection; the group component only supplies that shared `name`.

`<brk-radio-group>` supplies every radio inside it with a shared, generated
`name` (override it with the `name` input if you need a stable one, e.g. to
match a reactive form's control name) and wraps them in a real
`<fieldset>`/`<legend>` for the group's accessible name - not
`aria-labelledby` pointing at a heading, which every assistive technology
already understands without any ARIA at all. **Don't set `name` on the
individual radios yourself when using the group - that fights it.**

Used outside a group, `brkRadio` works exactly like a bare native radio:
set `name` yourself.

Only input either component adds beyond native behavior is `size`
(`sm | md | lg`, default `md`) on `brkRadio`, and `label`/`name` on
`brk-radio-group`.

## How the dot is drawn

`appearance: none` plus a `radial-gradient` `background-image` (not
`::before`/`::after`, unreliable on replaced elements like `<input>` across
browsers) - the same reasoning `brk-checkbox`'s mark uses, a different
technique because a radio's dot is a flat theme color rather than a stroked
glyph.

## Testing

`BrkRadioHarness` and `BrkRadioGroupHarness` (Angular CDK
`ComponentHarness`) read real DOM state, not directive inputs - both
components deliberately have very few of those.
