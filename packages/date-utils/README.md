# @app-design-system/date-utils

Framework-agnostic dayjs wrapper - the org-standard formats, parsing, and
timezone helpers shared by every consumer. Tailwind/Bootstrap/plain-JS apps
import this directly; Angular apps get the same behavior via
`@app-design-system/date-adapter-angular`, which wires this package's dayjs
configuration into Angular Material's datepicker.

## API

- `dayjs` - re-exported from `dayjs`, pre-configured with the `utc`,
  `timezone`, `customParseFormat`, `localizedFormat`, `isoWeek`, and
  `localeData` plugins.
  Import this instead of the bare `dayjs` package so every consumer shares
  one plugin configuration.
- `DATE_FORMATS` - org-standard format strings (`ISO_DATE`, `DISPLAY_DATE`,
  `DISPLAY_DATE_TIME`, ...).
- `formatDate(input, format?)` - formats any dayjs-parseable input; returns
  `''` for invalid input instead of `dayjs`'s default `"Invalid Date"`.
- `parseDate(input, format?)` - parses a string against an explicit format;
  returns `null` for invalid input instead of an invalid `Dayjs` instance.
- `toTimezone(input, tz)` / `nowInTimezone(tz)` - IANA timezone conversion.

## Building

Run `nx build date-utils` to build the library.

## Running unit tests

Run `nx test date-utils` to execute the unit tests via [Vitest](https://vitest.dev/).
