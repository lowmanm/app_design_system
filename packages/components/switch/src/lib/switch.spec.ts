import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '@app-design-system/core/testing';
import { BrkSwitchComponent } from './switch';
import { BrkSwitchHarness } from './switch.harness';

@Component({
  imports: [BrkSwitchComponent, FormsModule],
  template: `
    <label>
      <input
        type="checkbox"
        brkSwitch
        [size]="size()"
        [checked]="on()"
        [disabled]="disabled()"
        (change)="on.set($any($event.target).checked)"
      />
      Email notifications
    </label>
  `,
})
class HostComponent {
  readonly size = signal<'sm' | 'md' | 'lg'>('md');
  readonly on = signal(false);
  readonly disabled = signal(false);
}

async function setup() {
  const fixture = TestBed.createComponent(HostComponent);
  fixture.detectChanges();
  const harness =
    await TestbedHarnessEnvironment.loader(fixture).getHarness(
      BrkSwitchHarness,
    );
  return { fixture, harness, host: fixture.componentInstance };
}

describe('BrkSwitchComponent (native input[brkSwitch])', () => {
  it('announces as a switch, not a checkbox', async () => {
    const { harness } = await setup();
    expect(await harness.getRole()).toBe('switch');
  });

  it('reflects the checked property a plain binding sets', async () => {
    const { fixture, harness, host } = await setup();
    expect(await harness.isOn()).toBe(false);

    host.on.set(true);
    fixture.detectChanges();
    expect(await harness.isOn()).toBe(true);
  });

  it('reflects disabled', async () => {
    const { fixture, harness, host } = await setup();
    host.disabled.set(true);
    fixture.detectChanges();
    expect(await harness.isDisabled()).toBe(true);
  });

  it('applies the size class', async () => {
    const { fixture, harness, host } = await setup();
    expect(await harness.getSize()).toBe('md');

    host.size.set('sm');
    fixture.detectChanges();
    expect(await harness.getSize()).toBe('sm');
  });

  it('toggles via native click, with no directive-side state of its own', async () => {
    const { fixture, harness, host } = await setup();
    await harness.toggle();
    fixture.detectChanges();
    expect(host.on()).toBe(true);
    expect(await harness.isOn()).toBe(true);
  });

  it('participates in ngModel via Angular’s own CheckboxControlValueAccessor', async () => {
    @Component({
      imports: [BrkSwitchComponent, FormsModule],
      template: `<label
        ><input type="checkbox" brkSwitch [(ngModel)]="enabled" />
        Notifications</label
      >`,
    })
    class NgModelHost {
      enabled = false;
    }

    const fixture = TestBed.createComponent(NgModelHost);
    fixture.detectChanges();
    const harness =
      await TestbedHarnessEnvironment.loader(fixture).getHarness(
        BrkSwitchHarness,
      );

    await harness.toggle();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.componentInstance.enabled).toBe(true);
  });

  it('has no accessibility violations when labelled', async () => {
    const { fixture } = await setup();
    await expectNoAxeViolations(fixture.nativeElement);
  });
});
