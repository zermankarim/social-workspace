export const COMMENT_TEXT_MAX_LENGTH = 3000;
export const COMMENT_ATTACHMENTS_MAX_COUNT = 5;

export function hasCommentContent(
  text: string,
  attachmentCount: number,
): boolean {
  return text.trim().length > 0 || attachmentCount > 0;
}
