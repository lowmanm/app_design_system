import { Component } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { BrkMenuComponent } from './menu';
import { BrkMenuTriggerDirective } from './menu-trigger.directive';
import { BrkContextMenuTriggerDirective } from './context-menu-trigger.directive';
import { BrkMenuItemDirective } from './menu-item.directive';
import { BrkMenuContentDirective } from './menu-content.directive';
import { expectNoAxeViolations } from '@app-design-system/core/testing';

@Component({
  standalone: true,
  imports: [BrkMenuComponent, BrkMenuTriggerDirective, BrkMenuItemDirective],
  template: `
    <button [brkMenuTriggerFor]="fileMenu">File</button>
    <brk-menu #fileMenu>
      <button brkMenuItem [brkMenuTriggerFor]="shareMenu">Share</button>
      <button brkMenuItem (activated)="renameCount = renameCount + 1">
        Rename
      </button>
    </brk-menu>
    <brk-menu #shareMenu>
      <button brkMenuItem (activated)="emailCount = emailCount + 1">
        Email link
      </button>
    </brk-menu>
  `,
})
class NestedMenuHostComponent {
  renameCount = 0;
  emailCount = 0;
}

describe('nested submenus', () => {
  it('marks a co-located trigger item with the submenu chevron class', () => {
    const fixture = TestBed.createComponent(NestedMenuHostComponent);
    fixture.detectChanges();
    fixture.nativeElement.querySelector('button').click();
    fixture.detectChanges();

    const shareItem = document.querySelectorAll('.brk-menu-item')[0];
    expect(shareItem.classList.contains('brk-menu-item--submenu')).toBe(true);
  });

  it('opens the submenu without closing the parent, and clicking inside it does not close the parent either', () => {
    const fixture = TestBed.createComponent(NestedMenuHostComponent);
    fixture.detectChanges();
    fixture.nativeElement.querySelector('button').click();
    fixture.detectChanges();

    const shareItem = document.querySelectorAll(
      '.brk-menu-item',
    )[0] as HTMLButtonElement;
    shareItem.click();
    fixture.detectChanges();

    const panels = document.querySelectorAll('.brk-menu');
    expect(panels.length).toBe(2); // parent + submenu both open

    const emailItem = Array.from(
      document.querySelectorAll('.brk-menu-item'),
    ).find(
      (el) => el.textContent?.trim() === 'Email link',
    ) as HTMLButtonElement;
    expect(emailItem).toBeTruthy();
    emailItem.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.emailCount).toBe(1);
    // Choosing the submenu item closes both the submenu and, since it was
    // the only thing open under the parent, the parent is left open still
    // (only Escape/outside-click/its own item closes *it*).
    expect(document.querySelectorAll('.brk-menu').length).toBe(1);
  });

  it('closes the submenu when the parent closes (cascade)', () => {
    const fixture = TestBed.createComponent(NestedMenuHostComponent);
    fixture.detectChanges();
    const trigger: HTMLButtonElement =
      fixture.nativeElement.querySelector('button');
    trigger.click();
    fixture.detectChanges();
    (
      document.querySelectorAll('.brk-menu-item')[0] as HTMLButtonElement
    ).click();
    fixture.detectChanges();
    expect(document.querySelectorAll('.brk-menu').length).toBe(2);

    const parentPanel = document.querySelectorAll(
      '.brk-menu',
    )[0] as HTMLElement;
    parentPanel.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    fixture.detectChanges();

    expect(document.querySelectorAll('.brk-menu').length).toBe(0);
  });
});

@Component({
  standalone: true,
  imports: [
    BrkMenuComponent,
    BrkContextMenuTriggerDirective,
    BrkMenuItemDirective,
  ],
  template: `
    <div class="row" [brkContextMenuTriggerFor]="rowMenu">Report row</div>
    <brk-menu #rowMenu>
      <button brkMenuItem danger (activated)="deleteCount = deleteCount + 1">
        Delete
      </button>
    </brk-menu>
  `,
})
class ContextMenuHostComponent {
  deleteCount = 0;
}

describe('BrkContextMenuTriggerDirective', () => {
  it('opens on contextmenu (right-click) rather than a normal click', () => {
    const fixture = TestBed.createComponent(ContextMenuHostComponent);
    fixture.detectChanges();
    const row: HTMLElement = fixture.nativeElement.querySelector('.row');

    row.click();
    fixture.detectChanges();
    expect(document.querySelector('.brk-menu')).toBeNull();

    row.dispatchEvent(
      new MouseEvent('contextmenu', {
        bubbles: true,
        clientX: 120,
        clientY: 80,
      }),
    );
    fixture.detectChanges();
    expect(document.querySelector('.brk-menu')).not.toBeNull();
  });
});

@Component({
  standalone: true,
  imports: [
    BrkMenuComponent,
    BrkMenuTriggerDirective,
    BrkMenuItemDirective,
    BrkMenuContentDirective,
  ],
  template: `
    <button [brkMenuTriggerFor]="lazyMenu">Projects</button>
    <brk-menu #lazyMenu>
      <ng-template brkMenuContent>
        <button brkMenuItem>Alpha</button>
        <button brkMenuItem>Beta</button>
      </ng-template>
    </brk-menu>
  `,
})
class LazyMenuHostComponent {}

