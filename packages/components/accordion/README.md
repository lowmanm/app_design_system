# @app-design-system/accordion

A vertically stacked set of expand/collapse panels - the ARIA disclosure
pattern, one header button per panel.

```sh
npm install @app-design-system/accordion
```

## Usage

```html
<brk-accordion>
  <brk-accordion-item header="What's included?">
    Everything in the Pro plan, plus priority support.
  </brk-accordion-item>
  <brk-accordion-item header="Can I cancel anytime?">
    Yes, from your billing settings.
  </brk-accordion-item>
</brk-accordion>
```

Single-open (exclusive) by default - opening one item closes whichever was
open, matching the common "FAQ list" expectation. Pass `multi` on
`brk-accordion` to allow several items open at once.

| Component            | Input    | Type      | Notes                             |
| --------------------- | -------- | --------- | ---------------------------------- |
| `brk-accordion`       | `multi`  | `boolean` | Allow more than one item expanded. |
| `brk-accordion-item`  | `header` | `string`  | Required. The trigger's text.      |

## Why the container/item relationship is two-way, unlike `brk-tabs`

`brk-tabs` renders every tab button itself, from one loop, so it owns
every click directly. Here each `brk-accordion-item` renders its **own**
header button in its own template - accordion headers are full-width
stacked blocks, not a side-by-side row a parent can reasonably render as
a set. So an item calls back into the accordion's `toggle()` on click,
and the accordion pushes the resulting expanded/collapsed state back down
into each item - genuinely bidirectional, where tabs' relationship is
one-way (parent owns everything).

## The collapse animation

The panel animates with `grid-template-rows: 0fr` -> `1fr`, not `height`:
`height: auto` isn't animatable, and a fixed pixel height would need a JS
measurement of content that can change (e.g. from a browser font-size
setting). A single-track CSS grid with `overflow: hidden` collapses to
zero height exactly like `height: 0` would, while still transitioning
smoothly.

The panel uses `inert` while collapsed, not `hidden`: `hidden` forces
`display: none`, which can't be animated, and the collapse relies on the
panel staying laid out (if zero-height) throughout. `inert` removes the
collapsed content from keyboard/AT reach without touching `display` -
without it, a keyboard user could Tab into content that's invisible.

## Testing

`BrkAccordionHarness` and `BrkAccordionItemHarness` (Angular CDK
`ComponentHarness`) read header text, expanded state, and panel content,
and can toggle an item.
