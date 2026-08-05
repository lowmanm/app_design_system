import type { Meta, StoryObj } from '@storybook/angular';
import { BrkCardComponent } from './card';

const meta: Meta<BrkCardComponent> = {
  title: 'Components/Card',
  component: BrkCardComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['elevated', 'outlined'] },
  },
  render: (args) => ({
    props: args,
    template: `
      <brk-card [variant]="variant" style="max-width: 320px; display: block;">
        <h3 style="margin: 0 0 0.25rem; font-size: 0.9375rem; font-weight: 600;">Getting started</h3>
        <p style="margin: 0; font-size: 0.875rem;">
          Install the tokens package, pick a brand, wire the theme bridge - done in about ten minutes.
        </p>
        <div brkCardFooter>
          <a href="#" style="font-size: 0.8125rem; font-weight: 500;">Read the guide →</a>
        </div>
      </brk-card>
    `,
  }),
};

export default meta;
type Story = StoryObj<BrkCardComponent>;

export const Elevated: Story = { args: { variant: 'elevated' } };
export const Outlined: Story = { args: { variant: 'outlined' } };

export const WithoutFooter: Story = {
  render: () => ({
    template: `
      <brk-card variant="outlined" style="max-width: 260px; display: block;">
        <p style="margin: 0 0 -0.25rem; font-size: 0.8125rem; color: var(--mat-sys-on-surface-variant);">
          Components published
        </p>
        <div style="display:flex; align-items: baseline; justify-content: space-between;">
          <span style="font-size: 1.875rem; font-weight: 600;">24</span>
          <span style="font-family: var(--font-family-mono, monospace); font-size: 0.75rem; font-weight: 600; background: var(--mat-sys-success-container, #e2f5ec); padding: 0.1875rem 0.5rem; border-radius: 999px;">+6 this quarter</span>
        </div>
      </brk-card>
    `,
  }),
};

export const SideBySide: Story = {
  render: () => ({
    template: `
      <div style="display:flex; gap: 1rem; flex-wrap: wrap;">
        <brk-card variant="elevated" style="max-width: 260px; display: block;">
          <h3 style="margin: 0 0 0.25rem; font-size: 0.9375rem; font-weight: 600;">Elevated</h3>
          <p style="margin: 0; font-size: 0.875rem;">Soft shadow - for content and marketing surfaces.</p>
        </brk-card>
        <brk-card variant="outlined" style="max-width: 260px; display: block;">
          <h3 style="margin: 0 0 0.25rem; font-size: 0.9375rem; font-weight: 600;">Outlined</h3>
          <p style="margin: 0; font-size: 0.875rem;">1px border, no shadow - for dense dashboard grids.</p>
        </brk-card>
      </div>
    `,
  }),
};
