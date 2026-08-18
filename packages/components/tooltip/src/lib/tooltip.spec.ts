import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '@app-design-system/core/testing';
import { BrkTooltipDirective } from './tooltip';
import { BrkTooltipHarness } from './tooltip.harness';

@Component({
  imports: [BrkTooltipDirective],
  template: `<button brkTooltip="Save changes">Save</button>`,
})
class HostComponent {}

/**
 * A real wait, not a fake-timers mock: `setTimeout` inside this directive
 * runs through zone.js the same way it does in a real browser, and this
 * codebase has already hit one saga (select's NgModel timing) from fighting
 * that instead of just waiting for it - a real ~600ms is a small cost for a
 * suite this size and sidesteps the whole question.
 */
function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function setup() {
  const fixture = TestBed.createComponent(HostComponent);
  fixture.detectChanges();
  const button: HTMLElement = fixture.nativeElement.querySelector('button');
  return { fixture, button };
}

async function getTooltip(
  fixture: ReturnType<typeof TestBed.createComponent>,
): Promise<BrkTooltipHarness | null> {
  return TestbedHarnessEnvironment.documentRootLoader(fixture).getHarnessOrNull(
    BrkTooltipHarness,
  );
}

describe('BrkTooltipDirective', () => {
  it('is absent until the trigger is hovered', async () => {
    const { fixture } = await setup();
    expect(await getTooltip(fixture)).toBeNull();
  });

  it('shows on hover after a delay, and hides on mouseleave', async () => {
    const { fixture, button } = await setup();

    button.dispatchEvent(new Event('mouseenter'));
    expect(await getTooltip(fixture)).toBeNull(); // delay hasn't elapsed yet
    await wait(600);

    const tooltip = await getTooltip(fixture);
    expect(await tooltip!.getText()).toBe('Save changes');

    button.dispatchEvent(new Event('mouseleave'));
    expect(await getTooltip(fixture)).toBeNull();
  });

  it('shows on focus too, not just hover', async () => {
    const { fixture, button } = await setup();

    button.dispatchEvent(new Event('focus'));
    await wait(600);

    expect(await getTooltip(fixture)).not.toBeNull();

    button.dispatchEvent(new Event('blur'));
    expect(await getTooltip(fixture)).toBeNull();
  });

  it('dismisses on Escape without waiting for blur', async () => {
    const { fixture, button } = await setup();

    button.dispatchEvent(new Event('focus'));
    await wait(600);
    expect(await getTooltip(fixture)).not.toBeNull();

    button.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    expect(await getTooltip(fixture)).toBeNull();
  });

  it('links the trigger to the panel via aria-describedby only while visible', async () => {
    const { fixture, button } = await setup();

    expect(button.getAttribute('aria-describedby')).toBeNull();

    button.dispatchEvent(new Event('focus'));
    await wait(600);

    const tooltip = await getTooltip(fixture);
    const panelId = await (await tooltip!.host()).getAttribute('id');
    expect(button.getAttribute('aria-describedby')).toBe(panelId);

    button.dispatchEvent(new Event('blur'));
    // The panel itself is removed synchronously (`overlayRef.dispose()`
    // inside `hide()`), but the host's own `aria-describedby` binding is an
    // Angular host binding - it only flushes to the DOM on the next change
    // detection pass, which a synchronous dispatchEvent doesn't force
    // mid-stack the way it does for a plain DOM removal.
    fixture.detectChanges();
    expect(button.getAttribute('aria-describedby')).toBeNull();
  });

  it('has no accessibility violations while visible', async () => {
    const { fixture, button } = await setup();

    button.dispatchEvent(new Event('focus'));
    await wait(600);

    await expectNoAxeViolations(document.body);

    button.dispatchEvent(new Event('blur'));
  });
});
