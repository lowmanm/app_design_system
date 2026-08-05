import { setTheme, type ThemeName } from '@app-design-system/tokens';
import '@app-design-system/tokens/css/core.css';
import '@app-design-system/tokens/css/theme-light.css';
import '@app-design-system/tokens/css/theme-dark.css';
import '@app-design-system/tokens/css/theme-high-contrast.css';
import '@app-design-system/bootstrap-overrides/src/runtime-theme-bridge.css';

document.querySelectorAll<HTMLButtonElement>('[data-theme-button]').forEach((button) => {
  button.addEventListener('click', () => {
    setTheme(button.dataset['themeButton'] as ThemeName);
  });
});
