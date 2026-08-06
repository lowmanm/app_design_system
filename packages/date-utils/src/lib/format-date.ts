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
 */
export function parseDate(input: string, format?: string): Date | null {
  const parsed = format ? dayjs(input, format) : dayjs(input);
  return parsed.isValid() ? parsed.toDate() : null;
}
