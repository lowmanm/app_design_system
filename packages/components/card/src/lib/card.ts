import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { SurfaceVariant } from '@app-design-system/core';

/**
 * A container surface for grouping related content. Two elevation
 * strategies are offered rather than one global choice: `elevated` (soft
 * shadow) reads well on content/marketing surfaces; `outlined` (1px border,
 * no shadow) stays calm on dense dashboard surfaces where several cards'
 * shadows stacked together get visually noisy fast.
 *
 * Put an actions row in the optional `brkCardFooter` slot to get a
 * top divider and consistent spacing for free:
 *
 * ```html
 * <brk-card variant="elevated">
 *   <h3>Getting started</h3>
 *   <p>Install the tokens package, pick a brand, wire the theme bridge.</p>
 *   <div brkCardFooter>
 *     <a brkButton variant="text" href="/guides/getting-started">Read the guide</a>
 *   </div>
 * </brk-card>
 * ```
 */
@Component({
  selector: 'brk-card',
  template: `
    <ng-content />
    <div class="brk-card__footer">
      <ng-content select="[brkCardFooter]" />
    </div>
  `,
  styleUrl: './card.css',
  host: {
    class: 'brk-card',
    '[class]': '"brk-card--" + variant()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrkCardComponent {
  readonly variant = input<SurfaceVariant>('elevated');
}
