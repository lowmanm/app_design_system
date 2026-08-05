import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrkFormFieldComponent } from './form-field';
import { BrkFormFieldControlDirective } from './form-field-control.directive';

const meta: Meta<BrkFormFieldComponent> = {
  title: 'Components/Form Field',
  component: BrkFormFieldComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [BrkFormFieldComponent, BrkFormFieldControlDirective],
    }),
  ],
};

export default meta;
type Story = StoryObj<BrkFormFieldComponent>;

export const Default: Story = {
  render: () => ({
    template: `
      <brk-form-field label="Email" hint="We'll never share it">
        <input brkFormFieldControl type="email" />
      </brk-form-field>
    `,
  }),
};

export const WithError: Story = {
  render: () => ({
    template: `
      <brk-form-field label="Email" hint="We'll never share it" errorMessage="Enter a valid email address">
        <input brkFormFieldControl type="email" value="not-an-email" />
      </brk-form-field>
    `,
  }),
};
