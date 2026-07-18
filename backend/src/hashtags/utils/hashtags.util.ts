export const HASHTAG_MAX_COUNT = 30;
export const HASHTAG_MAX_LENGTH = 64;

// Matches `#tag` at the start of the text or after whitespace, so URL
// fragments like `example.com/#section` are ignored. Unicode-aware.
const HASHTAG_PATTERN = new RegExp(
  `(?<=^|\\s)#([\\p{L}\\p{N}_]{1,${HASHTAG_MAX_LENGTH}})`,
  'gu',
);

/** Extract unique, normalized (lowercased, no `#`) hashtags from text. */
export function extractHashtags(text: string | null | undefined): string[] {
  if (!text) return [];

  const found = new Set<string>();
  for (const match of text.matchAll(HASHTAG_PATTERN)) {
    const tag = match[1]?.toLowerCase();
    if (!tag) continue;
    found.add(tag);
    if (found.size >= HASHTAG_MAX_COUNT) break;
  }
  return [...found];
}

/** Normalize a raw tag (possibly with leading `#`) for lookups. */
export function normalizeHashtag(raw: string): string {
  return raw.trim().replace(/^#+/, '').toLowerCase();
}
