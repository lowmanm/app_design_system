import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../testing/axe';
import { BrkVisuallyHiddenDirective } from './visually-hidden.directive';

@Component({
  imports: [BrkVisuallyHiddenDirective],
  template: `<button type="button">
    <span aria-hidden="true">x</span>
    <span brkVisuallyHidden>Close dialog</span>
  </button>`,
})
class HostComponent {}

describe('BrkVisuallyHiddenDirective', () => {
  it('applies the visually-hidden class', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const span: HTMLElement = fixture.nativeElement.querySelector(
      '[brkVisuallyHidden]',
    );
    expect(span.classList.contains('brk-visually-hidden')).toBe(true);
  });

  it('clips the element without removing it from the accessibility tree', () => {
    // The point of the directive: `display: none` / `visibility: hidden`
    // would also hide it from screen readers, which is the opposite of what
    // this is for. Asserted on the element's own styles because the previous
    // implementation only applied a class whose stylesheet shipped nowhere.
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const span: HTMLElement = fixture.nativeElement.querySelector(
      '[brkVisuallyHidden]',
    );

    expect(span.style.position).toBe('absolute');
    expect(span.style.overflow).toBe('hidden');
    expect(span.style.clipPath).toBe('inset(50%)');
    expect(span.style.display).not.toBe('none');
    expect(span.style.visibility).not.toBe('hidden');
    expect(span.textContent?.trim()).toBe('Close dialog');
  });

  it('has no accessibility violations', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    await expectNoAxeViolations(fixture.nativeElement);
  });
});
