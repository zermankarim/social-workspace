export const POST_TEXT_MAX_LENGTH = 5000;
export const POST_ATTACHMENTS_MAX_COUNT = 10;

export function hasPostContent(text: string, attachmentCount: number): boolean {
  return text.trim().length > 0 || attachmentCount > 0;
}
