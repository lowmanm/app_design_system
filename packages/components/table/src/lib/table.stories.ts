import { Component, computed, signal } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
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
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrkCheckboxComponent } from '@app-design-system/checkbox';
import { BrkTableComponent } from './table';
import { BrkSortDirective, type BrkSortState } from './sort.directive';
import { BrkSortHeaderDirective } from './sort-header.directive';
import { BrkPaginatorComponent } from './paginator';

interface Person {
  name: string;
  role: string;
  team: string;
}

const PEOPLE: Person[] = [
  'Ada Lovelace/Engineer/Platform',
  'Grace Hopper/Engineer/Compilers',
  'Katherine Johnson/Analyst/Trajectory',
  'Margaret Hamilton/Engineer/Flight Software',
  'Radia Perlman/Engineer/Networking',
  'Barbara Liskov/Engineer/Languages',
  'Frances Allen/Researcher/Compilers',
  'Shafi Goldwasser/Researcher/Cryptography',
  'Adele Goldberg/Engineer/Languages',
  'Karen Sparck Jones/Researcher/Search',
  'Jean Bartik/Engineer/ENIAC',
  'Annie Easley/Engineer/Energy Systems',
].map((row) => {
  const [name, role, team] = row.split('/');
  return { name: name!, role: role!, team: team! };
});

@Component({
  selector: 'brk-story-table-demo',
  imports: [
    BrkTableComponent,
    BrkSortDirective,
    BrkSortHeaderDirective,
    BrkPaginatorComponent,
    BrkCheckboxComponent,
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
      (sortChange)="sort.set($event)"
      [dataSource]="visibleRows()"
      style="width: 100%"
    >
      <ng-container cdkColumnDef="select">
        <th cdk-header-cell *cdkHeaderCellDef>
          <input
            type="checkbox"
            brkCheckbox
            [checked]="allSelected()"
            (change)="toggleAll()"
            aria-label="Select all rows on this page"
          />
        </th>
        <td cdk-cell *cdkCellDef="let row">
          <input
            type="checkbox"
            brkCheckbox
            [checked]="selection.isSelected(row)"
            (change)="selection.toggle(row)"
            [attr.aria-label]="'Select ' + row.name"
          />
        </td>
      </ng-container>

      <ng-container cdkColumnDef="name">
        <th cdk-header-cell *cdkHeaderCellDef brkSortHeader="name">Name</th>
        <td cdk-cell *cdkCellDef="let row">{{ row.name }}</td>
      </ng-container>

      <ng-container cdkColumnDef="role">
        <th cdk-header-cell *cdkHeaderCellDef brkSortHeader="role">Role</th>
        <td cdk-cell *cdkCellDef="let row">{{ row.role }}</td>
      </ng-container>

      <ng-container cdkColumnDef="team">
        <th cdk-header-cell *cdkHeaderCellDef brkSortHeader="team">Team</th>
        <td cdk-cell *cdkCellDef="let row">{{ row.team }}</td>
      </ng-container>

      <tr cdk-header-row *cdkHeaderRowDef="columns"></tr>
      <tr
        cdk-row
        *cdkRowDef="let row; columns: columns"
        [class.brk-table__row--selected]="selection.isSelected(row)"
      ></tr>
    </table>

    <brk-paginator
      [length]="allRows.length"
      [(pageIndex)]="pageIndex"
      [(pageSize)]="pageSize"
    />
  `,
})
class StoryTableDemo {
  protected readonly columns = ['select', 'name', 'role', 'team'];
  protected readonly allRows = PEOPLE;
  protected readonly selection = new SelectionModel<Person>(true, []);

  protected readonly sort = signal<BrkSortState>({ active: '', direction: '' });
  protected readonly pageIndex = signal(0);
  protected readonly pageSize = signal(5);

  private readonly sortedRows = computed(() => {
    const { active, direction } = this.sort();
    if (!active || !direction) {
      return this.allRows;
    }
    const factor = direction === 'asc' ? 1 : -1;
    return [...this.allRows].sort(
      (a, b) =>
        factor *
        String(a[active as keyof Person]).localeCompare(
          String(b[active as keyof Person]),
        ),
    );
  });

  protected readonly visibleRows = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.sortedRows().slice(start, start + this.pageSize());
  });

  protected readonly allSelected = computed(() =>
    this.visibleRows().every((row) => this.selection.isSelected(row)),
  );

  protected toggleAll(): void {
    if (this.allSelected()) {
      this.selection.deselect(...this.visibleRows());
    } else {
      this.selection.select(...this.visibleRows());
    }
  }
}

const meta: Meta<StoryTableDemo> = {
  title: 'Components/Table',
  component: StoryTableDemo,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [StoryTableDemo],
    }),
  ],
};

export default meta;
type Story = StoryObj<StoryTableDemo>;

export const Default: Story = {
  name: 'Sortable, selectable, paginated',
};
