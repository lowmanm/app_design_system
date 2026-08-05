import type { Provider } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { DayjsDateAdapter } from './dayjs-date-adapter';
import { MAT_DAYJS_DATE_FORMATS } from './dayjs-date-formats';

/**
 * Registers DayjsDateAdapter (and its formats) as Angular Material's date
 * adapter, so every date-based component (datepicker, etc.) in the app uses
 * dayjs. Mirrors Angular Material's own `provideNativeDateAdapter()`:
 *
 * ```ts
 * bootstrapApplication(App, {
 *   providers: [provideDayjsDateAdapter()],
 * });
 * ```
 */
export function provideDayjsDateAdapter(
  formats: typeof MAT_DAYJS_DATE_FORMATS = MAT_DAYJS_DATE_FORMATS,
): Provider[] {
  return [
    { provide: DateAdapter, useClass: DayjsDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: formats },
  ];
}
