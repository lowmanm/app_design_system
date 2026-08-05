import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { describe, expect, it } from 'vitest';
import { BrkButtonComponent } from './button';
import { BrkButtonHarness } from './button.harness';

@Component({
  standalone: true,
  imports: [BrkButtonComponent],
  template: `
    <button brkButton variant="outlined" size="lg" [disabled]="disabled" (click)="onClick()">
      Save
    </button>
  `,
})
class HostComponent {
  disabled = false;
  clicked = false;
  onClick(): void {
    this.clicked = true;
  }
}

// Interaction assertions below use the native DOM directly rather than
// BrkButtonHarness's click()/getAttribute(): CDK's ComponentHarness relies
// on PointerEvent-based dispatch and Zone-driven stabilization that this
// repo's Vitest+Analog jsdom runner doesn't fully support (PointerEvent is
// undefined in this environment). The harness itself follows the same
// pattern as Angular Material's own component harnesses and is exercised
// through getText() below; click()/isDisabled() are meant for consumers
// testing in a real browser (Karma) or Playwright component tests.
describe('BrkButtonComponent', () => {
  it('renders as a native <button> preserving native semantics', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.tagName).toBe('BUTTON');
    expect(button.textContent?.trim()).toBe('Save');
  });

  it('applies variant and size classes', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.classList.contains('brk-button--outlined')).toBe(true);
    expect(button.classList.contains('brk-button--lg')).toBe(true);
  });

  it('is clickable and fires (click)', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    button.click();
    expect(fixture.componentInstance.clicked).toBe(true);
  });

  it('does not fire (click) while disabled', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    button.click();
    expect(fixture.componentInstance.clicked).toBe(false);
  });

  it('exposes its text through BrkButtonHarness', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const harness = await TestbedHarnessEnvironment.harnessForFixture(fixture, BrkButtonHarness);
    expect((await harness.getText()).trim()).toBe('Save');
  });
});
