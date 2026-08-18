import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { BrkSwitchComponent } from './switch';

const meta: Meta<BrkSwitchComponent> = {
  title: 'Components/Switch',
  component: BrkSwitchComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [BrkSwitchComponent, FormsModule] })],
};

export default meta;
type Story = StoryObj<BrkSwitchComponent>;

export const Default: Story = {
  render: () => ({
    template: `
      <label style="display:inline-flex; align-items:center; gap:.5rem;">
        <input type="checkbox" brkSwitch />
        Email notifications
      </label>
    `,
  }),
};

export const States: Story = {
  name: 'On / Off / Disabled',
  render: () => ({
    template: `
      <div style="display:flex; flex-direction:column; gap:.75rem;">
        <label style="display:inline-flex; align-items:center; gap:.5rem;">
          <input type="checkbox" brkSwitch />
          Off
        </label>
        <label style="display:inline-flex; align-items:center; gap:.5rem;">
          <input type="checkbox" brkSwitch checked />
          On
        </label>
        <label style="display:inline-flex; align-items:center; gap:.5rem; opacity:.7;">
          <input type="checkbox" brkSwitch disabled />
          Disabled
        </label>
        <label style="display:inline-flex; align-items:center; gap:.5rem; opacity:.7;">
          <input type="checkbox" brkSwitch checked disabled />
          Disabled + on
        </label>
      </div>
    `,
  }),
};

export const Sizes: Story = {
  name: 'Sizes (sm / md / lg)',
  render: () => ({
    template: `
      <div style="display:flex; align-items:center; gap:1.5rem;">
        <input type="checkbox" brkSwitch size="sm" checked />
        <input type="checkbox" brkSwitch size="md" checked />
        <input type="checkbox" brkSwitch size="lg" checked />
      </div>
    `,
  }),
};

export const WithNgModel: Story = {
  name: 'Two-way binding with ngModel',
  render: () => ({
    props: { enabled: false },
    template: `
      <label style="display:inline-flex; align-items:center; gap:.5rem;">
        <input type="checkbox" brkSwitch [(ngModel)]="enabled" />
        enabled = {{ enabled }}
      </label>
    `,
  }),
};
