# @app-design-system/card

A container surface (`brk-card`) for grouping related content, with two
elevation strategies rather than one global choice.

## Usage

```html
<brk-card variant="elevated">
  <h3>Getting started</h3>
  <p>Install the tokens package, pick a brand, wire the theme bridge.</p>
  <div brkCardFooter>
    <a brkButton variant="text" href="/guides/getting-started">Read the guide</a>
  </div>
</brk-card>
```

- `variant`: `'elevated' | 'outlined'` (default `'elevated'`)
  - `elevated`: soft shadow - reads well on content/marketing surfaces.
  - `outlined`: 1px border, no shadow - stays calm on dense dashboard grids
    where several cards' shadows stacked together get visually noisy fast.

Content is fully free-form (default slot) - `brk-card` only supplies the
container's padding, radius, and elevation. Put an actions row in the
optional `brkCardFooter` slot to get a top divider and consistent spacing
for free; the divider is omitted automatically when the slot is empty.

## Testing

`BrkCardHarness` (Angular CDK `ComponentHarness`) is exported for consumers
to test against instead of querying host DOM directly.

Run `nx test card` to execute the unit tests.
