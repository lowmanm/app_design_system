import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { BrkRadioComponent } from './radio';
import { BrkRadioGroupComponent } from './radio-group';

const meta: Meta<BrkRadioGroupComponent> = {
  title: 'Components/Radio',
  component: BrkRadioGroupComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [BrkRadioComponent, BrkRadioGroupComponent, FormsModule],
    }),
  ],
};

export default meta;
type Story = StoryObj<BrkRadioGroupComponent>;

export const Default: Story = {
  render: () => ({
    props: { plan: 'free' },
    template: `
      <brk-radio-group label="Billing plan">
        <label style="display:flex; align-items:center; gap:.5rem;">
          <input type="radio" brkRadio value="free" [(ngModel)]="plan" /> Free
        </label>
        <label style="display:flex; align-items:center; gap:.5rem;">
          <input type="radio" brkRadio value="pro" [(ngModel)]="plan" /> Pro
        </label>
        <label style="display:flex; align-items:center; gap:.5rem;">
          <input type="radio" brkRadio value="enterprise" [(ngModel)]="plan" /> Enterprise
        </label>
      </brk-radio-group>
      <p style="margin-top:.75rem; font: var(--mat-sys-body-small); opacity:.75">
        Selected: {{ plan }}. Arrow keys move the selection - the browser's
        own native same-name radio grouping, not a directive we wrote.
      </p>
    `,
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: `
      <brk-radio-group label="Shipping speed">
        <label style="display:flex; align-items:center; gap:.5rem;">
          <input type="radio" brkRadio name="shipping" value="standard" checked /> Standard
        </label>
        <label style="display:flex; align-items:center; gap:.5rem; opacity:.7;">
          <input type="radio" brkRadio name="shipping" value="overnight" disabled /> Overnight (unavailable)
        </label>
      </brk-radio-group>
    `,
  }),
};

export const Sizes: Story = {
  name: 'Sizes (sm / md / lg)',
  render: () => ({
    template: `
      <div style="display:flex; align-items:center; gap:1.5rem;">
        <label style="display:flex; align-items:center; gap:.5rem;">
          <input type="radio" brkRadio name="size-demo" size="sm" checked /> sm
        </label>
        <label style="display:flex; align-items:center; gap:.5rem;">
          <input type="radio" brkRadio name="size-demo-2" size="md" checked /> md
        </label>
        <label style="display:flex; align-items:center; gap:.5rem;">
          <input type="radio" brkRadio name="size-demo-3" size="lg" checked /> lg
        </label>
      </div>
    `,
  }),
};

export const Standalone: Story = {
  name: 'Standalone (no brk-radio-group)',
  render: () => ({
    template: `
      <p style="margin:0 0 .5rem; font: var(--mat-sys-body-small); opacity:.75">
        Used outside a group, set \`name\` yourself - exactly like a bare native radio.
      </p>
      <label style="display:flex; align-items:center; gap:.5rem;">
        <input type="radio" brkRadio name="standalone" checked /> Option A
      </label>
      <label style="display:flex; align-items:center; gap:.5rem;">
        <input type="radio" brkRadio name="standalone" /> Option B
      </label>
    `,
  }),
};
