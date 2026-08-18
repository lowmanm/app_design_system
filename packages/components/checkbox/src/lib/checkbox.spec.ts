import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '@app-design-system/core/testing';
import { BrkCheckboxComponent } from './checkbox';
import { BrkCheckboxHarness } from './checkbox.harness';

@Component({
  imports: [BrkCheckboxComponent, FormsModule],
  template: `
    <label>
      <input
        type="checkbox"
        brkCheckbox
        [size]="size()"
        [checked]="checked()"
        [indeterminate]="indeterminate()"
        [disabled]="disabled()"
        (change)="checked.set($any($event.target).checked)"
      />
      Accept terms
    </label>
  `,
})
class HostComponent {
  readonly size = signal<'sm' | 'md' | 'lg'>('md');
  readonly checked = signal(false);
  readonly indeterminate = signal(false);
  readonly disabled = signal(false);
}

// `.loader(fixture).getHarness(...)`, not `.harnessForFixture(...)` - the
// latter treats the fixture root as the harness host, which is only correct
// when the fixture was created for the harnessed component directly. Here
// the root is a wrapping test host.
async function setup() {
  const fixture = TestBed.createComponent(HostComponent);
  fixture.detectChanges();
  const harness =
    await TestbedHarnessEnvironment.loader(fixture).getHarness(
      BrkCheckboxHarness,
    );
  return { fixture, harness, host: fixture.componentInstance };
}

describe('BrkCheckboxComponent (native input[brkCheckbox])', () => {
  it('reflects the checked property a plain binding sets', async () => {
    const { fixture, harness, host } = await setup();
    expect(await harness.isChecked()).toBe(false);

    host.checked.set(true);
    fixture.detectChanges();
    expect(await harness.isChecked()).toBe(true);
  });

  it('reflects indeterminate, which has no HTML attribute reflection', async () => {
    const { fixture, harness, host } = await setup();
    host.indeterminate.set(true);
    fixture.detectChanges();
    expect(await harness.isIndeterminate()).toBe(true);
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

    host.size.set('lg');
    fixture.detectChanges();
    expect(await harness.getSize()).toBe('lg');
  });

  it('toggles via native click, with no directive-side state of its own', async () => {
    const { fixture, harness, host } = await setup();
    await harness.toggle();
    fixture.detectChanges();
    expect(host.checked()).toBe(true);
    expect(await harness.isChecked()).toBe(true);
  });

  it('participates in ngModel via Angular’s own CheckboxControlValueAccessor', async () => {
    @Component({
      imports: [BrkCheckboxComponent, FormsModule],
      template: `<label
        ><input type="checkbox" brkCheckbox [(ngModel)]="agreed" />
        Accept</label
      >`,
    })
    class NgModelHost {
      agreed = false;
    }

    const fixture = TestBed.createComponent(NgModelHost);
    fixture.detectChanges();
    const harness =
      await TestbedHarnessEnvironment.loader(fixture).getHarness(
        BrkCheckboxHarness,
      );

    await harness.toggle();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.componentInstance.agreed).toBe(true);
  });

  it('has no accessibility violations when labelled', async () => {
    const { fixture } = await setup();
    await expectNoAxeViolations(fixture.nativeElement);
  });
});
