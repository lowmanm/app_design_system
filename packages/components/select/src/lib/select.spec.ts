import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { afterEach, describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '@app-design-system/core/testing';
import { BrkSelectComponent } from './select';
import { BrkOptionDirective } from './option.directive';
import { BrkSelectHarness } from './select.harness';

@Component({
  imports: [BrkSelectComponent, BrkOptionDirective, FormsModule],
  template: `
    <brk-select
      placeholder="Choose a country"
      ariaLabel="Country"
      [(ngModel)]="country"
      [disabled]="disabled()"
    >
      <div brkOption value="us">United States</div>
      <div brkOption value="ca">Canada</div>
      <div brkOption value="mx" disabled>Mexico (unavailable)</div>
    </brk-select>
  `,
})
class HostComponent {
  country: string | undefined;
  readonly disabled = signal(false);
}

// CDK's ListKeyManager (the base ActiveDescendantKeyManager extends) reads
// `event.keyCode`, which a synthetically constructed KeyboardEvent leaves
// at 0 - see the identical helper in menu-advanced.spec.ts.
const KEY_CODES: Record<string, number> = {
  Escape: 27,
  Enter: 13,
  ArrowUp: 38,
  ArrowDown: 40,
};

function press(el: HTMLElement, key: string): void {
  const event = new KeyboardEvent('keydown', { key, bubbles: true });
  Object.defineProperty(event, 'keyCode', { get: () => KEY_CODES[key] ?? 0 });
  el.dispatchEvent(event);
}

async function setup() {
  const fixture = TestBed.createComponent(HostComponent);
  fixture.detectChanges();
  const harness =
    await TestbedHarnessEnvironment.loader(fixture).getHarness(
      BrkSelectHarness,
    );
  return { fixture, harness, host: fixture.componentInstance };
}

// The open panel is moved into CDK Overlay's pane, appended to
// document.body - outside the fixture's own DOM subtree - so every test
// that opens the select must clean that up itself, or it leaks into the
// next test.
afterEach(() => {
  document
    .querySelectorAll('.cdk-overlay-container')
    .forEach((el) => el.remove());
});

describe('BrkSelectComponent', () => {
  it('shows the placeholder when nothing is selected', async () => {
    const { harness } = await setup();
    expect(await harness.getDisplayedText()).toBe('Choose a country');
  });

  it('shows the selected option’s label when a value arrives via ngModel', async () => {
    const { fixture, harness, host } = await setup();
    host.country = 'ca';
    fixture.detectChanges();
    // NgModel.ngOnChanges defers the actual writeValue() push (to avoid an
    // ExpressionChangedAfterItHasBeenCheckedError from the value changing
    // as a result of change detection itself) past whatever a manual
    // detectChanges()/whenStable() reliably observes in this test
    // environment - but a real dispatched DOM event does, because it goes
    // through zone.js's normal event-then-stabilize pathway, the same one
    // that would flush it in a real browser between renders anyway. open()
    // dispatches a real click, so it doubles as that flush here - same
    // reasoning the "aria-selected" test below relies on already.
    await harness.open();
    expect(await harness.getDisplayedText()).toBe('Canada');
  });

  it('opens on click and closes on Escape', async () => {
    const { fixture, harness } = await setup();
    await harness.open();
    expect(await harness.isOpen()).toBe(true);

    press(fixture.nativeElement.querySelector('brk-select')!, 'Escape');
    fixture.detectChanges();
    expect(await harness.isOpen()).toBe(false);
  });

  it('selects an option by click, updating the model and closing', async () => {
    const { fixture, harness, host } = await setup();
    await harness.selectOptionByText('Canada');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(host.country).toBe('ca');
    expect(await harness.isOpen()).toBe(false);
    expect(await harness.getDisplayedText()).toBe('Canada');
  });

  it('marks the selected option aria-selected', async () => {
    const { fixture, harness, host } = await setup();
    host.country = 'us';
    fixture.detectChanges();
    await harness.open();

    const options = await harness.getOptions();
    expect(await options[0]!.isSelected()).toBe(true);
    expect(await options[1]!.isSelected()).toBe(false);
  });

  it('moves the active descendant with arrow keys and commits with Enter, skipping the disabled option', async () => {
    const { fixture, harness } = await setup();
    await harness.open();
    const hostEl: HTMLElement =
      fixture.nativeElement.querySelector('brk-select');

    // open() already activates the first option (United States) per the
    // ARIA APG select-only combobox pattern, before any key is pressed.
    press(hostEl, 'ArrowDown'); // United States -> Canada
    press(hostEl, 'ArrowDown'); // Canada -> Mexico is disabled, skipped -> wraps to United States
    fixture.detectChanges();

    press(hostEl, 'Enter');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(await harness.getDisplayedText()).toBe('United States');
  });

  it('does not open when disabled', async () => {
    const { fixture, harness, host } = await setup();
    host.disabled.set(true);
    fixture.detectChanges();

    expect(await harness.isDisabled()).toBe(true);
    await harness.open();
    expect(await harness.isOpen()).toBe(false);
  });

  it('has no accessibility violations closed or open', async () => {
    const { fixture, harness } = await setup();
    await expectNoAxeViolations(fixture.nativeElement);

    // The open panel lives in the CDK overlay container, appended to
    // document.body - outside fixture.nativeElement - so it needs its own
    // check against the wider document.
    await harness.open();
    await expectNoAxeViolations(document.body);
  });
});
