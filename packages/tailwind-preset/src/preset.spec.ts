import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('tailwind preset build', () => {
  it('generates a preset whose colors reference CSS custom properties', () => {
    const cwd = resolve(__dirname, '..');
    execSync('node build.mjs', { cwd });
    const outFile = resolve(cwd, 'dist/preset.cjs');
    expect(existsSync(outFile)).toBe(true);

    const preset = require(outFile);
    expect(preset.theme.extend.colors.primary).toBe('var(--color-primary)');
    expect(preset.theme.extend.spacing['4']).toBe('var(--space-4)');
    expect(preset.theme.extend.borderRadius.md).toBe('var(--radius-md)');
  });
});
