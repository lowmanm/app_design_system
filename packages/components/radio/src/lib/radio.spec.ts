import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '@app-design-system/core/testing';
import { BrkRadioComponent } from './radio';
import { BrkRadioHarness } from './radio.harness';
import { BrkRadioGroupComponent } from './radio-group';
import { BrkRadioGroupHarness } from './radio-group.harness';

@Component({
  imports: [BrkRadioComponent, BrkRadioGroupComponent, FormsModule],
  template: `
    <brk-radio-group label="Billing plan">
      <label
        ><input
          type="radio"
          brkRadio
          [size]="size()"
          value="free"
          [(ngModel)]="plan"
        />
        Free</label
      >
      <label
        ><input type="radio" brkRadio value="pro" [(ngModel)]="plan" />
        Pro</label
      >
    </brk-radio-group>
  `,
})
class HostComponent {
  readonly size = signal<'sm' | 'md' | 'lg'>('md');
  plan = 'free';
}

async function setup() {
  const fixture = TestBed.createComponent(HostComponent);
  fixture.detectChanges();
  const loader = TestbedHarnessEnvironment.loader(fixture);
  const group = await loader.getHarness(BrkRadioGroupHarness);
  const radios = await loader.getAllHarnesses(BrkRadioHarness);
  return { fixture, group, radios, host: fixture.componentInstance };
}

describe('BrkRadioGroupComponent + BrkRadioComponent', () => {
  it('renders a fieldset/legend with the group label', async () => {
    const { group } = await setup();
    expect(await group.getLegend()).toBe('Billing plan');
  });

  it('gives every radio in the group the same generated name', async () => {
    const { group, radios } = await setup();
    const groupName = await group.getName();
    expect(groupName).toMatch(/^brk-radio-group-\d+$/);
    for (const radio of radios) {
      expect(await radio.getName()).toBe(groupName);
    }
  });

  it('applies the size class to an individual radio', async () => {
    const { fixture, radios, host } = await setup();
    expect(await radios[0]!.getSize()).toBe('md');

    host.size.set('lg');
    fixture.detectChanges();
    expect(await radios[0]!.getSize()).toBe('lg');
  });

  it('coordinates a single selection across the group via ngModel, using only Angular’s own RadioControlValueAccessor', async () => {
    const { fixture, radios, host } = await setup();
    expect(await radios[0]!.isChecked()).toBe(true);
    expect(await radios[1]!.isChecked()).toBe(false);

    await radios[1]!.select();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(host.plan).toBe('pro');
    expect(await radios[0]!.isChecked()).toBe(false);
    expect(await radios[1]!.isChecked()).toBe(true);
  });

  it('has no accessibility violations', async () => {
    const { fixture } = await setup();
    await expectNoAxeViolations(fixture.nativeElement);
  });
});
