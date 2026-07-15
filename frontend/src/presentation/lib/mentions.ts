/**
 * Mention tokens stored in post/comment textContent:
 * @[Display Name](uuid)
 */

export const MENTION_TOKEN_PATTERN =
  /@\[([^\]]+)\]\(([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\)/gi;

export type MentionSegment =
  | { type: "text"; value: string }
  | { type: "mention"; displayName: string; userId: string };

export type ActiveMentionQuery = {
  /** Absolute index of the `@` that starts the incomplete mention. */
  start: number;
  /** Query text after `@` (may be empty). */
  query: string;
};

export function formatMentionToken(
  displayName: string,
  userId: string,
): string {
  const safeName = displayName.replace(/[\[\]]/g, "").trim() || "User";
  return `@[${safeName}](${userId})`;
}

export function parseMentionSegments(text: string): MentionSegment[] {
  const segments: MentionSegment[] = [];
  const pattern = new RegExp(MENTION_TOKEN_PATTERN.source, "gi");
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        type: "text",
        value: text.slice(lastIndex, match.index),
      });
    }
    segments.push({
      type: "mention",
      displayName: match[1]!,
      userId: match[2]!,
    });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    segments.push({ type: "text", value: text.slice(lastIndex) });
  }

  return segments;
}

/** Flat preview for lists/toasts — `@Name` instead of raw tokens. */
export function formatMentionsForPreview(text: string): string {
  return parseMentionSegments(text)
    .map((segment) =>
      segment.type === "mention" ? `@${segment.displayName}` : segment.value,
    )
    .join("");
}

/**
 * Detect an incomplete @mention being typed at the caret.
 * Skips completed `@[Name](id)` tokens.
 */
export function getActiveMentionQuery(
  text: string,
  caret: number,
): ActiveMentionQuery | null {
  const before = text.slice(0, Math.max(0, caret));
  const atIndex = before.lastIndexOf("@");
  if (atIndex < 0) return null;

  const afterAt = before.slice(atIndex + 1);
  if (/[\s\n]/.test(afterAt)) return null;

  // Already a completed token ending at caret? e.g. @[Name](uuid)|
  const completed = before.match(
    /@\[[^\]]*\]\([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\)$/i,
  );
  if (completed) return null;

  // Caret inside a completed token — don't open picker
  const fromAt = text.slice(atIndex);
  const tokenAtCaret = fromAt.match(
    /^@\[[^\]]*\]\([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\)/i,
  );
  if (tokenAtCaret && caret <= atIndex + tokenAtCaret[0].length) {
    return null;
  }

  // Disallow `[` mid-query (token drafting)
  if (afterAt.includes("[")) return null;

  return { start: atIndex, query: afterAt };
}

export function insertMentionToken(
  text: string,
  caret: number,
  mentionStart: number,
  displayName: string,
  userId: string,
): { nextValue: string; nextCaret: number } {
  const token = `${formatMentionToken(displayName, userId)} `;
  const nextValue = `${text.slice(0, mentionStart)}${token}${text.slice(caret)}`;
  const nextCaret = mentionStart + token.length;
  return { nextValue, nextCaret };
}
