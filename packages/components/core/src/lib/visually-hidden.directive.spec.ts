import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { VisuallyHiddenDirective } from './visually-hidden.directive';

@Component({
  standalone: true,
  imports: [VisuallyHiddenDirective],
  template: `<span adsVisuallyHidden>Loading</span>`,
})
class HostComponent {}

describe('VisuallyHiddenDirective', () => {
  it('applies the ads-visually-hidden class', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const span: HTMLElement = fixture.nativeElement.querySelector('span');
    expect(span.classList.contains('ads-visually-hidden')).toBe(true);
    // Still present in the accessibility tree / DOM text content.
    expect(span.textContent).toBe('Loading');
  });
});
