import axe, {
  type AxeResults,
  type ElementContext,
  type RunOptions,
} from 'axe-core';

/**
 * Runs axe-core against a rendered fixture and fails with a readable report
 * if anything violates WCAG 2.1/2.2 A/AA.
 *
 * This exists because the design system's accessibility claim was, until
 * now, unenforced: axe was a dependency, the Storybook a11y panel could show
 * violations to whoever happened to look, and CI never ran any of it. Every
 * component spec calls this, so a regression fails the build.
 *
 * ```ts
 * const fixture = TestBed.createComponent(HostComponent);
 * fixture.detectChanges();
 * await expectNoAxeViolations(fixture.nativeElement);
 * ```
 *
 * Note on colour contrast: axe cannot evaluate it in jsdom, which has no
 * layout or cascade, so that check is disabled here rather than silently
 * reporting nothing. Contrast is covered at the token level instead - the
 * palettes are generated from M3 tonal steps whose on-* pairings are
 * contrast-safe by construction.
 */
export async function expectNoAxeViolations(
  element: ElementContext,
  options: RunOptions = {},
): Promise<void> {
  const results: AxeResults = await axe.run(element, {
    runOnly: {
      type: 'tag',
      values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
    },
    rules: { 'color-contrast': { enabled: false } },
    ...options,
  });

  if (results.violations.length === 0) {
    return;
  }

  const report = results.violations
    .map((violation) => {
      const targets = violation.nodes
        .map((node) => `      - ${node.target.join(' ')}`)
        .join('\n');
      return `  [${violation.impact ?? 'unknown'}] ${violation.id}: ${violation.help}\n    ${violation.helpUrl}\n${targets}`;
    })
    .join('\n');

  throw new Error(
    `Expected no accessibility violations, found ${results.violations.length}:\n${report}`,
  );
}
