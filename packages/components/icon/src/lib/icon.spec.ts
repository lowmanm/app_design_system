import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '@app-design-system/core/testing';
import { BrkIconComponent } from './icon';
import { BrkIconHarness } from './icon.harness';

@Component({
  imports: [BrkIconComponent],
  template: `
    <brk-icon
      [name]="name()"
      [size]="size()"
      [label]="label()"
      [filled]="filled()"
      [weight]="weight()"
      [grade]="grade()"
    />
  `,
})
class HostComponent {
  readonly name = signal('settings');
  readonly size = signal<'sm' | 'md' | 'lg' | 'xl'>('md');
  readonly label = signal<string | undefined>(undefined);
  readonly filled = signal(false);
  readonly weight = signal(400);
  readonly grade = signal(0);
}

// `.loader(fixture).getHarness(...)`, not `.harnessForFixture(...)` - the
// latter treats the fixture root as the harness host, which is only correct
// when the fixture was created for the harnessed component directly. Here
// the root is a wrapping test host.
async function setup() {
  const fixture = TestBed.createComponent(HostComponent);
  fixture.detectChanges();
  const harness =
    await TestbedHarnessEnvironment.loader(fixture).getHarness(BrkIconHarness);
  return { fixture, harness, host: fixture.componentInstance };
}

describe('BrkIconComponent', () => {
  it('renders the glyph name as its ligature text', async () => {
    const { harness } = await setup();
    expect(await harness.getName()).toBe('settings');
  });

  it('applies the size class', async () => {
    const { fixture, harness, host } = await setup();
    expect(await harness.getSize()).toBe('md');

    host.size.set('xl');
    fixture.detectChanges();
    expect(await harness.getSize()).toBe('xl');
  });

  describe('accessibility', () => {
    // The default matters more than the opt-in: most icons sit next to their
    // own text label, so announcing them repeats the label. Getting this
    // backwards is the single most common icon a11y bug.
    it('is hidden from assistive technology by default', async () => {
      const { harness } = await setup();
      expect(await harness.isDecorative()).toBe(true);
      expect(await harness.getLabel()).toBeNull();
    });

    it('becomes an img with an accessible name when labelled', async () => {
      const { fixture, harness, host } = await setup();
      host.label.set('Open settings');
      fixture.detectChanges();

      expect(await harness.getLabel()).toBe('Open settings');
      expect(await harness.isDecorative()).toBe(false);
      expect(await (await harness.host()).getAttribute('role')).toBe('img');
    });

    it('has no violations either way', async () => {
      const { fixture, host } = await setup();
      await expectNoAxeViolations(fixture.nativeElement);

      host.label.set('Open settings');
      fixture.detectChanges();
      await expectNoAxeViolations(fixture.nativeElement);
    });
  });

  describe('variable axes', () => {
    // Every visual variant renders through font-variation-settings rather
    // than through classes, so if this string is wrong the icon silently
    // renders in its default form - no error, just the wrong glyph weight.
    it('defaults to outlined, regular weight, at the size opsz', async () => {
      const { harness } = await setup();
      expect(await harness.getVariationSettings()).toBe(
        `"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24`,
      );
    });

    it('sets FILL when filled', async () => {
      const { fixture, harness, host } = await setup();
      host.filled.set(true);
      fixture.detectChanges();
      expect(await harness.getVariationSettings()).toContain(`"FILL" 1`);
    });

    it('carries weight and grade through', async () => {
      const { fixture, harness, host } = await setup();
      host.weight.set(600);
      host.grade.set(200);
      fixture.detectChanges();

      const settings = await harness.getVariationSettings();
      expect(settings).toContain(`"wght" 600`);
      expect(settings).toContain(`"GRAD" 200`);
    });

    it('drives opsz from the size, so strokes stay optically correct', async () => {
      const { fixture, harness, host } = await setup();
      host.size.set('xl');
      fixture.detectChanges();
      expect(await harness.getVariationSettings()).toContain(`"opsz" 40`);
    });
  });
});
