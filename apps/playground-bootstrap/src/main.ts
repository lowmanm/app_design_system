import { setTheme, type ThemeName } from '@app-design-system/tokens';
import '@app-design-system/tokens/css/core.css';
// This playground demos the "azure-blue" business-unit brand - see
// @app-design-system/tokens' README for the full brand list. A real app
// picks one brand's files at install time; it doesn't ship all of them.
import '@app-design-system/tokens/css/brands/azure-blue/theme-light.css';
import '@app-design-system/tokens/css/brands/azure-blue/theme-dark.css';
import '@app-design-system/tokens/css/brands/azure-blue/theme-high-contrast.css';
import '@app-design-system/bootstrap-overrides/runtime-theme-bridge.css';

document
  .querySelectorAll<HTMLButtonElement>('[data-theme-button]')
  .forEach((button) => {
    button.addEventListener('click', () => {
      setTheme(button.dataset['themeButton'] as ThemeName);
    });
  });
