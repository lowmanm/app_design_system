/** Org-standard date/time display and wire formats, shared by every consumer. */
export const DATE_FORMATS = {
  ISO_DATE: 'YYYY-MM-DD',
  ISO_DATE_TIME: 'YYYY-MM-DDTHH:mm:ssZ',
  DISPLAY_DATE: 'MMM D, YYYY',
  DISPLAY_DATE_SHORT: 'M/D/YYYY',
  DISPLAY_DATE_TIME: 'MMM D, YYYY h:mm A',
  DISPLAY_TIME: 'h:mm A',
} as const;

export type DateFormatKey = keyof typeof DATE_FORMATS;
