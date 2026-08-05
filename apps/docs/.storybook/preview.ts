import type { Preview } from '@storybook/angular';
// Token/theme CSS is loaded via the "styles" array on the
// storybook-browser-target in ../project.json instead of imported here -
// ts-loader (used for this file specifically) has no loader configured for
// bare .css/.scss imports, unlike the app's own Angular style pipeline.

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
    theme: 'light',
  },
  decorators: [
    (story, context) => {
      document.documentElement.setAttribute('data-theme', context.globals['theme'] ?? 'light');
      return story();
    },
  ],
};

export default preview;
