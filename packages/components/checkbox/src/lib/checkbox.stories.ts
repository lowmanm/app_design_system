import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { BrkCheckboxComponent } from './checkbox';

const meta: Meta<BrkCheckboxComponent> = {
  title: 'Components/Checkbox',
  component: BrkCheckboxComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({ imports: [BrkCheckboxComponent, FormsModule] }),
  ],
};

export default meta;
type Story = StoryObj<BrkCheckboxComponent>;

export const Default: Story = {
  render: () => ({
    template: `
      <label style="display:inline-flex; align-items:center; gap:.5rem;">
        <input type="checkbox" brkCheckbox />
        Accept terms and conditions
      </label>
    `,
  }),
};

export const States: Story = {
  name: 'Checked / Indeterminate / Disabled',
  render: () => ({
    template: `
      <div style="display:flex; flex-direction:column; gap:.75rem;">
        <label style="display:inline-flex; align-items:center; gap:.5rem;">
          <input type="checkbox" brkCheckbox />
          Unchecked
        </label>
        <label style="display:inline-flex; align-items:center; gap:.5rem;">
          <input type="checkbox" brkCheckbox checked />
          Checked
        </label>
        <label style="display:inline-flex; align-items:center; gap:.5rem;">
          <input type="checkbox" brkCheckbox [indeterminate]="true" />
          Indeterminate ("select all" with a partial selection)
        </label>
        <label style="display:inline-flex; align-items:center; gap:.5rem; opacity:.7;">
          <input type="checkbox" brkCheckbox disabled />
          Disabled
        </label>
        <label style="display:inline-flex; align-items:center; gap:.5rem; opacity:.7;">
          <input type="checkbox" brkCheckbox checked disabled />
          Disabled + checked
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
        <label style="display:inline-flex; align-items:center; gap:.5rem;">
          <input type="checkbox" brkCheckbox size="sm" checked /> sm
        </label>
        <label style="display:inline-flex; align-items:center; gap:.5rem;">
          <input type="checkbox" brkCheckbox size="md" checked /> md
        </label>
        <label style="display:inline-flex; align-items:center; gap:.5rem;">
          <input type="checkbox" brkCheckbox size="lg" checked /> lg
        </label>
      </div>
    `,
  }),
};

export const WithNgModel: Story = {
  name: 'Two-way binding with ngModel',
  render: () => ({
    props: { agreed: false },
    template: `
      <label style="display:inline-flex; align-items:center; gap:.5rem;">
        <input type="checkbox" brkCheckbox [(ngModel)]="agreed" />
        agreed = {{ agreed }}
      </label>
    `,
  }),
};
