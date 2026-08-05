import type { Meta, StoryObj } from '@storybook/angular';
import { AdsButtonComponent } from './button';

const meta: Meta<AdsButtonComponent> = {
  title: 'Components/Button',
  component: AdsButtonComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['filled', 'outlined', 'text'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  render: (args) => ({
    props: args,
    template: `<button adsButton [variant]="variant" [size]="size">Save changes</button>`,
  }),
};

export default meta;
type Story = StoryObj<AdsButtonComponent>;

export const Filled: Story = { args: { variant: 'filled', size: 'md' } };
export const Outlined: Story = { args: { variant: 'outlined', size: 'md' } };
export const Text: Story = { args: { variant: 'text', size: 'md' } };

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display:flex; gap: 1rem; align-items:center;">
        <button adsButton variant="filled" size="sm">Small</button>
        <button adsButton variant="filled" size="md">Medium</button>
        <button adsButton variant="filled" size="lg">Large</button>
      </div>
    `,
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: `<button adsButton variant="filled" [disabled]="true">Save changes</button>`,
  }),
};
