// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from './axe';

describe('expectNoAxeViolations', () => {
  it('passes for accessible markup', async () => {
    const el = document.createElement('div');
    el.innerHTML = `<button type="button">Save changes</button>`;
    document.body.appendChild(el);
    await expect(expectNoAxeViolations(el)).resolves.toBeUndefined();
  });

  it('fails, and names the rule, for inaccessible markup', async () => {
    const el = document.createElement('div');
    // An image with no alt text - a WCAG 1.1.1 failure axe detects reliably
    // in jsdom (unlike colour contrast, which needs real layout).
    el.innerHTML = `<img src="chart.png" />`;
    document.body.appendChild(el);
    await expect(expectNoAxeViolations(el)).rejects.toThrow(/image-alt/);
  });
});
