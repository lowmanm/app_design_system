import type { ConfigType } from 'dayjs';
import { dayjs, type Dayjs } from './dayjs';

/** Converts any dayjs-parseable input into the given IANA timezone. */
export function toTimezone(input: ConfigType, tz: string): Dayjs {
  return dayjs(input).tz(tz);
}

/** The current instant, expressed in the given IANA timezone. */
export function nowInTimezone(tz: string): Dayjs {
  return dayjs().tz(tz);
}
