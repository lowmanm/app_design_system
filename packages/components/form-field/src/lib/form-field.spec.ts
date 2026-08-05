import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { BrkFormFieldComponent } from './form-field';
import { BrkFormFieldControlDirective } from './form-field-control.directive';

@Component({
  standalone: true,
  imports: [BrkFormFieldComponent, BrkFormFieldControlDirective],
  template: `
    <brk-form-field label="Email" [hint]="hint()" [errorMessage]="error()">
      <input brkFormFieldControl type="email" />
    </brk-form-field>
  `,
})
class HostComponent {
  hint = signal("We'll never share it");
  error = signal('');
}

describe('BrkFormFieldComponent', () => {
  it('associates the label with the control via for/id', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const label: HTMLLabelElement = fixture.nativeElement.querySelector('label');
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(label.getAttribute('for')).toBe(input.id);
    expect(input.id).toBeTruthy();
  });

  it('describes the control with the hint when there is no error', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    const hint: HTMLElement = fixture.nativeElement.querySelector('.brk-form-field__hint');
    expect(input.getAttribute('aria-describedby')).toBe(hint.id);
    expect(input.getAttribute('aria-invalid')).toBeNull();
    expect(fixture.nativeElement.querySelector('.brk-form-field__error')).toBeNull();
  });

  it('switches to the error message and marks aria-invalid when an error is set', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.error.set('Enter a valid email address');
    fixture.detectChanges();

    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    const error: HTMLElement = fixture.nativeElement.querySelector('.brk-form-field__error');

    expect(error.textContent?.trim()).toBe('Enter a valid email address');
    expect(error.getAttribute('role')).toBe('alert');
    expect(input.getAttribute('aria-describedby')).toBe(error.id);
    expect(input.getAttribute('aria-invalid')).toBe('true');
    // Hint is suppressed while an error is showing, to avoid a noisy double
    // announcement - the error already conveys the field is invalid.
    expect(fixture.nativeElement.querySelector('.brk-form-field__hint')).toBeNull();
  });
});
