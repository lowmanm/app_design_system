# @app-design-system/menu

A dropdown menu (`brk-menu`), positioned with CDK Overlay and connected to
its trigger with `[brkMenuTriggerFor]` - the same style options
[Angular Material's `mat-menu`](https://material.angular.dev/components/menu/overview)
documents, under the `brk` prefix.

## Basic usage

```html
<button brkButton variant="outlined" [brkMenuTriggerFor]="appMenu">Workspace</button>

<brk-menu #appMenu>
  <button brkMenuItem (activated)="openSettings()">Profile settings</button>
  <button brkMenuItem (activated)="openTeam()">Team members</button>
  <div brkMenuDivider></div>
  <button brkMenuItem danger (activated)="signOut()">Sign out</button>
</brk-menu>
```

- `brk-menu`: the panel. Its content is only rendered once opened (portaled
  into a CDK Overlay), positioned per the options below and flipped
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
  - Icons: put any content (e.g. an inline `<svg>`) before the label - see
    the "With icons" story.
- `brkMenuDivider`: a visual separator between groups of items.

## Positioning

`brk-menu` takes the same three position inputs as `mat-menu`:

```html
<brk-menu #appMenu xPosition="before" yPosition="above" [overlapTrigger]="true"></brk-menu>
```

- `xPosition`: `'after'` (default) opens toward the trigger's leading edge,
  `'before'` toward its trailing edge.
- `yPosition`: `'below'` (default) or `'above'`.
- `overlapTrigger`: `false` (default) opens beside the trigger; `true`
  opens flush over it.

Whatever the primary position is, it automatically flips to the opposite
side if there isn't room in the viewport - same as the default behavior.

## Nested (cascading) submenus

Put `[brkMenuTriggerFor]` on a `brkMenuItem` instead of a standalone
trigger to turn it into a submenu:

```html
<brk-menu #fileMenu>
  <button brkMenuItem [brkMenuTriggerFor]="shareMenu">Share</button>
</brk-menu>
<brk-menu #shareMenu>
  <button brkMenuItem (activated)="emailLink()">Email link</button>
</brk-menu>
```

The item gets a trailing chevron automatically. Clicking it opens the
submenu beside it (flipping to the other side if there isn't room) without
closing the parent; closing the parent (Escape, outside click, or another
item's own action) cascades to close any open submenu too. Submenus open
on click, not hover - there's no hover-intent delay logic yet.

## Context menus

Use `[brkContextMenuTriggerFor]` on any element to open a `brk-menu` at the
cursor on right-click, instead of below a clicked trigger:

```html
<div class="report-row" [brkContextMenuTriggerFor]="rowMenu">...</div>
<brk-menu #rowMenu>
  <button brkMenuItem (activated)="rename()">Rename</button>
  <button brkMenuItem danger (activated)="delete()">Delete</button>
</brk-menu>
```

## Lazy content

By default, a menu's content (its `brkMenuItem`s) is created as soon as the
menu is declared, same as any other Angular content projection. For a menu
whose content is large or comes from an async source, wrap it in
`<ng-template brkMenuContent>` instead so nothing inside is created until
the menu is actually opened for the first time:

```html
<brk-menu #projectsMenu>
  <ng-template brkMenuContent>
    @for (project of projects$ | async; track project.id) {
    <button brkMenuItem (activated)="open(project)">{{ project.name }}</button>
    }
  </ng-template>
</brk-menu>
```

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
