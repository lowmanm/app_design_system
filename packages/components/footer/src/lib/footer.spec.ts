import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '@app-design-system/core/testing';
import { BrkFooterComponent } from './footer';
import { BrkFooterHarness } from './footer.harness';

@Component({
  imports: [BrkFooterComponent],
  template: `
    <brk-footer>
      <div brkFooterBrand><span>Acme</span></div>
      <div brkFooterLinks>
        <div>
          <h3>Product</h3>
          <a href="/pricing">Pricing</a>
          <a href="/changelog">Changelog</a>
        </div>
        <div>
          <h3>Company</h3>
          <a href="/about">About</a>
        </div>
      </div>
      <div brkFooterLegal>&copy; 2026 Acme, Inc.</div>
    </brk-footer>
  `,
})
class HostComponent {}

async function setup() {
  const fixture = TestBed.createComponent(HostComponent);
  fixture.detectChanges();
  const harness =
    await TestbedHarnessEnvironment.loader(fixture).getHarness(
      BrkFooterHarness,
    );
  return { fixture, harness };
}

describe('BrkFooterComponent', () => {
  it('projects brand, links, and legal content into their own regions', async () => {
    const { harness } = await setup();

    expect(await harness.getBrandText()).toBe('Acme');
    expect(await harness.getLinkLabels()).toEqual([
      'Pricing',
      'Changelog',
      'About',
    ]);
    expect(await harness.getLegalText()).toContain('2026 Acme, Inc.');
  });

  it('exposes the contentinfo landmark', async () => {
    // Without this a screen-reader user has nothing to jump to: brk-footer
    // is a custom element with no implicit role, the same gap brk-header
    // fills with role="banner".
    const { fixture } = await setup();
    const footer: HTMLElement =
      fixture.nativeElement.querySelector('brk-footer');
    expect(footer.getAttribute('role')).toBe('contentinfo');
  });

  it('has no accessibility violations', async () => {
    const { fixture } = await setup();
    await expectNoAxeViolations(fixture.nativeElement);
  });
});
