import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { AdsFormFieldComponent } from './form-field';
import { AdsFormFieldControlDirective } from './form-field-control.directive';

const meta: Meta<AdsFormFieldComponent> = {
  title: 'Components/Form Field',
  component: AdsFormFieldComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [AdsFormFieldComponent, AdsFormFieldControlDirective],
    }),
  ],
};

export default meta;
type Story = StoryObj<AdsFormFieldComponent>;

export const Default: Story = {
  render: () => ({
    template: `
      <ads-form-field label="Email" hint="We'll never share it">
        <input adsFormFieldControl type="email" />
      </ads-form-field>
    `,
  }),
};

export const WithError: Story = {
  render: () => ({
    template: `
      <ads-form-field label="Email" hint="We'll never share it" errorMessage="Enter a valid email address">
        <input adsFormFieldControl type="email" value="not-an-email" />
      </ads-form-field>
    `,
  }),
};
