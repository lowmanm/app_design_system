import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrkIconComponent } from './icon';
import manifest from '../icon-manifest.json';

const meta: Meta<BrkIconComponent> = {
  title: 'Components/Icon',
  component: BrkIconComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [BrkIconComponent] })],
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg', 'xl'] },
    weight: { control: { type: 'range', min: 100, max: 700, step: 100 } },
    grade: { control: { type: 'range', min: -25, max: 200, step: 25 } },
  },
  args: {
    name: 'settings',
    size: 'md',
    filled: false,
    weight: 400,
    grade: 0,
  },
};

export default meta;
type Story = StoryObj<BrkIconComponent>;

export const Default: Story = {};

export const Sizes: Story = {
  name: 'Sizes (sm / md / lg / xl)',
  render: () => ({
    template: `
      <div style="display:flex; align-items:center; gap:1.5rem;">
        @for (size of ['sm','md','lg','xl']; track size) {
          <div style="display:flex; flex-direction:column; align-items:center; gap:.5rem;">
            <brk-icon name="dashboard" [size]="size" />
            <code style="font-size:.75rem; opacity:.7">{{ size }}</code>
          </div>
        }
      </div>
    `,
  }),
};

export const Filled: Story = {
  name: 'Filled (the selected / active state)',
  render: () => ({
    template: `
      <div style="display:flex; align-items:center; gap:2rem;">
        @for (name of ['star','favorite','bookmark','check_circle']; track name) {
          <div style="display:flex; align-items:center; gap:.75rem;">
            <brk-icon [name]="name" size="lg" />
            <brk-icon [name]="name" size="lg" filled />
          </div>
        }
      </div>
    `,
  }),
};

export const Weight: Story = {
  name: 'Weight (matching heavier or lighter text)',
  render: () => ({
    template: `
      <div style="display:flex; align-items:center; gap:1.5rem;">
        @for (weight of [100,300,400,500,700]; track weight) {
          <div style="display:flex; flex-direction:column; align-items:center; gap:.5rem;">
            <brk-icon name="settings" size="lg" [weight]="weight" />
            <code style="font-size:.75rem; opacity:.7">{{ weight }}</code>
          </div>
        }
      </div>
    `,
  }),
};

export const InheritsColor: Story = {
  name: 'Colour is inherited, never set',
  render: () => ({
    template: `
      <div style="display:flex; flex-direction:column; gap:.75rem;">
        @for (role of ['on-surface','primary','error','success','warning']; track role) {
          <div style="display:flex; align-items:center; gap:.5rem; color: var(--mat-sys-{{ role }});">
            <brk-icon name="info" />
            <span>An icon takes the colour of the text beside it - <code>{{ role }}</code></span>
          </div>
        }
      </div>
    `,
  }),
};

export const Accessibility: Story = {
  name: 'Decorative vs. meaningful',
  render: () => ({
    template: `
      <div style="display:flex; flex-direction:column; gap:1rem; max-width:38rem;">
        <p style="margin:0">
          Icons are <strong>decorative by default</strong> - <code>aria-hidden</code>,
          invisible to a screen reader - because most sit next to their own label
          and announcing them repeats it. Inspect both below: only the second
          has an accessible name.
        </p>
        <div style="display:flex; align-items:center; gap:.5rem;">
          <brk-icon name="delete" />
          <span>Delete (label supplied by this text, icon stays silent)</span>
        </div>
        <div style="display:flex; align-items:center; gap:.5rem;">
          <brk-icon name="delete" label="Delete this row" />
          <span>Icon-only control - the icon carries the name itself</span>
        </div>
      </div>
    `,
  }),
};

/**
 * The curated set from `icon-manifest.json`. Not a restriction - any of
 * Material Symbols' ~3,400 names works - but one obvious answer per concept
 * keeps three screens from using three different "delete" icons.
 */
export const CuratedSet: Story = {
  name: 'Curated set',
  render: () => ({
    props: {
      groups: Object.entries(manifest).filter(([key]) => !key.startsWith('$')),
    },
    template: `
      <div style="display:flex; flex-direction:column; gap:2rem;">
        @for (group of groups; track group[0]) {
          <section>
            <h3 style="margin:0 0 .75rem; font: var(--mat-sys-title-medium); text-transform:capitalize;">
              {{ group[0] }}
            </h3>
            <div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(7.5rem,1fr)); gap:.75rem;">
              @for (name of group[1]; track name) {
                <div style="display:flex; flex-direction:column; align-items:center; gap:.375rem; padding:.75rem .25rem; border:1px solid var(--mat-sys-outline-variant); border-radius:var(--radius-md);">
                  <brk-icon [name]="name" size="lg" />
                  <code style="font-size:.6875rem; opacity:.75; text-align:center; word-break:break-all;">{{ name }}</code>
                </div>
              }
            </div>
          </section>
        }
      </div>
    `,
  }),
};
