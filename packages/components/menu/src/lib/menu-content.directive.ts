import { Directive } from '@angular/core';

/**
 * Marks an `<ng-template>` as a `brk-menu`'s content, deferring creation of
 * everything inside it until the menu is actually opened. Use this instead
 * of direct children for large or dynamic menus (e.g. built from an
 * observable) where paying to create every item up front isn't worth it:
 *
 * ```html
 * <brk-menu #appMenu>
 *   <ng-template brkMenuContent>
 *     @for (project of projects$ | async; track project.id) {
 *       <button brkMenuItem (activated)="open(project)">{{ project.name }}</button>
 *     }
 *   </ng-template>
 * </brk-menu>
 * ```
 *
 * For small static menus, plain children (no `<ng-template>`) are simpler
 * and are created eagerly - both are supported by the same `brk-menu`.
 */
@Directive({
  selector: 'ng-template[brkMenuContent]',
  standalone: true,
})
export class BrkMenuContentDirective {}
