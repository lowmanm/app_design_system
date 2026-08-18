import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { BrkSelectComponent } from './select';
import { BrkOptionDirective } from './option.directive';

const meta: Meta<BrkSelectComponent> = {
  title: 'Components/Select',
  component: BrkSelectComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [BrkSelectComponent, BrkOptionDirective, FormsModule],
    }),
  ],
};

export default meta;
type Story = StoryObj<BrkSelectComponent>;

export const Default: Story = {
  render: () => ({
    props: { country: undefined },
    template: `
      <brk-select placeholder="Choose a country" ariaLabel="Country" [(ngModel)]="country" style="width: 16rem;">
        <div brkOption value="us">United States</div>
        <div brkOption value="ca">Canada</div>
        <div brkOption value="mx">Mexico</div>
        <div brkOption value="uk">United Kingdom</div>
      </brk-select>
      <p style="margin-top:.75rem; font: var(--mat-sys-body-small); opacity:.75">
        Selected: {{ country || '(none)' }}. Arrow keys move the highlight
        without moving real focus off the control - the ARIA select-only
        combobox pattern - Enter/Space commits it.
      </p>
    `,
  }),
};

export const Preselected: Story = {
  render: () => ({
    props: { country: 'ca' },
    template: `
      <brk-select placeholder="Choose a country" ariaLabel="Country" [(ngModel)]="country" style="width: 16rem;">
        <div brkOption value="us">United States</div>
        <div brkOption value="ca">Canada</div>
        <div brkOption value="mx">Mexico</div>
      </brk-select>
    `,
  }),
};

export const WithDisabledOption: Story = {
  name: 'With a disabled option',
  render: () => ({
    template: `
      <brk-select placeholder="Choose a plan" ariaLabel="Plan" style="width: 16rem;">
        <div brkOption value="free">Free</div>
        <div brkOption value="pro">Pro</div>
        <div brkOption value="enterprise" disabled>Enterprise (contact sales)</div>
      </brk-select>
    `,
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: `
      <brk-select placeholder="Choose a country" ariaLabel="Country" disabled style="width: 16rem;">
        <div brkOption value="us">United States</div>
        <div brkOption value="ca">Canada</div>
      </brk-select>
    `,
  }),
};
