import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '@app-design-system/core/testing';
import { BrkPaginatorComponent, type BrkPageEvent } from './paginator';
import { BrkPaginatorHarness } from './paginator.harness';

@Component({
  imports: [BrkPaginatorComponent],
  template: `
    <brk-paginator
      [length]="length()"
      [(pageIndex)]="pageIndex"
      [(pageSize)]="pageSize"
      (page)="lastPage = $event"
    />
  `,
})
class HostComponent {
  readonly length = signal(95);
  // Signals, not plain fields: this workspace's zoneless test environment
  // only re-checks a binding across a *second* detectChanges() call when
  // the bound expression is itself reactive - a plain field mutated
  // directly (`host.pageIndex = 9`) never reaches the child, since nothing
  // marks the view dirty for it. `[(pageIndex)]="pageIndex"` binds
  // directly to the WritableSignal here (Angular's two-way sugar supports
  // that), so `host.pageIndex.set(...)` does propagate.
  readonly pageIndex = signal(0);
  readonly pageSize = signal(10);
  lastPage?: BrkPageEvent;
}

async function setup() {
  const fixture = TestBed.createComponent(HostComponent);
  fixture.detectChanges();
  const harness =
    await TestbedHarnessEnvironment.loader(fixture).getHarness(
      BrkPaginatorHarness,
    );
  return { fixture, harness, host: fixture.componentInstance };
}

describe('BrkPaginatorComponent', () => {
  it('shows the current range and disables Previous on the first page', async () => {
    const { harness } = await setup();

    expect(await harness.getRangeLabel()).toBe('1–10 of 95');
    expect(await harness.isPreviousDisabled()).toBe(true);
    expect(await harness.isNextDisabled()).toBe(false);
  });

  it('advances the page and reports it via pageIndex and page', async () => {
    const { fixture, harness, host } = await setup();

    await harness.nextPage();
    fixture.detectChanges();

    expect(host.pageIndex()).toBe(1);
    expect(await harness.getRangeLabel()).toBe('11–20 of 95');
    expect(host.lastPage).toEqual({ pageIndex: 1, pageSize: 10, length: 95 });
  });

  it('disables Next on the last page, including a short final page', async () => {
    const { fixture, harness, host } = await setup();
    host.pageIndex.set(9); // rows 91-95, five items on the last page
    fixture.detectChanges();

    expect(await harness.getRangeLabel()).toBe('91–95 of 95');
    expect(await harness.isNextDisabled()).toBe(true);
  });

  it('changing the page size resets to the first page', async () => {
    const { fixture, harness, host } = await setup();
    host.pageIndex.set(3);
    fixture.detectChanges();

    await harness.setPageSize('25');
    fixture.detectChanges();

    expect(host.pageIndex()).toBe(0);
    expect(host.pageSize()).toBe(25);
    expect(await harness.getRangeLabel()).toBe('1–25 of 95');
  });

  it('clamps pageIndex when length shrinks below the current page', async () => {
    const { fixture, host } = await setup();
    host.pageIndex.set(9); // last page of 95 rows at size 10
    fixture.detectChanges();

    host.length.set(15); // now only 2 pages
    fixture.detectChanges();

    expect(host.pageIndex()).toBe(1);
  });

  it('has no accessibility violations', async () => {
    const { fixture } = await setup();
    await expectNoAxeViolations(fixture.nativeElement);
  });
});
