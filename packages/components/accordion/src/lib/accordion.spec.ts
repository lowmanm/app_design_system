import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '@app-design-system/core/testing';
import { BrkAccordionComponent } from './accordion';
import { BrkAccordionItemComponent } from './accordion-item';
import { BrkAccordionHarness } from './accordion.harness';

@Component({
  imports: [BrkAccordionComponent, BrkAccordionItemComponent],
  template: `
    <brk-accordion [multi]="multi()">
      <brk-accordion-item header="What's included?">
        Everything in the Pro plan, plus priority support.
      </brk-accordion-item>
      <brk-accordion-item header="Can I cancel anytime?">
        Yes, from your billing settings.
      </brk-accordion-item>
    </brk-accordion>
  `,
})
class HostComponent {
  readonly multi = signal(false);
}

async function setup() {
  const fixture = TestBed.createComponent(HostComponent);
  fixture.detectChanges();
  const harness = await TestbedHarnessEnvironment.loader(fixture).getHarness(
    BrkAccordionHarness,
  );
  const items = await harness.getItems();
  return { fixture, harness, items, host: fixture.componentInstance };
}

describe('BrkAccordionComponent', () => {
  it('starts with every item collapsed', async () => {
    const { items } = await setup();
    expect(await items[0]!.isExpanded()).toBe(false);
    expect(await items[1]!.isExpanded()).toBe(false);
  });

  it('expands an item on click and reveals its panel text', async () => {
    const { fixture, items } = await setup();
    await items[0]!.toggle();
    fixture.detectChanges();

    expect(await items[0]!.isExpanded()).toBe(true);
    expect(await items[0]!.getPanelText()).toContain(
      'Everything in the Pro plan',
    );
  });

  it('collapses an open item on a second click', async () => {
    const { fixture, items } = await setup();
    await items[0]!.toggle();
    fixture.detectChanges();
    await items[0]!.toggle();
    fixture.detectChanges();

    expect(await items[0]!.isExpanded()).toBe(false);
  });

  it('single-open mode: opening one item closes the previously open one', async () => {
    const { fixture, items } = await setup();
    await items[0]!.toggle();
    fixture.detectChanges();
    await items[1]!.toggle();
    fixture.detectChanges();

    expect(await items[0]!.isExpanded()).toBe(false);
    expect(await items[1]!.isExpanded()).toBe(true);
  });

  it('multi mode: opening one item leaves others open', async () => {
    const { fixture, items, host } = await setup();
    host.multi.set(true);
    fixture.detectChanges();

    await items[0]!.toggle();
    fixture.detectChanges();
    await items[1]!.toggle();
    fixture.detectChanges();

    expect(await items[0]!.isExpanded()).toBe(true);
    expect(await items[1]!.isExpanded()).toBe(true);
  });

  it('has no accessibility violations either collapsed or expanded', async () => {
    const { fixture, items } = await setup();
    await expectNoAxeViolations(fixture.nativeElement);

    await items[0]!.toggle();
    fixture.detectChanges();
    await expectNoAxeViolations(fixture.nativeElement);
  });
});
