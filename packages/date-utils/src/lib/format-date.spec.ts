import { describe, expect, it } from 'vitest';
import { formatDate, parseDate } from './format-date';
import { DATE_FORMATS } from './formats';

describe('formatDate', () => {
  it('formats a date using the default display format', () => {
    expect(formatDate('2026-03-05')).toBe('Mar 5, 2026');
  });

  it('formats a date using an explicit format', () => {
    expect(formatDate('2026-03-05', DATE_FORMATS.ISO_DATE)).toBe('2026-03-05');
  });

  it('returns an empty string for invalid input', () => {
    expect(formatDate('not-a-date')).toBe('');
  });
});

describe('parseDate', () => {
  it('parses a string against an explicit format', () => {
    const result = parseDate('03/05/2026', 'MM/DD/YYYY');
    expect(result?.getFullYear()).toBe(2026);
    expect(result?.getMonth()).toBe(2);
    expect(result?.getDate()).toBe(5);
  });

  it('returns null for invalid input', () => {
    expect(parseDate('not-a-date')).toBeNull();
  });
});
