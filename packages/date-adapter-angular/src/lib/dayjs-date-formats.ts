import type { MatDateFormats } from '@angular/material/core';

/**
 * Format strings passed straight through to `dayjs().format(...)` /
 * `dayjs(value, format)` by DayjsDateAdapter - see
 * https://day.js.org/docs/en/display/format for the token reference (it
 * intentionally does not match Angular Material's NativeDateAdapter, which
 * uses Intl.DateTimeFormat options instead).
 */
export const MAT_DAYJS_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'MM/DD/YYYY',
  },
  display: {
    dateInput: 'MM/DD/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'MMM D, YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
