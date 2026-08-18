import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '@app-design-system/core/testing';
import { BrkTabsComponent } from './tabs';
import { BrkTabComponent } from './tab';
import { BrkTabsHarness } from './tabs.harness';

@Component({
  imports: [BrkTabsComponent, BrkTabComponent],
  template: `
    <brk-tabs ariaLabel="Account settings">
      <brk-tab label="Profile">Profile form.</brk-tab>
      <brk-tab label="Billing" disabled>Billing form.</brk-tab>
      <brk-tab label="Security">Security form.</brk-tab>
    </brk-tabs>
  `,
})
class HostComponent {}

// CDK-style keydown helper isn't needed here - BrkTabsComponent's own
// _onKeydown reads event.key directly, not CDK's ListKeyManager, so the
// keyCode patch other specs need doesn't apply.
function press(el: HTMLElement, key: string): void {
  el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
}

async function setup() {
  const fixture = TestBed.createComponent(HostComponent);
  fixture.detectChanges();
  const harness =
    await TestbedHarnessEnvironment.loader(fixture).getHarness(BrkTabsHarness);
  return { fixture, harness };
}

describe('BrkTabsComponent', () => {
  it('selects the first tab by default and shows its panel', async () => {
    const { harness } = await setup();
    expect(await harness.getTabLabels()).toEqual([
      'Profile',
      'Billing',
      'Security',
    ]);
    expect(await harness.getSelectedLabel()).toBe('Profile');
    expect(await harness.getVisiblePanelText()).toBe('Profile form.');
  });

  it('selects a tab by click and shows only its panel', async () => {
    const { fixture, harness } = await setup();
    await harness.selectTabByLabel('Security');
    fixture.detectChanges();

    expect(await harness.getSelectedLabel()).toBe('Security');
    expect(await harness.getVisiblePanelText()).toBe('Security form.');
  });

  it('does not select a disabled tab by click', async () => {
    const { fixture, harness } = await setup();
    await harness.selectTabByLabel('Billing');
    fixture.detectChanges();

    expect(await harness.getSelectedLabel()).toBe('Profile');
  });

  it('moves selection with arrow keys, skipping the disabled tab, and wraps', async () => {
    const { fixture, harness } = await setup();
    const tablist = fixture.nativeElement.querySelector('[role="tablist"]');

    press(tablist, 'ArrowRight'); // Profile -> Billing is disabled, skip -> Security
    fixture.detectChanges();
    expect(await harness.getSelectedLabel()).toBe('Security');

    press(tablist, 'ArrowRight'); // wraps: Security -> Profile
    fixture.detectChanges();
    expect(await harness.getSelectedLabel()).toBe('Profile');

    press(tablist, 'ArrowLeft'); // wraps the other way: Profile -> Security
    fixture.detectChanges();
    expect(await harness.getSelectedLabel()).toBe('Security');
  });

  it('Home/End jump to the first/last enabled tab', async () => {
    const { fixture, harness } = await setup();
    const tablist = fixture.nativeElement.querySelector('[role="tablist"]');

    press(tablist, 'End');
    fixture.detectChanges();
    expect(await harness.getSelectedLabel()).toBe('Security');

    press(tablist, 'Home');
    fixture.detectChanges();
    expect(await harness.getSelectedLabel()).toBe('Profile');
  });

  it('marks only the selected tab reachable by Tab key (roving tabindex)', async () => {
    const { fixture } = await setup();
    const buttons = [
      ...fixture.nativeElement.querySelectorAll('.brk-tabs__tab'),
    ] as HTMLButtonElement[];
    expect(buttons.map((b) => b.tabIndex)).toEqual([0, -1, -1]);
  });

  it('has no accessibility violations', async () => {
    const { fixture } = await setup();
    await expectNoAxeViolations(fixture.nativeElement);
  });
});
