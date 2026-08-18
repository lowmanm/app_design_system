import { Component, inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { DialogRef } from '@angular/cdk/dialog';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '@app-design-system/core/testing';
import { BrkDialogComponent } from './dialog';
import { BrkDialogService } from './dialog.service';
import { BrkDialogTitleDirective } from './dialog-title.directive';
import { BrkDialogContentDirective } from './dialog-content.directive';
import { BrkDialogActionsDirective } from './dialog-actions.directive';
import { BrkDialogHarness } from './dialog.harness';

@Component({
  imports: [
    BrkDialogComponent,
    BrkDialogTitleDirective,
    BrkDialogContentDirective,
    BrkDialogActionsDirective,
  ],
  template: `
    <brk-dialog>
      <h2 brkDialogTitle>Delete project?</h2>
      <p brkDialogContent>This can't be undone.</p>
      <div brkDialogActions>
        <button type="button" (click)="dialogRef.close(false)">
          Cancel
        </button>
        <button type="button" (click)="dialogRef.close(true)">Delete</button>
      </div>
    </brk-dialog>
  `,
})
class TestConfirmDialogComponent {
  readonly dialogRef = inject(DialogRef<boolean>);
}

@Component({
  template: `<button type="button" (click)="open()">Open</button>`,
})
class HostComponent {
  private readonly dialogService = inject(BrkDialogService);
  ref?: DialogRef<boolean, TestConfirmDialogComponent>;

  open(): void {
    this.ref = this.dialogService.open(TestConfirmDialogComponent);
  }
}

async function setup() {
  const fixture = TestBed.createComponent(HostComponent);
  fixture.detectChanges();
  const trigger: HTMLButtonElement =
    fixture.nativeElement.querySelector('button');
  return { fixture, trigger, host: fixture.componentInstance };
}

async function getDialog(
  fixture: ReturnType<typeof TestBed.createComponent>,
): Promise<BrkDialogHarness | null> {
  return TestbedHarnessEnvironment.documentRootLoader(
    fixture,
  ).getHarnessOrNull(BrkDialogHarness);
}

describe('BrkDialogComponent + BrkDialogService', () => {
  it('opens with its projected title and content, labelled by the title', async () => {
    const { fixture, host } = await setup();
    host.open();
    fixture.detectChanges();

    const dialog = await getDialog(fixture);
    expect(dialog).not.toBeNull();
    expect(await dialog!.getTitleText()).toBe('Delete project?');
    expect(await dialog!.getContentText()).toContain("can't be undone");

    const container = document.querySelector('[role="dialog"]');
    expect(container?.getAttribute('aria-modal')).toBe('true');
    const labelledBy = container?.getAttribute('aria-labelledby');
    expect(labelledBy).toBeTruthy();
    expect(document.getElementById(labelledBy!)?.textContent).toBe(
      'Delete project?',
    );
  });

  it('moves focus into the dialog on open and restores it to the trigger on close', async () => {
    const { fixture, trigger, host } = await setup();
    trigger.focus();
    host.open();
    fixture.detectChanges();
    await getDialog(fixture); // wait for the panel to exist before asserting focus

    expect(document.activeElement).not.toBe(trigger);
    expect(
      document.querySelector('[role="dialog"]')?.contains(document.activeElement),
    ).toBe(true);

    host.ref!.close();
    fixture.detectChanges();

    expect(document.activeElement).toBe(trigger);
  });

  it('closes with the result from the clicked action', async () => {
    const { fixture, host } = await setup();
    host.open();
    fixture.detectChanges();

    let result: boolean | undefined;
    host.ref!.closed.subscribe((value) => (result = value));

    const deleteButton = [
      ...document.querySelectorAll<HTMLButtonElement>('[role="dialog"] button'),
    ].find((btn) => btn.textContent?.trim() === 'Delete');
    deleteButton!.click();
    fixture.detectChanges();

    expect(result).toBe(true);
    expect(await getDialog(fixture)).toBeNull();
  });

  it('closes via the built-in close button', async () => {
    const { fixture, host } = await setup();
    host.open();
    fixture.detectChanges();

    const dialog = await getDialog(fixture);
    await dialog!.clickClose();
    fixture.detectChanges();

    expect(await getDialog(fixture)).toBeNull();
  });

  it('closes on Escape, per CDK Dialog default behavior', async () => {
    const { fixture, host } = await setup();
    host.open();
    fixture.detectChanges();
    await getDialog(fixture);

    // CDK's overlay keyboard dispatcher listens on `document.body`, not
    // `document` - dispatching on `document` itself never reaches it,
    // since bubbling runs child to parent, not the other way around. It
    // also checks event.keyCode, not event.key - jsdom's KeyboardEvent
    // constructor doesn't derive one from the other, so both are needed.
    document.body.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Escape',
        keyCode: 27,
        bubbles: true,
      }),
    );
    fixture.detectChanges();

    expect(await getDialog(fixture)).toBeNull();
  });

  it('has no accessibility violations while open', async () => {
    const { fixture, host } = await setup();
    host.open();
    fixture.detectChanges();
    await getDialog(fixture);

    await expectNoAxeViolations(document.body);
  });
});
