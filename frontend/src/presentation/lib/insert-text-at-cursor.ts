/**
 * Inserts text at the current caret position of a textarea/input.
 * Falls back to appending when the element is not focused or has no selection.
 */
export function insertTextAtCursor(
  element: HTMLTextAreaElement | HTMLInputElement | null,
  text: string,
  value: string,
): { nextValue: string; nextCaret: number } {
  if (!element) {
    const nextValue = `${value}${text}`;
    return { nextValue, nextCaret: nextValue.length };
  }

  const start = element.selectionStart ?? value.length;
  const end = element.selectionEnd ?? value.length;
  const nextValue = `${value.slice(0, start)}${text}${value.slice(end)}`;
  const nextCaret = start + text.length;

  return { nextValue, nextCaret };
}

export function restoreTextareaCaret(
  element: HTMLTextAreaElement | HTMLInputElement | null,
  caret: number,
): void {
  if (!element) return;
  element.focus();
  element.setSelectionRange(caret, caret);
}
