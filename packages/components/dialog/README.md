# @app-design-system/dialog

A modal dialog: `BrkDialogService` wraps `@angular/cdk/dialog`'s `Dialog`
directly (focus trap, initial focus, restore-focus-on-close all come from
CDK, not hand-rolled), and `BrkDialogComponent` is a token-styled container
with title/content/actions slots.

```sh
npm install @app-design-system/dialog
```

## Usage

Write the dialog's content as its own component, styled with `<brk-dialog>`
and its three slot directives:

```ts
@Component({
  imports: [BrkDialogComponent, BrkDialogTitleDirective, BrkDialogContentDirective, BrkDialogActionsDirective],
  template: `
    <brk-dialog>
      <h2 brkDialogTitle>Delete project?</h2>
      <p brkDialogContent>This can't be undone.</p>
      <div brkDialogActions>
        <button type="button" (click)="dialogRef.close(false)">Cancel</button>
        <button type="button" (click)="dialogRef.close(true)">Delete</button>
      </div>
    </brk-dialog>
  `,
})
class ConfirmDeleteDialog {
  readonly dialogRef = inject(DialogRef<boolean>);
}
```

Open it from anywhere with `BrkDialogService`:

```ts
const dialogService = inject(BrkDialogService);
const dialogRef = dialogService.open<boolean>(ConfirmDeleteDialog);
dialogRef.closed.subscribe((confirmed) => { ... });
```

| Piece                       | What it's for                                                        |
| --------------------------- | -------------------------------------------------------------------- |
| `BrkDialogService.open()`   | Opens the given component in a modal `Dialog` overlay.               |
| `BrkDialogComponent`        | The visual container - elevation, radius, max-width, a close button. |
| `BrkDialogTitleDirective`   | Marks the dialog's accessible name (required - see below).           |
| `BrkDialogContentDirective` | Marks the scrollable body.                                           |
| `BrkDialogActionsDirective` | Marks the button row, gets a top divider for free.                   |

`BrkDialogComponent` also renders its own close ("X") button, wired to
`DialogRef.close()` - not an input to opt out of, since a modal without a
visible way to dismiss it besides Escape/backdrop-click is a usability
gap, not a style choice.

## `brkDialogTitle` is required in practice

A `role="dialog"` element needs an accessible name (WCAG 2.4.6, 4.1.2).
`BrkDialogTitleDirective` registers its host as that name automatically -
there's nothing to wire by hand - but a dialog authored without one has no
accessible name at all, the same gap `brk-select` has without `ariaLabel`.

## Modal only, this pass

`BrkDialogService.open()` forces `ariaModal: true` (CDK's `Dialog` defaults
it to `false`). A non-modal drawer/side-panel is a different component,
not a config flag here, and isn't shipped yet.

## Testing

`BrkDialogHarness` (Angular CDK `ComponentHarness`) locates an open dialog
by its `.brk-dialog` class. Because `Dialog` portals the dialog to
`document.body`, outside the opener's own subtree, look it up with
`TestbedHarnessEnvironment.documentRootLoader(fixture)` rather than the
usual fixture-scoped loader - see `dialog.spec.ts` for the full pattern,
including asserting on focus movement and `aria-labelledby`.

Run `nx test dialog` to execute the unit tests.
