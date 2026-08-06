import { defineConfig } from 'vitest/config';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/packages/theme-angular-material',
  plugins: [nxViteTsPaths()],
  test: {
    name: 'theme-angular-material',
    watch: false,
    globals: true,
    environment: 'node',
    include: ['tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/packages/theme-angular-material',
      provider: 'v8' as const,
    },
  },
}));
