export type Audience = 'senior' | 'family';

export function normalizeAudience(input: string | null | undefined): Audience {
  if (input === 'family') return 'family';
  return 'senior';
}
