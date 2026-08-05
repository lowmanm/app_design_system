import type { Meta, StoryObj } from '@storybook/angular';
import { BrkButtonComponent } from './button';

const meta: Meta<BrkButtonComponent> = {
  title: 'Components/Button',
  component: BrkButtonComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['filled', 'tonal', 'outlined', 'text', 'danger'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  render: (args) => ({
    props: args,
    template: `<button brkButton [variant]="variant" [size]="size">Save changes</button>`,
  }),
};

export default meta;
type Story = StoryObj<BrkButtonComponent>;

export const Filled: Story = { args: { variant: 'filled', size: 'md' } };
export const Tonal: Story = { args: { variant: 'tonal', size: 'md' } };
export const Outlined: Story = { args: { variant: 'outlined', size: 'md' } };
export const Text: Story = { args: { variant: 'text', size: 'md' } };
export const Danger: Story = { args: { variant: 'danger', size: 'md' } };

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display:flex; gap: 0.625rem; flex-wrap: wrap; align-items:center;">
        <button brkButton variant="filled">Save changes</button>
        <button brkButton variant="tonal">Preview</button>
        <button brkButton variant="outlined">Cancel</button>
        <button brkButton variant="text">Skip for now</button>
        <button brkButton variant="danger">Delete report</button>
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display:flex; gap: 1rem; align-items:center;">
        <button brkButton variant="filled" size="sm">Small</button>
        <button brkButton variant="filled" size="md">Medium</button>
        <button brkButton variant="filled" size="lg">Large</button>
      </div>
    `,
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: `<button brkButton variant="filled" [disabled]="true">Save changes</button>`,
  }),
};
