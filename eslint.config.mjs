import nx from '@nx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: [
      '**/dist',
      '**/storybook-static',
      '**/vite.config.*.timestamp*',
      '**/vitest.config.*.timestamp*',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints: [
            {
              // Design tokens are the framework-agnostic core - they must
              // never depend on Angular (or anything else), so every other
              // consumer type can build on them without pulling in Angular.
              sourceTag: 'scope:tokens',
              onlyDependOnLibsWithTags: [],
            },
            {
              sourceTag: 'scope:agnostic',
              onlyDependOnLibsWithTags: ['scope:tokens', 'scope:agnostic'],
            },
            {
              sourceTag: 'scope:tailwind',
              onlyDependOnLibsWithTags: ['scope:tokens'],
            },
            {
              sourceTag: 'scope:bootstrap',
              onlyDependOnLibsWithTags: ['scope:tokens'],
            },
            {
              sourceTag: 'scope:angular',
              onlyDependOnLibsWithTags: ['scope:tokens', 'scope:agnostic', 'scope:angular'],
            },
            {
              // Storybook docs app and the manual-QA playground apps may
              // consume any consumer-facing package to demonstrate them.
              sourceTag: 'scope:docs',
              onlyDependOnLibsWithTags: [
                'scope:tokens',
                'scope:agnostic',
                'scope:angular',
                'scope:tailwind',
                'scope:bootstrap',
              ],
            },
            {
              sourceTag: 'scope:playground',
              onlyDependOnLibsWithTags: [
                'scope:tokens',
                'scope:agnostic',
                'scope:angular',
                'scope:tailwind',
                'scope:bootstrap',
              ],
            },
          ],
        },
      ],
    },
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
    // Override or add rules here
    rules: {},
  },
];
