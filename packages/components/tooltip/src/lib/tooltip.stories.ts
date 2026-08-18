import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrkTooltipDirective } from './tooltip';

const meta: Meta<BrkTooltipDirective> = {
  title: 'Components/Tooltip',
  component: BrkTooltipDirective,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [BrkTooltipDirective],
    }),
  ],
};

export default meta;
type Story = StoryObj<BrkTooltipDirective>;

export const Default: Story = {
  name: 'Hover or focus to reveal',
  render: () => ({
    template: `
      <button type="button" brkTooltip="Save changes" style="padding: 0.5rem 1rem;">
        Save
      </button>
    `,
  }),
};

export const Positions: Story = {
  render: () => ({
    template: `
      <div style="display:flex; gap:3rem; padding: 3rem; align-items:center;">
        <button type="button" brkTooltip="Above" brkTooltipPosition="above">Above</button>
        <button type="button" brkTooltip="Below" brkTooltipPosition="below">Below</button>
        <button type="button" brkTooltip="Before" brkTooltipPosition="before">Before</button>
        <button type="button" brkTooltip="After" brkTooltipPosition="after">After</button>
      </div>
    `,
  }),
};
