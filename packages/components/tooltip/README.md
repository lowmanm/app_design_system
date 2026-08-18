# @app-design-system/tooltip

A text-only popup describing an element on hover or focus - the WAI-ARIA
"tooltip" pattern (`role="tooltip"`, linked back via `aria-describedby`).

```sh
npm install @app-design-system/tooltip
```

## Usage

```html
<button brkButton iconOnly brkTooltip="Delete">
  <brk-icon name="delete" />
</button>
```

It's a directive, not a component - apply it to whatever it describes, most
often an icon-only button that has no visible label of its own. Shows on
hover **and** focus (never hover-only, so a keyboard user gets the same
information a mouse user does), after a short delay so it doesn't flash on
every incidental mouse pass-over. Escape dismisses it without moving focus.

| Input               | Type                                       | Default   |
| -------------------- | ------------------------------------------- | --------- |
| `brkTooltip`          | `string` (required) - the tooltip's text.   | -         |
| `brkTooltipPosition`  | `'above' \| 'below' \| 'before' \| 'after'` | `'above'` |

## Text only, by contract

The ARIA tooltip pattern forbids interactive content, and this directive has
no way to project markup into the popup at all - its content is a plain
`string`. A tooltip that needs a link or a button inside it is a popover,
not a tooltip: reach for `brk-menu` or a future popover component instead.

## Positioning

Built on the same shared CDK-overlay utility as `brk-menu` and `brk-select`
(`@app-design-system/core`'s `createConnectedOverlay`), with a fallback
position on the opposite side so it flips automatically if there isn't room.

## Testing

`BrkTooltipHarness` (Angular CDK `ComponentHarness`) locates the tooltip
*panel* by its `.brk-tooltip` class. Because the panel is portaled to
`document.body` and only exists in the DOM while visible, look it up with
`TestbedHarnessEnvironment.documentRootLoader(fixture)` after dispatching
the real event (`mouseenter`, `focus`) that shows it and waiting out the
show delay - see `tooltip.spec.ts` for the pattern.

Run `nx test tooltip` to execute the unit tests.
