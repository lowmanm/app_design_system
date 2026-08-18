import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  model,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  BrkSelectComponent,
  BrkOptionDirective,
} from '@app-design-system/select';
import { BrkIconComponent } from '@app-design-system/icon';

export interface BrkPageEvent {
  pageIndex: number;
  pageSize: number;
  length: number;
}

/**
 * Page-size control, prev/next, and a range indicator - bundled inside
 * `table` rather than shipped as its own package, since neither CDK nor
 * Material ships a headless paginator primitive to build on and this is
 * the only component in the phase genuinely paired one-to-one with
 * `brkTable` (unlike, say, `brk-select`, which table also uses but which
 * is independently useful on its own). If a second use for it emerges
 * later, extracting it to its own package is a mechanical move.
 *
 * Client-side and server-driven paging share the same contract: this
 * component only reports intent via `page` (and the two-way
 * `pageIndex`/`pageSize`) - it never slices `length` items out of anything
 * itself, the same "reports state, doesn't own data" split `BrkSortDirective`
 * uses.
 *
 * ```html
 * <brk-paginator [length]="rows.length" [(pageIndex)]="pageIndex" [(pageSize)]="pageSize" (page)="onPage($event)" />
 * ```
 */
@Component({
  selector: 'brk-paginator',
  imports: [
    FormsModule,
    BrkSelectComponent,
    BrkOptionDirective,
    BrkIconComponent,
  ],
  template: `
    <div class="brk-paginator__size">
      <span class="brk-paginator__size-label">Rows per page</span>
      <brk-select
        ariaLabel="Rows per page"
        [ngModel]="pageSize()"
        (ngModelChange)="_onPageSizeChange($event)"
      >
        @for (size of pageSizeOptions(); track size) {
          <div brkOption [value]="size">{{ size }}</div>
        }
      </brk-select>
    </div>

    <span class="brk-paginator__range">{{ _rangeLabel() }}</span>

    <div class="brk-paginator__nav">
      <button
        type="button"
        class="brk-paginator__nav-button"
        aria-label="Previous page"
        [disabled]="!hasPreviousPage()"
        (click)="previousPage()"
      >
        <brk-icon name="chevron_left" size="sm" />
      </button>
      <button
        type="button"
        class="brk-paginator__nav-button"
        aria-label="Next page"
        [disabled]="!hasNextPage()"
        (click)="nextPage()"
      >
        <brk-icon name="chevron_right" size="sm" />
      </button>
    </div>
  `,
  styleUrl: './paginator.css',
  host: { class: 'brk-paginator' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrkPaginatorComponent {
  readonly length = input.required<number>();
  readonly pageSizeOptions = input<readonly number[]>([5, 10, 25, 50]);

  readonly pageSize = model(10);
  readonly pageIndex = model(0);

  readonly page = output<BrkPageEvent>();

  protected readonly _pageCount = computed(() =>
    Math.max(1, Math.ceil(this.length() / this.pageSize())),
  );

  protected readonly _rangeLabel = computed(() => {
    const length = this.length();
    if (length === 0) {
      return '0 of 0';
    }
    const start = this.pageIndex() * this.pageSize() + 1;
    const end = Math.min(start + this.pageSize() - 1, length);
    return `${start}–${end} of ${length}`;
  });

  constructor() {
    // If `length` shrinks (e.g. a filter narrows the row set) the current
    // page can land past the new last page - land on the new last page
    // instead of showing an empty one.
    effect(() => {
      const maxIndex = this._pageCount() - 1;
      if (this.pageIndex() > maxIndex) {
        this.pageIndex.set(maxIndex);
      }
    });
  }

  hasPreviousPage(): boolean {
    return this.pageIndex() > 0;
  }

  hasNextPage(): boolean {
    return this.pageIndex() < this._pageCount() - 1;
  }

  previousPage(): void {
    if (!this.hasPreviousPage()) {
      return;
    }
    this.pageIndex.set(this.pageIndex() - 1);
    this._emit();
  }

  nextPage(): void {
    if (!this.hasNextPage()) {
      return;
    }
    this.pageIndex.set(this.pageIndex() + 1);
    this._emit();
  }

  protected _onPageSizeChange(size: number): void {
    this.pageSize.set(size);
    this.pageIndex.set(0);
    this._emit();
  }

  private _emit(): void {
    this.page.emit({
      pageIndex: this.pageIndex(),
      pageSize: this.pageSize(),
      length: this.length(),
    });
  }
}
