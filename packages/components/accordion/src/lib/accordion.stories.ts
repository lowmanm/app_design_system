import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrkAccordionComponent } from './accordion';
import { BrkAccordionItemComponent } from './accordion-item';

const meta: Meta<BrkAccordionComponent> = {
  title: 'Components/Accordion',
  component: BrkAccordionComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [BrkAccordionComponent, BrkAccordionItemComponent],
    }),
  ],
};

export default meta;
type Story = StoryObj<BrkAccordionComponent>;

export const Default: Story = {
  name: 'Default (single-open)',
  render: () => ({
    template: `
      <brk-accordion style="max-width: 32rem;">
        <brk-accordion-item header="What's included in the Pro plan?">
          Everything in Free, plus priority support, unlimited projects,
          and advanced analytics.
        </brk-accordion-item>
        <brk-accordion-item header="Can I cancel anytime?">
          Yes - cancel from your billing settings and you'll keep access
          until the end of the current period.
        </brk-accordion-item>
        <brk-accordion-item header="Do you offer a student discount?">
          Yes, 50% off with a verified .edu email address.
        </brk-accordion-item>
      </brk-accordion>
      <p style="margin-top:1rem; font: var(--mat-sys-body-small); opacity:.75">
        Single-open by default - opening one item closes whichever was open.
      </p>
    `,
  }),
};

export const Multi: Story = {
  name: 'Multi-open',
  render: () => ({
    template: `
      <brk-accordion multi style="max-width: 32rem;">
        <brk-accordion-item header="Section one">
          Content for section one.
        </brk-accordion-item>
        <brk-accordion-item header="Section two">
          Content for section two.
        </brk-accordion-item>
        <brk-accordion-item header="Section three">
          Content for section three.
        </brk-accordion-item>
      </brk-accordion>
    `,
  }),
};
