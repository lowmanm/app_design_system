import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { describe, expect, it } from 'vitest';
import { BrkButtonComponent } from './button';
import { expectNoAxeViolations } from '@app-design-system/core/testing';
import { BrkButtonHarness } from './button.harness';

@Component({
  imports: [BrkButtonComponent],
  template: `
    <button
      brkButton
      variant="outlined"
      size="lg"
      [disabled]="disabled"
      (click)="onClick()"
    >
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
    const button: HTMLButtonElement =
      fixture.nativeElement.querySelector('button');
    expect(button.tagName).toBe('BUTTON');
    expect(button.textContent?.trim()).toBe('Save');
  });

  it('applies variant and size classes', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const button: HTMLButtonElement =
      fixture.nativeElement.querySelector('button');
    expect(button.classList.contains('brk-button--outlined')).toBe(true);
    expect(button.classList.contains('brk-button--lg')).toBe(true);
  });

  it('is clickable and fires (click)', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const button: HTMLButtonElement =
      fixture.nativeElement.querySelector('button');
    button.click();
    expect(fixture.componentInstance.clicked).toBe(true);
  });

  it('does not fire (click) while disabled', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();
    const button: HTMLButtonElement =
      fixture.nativeElement.querySelector('button');
    button.click();
    expect(fixture.componentInstance.clicked).toBe(false);
  });

  it('exposes its text through BrkButtonHarness', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    // `.loader(fixture).getHarness(...)` (not `.harnessForFixture(...)`) -
    // the latter treats the fixture's own root as the harness host, which
    // is only correct when the fixture was created directly for the
    // harnessed component. Here the fixture root is a wrapping test host,
    // so the harness must search its descendants for `.brk-button`.
    const harness =
      await TestbedHarnessEnvironment.loader(fixture).getHarness(
        BrkButtonHarness,
      );
    expect((await harness.getText()).trim()).toBe('Save');
  });
});

@Component({
  imports: [BrkButtonComponent],
  template: `
    <button brkButton variant="tonal">Preview</button>
    <button brkButton variant="danger">Delete</button>
  `,
})
class VariantsHostComponent {}

describe('BrkButtonComponent variants', () => {
  it('applies the tonal and danger variant classes', () => {
    const fixture = TestBed.createComponent(VariantsHostComponent);
    fixture.detectChanges();
    const [preview, danger] = fixture.nativeElement.querySelectorAll('button');
    expect(preview.classList.contains('brk-button--tonal')).toBe(true);
    expect(danger.classList.contains('brk-button--danger')).toBe(true);
  });
});

@Component({
  imports: [BrkButtonComponent],
  template: `<a brkButton variant="text" href="/help">Learn more</a>`,
})
class LinkHostComponent {}

describe('BrkButtonComponent as a link', () => {
  it('renders as a real anchor, keeping href and link semantics', () => {
    // Half of this component's selector is the `<a>` arm, which had no
    // coverage at all - a regression there would only surface in an app.
    const fixture = TestBed.createComponent(LinkHostComponent);
    fixture.detectChanges();
    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('a');
    expect(link.tagName).toBe('A');
    expect(link.getAttribute('href')).toBe('/help');
    expect(link.classList.contains('brk-button--text')).toBe(true);
  });

  it('has no accessibility violations', async () => {
    const fixture = TestBed.createComponent(LinkHostComponent);
    fixture.detectChanges();
    await expectNoAxeViolations(fixture.nativeElement);
  });
});

describe('BrkButtonComponent accessibility', () => {
  it('has no violations across every variant and size', async () => {
    const fixture = TestBed.createComponent(VariantsHostComponent);
    fixture.detectChanges();
    await expectNoAxeViolations(fixture.nativeElement);
  });
});
