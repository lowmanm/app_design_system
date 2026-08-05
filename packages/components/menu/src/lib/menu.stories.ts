import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrkButtonComponent } from '@app-design-system/button';
import { BrkMenuComponent } from './menu';
import { BrkMenuTriggerDirective } from './menu-trigger.directive';
import { BrkMenuItemDirective } from './menu-item.directive';
import { BrkMenuDividerDirective } from './menu-divider.directive';

const meta: Meta<BrkMenuComponent> = {
  title: 'Components/Menu',
  component: BrkMenuComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [BrkButtonComponent, BrkMenuTriggerDirective, BrkMenuItemDirective, BrkMenuDividerDirective],
    }),
  ],
};

export default meta;
type Story = StoryObj<BrkMenuComponent>;

export const Default: Story = {
  render: () => ({
    template: `
      <button brkButton variant="outlined" [brkMenuTriggerFor]="appMenu">
        Workspace
      </button>
      <brk-menu #appMenu>
        <button brkMenuItem>Profile settings</button>
        <button brkMenuItem>Team members</button>
        <div brkMenuDivider></div>
        <button brkMenuItem danger>Sign out</button>
      </brk-menu>
    `,
  }),
};
