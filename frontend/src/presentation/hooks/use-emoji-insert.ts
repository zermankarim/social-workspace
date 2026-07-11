"use client";

import { useCallback, type RefObject } from "react";
import {
  insertTextAtCursor,
  restoreTextareaCaret,
} from "@/presentation/lib/insert-text-at-cursor";

export function useEmojiInsert(
  textareaRef: RefObject<HTMLTextAreaElement | null>,
  value: string,
  setValue: (next: string) => void,
  maxLength: number,
) {
  return useCallback(
    (emoji: string) => {
      const { nextValue, nextCaret } = insertTextAtCursor(
        textareaRef.current,
        emoji,
        value,
      );
      const clipped = nextValue.slice(0, maxLength);
      const caret = Math.min(nextCaret, clipped.length);
      setValue(clipped);
      requestAnimationFrame(() => {
        restoreTextareaCaret(textareaRef.current, caret);
      });
    },
    [maxLength, setValue, textareaRef, value],
  );
}
