import { Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrkPaginatorComponent, type BrkPageEvent } from './paginator';

@Component({
  selector: 'brk-story-paginator-demo',
  imports: [BrkPaginatorComponent, JsonPipe],
  template: `
    <brk-paginator
      [length]="120"
      [(pageIndex)]="pageIndex"
      [(pageSize)]="pageSize"
      (page)="lastPage.set($event)"
    />
    <p
      style="font: var(--type-body-sm-size, 0.75rem); opacity: 0.75; margin-top: 1rem;"
    >
      Last page event: {{ lastPage() | json }}
    </p>
  `,
})
class StoryPaginatorDemo {
  protected readonly pageIndex = signal(0);
  protected readonly pageSize = signal(10);
  protected readonly lastPage = signal<BrkPageEvent | null>(null);
}

const meta: Meta<StoryPaginatorDemo> = {
  title: 'Components/Table/Paginator',
  component: StoryPaginatorDemo,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [StoryPaginatorDemo],
    }),
  ],
};

export default meta;
type Story = StoryObj<StoryPaginatorDemo>;

export const Default: Story = {};
