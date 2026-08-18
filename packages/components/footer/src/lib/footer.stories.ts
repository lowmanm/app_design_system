import type { Meta, StoryObj } from '@storybook/angular';
import { BrkFooterComponent } from './footer';

const meta: Meta<BrkFooterComponent> = {
  title: 'Components/Footer',
  component: BrkFooterComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<BrkFooterComponent>;

export const Default: Story = {
  render: () => ({
    template: `
      <brk-footer>
        <div brkFooterBrand>
          <span style="width: 1.5rem; height: 1.5rem; border-radius: var(--radius-sm); background: var(--mat-sys-primary); color: var(--mat-sys-on-primary); display: grid; place-items: center; font-weight: 700; font-size: 0.75rem;">B</span>
          <span>Brk</span>
        </div>
        <div brkFooterLinks>
          <div>
            <h3>Product</h3>
            <a href="#">Pricing</a>
            <a href="#">Changelog</a>
            <a href="#">Docs</a>
          </div>
          <div>
            <h3>Company</h3>
            <a href="#">About</a>
            <a href="#">Careers</a>
            <a href="#">Blog</a>
          </div>
          <div>
            <h3>Legal</h3>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
        <div brkFooterLegal>&copy; 2026 Brk, Inc. All rights reserved.</div>
      </brk-footer>
    `,
  }),
};
