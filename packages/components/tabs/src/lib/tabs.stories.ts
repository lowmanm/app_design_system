import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrkTabsComponent } from './tabs';
import { BrkTabComponent } from './tab';

const meta: Meta<BrkTabsComponent> = {
  title: 'Components/Tabs',
  component: BrkTabsComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({ imports: [BrkTabsComponent, BrkTabComponent] }),
  ],
};

export default meta;
type Story = StoryObj<BrkTabsComponent>;

export const Default: Story = {
  render: () => ({
    template: `
      <brk-tabs ariaLabel="Account settings" style="max-width: 32rem;">
        <brk-tab label="Profile">
          <p style="margin:0;">Profile form goes here.</p>
        </brk-tab>
        <brk-tab label="Billing">
          <p style="margin:0;">Billing form goes here.</p>
        </brk-tab>
        <brk-tab label="Security">
          <p style="margin:0;">Security form goes here.</p>
        </brk-tab>
      </brk-tabs>
      <p style="margin-top:1rem; font: var(--mat-sys-body-small); opacity:.75">
        Left/Right arrow keys move the selection (wrapping, skipping any
        disabled tab), Home/End jump to the first/last enabled tab -
        automatic activation, so the panel switches immediately rather than
        needing a separate commit key.
      </p>
    `,
  }),
};

export const WithDisabledTab: Story = {
  name: 'With a disabled tab',
  render: () => ({
    template: `
      <brk-tabs ariaLabel="Report sections" style="max-width: 32rem;">
        <brk-tab label="Summary">Summary content.</brk-tab>
        <brk-tab label="Details" disabled>Details content.</brk-tab>
        <brk-tab label="Export">Export content.</brk-tab>
      </brk-tabs>
    `,
  }),
};

export const PreselectedTab: Story = {
  name: 'Preselected via [(selectedIndex)]',
  render: () => ({
    props: { active: 1 },
    template: `
      <brk-tabs ariaLabel="Account settings" [(selectedIndex)]="active" style="max-width: 32rem;">
        <brk-tab label="Profile">Profile form goes here.</brk-tab>
        <brk-tab label="Billing">Billing form goes here.</brk-tab>
        <brk-tab label="Security">Security form goes here.</brk-tab>
      </brk-tabs>
    `,
  }),
};
