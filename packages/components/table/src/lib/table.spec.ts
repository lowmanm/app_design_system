import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import {
  CdkCell,
  CdkCellDef,
  CdkColumnDef,
  CdkHeaderCell,
  CdkHeaderCellDef,
  CdkHeaderRow,
  CdkHeaderRowDef,
  CdkRow,
  CdkRowDef,
} from '@angular/cdk/table';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '@app-design-system/core/testing';
import { BrkTableComponent } from './table';
import { BrkSortDirective, type BrkSortState } from './sort.directive';
import { BrkSortHeaderDirective } from './sort-header.directive';
import { BrkTableHarness } from './table.harness';

interface Row {
  name: string;
  age: number;
}

@Component({
  imports: [
    BrkTableComponent,
    BrkSortDirective,
    BrkSortHeaderDirective,
    CdkColumnDef,
    CdkHeaderCellDef,
    CdkCellDef,
    CdkHeaderCell,
    CdkCell,
    CdkHeaderRowDef,
    CdkRowDef,
    CdkHeaderRow,
    CdkRow,
  ],
  template: `
    <table
      brkTable
      brkSort
      (sortChange)="lastSort = $event"
      [dataSource]="rows()"
    >
      <ng-container cdkColumnDef="name">
        <th cdk-header-cell *cdkHeaderCellDef brkSortHeader="name">Name</th>
        <td cdk-cell *cdkCellDef="let row">{{ row.name }}</td>
      </ng-container>
      <ng-container cdkColumnDef="age">
        <th cdk-header-cell *cdkHeaderCellDef brkSortHeader="age">Age</th>
        <td cdk-cell *cdkCellDef="let row">{{ row.age }}</td>
      </ng-container>

      <tr cdk-header-row *cdkHeaderRowDef="columns"></tr>
      <tr cdk-row *cdkRowDef="let row; columns: columns"></tr>
    </table>
  `,
})
class HostComponent {
  readonly columns = ['name', 'age'];
  readonly rows = signal<Row[]>([
    { name: 'Ada', age: 36 },
    { name: 'Grace', age: 85 },
  ]);
  lastSort?: BrkSortState;
}

async function setup() {
  const fixture = TestBed.createComponent(HostComponent);
  fixture.detectChanges();
  const harness =
    await TestbedHarnessEnvironment.loader(fixture).getHarness(BrkTableHarness);
  return { fixture, harness, host: fixture.componentInstance };
}

describe('BrkTableComponent', () => {
  it('renders header and row cells from dataSource', async () => {
    const { harness } = await setup();

    expect(await harness.getHeaderRowText()).toEqual(['Name', 'Age']);
    expect(await harness.getRowCount()).toBe(2);
    expect(await harness.getRowText(0)).toEqual(['Ada', '36']);
    expect(await harness.getRowText(1)).toEqual(['Grace', '85']);
  });

  it('has no accessibility violations', async () => {
    const { fixture } = await setup();
    await expectNoAxeViolations(fixture.nativeElement);
  });
});

describe('BrkSortDirective + BrkSortHeaderDirective', () => {
  it('cycles a header through ascending, descending, and unsorted', async () => {
    const { fixture, harness, host } = await setup();
    const nameHeader = await harness.getSortHeader('name');

    expect(await nameHeader.getAriaSort()).toBeNull();

    await nameHeader.click();
    fixture.detectChanges();
    expect(await nameHeader.getAriaSort()).toBe('ascending');
    expect(host.lastSort).toEqual({ active: 'name', direction: 'asc' });

    await nameHeader.click();
    fixture.detectChanges();
    expect(await nameHeader.getAriaSort()).toBe('descending');
    expect(host.lastSort).toEqual({ active: 'name', direction: 'desc' });

    await nameHeader.click();
    fixture.detectChanges();
    expect(await nameHeader.getAriaSort()).toBeNull();
    expect(host.lastSort).toEqual({ active: '', direction: '' });
  });

  it('switching to a different header starts it at ascending and clears the old one', async () => {
    const { fixture, harness } = await setup();
    const nameHeader = await harness.getSortHeader('name');
    const ageHeader = await harness.getSortHeader('age');

    await nameHeader.click();
    fixture.detectChanges();
    await ageHeader.click();
    fixture.detectChanges();

    expect(await nameHeader.getAriaSort()).toBeNull();
    expect(await ageHeader.getAriaSort()).toBe('ascending');
  });

  it('Enter and Space activate the header the same as a click', async () => {
    const { fixture, harness } = await setup();
    const ageHeader = await harness.getSortHeader('age');
    const headerElement: HTMLElement = fixture.nativeElement.querySelector(
      '[brksortheader="age"]',
    );

    headerElement.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
    );
    fixture.detectChanges();
    expect(await ageHeader.getAriaSort()).toBe('ascending');

    const spaceEvent = new KeyboardEvent('keydown', {
      key: ' ',
      bubbles: true,
      cancelable: true,
    });
    headerElement.dispatchEvent(spaceEvent);
    fixture.detectChanges();
    expect(await ageHeader.getAriaSort()).toBe('descending');
    expect(spaceEvent.defaultPrevented).toBe(true);
  });
});
