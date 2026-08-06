import type { Preview } from '@storybook/angular';
import { addons } from 'storybook/preview-api';
import { GLOBALS_UPDATED } from 'storybook/internal/core-events';
import appearance from './appearance-data.json';
// Token/theme CSS is loaded via the "styles" array on the
// storybook-browser-target in ../project.json instead of imported here -
// ts-loader (used for this file specifically) has no loader configured for
// bare .css/.scss imports, unlike the app's own Angular style pipeline.
//
// Manager (sidebar/toolbar chrome) theming is kept in sync with the
// Brand/Theme globals below by .storybook/manager.ts, via the same
// GLOBALS_UPDATED event this file listens for.

const DEFAULT_BRAND = appearance.brands[0]!;
const DEFAULT_MODE = 'light';

/**
 * Writes the attributes every brand's token CSS is scoped under.
 *
 * Applied here at preview level - not only from the story decorator -
 * because a standalone MDX page (a `<Meta>` with no story, like Guides/
 * Colors) never runs decorators. Once the token CSS became brand-scoped,
 * such a page matched no brand block at all and every `--color-*` resolved
 * to nothing, so its swatches rendered unstyled.
 */
function applyAppearance(brand: unknown, mode: unknown): void {
  const root = document.documentElement;
  root.setAttribute(
    'data-brand',
    typeof brand === 'string' ? brand : DEFAULT_BRAND,
  );
  root.setAttribute(
    'data-theme',
    typeof mode === 'string' ? mode : DEFAULT_MODE,
  );
}

// Before first paint, so nothing renders unstyled while waiting for an event.
applyAppearance(DEFAULT_BRAND, DEFAULT_MODE);

addons
  .getChannel()
  .on(GLOBALS_UPDATED, ({ globals }: { globals: Record<string, unknown> }) => {
    applyAppearance(globals['brand'], globals['theme']);
  });

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
        // Derived from the tokens package's brand list (see
        // scripts/generate-appearance-data.mjs) so a new brand appears here
        // without editing this file.
        items: appearance.brands.map((brand) => ({
          value: brand,
          title: brand.replace(
            /(^|-)(\w)/g,
            (_, sep, ch) => (sep ? ' ' : '') + ch.toUpperCase(),
          ),
        })),
        dynamicTitle: true,
      },
    },
    theme: {
      description: 'Design system theme',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [...appearance.modes],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    brand: DEFAULT_BRAND,
    theme: DEFAULT_MODE,
  },
  decorators: [
    (story, context) => {
      // Redundant with the channel listener above for stories, but keeps a
      // story correct even if it renders before the first globals event.
      applyAppearance(context.globals['brand'], context.globals['theme']);
      return story();
    },
  ],
};

export default preview;
