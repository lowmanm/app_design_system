import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { BrkMenuComponent } from './menu';
import { BrkMenuTriggerDirective } from './menu-trigger.directive';
import { BrkMenuItemDirective } from './menu-item.directive';
import { BrkMenuDividerDirective } from './menu-divider.directive';

@Component({
  standalone: true,
  imports: [BrkMenuComponent, BrkMenuTriggerDirective, BrkMenuItemDirective, BrkMenuDividerDirective],
  template: `
    <button [brkMenuTriggerFor]="menu">Workspace</button>
    <brk-menu #menu>
      <button brkMenuItem (activated)="profileCount = profileCount + 1">Profile settings</button>
      <div brkMenuDivider></div>
      <button brkMenuItem danger (activated)="signOutCount = signOutCount + 1">Sign out</button>
    </brk-menu>
  `,
})
class HostComponent {
  profileCount = 0;
  signOutCount = 0;
}

describe('BrkMenuComponent + BrkMenuTriggerDirective', () => {
  it('is closed until the trigger is clicked, then opens the panel into the overlay', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    expect(document.querySelector('.brk-menu')).toBeNull();

    const trigger: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    trigger.click();
    fixture.detectChanges();

    const panel = document.querySelector('.brk-menu');
    expect(panel).not.toBeNull();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');

    const items = document.querySelectorAll('.brk-menu-item');
    expect(items.length).toBe(2);
    expect(items[1].classList.contains('brk-menu-item--danger')).toBe(true);
  });

  it('closes and fires (activated) when an item is clicked', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const trigger: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    trigger.click();
    fixture.detectChanges();

    const signOutItem = document.querySelectorAll('.brk-menu-item')[1] as HTMLButtonElement;
    signOutItem.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.signOutCount).toBe(1);
    expect(document.querySelector('.brk-menu')).toBeNull();
  });

  it('closes on Escape and returns focus to the trigger', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const trigger: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    trigger.click();
    fixture.detectChanges();

    const panel = document.querySelector('.brk-menu') as HTMLElement;
    panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();

    expect(document.querySelector('.brk-menu')).toBeNull();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });
});
