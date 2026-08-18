# @app-design-system/tabs

Tabbed navigation for switching between sibling views. ARIA tabs pattern
(`role="tablist"`/`"tab"`/`"tabpanel"`, roving tabindex).

```sh
npm install @app-design-system/tabs
```

## Usage

```html
<brk-tabs ariaLabel="Account settings">
  <brk-tab label="Profile">Profile form goes here.</brk-tab>
  <brk-tab label="Billing">Billing form goes here.</brk-tab>
</brk-tabs>
```

Each `brk-tab` pairs its own label **and** its own panel content in one
element - not two parallel lists (a tablist of buttons, a separate list of
panels) you have to keep in sync by index. `brk-tabs` reads `label()` off
each and renders the tab buttons itself; a `brk-tab`'s own template holds
only the panel, shown when it's the selected one.

| Component  | Input           | Type      | Notes                                              |
| ---------- | --------------- | --------- | -------------------------------------------------- |
| `brk-tabs` | `ariaLabel`     | `string`  | Names the tablist, when nothing else already does. |
| `brk-tabs` | `selectedIndex` | `number`  | Two-way bindable: `[(selectedIndex)]="active"`.    |
| `brk-tab`  | `label`         | `string`  | Required. The tab button's text.                   |
| `brk-tab`  | `disabled`      | `boolean` | Skipped by click and by arrow-key navigation.      |

## Keyboard model

Automatic activation, per the WAI-ARIA APG's default recommendation: arrow
keys move the selection **and** switch the panel immediately, rather than
just moving a pending highlight that needs a separate Enter/Space to
commit. That two-step "manual activation" pattern exists for cases where
loading a panel is expensive (e.g. it triggers a network request) - not
the case for ordinary local content, so this always uses the simpler
automatic model. Left/Right move and wrap, skipping any disabled tab;
Home/End jump to the first/last enabled tab.

## Why this doesn't use `FocusKeyManager`, unlike `brk-menu`/`brk-select`

Menu and select coordinate roving focus across elements a _consumer_
authors and controls individually - CDK's key manager is the right tool
for that. Here, `brk-tabs` renders every tab button itself from a single
`@for` loop, so it already has direct control over focus and `tabindex`;
plain index arithmetic against the tab list is simpler and no less
correct. This is a deliberate difference in approach per component, not an
inconsistency - use whichever fits who actually owns the DOM.

## Testing

`BrkTabsHarness` (Angular CDK `ComponentHarness`) reads tab labels,
selected state, and the visible panel's text, and can select a tab by
label.
