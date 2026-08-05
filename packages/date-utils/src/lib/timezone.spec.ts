import { describe, expect, it } from 'vitest';
import { toTimezone } from './timezone';

describe('toTimezone', () => {
  it('converts a UTC instant into the given IANA timezone', () => {
    const result = toTimezone('2026-06-15T12:00:00Z', 'America/New_York');
    // Mid-June is EDT (UTC-4).
    expect(result.format('HH:mm')).toBe('08:00');
  });
});
