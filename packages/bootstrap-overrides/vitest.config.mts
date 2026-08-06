import { defineConfig } from 'vitest/config';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/packages/bootstrap-overrides',
  plugins: [nxViteTsPaths()],
  test: {
    name: 'bootstrap-overrides',
    watch: false,
    globals: true,
    environment: 'node',
    include: ['tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/packages/bootstrap-overrides',
      provider: 'v8' as const,
    },
  },
}));
