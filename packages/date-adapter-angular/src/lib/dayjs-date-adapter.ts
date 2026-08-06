import { Injectable, inject } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { dayjs, type Dayjs } from '@app-design-system/date-utils';
// Registers the `Dayjs.localeData()` type augmentation (used by
// getFirstDayOfWeek() below) directly in this compilation unit - dayjs
// plugin type augmentations don't reliably survive being re-exported
// through another package's own declaration build.
import 'dayjs/plugin/localeData';

/**
 * Adapts dayjs `Dayjs` objects for use with Angular Material's date-based
 * components (datepicker, etc). No official Angular Material date adapter
 * ships for dayjs - Angular Material only provides one for the native `Date`
 * object, with community adapters for Moment/Luxon/date-fns - so this
 * mirrors that pattern for dayjs, sharing its plugin configuration and
 * formats with `@app-design-system/date-utils` (see MAT_DAYJS_DATE_FORMATS).
 */
@Injectable()
export class DayjsDateAdapter extends DateAdapter<Dayjs> {
  private readonly matDateLocale = inject(MAT_DATE_LOCALE, {
    optional: true,
  }) as string | undefined;

  constructor() {
    super();
    this.setLocale(this.matDateLocale ?? dayjs.locale());
  }

  override getYear(date: Dayjs): number {
    return date.year();
  }

  override getMonth(date: Dayjs): number {
    return date.month();
  }

  override getDate(date: Dayjs): number {
    return date.date();
  }

  override getDayOfWeek(date: Dayjs): number {
    return date.day();
  }

  override getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
    const format =
      style === 'long' ? 'MMMM' : style === 'short' ? 'MMM' : 'MMM';
    const names = Array.from({ length: 12 }, (_, month) =>
      dayjs().locale(this.locale).month(month).format(format),
    );
    return style === 'narrow' ? names.map((name) => name.charAt(0)) : names;
  }

  override getDateNames(): string[] {
    return Array.from({ length: 31 }, (_, day) => String(day + 1));
  }

  override getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
    const format = style === 'long' ? 'dddd' : 'ddd';
    const names = Array.from({ length: 7 }, (_, day) =>
      dayjs().locale(this.locale).day(day).format(format),
    );
    return style === 'narrow' ? names.map((name) => name.charAt(0)) : names;
  }

  override getYearName(date: Dayjs): string {
    return date.format('YYYY');
  }

  override getFirstDayOfWeek(): number {
    return dayjs().locale(this.locale).localeData().firstDayOfWeek();
  }

  override getNumDaysInMonth(date: Dayjs): number {
    return date.daysInMonth();
  }

  override clone(date: Dayjs): Dayjs {
    return date.clone().locale(this.locale);
  }

  override createDate(year: number, month: number, date: number): Dayjs {
    const result = dayjs()
      .locale(this.locale)
      .year(year)
      .month(month)
      .date(date);
    if (result.month() !== ((month % 12) + 12) % 12) {
      // dayjs, like the native Date object, rolls over-flowing days/months
      // into the next month rather than rejecting them - Angular Material
      // expects createDate() to signal that with an invalid date instead.
      return this.invalid();
    }
    return result;
  }

  override today(): Dayjs {
    return dayjs().locale(this.locale);
  }

  override parse(value: unknown, parseFormat: string | string[]): Dayjs | null {
    if (value == null || value === '') {
      return null;
    }
    if (typeof value === 'string' && value.trim().length > 0) {
      return dayjs(value, parseFormat, this.locale, true);
    }
    return dayjs(value as dayjs.ConfigType).locale(this.locale);
  }

  override format(date: Dayjs, displayFormat: string): string {
    if (!this.isValid(date)) {
      throw Error('DayjsDateAdapter: Cannot format invalid date.');
    }
    return date.locale(this.locale).format(displayFormat);
  }

  override addCalendarYears(date: Dayjs, years: number): Dayjs {
    return date.add(years, 'year');
  }

  override addCalendarMonths(date: Dayjs, months: number): Dayjs {
    return date.add(months, 'month');
  }

  override addCalendarDays(date: Dayjs, days: number): Dayjs {
    return date.add(days, 'day');
  }

  override toIso8601(date: Dayjs): string {
    return date.toISOString();
  }

  override isDateInstance(obj: unknown): boolean {
    return dayjs.isDayjs(obj);
  }

  override isValid(date: Dayjs): boolean {
    return date.isValid();
  }

  override invalid(): Dayjs {
    return dayjs(NaN);
  }

  override deserialize(value: unknown): Dayjs | null {
    if (typeof value === 'string' && value.length > 0) {
      const parsed = dayjs(value);
      if (this.isValid(parsed)) {
        return parsed;
      }
    }
    return super.deserialize(value);
  }
}
