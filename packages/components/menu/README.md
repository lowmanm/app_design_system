# @app-design-system/menu

A dropdown menu (`brk-menu`), positioned with CDK Overlay and connected to
its trigger with `[brkMenuTriggerFor]` - similar shape to `mat-menu`, just
under the `brk` prefix and without submenus/typeahead-heavy extras.

## Usage

```html
<button brkButton variant="outlined" [brkMenuTriggerFor]="appMenu">
  Workspace
</button>

<brk-menu #appMenu>
  <button brkMenuItem (activated)="openSettings()">Profile settings</button>
  <button brkMenuItem (activated)="openTeam()">Team members</button>
  <div brkMenuDivider></div>
  <button brkMenuItem danger (activated)="signOut()">Sign out</button>
</brk-menu>
```

- `brk-menu`: the panel. Its content is only rendered once opened (portaled
  into a CDK Overlay), positioned below the trigger and flipped above it
  automatically if there isn't room.
- `[brkMenuTriggerFor]`: put on the trigger element (a `brkButton` or any
  element), pointing at the `brk-menu`'s template reference. Opens on click
  or ArrowDown.
- `brkMenuItem`: put on a native `<button>` inside the menu.
  - `danger`: styles it as a destructive action (its own color role, not
    just red text).
  - `disabled`: skips it in keyboard navigation and blocks activation.
  - `(activated)`: fires on click, Enter, or Space - the menu closes
    automatically right after.
- `brkMenuDivider`: a visual separator between groups of items.

## Keyboard behavior

Arrow Up/Down move focus between items (wrapping at the ends, real DOM
focus - a roving-tabindex pattern, not `aria-activedescendant`), typing a
letter jumps to the next item starting with it, Escape and outside clicks
close the menu and return focus to the trigger.

## Testing

`BrkMenuHarness` (Angular CDK `ComponentHarness`) is exported for consumers
to test against. Since the panel is portaled into the CDK overlay container
rather than staying inside the trigger's own DOM subtree, load it from the
document root rather than a loader scoped to your fixture, e.g.
`TestbedHarnessEnvironment.documentRootLoader(fixture).getHarness(BrkMenuHarness)`.

Run `nx test menu` to execute the unit tests.
