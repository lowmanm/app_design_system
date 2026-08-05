/** Shared size scale, consistent across every component in the library. */
export type ComponentSize = 'sm' | 'md' | 'lg';

/**
 * Shared visual-emphasis scale. `tonal` is a lower-emphasis filled style
 * (container color instead of the full-strength primary) for a secondary
 * action next to a `filled` primary one; `danger` carries the same weight
 * as `filled` but in the error role, for destructive actions.
 */
export type ComponentVariant = 'filled' | 'tonal' | 'outlined' | 'text' | 'danger';

/**
 * Elevation strategy for container-like components (card, menu panel, ...):
 * `elevated` uses a soft shadow, appropriate for content/marketing surfaces;
 * `outlined` uses a 1px border instead, for dense dashboard surfaces where
 * stacked shadows get visually noisy fast.
 */
export type SurfaceVariant = 'elevated' | 'outlined';
