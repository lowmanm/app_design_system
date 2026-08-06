import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isoWeek from 'dayjs/plugin/isoWeek';
import localeData from 'dayjs/plugin/localeData';
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
// Needed for DayjsDateAdapter.getFirstDayOfWeek() (date-adapter-angular).
dayjs.extend(localeData);

export { dayjs };
// ConfigType is re-exported explicitly: consumers that accept 'whatever
// dayjs() accepts' need the type, and reaching for `dayjs.ConfigType` as a
// namespace through a re-exported value only works while declaration
// merging happens to survive, which is exactly the fragility this package
// exists to absorb.
export type { Dayjs, ConfigType } from 'dayjs';
