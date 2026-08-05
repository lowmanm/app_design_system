import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrkButtonComponent } from '@app-design-system/button';
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
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M11 2l3 3-8 8-4 1 1-4 8-8z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>
          Rename
        </button>
        <button brkMenuItem>
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.3"/><rect x="6" y="6" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.3"/></svg>
          Duplicate
        </button>
        <div brkMenuDivider></div>
        <button brkMenuItem danger>
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 5h10M6 5V3.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1V5m-6 0 .6 8a1 1 0 0 0 1 1h4.8a1 1 0 0 0 1-1L12 5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Delete
        </button>
      </brk-menu>
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
