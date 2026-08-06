import type { Preview } from '@storybook/angular';
// Token/theme CSS is loaded via the "styles" array on the
// storybook-browser-target in ../project.json instead of imported here -
// ts-loader (used for this file specifically) has no loader configured for
// bare .css/.scss imports, unlike the app's own Angular style pipeline.
//
// Manager (sidebar/toolbar chrome) theming is kept in sync with the
// Brand/Theme globals below by .storybook/manager.ts, via the core
// GLOBALS_UPDATED event - nothing needed here beyond declaring them.

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'error',
    },
  },
  globalTypes: {
    brand: {
      description: 'Business-unit brand (color palette)',
      toolbar: {
        title: 'Brand',
        icon: 'globe',
        items: [
          { value: 'azure-blue', title: 'Azure Blue' },
          { value: 'rose-red', title: 'Rose Red' },
          { value: 'cyan-orange', title: 'Cyan Orange' },
        ],
        dynamicTitle: true,
      },
    },
    theme: {
      description: 'Design system theme',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: ['light', 'dark', 'high-contrast'],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    brand: 'azure-blue',
    theme: 'light',
  },
  decorators: [
    (story, context) => {
      document.documentElement.setAttribute('data-brand', context.globals['brand'] ?? 'azure-blue');
      document.documentElement.setAttribute('data-theme', context.globals['theme'] ?? 'light');
      return story();
    },
  ],
};

export default preview;
