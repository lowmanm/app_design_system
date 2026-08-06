import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { BRAND_NAMES } from './generated-brands';

// Three separate files hand-map design-system tokens onto another
// framework's variable vocabulary:
//
//   theme-angular-material/src/_theme-mixin.scss  --mat-sys-* -> --color-*
//   bootstrap-overrides/src/runtime-theme-bridge.css   --bs-* -> --color-*
//   bootstrap-overrides/src/scss/_bootstrap-variable-mapping.scss  $x -> $color-x
//
// Renaming or removing a token breaks the first two *silently* - CSS custom
// properties that reference a nonexistent variable simply resolve to their
// initial value, so the build stays green and the UI quietly loses its
// colour. This suite turns that class of drift into a test failure.

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const read = (p: string) => readFileSync(resolve(repoRoot, p), 'utf8');

/** Every `--color-*`/`--space-*`/... custom property the tokens build emits. */
function emittedTokenNames(): Set<string> {
  const names = new Set<string>();
  const files = [
    'packages/tokens/dist/css/core.css',
    ...BRAND_NAMES.flatMap((brand) => [
      `packages/tokens/dist/css/brands/${brand}/theme-light.css`,
      `packages/tokens/dist/css/brands/${brand}/theme-dark.css`,
      `packages/tokens/dist/css/brands/${brand}/theme-high-contrast.css`,
    ]),
  ];
  for (const file of files) {
    for (const [, name] of read(file).matchAll(/^\s*(--[\w-]+):/gm)) {
      names.add(name);
    }
  }
  return names;
}

/** Strips comments, so prose mentioning a variable is not read as a reference. */
const stripComments = (source: string) =>
  source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

/** Every token a consumer file references via `var(--x)`. */
function referencedTokenNames(source: string): string[] {
  return [...stripComments(source).matchAll(/var\((--[\w-]+)/g)].map(
    (m) => m[1]!,
  );
}

describe('token contract', () => {
  const emitted = emittedTokenNames();

  it('emits a non-trivial set of tokens', () => {
    expect(emitted.size).toBeGreaterThan(50);
    expect(emitted.has('--color-primary')).toBe(true);
    expect(emitted.has('--space-4')).toBe(true);
  });

  it.each([
    [
      'Angular Material bridge',
      'packages/theme-angular-material/src/_theme-mixin.scss',
    ],
    [
      'Bootstrap runtime bridge',
      'packages/bootstrap-overrides/src/runtime-theme-bridge.css',
    ],
  ])('%s only references tokens that exist', (_label, file) => {
    const referenced = referencedTokenNames(read(file));
    expect(referenced.length).toBeGreaterThan(0);
    const missing = referenced.filter((name) => !emitted.has(name));
    expect(missing).toEqual([]);
  });

  it('Bootstrap Sass mapping only references tokens that exist', () => {
    // The Sass layer consumes `$color-primary`-style variables, which Style
    // Dictionary emits from the same source as the `--color-primary` custom
    // properties - so compare against the CSS names with the sigil swapped.
    const source = stripComments(
      read(
        'packages/bootstrap-overrides/src/scss/_bootstrap-variable-mapping.scss',
      ),
    );
    // Only the value side of `$bootstrap-var: $token-var;` - the left side is
    // Bootstrap's own vocabulary and shares prefixes with ours ($font-*).
    const referenced = [...source.matchAll(/:\s*([^;]+);/g)].flatMap(
      ([, value]) =>
        [
          ...value!.matchAll(
            /\$(color|space|radius|font|elevation|motion)-[\w-]+/g,
          ),
        ].map((m) => `--${m[0].slice(1)}`),
    );
    expect(referenced.length).toBeGreaterThan(0);
    const missing = [...new Set(referenced)].filter(
      (name) => !emitted.has(name),
    );
    expect(missing).toEqual([]);
  });

  it('bridges every semantic colour role, so no consumer is left on a different value', () => {
    // The whole point of the bridge is that Angular, Tailwind and Bootstrap
    // resolve to identical colours. A role defined in the tokens but missing
    // from the bridge means Material silently keeps its own derived value.
    //
    // `--color-*-rgb` companions are excluded: they exist so Bootstrap can
    // build `rgba(var(--x-rgb), a)` opacity utilities, and Material has no
    // corresponding `--mat-sys-*-rgb` vocabulary to bridge them into.
    const semanticRoles = [...emitted].filter(
      (n) => n.startsWith('--color-') && !n.endsWith('-rgb'),
    );
    const bridge = read(
      'packages/theme-angular-material/src/_theme-mixin.scss',
    );
    const bridged = new Set(referencedTokenNames(bridge));
    const unbridged = semanticRoles.filter((role) => !bridged.has(role));
    expect(unbridged).toEqual([]);
  });
});
