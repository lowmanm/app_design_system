# playground-tailwind

A minimal Tailwind CSS app proving `@app-design-system/tailwind-preset` and
`@app-design-system/tokens` produce the same visual language as the Angular
Material theme and Bootstrap overrides - no Angular involved.

```sh
nx serve playground-tailwind
nx build playground-tailwind
```

Click the theme buttons to confirm light/dark/high-contrast switch every
utility class (`bg-primary`, `rounded-md`, `shadow-2`, ...) via
`@app-design-system/tokens`' `setTheme()`.
