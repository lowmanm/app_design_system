import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrkButtonComponent } from '@app-design-system/button';
import { BrkIconComponent } from '@app-design-system/icon';
import { BrkHeaderComponent } from './header';

const meta: Meta<BrkHeaderComponent> = {
  title: 'Components/Header',
  component: BrkHeaderComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({ imports: [BrkButtonComponent, BrkIconComponent] }),
  ],
};

export default meta;
type Story = StoryObj<BrkHeaderComponent>;

export const Default: Story = {
  render: () => ({
    template: `
      <brk-header>
        <div brkHeaderBrand>
          <span style="width: 1.5rem; height: 1.5rem; border-radius: var(--radius-sm); background: var(--mat-sys-primary); color: var(--mat-sys-on-primary); display: grid; place-items: center; font-weight: 700; font-size: 0.75rem;">B</span>
          <span>Brk</span>
        </div>
        <a href="#" aria-current="page">Product</a>
        <a href="#">Solutions</a>
        <a href="#">Docs</a>
        <a href="#">Pricing</a>
        <div brkHeaderActions>
          <button brkButton variant="text" size="sm">Sign in</button>
          <button brkButton variant="filled" size="sm">Get started</button>
        </div>
      </brk-header>
    `,
  }),
};

/**
 * Both halves of the icon accessibility rule in one bar. The search and
 * notification controls are icon-only, so each `brk-icon` is given a
 * `label` and becomes the button's accessible name. The icon beside "Get
 * started" is decorative - the button already says what it does - so it is
 * left hidden from assistive technology, which is `brk-icon`'s default.
 */
export const WithIcons: Story = {
  render: () => ({
    template: `
      <brk-header>
        <div brkHeaderBrand>
          <span style="width: 1.5rem; height: 1.5rem; border-radius: var(--radius-sm); background: var(--mat-sys-primary); color: var(--mat-sys-on-primary); display: grid; place-items: center; font-weight: 700; font-size: 0.75rem;">B</span>
          <span>Brk</span>
        </div>
        <a href="#" aria-current="page">Dashboard</a>
        <a href="#">Reports</a>
        <a href="#">Settings</a>
        <div brkHeaderActions>
          <button brkButton variant="text" size="sm">
            <brk-icon name="search" size="sm" label="Search" />
          </button>
          <button brkButton variant="text" size="sm">
            <brk-icon name="notifications" size="sm" label="Notifications" />
          </button>
          <button brkButton variant="filled" size="sm">
            <brk-icon name="add" size="sm" />
            New report
          </button>
        </div>
      </brk-header>
    `,
  }),
};
