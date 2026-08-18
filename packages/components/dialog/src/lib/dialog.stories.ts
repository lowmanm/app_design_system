import { Component, inject } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrkDialogComponent } from './dialog';
import { BrkDialogService } from './dialog.service';
import { BrkDialogTitleDirective } from './dialog-title.directive';
import { BrkDialogContentDirective } from './dialog-content.directive';
import { BrkDialogActionsDirective } from './dialog-actions.directive';

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
      <p brkDialogContent>
        This permanently deletes "design-system" and everything in it. This
        can't be undone.
      </p>
      <div brkDialogActions>
        <button type="button" (click)="dialogRef.close(false)">Cancel</button>
        <button type="button" (click)="dialogRef.close(true)">Delete</button>
      </div>
    </brk-dialog>
  `,
})
class StoryConfirmDeleteDialog {
  protected readonly dialogRef = inject(DialogRef<boolean>);
}

@Component({
  selector: 'brk-story-dialog-demo',
  template: `<button type="button" (click)="open()">Delete project…</button>`,
})
class StoryDialogDemo {
  private readonly dialogService = inject(BrkDialogService);

  protected open(): void {
    this.dialogService.open<boolean>(StoryConfirmDeleteDialog);
  }
}

const meta: Meta<StoryDialogDemo> = {
  title: 'Components/Dialog',
  component: StoryDialogDemo,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [StoryDialogDemo],
    }),
  ],
};

export default meta;
type Story = StoryObj<StoryDialogDemo>;

export const Default: Story = {
  name: 'Modal confirm dialog',
};
