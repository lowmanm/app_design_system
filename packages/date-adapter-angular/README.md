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

## Running unit tests

Run `nx test date-adapter-angular` to execute the unit tests.
