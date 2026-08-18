# @app-design-system/switch

Toggle-switch styling applied directly to a native
`input[type="checkbox"]` - no wrapper element.

```sh
npm install @app-design-system/switch
```

## Usage

```html
<label>
  <input type="checkbox" brkSwitch [(ngModel)]="notificationsEnabled" />
  Email notifications
</label>
```

`brkSwitch` selects the real `input[type="checkbox"]` (the same technique
`brkCheckbox` uses) - a switch is a checkbox with a different visual and a
different announced role, not a different form control. So exactly as with
`brkCheckbox`: `[checked]`/`[disabled]` are plain Angular property
bindings, `[(ngModel)]`/`formControlName` work through Angular's own
built-in `CheckboxControlValueAccessor` unmodified, and there is no
`ControlValueAccessor` of this package's own.

`role="switch"` is set by this directive, not left for you to remember -
without it, a screen reader announces "checkbox" for something that reads
as on/off both visually and behaviorally.

Always pair it with a `<label>`, for the same reasons as `brkCheckbox`: an
unlabeled control has no accessible name (WCAG 1.3.1, 4.1.2), and the label
enlarges the click/tap target past this control's own small box
(WCAG 2.5.8).

The only input this directive adds is `size` (`sm | md | lg`, default `md`).

## How the thumb moves

`appearance: none` plus a `radial-gradient` `background-image` whose
`background-position` transitions between the two ends of the track - the
same non-pseudo-element technique `brk-radio`'s dot uses, animated. There
is no child `<span>` thumb element; this stays a single real `<input>`
with no child DOM at all.

## Testing

`BrkSwitchHarness` (Angular CDK `ComponentHarness`) reads real DOM state,
not a directive input, exactly like `BrkCheckboxHarness`.
