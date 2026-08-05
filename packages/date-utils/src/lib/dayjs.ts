import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isoWeek from 'dayjs/plugin/isoWeek';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

// Every consumer of this package - Angular (via date-adapter-angular),
// Tailwind, Bootstrap, or plain JS - gets the same dayjs configuration by
// importing from here rather than the bare `dayjs` package directly.
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);
dayjs.extend(isoWeek);

export { dayjs };
export type { Dayjs } from 'dayjs';
