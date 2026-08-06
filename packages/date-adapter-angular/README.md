# @app-design-system/date-adapter-angular

Wires `@app-design-system/date-utils`' dayjs configuration into Angular
Material's `DateAdapter`, so `<mat-datepicker>` and friends use dayjs instead
of the native `Date` object - no official dayjs adapter ships with Angular
Material (only a native-`Date` one, with community adapters for
Moment/Luxon/date-fns), so `DayjsDateAdapter` here is genuinely custom work.

## Usage

```ts
import { provideDayjsDateAdapter } from '@app-design-system/date-adapter-angular';

bootstrapApplication(App, {
  providers: [provideDayjsDateAdapter()],
});
```

This registers `DayjsDateAdapter` as Angular Material's `DateAdapter<Dayjs>`
and `MAT_DAYJS_DATE_FORMATS` as `MAT_DATE_FORMATS` (dayjs-style tokens, e.g.
`'MM/DD/YYYY'` - see `dayjs-date-formats.ts`). Pass your own formats object
to override the defaults: `provideDayjsDateAdapter(myFormats)`.

### Non-English locales

The adapter honours Angular Material's `MAT_DATE_LOCALE`, but dayjs only
knows a locale once its data file has been imported - otherwise it silently
falls back to English month and day names with no error. Import the locale
alongside the provider, and set `MAT_DATE_LOCALE` yourself (this package
deliberately does not provide it, so it cannot fight an app that already
sets one):

```ts
import 'dayjs/locale/fr';
import { MAT_DATE_LOCALE } from '@angular/material/core';

bootstrapApplication(App, {
  providers: [provideDayjsDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: 'fr' }],
});
```

### Serialization

`toIso8601` returns a calendar date (`YYYY-MM-DD`), matching Angular
Material's own `DateAdapter` contract - not a UTC timestamp, which would
shift the day for users in negative-offset timezones.

## Running unit tests

Run `nx test date-adapter-angular` to execute the unit tests.
