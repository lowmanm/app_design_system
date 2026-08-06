import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { describe, expect, it } from 'vitest';
import { BrkHeaderComponent } from './header';
import { expectNoAxeViolations } from '@app-design-system/core/testing';
import { BrkHeaderHarness } from './header.harness';

@Component({
  imports: [BrkHeaderComponent],
  template: `
    <brk-header>
      <div brkHeaderBrand><span>Acme</span></div>
      <a href="/product" aria-current="page">Product</a>
      <a href="/docs">Docs</a>
      <div brkHeaderActions>
        <button>Sign in</button>
      </div>
    </brk-header>
  `,
})
class HostComponent {}

describe('BrkHeaderComponent', () => {
  it('projects brand, nav, and actions into their own regions', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const header: HTMLElement =
      fixture.nativeElement.querySelector('brk-header');
    expect(
      header.querySelector('.brk-header__brand')?.textContent?.trim(),
    ).toBe('Acme');
    expect(header.querySelectorAll('.brk-header__nav a').length).toBe(2);
    expect(
      header.querySelector('.brk-header__actions button')?.textContent?.trim(),
    ).toBe('Sign in');
  });

  it('exposes nav link labels and the active link through BrkHeaderHarness', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const harness =
      await TestbedHarnessEnvironment.loader(fixture).getHarness(
        BrkHeaderHarness,
      );
    expect(await harness.getNavLinkLabels()).toEqual(['Product', 'Docs']);
    expect(await harness.getActiveNavLinkLabel()).toBe('Product');
  });

  it('exposes banner and navigation landmarks', () => {
    // Without these a screen-reader user has nothing to jump to: brk-header
    // is a custom element with no implicit role.
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const header: HTMLElement =
      fixture.nativeElement.querySelector('brk-header');
    expect(header.getAttribute('role')).toBe('banner');
    const nav: HTMLElement = header.querySelector('nav')!;
    expect(nav.getAttribute('aria-label')).toBe('Primary');
  });

  it('has no accessibility violations', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    await expectNoAxeViolations(fixture.nativeElement);
  });
});

@Component({
  imports: [BrkHeaderComponent],
  template: `
    <brk-header navLabel="Account settings">
      <div brkHeaderBrand><span>Acme</span></div>
      <a href="/profile" class="is-active">Profile</a>
      <a href="/billing">Billing</a>
    </brk-header>
  `,
})
class ActiveClassHostComponent {}

describe('BrkHeaderComponent active link via class', () => {
  it('recognises routerLinkActive-style is-active as the current link', async () => {
    // The component supports both aria-current and a plain class, since
    // Angular Router's routerLinkActive only applies the latter.
    const fixture = TestBed.createComponent(ActiveClassHostComponent);
    fixture.detectChanges();
    const harness =
      await TestbedHarnessEnvironment.loader(fixture).getHarness(
        BrkHeaderHarness,
      );
    expect(await harness.getActiveNavLinkLabel()).toBe('Profile');
  });

  it('applies a custom nav label', () => {
    const fixture = TestBed.createComponent(ActiveClassHostComponent);
    fixture.detectChanges();
    const nav: HTMLElement = fixture.nativeElement.querySelector('nav');
    expect(nav.getAttribute('aria-label')).toBe('Account settings');
  });
});
