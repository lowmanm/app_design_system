import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { describe, expect, it } from 'vitest';
import { BrkCardComponent } from './card';
import { BrkCardHarness } from './card.harness';

@Component({
  standalone: true,
  imports: [BrkCardComponent],
  template: `
    <brk-card variant="outlined">
      <h3>Getting started</h3>
      <p>Install the tokens package first.</p>
      <div brkCardFooter>
        <a href="/guides">Read the guide</a>
      </div>
    </brk-card>
  `,
})
class HostComponent {}

@Component({
  standalone: true,
  imports: [BrkCardComponent],
  template: `
    <brk-card>
      <p>No footer here.</p>
    </brk-card>
  `,
})
class NoFooterHostComponent {}

describe('BrkCardComponent', () => {
  it('applies the variant class and defaults to elevated', () => {
    const fixture = TestBed.createComponent(NoFooterHostComponent);
    fixture.detectChanges();
    const card: HTMLElement = fixture.nativeElement.querySelector('brk-card');
    expect(card.classList.contains('brk-card--elevated')).toBe(true);
  });

  it('projects default content and an explicit variant', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const card: HTMLElement = fixture.nativeElement.querySelector('brk-card');
    expect(card.classList.contains('brk-card--outlined')).toBe(true);
    expect(card.textContent).toContain('Getting started');
    expect(card.textContent).toContain('Read the guide');
  });

  it('exposes its content and variant through BrkCardHarness', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    // `.loader(fixture).getHarness(...)` (not `.harnessForFixture(...)`) -
    // the latter treats the fixture's own root as the harness host, which
    // is only correct when the fixture was created directly for the
    // harnessed component. Here the fixture root is a wrapping test host,
    // so the harness must search its descendants for `.brk-card`.
    const harness = await TestbedHarnessEnvironment.loader(fixture).getHarness(BrkCardHarness);
    expect(await harness.getVariant()).toBe('outlined');
    expect(await harness.getText()).toContain('Getting started');
  });
});
