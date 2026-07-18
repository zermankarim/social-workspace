/**
 * Client-side hashtag parsing for rendering. Mirrors the backend extraction:
 * a `#` at the start of the text or after whitespace, followed by unicode
 * letters/digits/underscore.
 */

export type HashtagSegment =
  | { type: "text"; value: string }
  | { type: "hashtag"; value: string; tag: string };

const HASHTAG_PATTERN = /(^|\s)(#[\p{L}\p{N}_]{1,64})/gu;

export function parseHashtagSegments(text: string): HashtagSegment[] {
  const segments: HashtagSegment[] = [];
  const pattern = new RegExp(HASHTAG_PATTERN.source, "gu");
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    const leading = match[1] ?? "";
    const token = match[2]!;
    const tokenStart = match.index + leading.length;

    if (tokenStart > lastIndex) {
      segments.push({ type: "text", value: text.slice(lastIndex, tokenStart) });
    }

    segments.push({
      type: "hashtag",
      value: token,
      tag: token.slice(1).toLowerCase(),
    });
    lastIndex = tokenStart + token.length;
  }

  if (lastIndex < text.length) {
    segments.push({ type: "text", value: text.slice(lastIndex) });
  }

  return segments;
}
