import type { ConfigType } from 'dayjs';
import { dayjs } from './dayjs';
import { DATE_FORMATS } from './formats';

/** Formats any dayjs-parseable input using an org-standard format string. */
export function formatDate(
  input: ConfigType,
  format: string = DATE_FORMATS.DISPLAY_DATE,
): string {
  const parsed = dayjs(input);
  return parsed.isValid() ? parsed.format(format) : '';
}

/**
 * Parses a string against an explicit format (falls back to dayjs's normal
 * flexible parsing when no format is given). Returns `null` for invalid
 * input rather than an "Invalid Date" dayjs instance, so callers don't have
 * to remember to call `.isValid()` themselves.
 *
 * Parsing with an explicit format is *strict*: the input must match it
 * exactly. Without strict mode dayjs accepts nonsense like '03/45/2026' by
 * rolling the day over into the next month, which silently turns a typo into
 * a plausible-looking wrong date. This matches the Angular Material date
 * adapter in the sibling package, which has always parsed strictly - the two
 * previously disagreed.
 */
export function parseDate(input: string, format?: string): Date | null {
  const parsed = format ? dayjs(input, format, true) : dayjs(input);
  return parsed.isValid() ? parsed.toDate() : null;
}
