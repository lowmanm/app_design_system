# @app-design-system/icon

The design system's icon set: Material Symbols Outlined, wrapped in a
`brk-icon` component and a `.brk-icon` class.

```sh
npm install @app-design-system/icon
```

## Usage

Load the stylesheet once, at app level. It carries both the `@font-face`
and every rule the icons need - the component deliberately has no styles of
its own, so that Angular and non-Angular consumers render from one
definition rather than two that can drift:

```ts
// angular.json / project.json "styles", or a global stylesheet
'node_modules/@app-design-system/icon/css/icons.css';
```

```html
<brk-icon name="settings" />
<brk-icon name="check_circle" size="lg" filled />
<brk-icon name="delete" label="Delete this row" />
```

Outside Angular, the same markup as a span:

```html
<span class="brk-icon brk-icon--lg">settings</span>
```

`name` is the Material Symbols glyph name - browse them at
[fonts.google.com/icons](https://fonts.google.com/icons). Any of the ~3,400
names works; `src/icon-manifest.json` is a curated shortlist, grouped by
job, so that three screens don't end up with three different "delete"
icons. The Iconography guide in Storybook renders it as a catalogue.

| Input    | Type                   | Default | Notes                                                     |
| -------- | ---------------------- | ------- | --------------------------------------------------------- |
| `name`   | `string`               | —       | Required. The glyph name, e.g. `chevron_right`.           |
| `size`   | `sm \| md \| lg \| xl` | `md`    | `--icon-size-*` tokens (20/24/32/40px).                   |
| `label`  | `string`               | —       | Accessible name. See below.                               |
| `filled` | `boolean`              | `false` | Solid rather than outlined - the "selected"/active state. |
| `weight` | `number` (100–700)     | `400`   | Stroke weight, for matching heavier or lighter text.      |
| `grade`  | `number` (-25–200)     | `0`     | Emphasis without changing footprint.                      |

## Accessibility

**Icons are decorative by default** - `aria-hidden="true"`, invisible to a
screen reader. That is the right default because most icons sit next to
their own text label, and announcing them repeats it ("delete delete").

Pass `label` only when the icon carries meaning nothing else conveys -
typically an icon-only button. Doing so makes it `role="img"` with that
accessible name:

```html
<!-- decorative: the button already says "Delete" -->
<button brkButton><brk-icon name="delete" /> Delete</button>

<!-- meaningful: nothing else names this control -->
<button brkButton><brk-icon name="delete" label="Delete row" /></button>
```

Colour is inherited, not set, so an icon inside a danger menu item goes red
with the item without being told to.

## How it renders

Material Symbols is a **ligature** font: `name="settings"` puts the literal
text `settings` in the element, and the font substitutes the icon glyph for
it. That is why the same markup works everywhere without a per-framework
sprite loader, and it is also why `translate="no"` is set on the host - a
page translator that rewrites the text renders tofu instead of an icon.

The four variable axes (`FILL`, `wght`, `GRAD`, `opsz`) render through a
single `font-variation-settings` binding rather than through classes.
`opsz` is driven from `size` rather than exposed on its own: it exists so
strokes stay optically correct as an icon scales, which is not a decision a
caller should have to make separately from picking a size.

## Size

**The font is ~3.8 MB.** It carries all ~3,400 glyphs across all four
variable axes, and that is a deliberate trade-off worth understanding:

- `font-display: block` means a brief blank rather than a flash of the
  literal word "settings" while it loads, and the file is immutable, so
  it's a once-per-user cost that caches indefinitely.
- The narrower cuts fontsource publishes (`wght` alone at ~0.75 MB, `fill`
  alone at ~1.1 MB) were rejected: they'd leave documented inputs silently
  doing nothing, and a third of 3.8 MB is still not small enough to change
  anyone's deployment decision.

**Per-app subsetting does not work here**, and it's worth stating why so
nobody spends a day rediscovering it. Subsetters cut a font down by taking
the closure of the glyphs reachable from the text you supply. Every icon
name is made of ordinary letters, so the closure over `a`–`z` reaches every
ligature in the font and retains everything - measured with `hb-subset` on
a 94-icon list, the "subset" came out 8% smaller. Turning layout closure
off drops the icon glyphs entirely and yields a 1.9 KB font of nothing.

Cutting it genuinely requires subsetting by the glyphs' private-use
codepoints, which means giving up the ligature API and writing
`&#xe8b8;` instead of `name="settings"`. If an app's budget makes that
trade worth it, Google's Material Symbols API accepts an `icon_names`
parameter and does that server-side - at the cost of a third-party runtime
request, which is exactly what self-hosting here avoids.

## Testing

`BrkIconHarness` (Angular CDK `ComponentHarness`) is exported for consumer
tests. It normalises `font-variation-settings` quoting, which a real
browser and jsdom serialise differently.
