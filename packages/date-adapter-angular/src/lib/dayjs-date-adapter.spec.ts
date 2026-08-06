import { TestBed } from '@angular/core/testing';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { describe, expect, it, beforeEach } from 'vitest';
import { DayjsDateAdapter } from './dayjs-date-adapter';

describe('DayjsDateAdapter', () => {
  let adapter: DayjsDateAdapter;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DayjsDateAdapter,
        { provide: MAT_DATE_LOCALE, useValue: 'en' },
      ],
    });
    adapter = TestBed.inject(DayjsDateAdapter);
  });

  it('extracts year/month/date components', () => {
    const date = adapter.createDate(2026, 2, 15); // March 15, 2026 (0-indexed month)
    expect(adapter.getYear(date)).toBe(2026);
    expect(adapter.getMonth(date)).toBe(2);
    expect(adapter.getDate(date)).toBe(15);
  });

  it('rejects overflowing day-of-month as an invalid date', () => {
    const date = adapter.createDate(2026, 1, 30); // Feb 30 doesn't exist
    expect(adapter.isValid(date)).toBe(false);
  });

  it('adds calendar years/months/days', () => {
    const date = adapter.createDate(2026, 0, 31);
    expect(adapter.getMonth(adapter.addCalendarMonths(date, 1))).toBe(1);
    expect(adapter.getYear(adapter.addCalendarYears(date, 1))).toBe(2027);
    expect(adapter.getDate(adapter.addCalendarDays(date, 1))).toBe(1);
  });

  it('parses using an explicit format', () => {
    const date = adapter.parse('03/15/2026', 'MM/DD/YYYY');
    expect(date).not.toBeNull();
    expect(date && adapter.getYear(date)).toBe(2026);
    expect(date && adapter.getMonth(date)).toBe(2);
    expect(date && adapter.getDate(date)).toBe(15);
  });

  it('formats a date', () => {
    const date = adapter.createDate(2026, 2, 15);
    expect(adapter.format(date, 'YYYY-MM-DD')).toBe('2026-03-15');
  });

  it('throws when formatting an invalid date', () => {
    expect(() => adapter.format(adapter.invalid(), 'YYYY-MM-DD')).toThrow();
  });

  it('serializes as a calendar date, not a UTC timestamp', () => {
    // Matches Angular Material's own DateAdapter contract, which returns
    // YYYY-MM-DD. A full timestamp would be converted to UTC, so a date
    // picked as the 15th in a negative-offset timezone would serialize as
    // the 14th and read back as the wrong day.
    const date = adapter.createDate(2026, 2, 15);
    expect(adapter.toIso8601(date)).toBe('2026-03-15');
  });

  it('round-trips through deserialize without shifting the day', () => {
    const date = adapter.createDate(2026, 0, 1);
    const restored = adapter.deserialize(adapter.toIso8601(date));
    expect(restored).not.toBeNull();
    expect(adapter.getYear(restored!)).toBe(2026);
    expect(adapter.getMonth(restored!)).toBe(0);
    expect(adapter.getDate(restored!)).toBe(1);
  });

  it('recognizes dayjs instances via isDateInstance', () => {
    expect(adapter.isDateInstance(adapter.today())).toBe(true);
    expect(adapter.isDateInstance('2026-03-15')).toBe(false);
  });
});
