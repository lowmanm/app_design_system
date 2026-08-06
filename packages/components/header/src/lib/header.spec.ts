import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { describe, expect, it } from 'vitest';
import { BrkHeaderComponent } from './header';
import { BrkHeaderHarness } from './header.harness';

@Component({
  standalone: true,
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
});
