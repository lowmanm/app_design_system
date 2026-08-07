import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrkButtonComponent } from '@app-design-system/button';
import { BrkIconComponent } from '@app-design-system/icon';
import { BrkMenuComponent } from './menu';
import { BrkMenuTriggerDirective } from './menu-trigger.directive';
import { BrkContextMenuTriggerDirective } from './context-menu-trigger.directive';
import { BrkMenuItemDirective } from './menu-item.directive';
import { BrkMenuDividerDirective } from './menu-divider.directive';
import { BrkMenuContentDirective } from './menu-content.directive';

const meta: Meta<BrkMenuComponent> = {
  title: 'Components/Menu',
  component: BrkMenuComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [
        BrkButtonComponent,
        BrkIconComponent,
        BrkMenuTriggerDirective,
        BrkContextMenuTriggerDirective,
        BrkMenuItemDirective,
        BrkMenuDividerDirective,
        BrkMenuContentDirective,
      ],
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

export const WithIcons: Story = {
  render: () => ({
    template: `
      <button brkButton variant="outlined" [brkMenuTriggerFor]="iconMenu">
        Actions
      </button>
      <brk-menu #iconMenu>
        <button brkMenuItem>
          <brk-icon name="edit" size="sm" />
          Rename
        </button>
        <button brkMenuItem>
          <brk-icon name="content_copy" size="sm" />
          Duplicate
        </button>
        <div brkMenuDivider></div>
        <button brkMenuItem danger>
          <brk-icon name="delete" size="sm" />
          Delete
        </button>
      </brk-menu>
      <p style="margin-top:1rem; max-width:32rem; font: var(--mat-sys-body-small); opacity:.75">
        The icons are decorative - each menu item already names itself in
        text - so <code>brk-icon</code> leaves them hidden from screen
        readers by default. Note the delete icon turns red with its item
        without being told to: icons inherit their colour.
      </p>
    `,
  }),
};

export const Positions: Story = {
  name: 'Positions (xPosition / yPosition / overlapTrigger)',
  render: () => ({
    template: `
      <div style="display:flex; gap: 2rem; padding: 4rem 2rem;">
        <div>
          <button brkButton variant="outlined" [brkMenuTriggerFor]="belowAfter">Below + after (default)</button>
          <brk-menu #belowAfter>
            <button brkMenuItem>One</button>
            <button brkMenuItem>Two</button>
          </brk-menu>
        </div>
        <div>
          <button brkButton variant="outlined" [brkMenuTriggerFor]="belowBefore">Below + before</button>
          <brk-menu #belowBefore xPosition="before">
            <button brkMenuItem>One</button>
            <button brkMenuItem>Two</button>
          </brk-menu>
        </div>
        <div>
          <button brkButton variant="outlined" [brkMenuTriggerFor]="above">Above</button>
          <brk-menu #above yPosition="above">
            <button brkMenuItem>One</button>
            <button brkMenuItem>Two</button>
          </brk-menu>
        </div>
        <div>
          <button brkButton variant="outlined" [brkMenuTriggerFor]="overlap">Overlapping trigger</button>
          <brk-menu #overlap [overlapTrigger]="true">
            <button brkMenuItem>One</button>
            <button brkMenuItem>Two</button>
          </brk-menu>
        </div>
      </div>
    `,
  }),
};

export const NestedSubmenu: Story = {
  name: 'Nested (cascading) submenu',
  render: () => ({
    template: `
      <button brkButton variant="outlined" [brkMenuTriggerFor]="fileMenu">
        File
      </button>
      <brk-menu #fileMenu>
        <button brkMenuItem>New tab</button>
        <button brkMenuItem [brkMenuTriggerFor]="shareMenu">Share</button>
        <button brkMenuItem [brkMenuTriggerFor]="exportMenu">Export</button>
        <div brkMenuDivider></div>
        <button brkMenuItem danger>Close</button>
      </brk-menu>
      <brk-menu #shareMenu>
        <button brkMenuItem>Copy link</button>
        <button brkMenuItem>Email link</button>
      </brk-menu>
      <brk-menu #exportMenu>
        <button brkMenuItem>Export as PDF</button>
        <button brkMenuItem>Export as CSV</button>
      </brk-menu>
    `,
  }),
};

export const ContextMenu: Story = {
  name: 'Context menu (right-click)',
  render: () => ({
    template: `
      <div
        [brkContextMenuTriggerFor]="rowMenu"
        style="width: 320px; padding: 1.5rem; border: 1px dashed var(--mat-sys-outline-variant); border-radius: var(--radius-md); text-align: center; color: var(--mat-sys-on-surface-variant); font-size: 0.875rem;"
      >
        Right-click this row
      </div>
      <brk-menu #rowMenu>
        <button brkMenuItem>Rename</button>
        <button brkMenuItem>Duplicate</button>
        <div brkMenuDivider></div>
        <button brkMenuItem danger>Delete</button>
      </brk-menu>
    `,
  }),
};

export const LazyContent: Story = {
  name: 'Lazy content (ng-template brkMenuContent)',
  render: () => ({
    template: `
      <button brkButton variant="outlined" [brkMenuTriggerFor]="lazyMenu">
        Projects
      </button>
      <brk-menu #lazyMenu>
        <ng-template brkMenuContent>
          <button brkMenuItem>Design System</button>
          <button brkMenuItem>Marketing Site</button>
          <button brkMenuItem>Internal Tools</button>
        </ng-template>
      </brk-menu>
    `,
  }),
};