describe('BrkMenuContentDirective (lazy rendering)', () => {
  it('does not create menu items until the menu is opened', () => {
    const fixture = TestBed.createComponent(LazyMenuHostComponent);
    fixture.detectChanges();
    expect(document.querySelectorAll('.brk-menu-item').length).toBe(0);

    fixture.nativeElement.querySelector('button').click();
    fixture.detectChanges();

    const items = document.querySelectorAll('.brk-menu-item');
    expect(items.length).toBe(2);
    expect(items[0].textContent?.trim()).toBe('Alpha');
  });
});

@Component({
  imports: [BrkMenuComponent, BrkMenuTriggerDirective, BrkMenuItemDirective],
  template: `
    <button [brkMenuTriggerFor]="menu">Actions</button>
    <brk-menu #menu>
      <button brkMenuItem (activated)="picked = 'alpha'">Alpha</button>
      <button brkMenuItem disabled (activated)="picked = 'beta'">Beta</button>
      <button brkMenuItem (activated)="picked = 'gamma'">Gamma</button>
    </brk-menu>
  `,
})
class KeyboardHostComponent {
  picked = '';
}

function openMenu(fixture: ComponentFixture<unknown>): HTMLElement {
  (fixture.nativeElement.querySelector('button') as HTMLButtonElement).click();
  fixture.detectChanges();
  return document.querySelector('.brk-menu') as HTMLElement;
}

// CDK's ListKeyManager reads `event.keyCode`, which a synthetically
// constructed KeyboardEvent leaves at 0 - real browser events always carry
// it, so this only matters for tests.
const KEY_CODES: Record<string, number> = {
  Tab: 9,
  Escape: 27,
  ArrowLeft: 37,
  ArrowUp: 38,
  ArrowRight: 39,
  ArrowDown: 40,
};

function press(panel: HTMLElement, key: string): void {
  const event = new KeyboardEvent('keydown', { key, bubbles: true });
  Object.defineProperty(event, 'keyCode', { get: () => KEY_CODES[key] ?? 0 });
  panel.dispatchEvent(event);
}

describe('menu items: disabled', () => {
  it('marks disabled items natively so clicks and key navigation both skip them', async () => {
    const fixture = TestBed.createComponent(KeyboardHostComponent);
    fixture.detectChanges();
    openMenu(fixture);
    await Promise.resolve();

    const items = [
      ...document.querySelectorAll('.brk-menu-item'),
    ] as HTMLButtonElement[];
    expect(items[1]!.disabled).toBe(true);
    expect(items[1]!.getAttribute('aria-disabled')).toBe('true');

    items[1]!.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.picked).toBe('');
    // Still open: a disabled item is not an activation.
    expect(document.querySelector('.brk-menu')).not.toBeNull();
  });
});

describe('menu keyboard navigation', () => {
  it('focuses the first item on open and moves with arrow keys, skipping disabled', async () => {
    const fixture = TestBed.createComponent(KeyboardHostComponent);
    fixture.detectChanges();
    const panel = openMenu(fixture);
    await Promise.resolve();

    expect(document.activeElement?.textContent?.trim()).toBe('Alpha');

    press(panel, 'ArrowDown');
    fixture.detectChanges();
    // Beta is disabled, so focus lands on Gamma.
    expect(document.activeElement?.textContent?.trim()).toBe('Gamma');
  });

  it('wraps around at the ends', async () => {
    const fixture = TestBed.createComponent(KeyboardHostComponent);
    fixture.detectChanges();
    const panel = openMenu(fixture);
    await Promise.resolve();

    press(panel, 'ArrowUp');
    fixture.detectChanges();
    expect(document.activeElement?.textContent?.trim()).toBe('Gamma');
  });

  it('closes on Tab so focus cannot walk out of an open overlay', () => {
    const fixture = TestBed.createComponent(KeyboardHostComponent);
    fixture.detectChanges();
    const panel = openMenu(fixture);

    press(panel, 'Tab');
    fixture.detectChanges();
    expect(document.querySelector('.brk-menu')).toBeNull();
  });

  it('returns focus to the trigger when it closes', () => {
    const fixture = TestBed.createComponent(KeyboardHostComponent);
    fixture.detectChanges();
    const trigger = fixture.nativeElement.querySelector(
      'button',
    ) as HTMLButtonElement;
    const panel = openMenu(fixture);

    press(panel, 'Escape');
    fixture.detectChanges();
    expect(document.activeElement).toBe(trigger);
  });
});

describe('menu accessibility', () => {
  it('links the trigger to its panel and has no violations while open', async () => {
    const fixture = TestBed.createComponent(KeyboardHostComponent);
    fixture.detectChanges();
    const trigger = fixture.nativeElement.querySelector(
      'button',
    ) as HTMLButtonElement;
    const panel = openMenu(fixture);
    await Promise.resolve();

    expect(trigger.getAttribute('aria-controls')).toBe(panel.id);
    expect(panel.id).toBeTruthy();
    await expectNoAxeViolations(panel);
  });
});
