"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Smile } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  EMOJI_CATEGORIES,
  type EmojiCategoryLabelKey,
} from "@/presentation/lib/emoji-data";

type EmojiPickerButtonProps = {
  disabled?: boolean;
  onSelect: (emoji: string) => void;
  className?: string;
};

export function EmojiPickerButton({
  disabled = false,
  onSelect,
  className = "",
}: EmojiPickerButtonProps) {
  const t = useTranslations("emoji");
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] =
    useState<EmojiCategoryLabelKey>("smileys");
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const category =
    EMOJI_CATEGORIES.find((item) => item.labelKey === activeCategory) ??
    EMOJI_CATEGORIES[0]!;

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        disabled={disabled}
        aria-label={t("open")}
        aria-expanded={open}
        aria-controls={panelId}
        title={t("open")}
        className="inline-flex cursor-pointer items-center justify-center rounded-md p-2 text-muted transition-colors hover:bg-surface-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
        onClick={() => setOpen((current) => !current)}
      >
        <Smile className="h-5 w-5" aria-hidden />
      </button>

      {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-label={t("title")}
          className="absolute bottom-full left-0 z-30 mb-2 w-[min(100vw-2rem,288px)] overflow-hidden rounded-xl border border-border bg-surface shadow-card"
        >
          <div className="flex gap-1 border-b border-border px-2 py-1.5">
            {EMOJI_CATEGORIES.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`rounded-md px-2 py-1 text-xs font-semibold transition-colors ${
                  activeCategory === item.labelKey
                    ? "bg-primary-soft text-primary"
                    : "text-muted hover:bg-surface-muted hover:text-foreground"
                }`}
                onClick={() => setActiveCategory(item.labelKey)}
              >
                {t(`categories.${item.labelKey}`)}
              </button>
            ))}
          </div>

          <div className="grid max-h-52 grid-cols-8 gap-0.5 overflow-y-auto p-2">
            {category.emojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-lg leading-none transition-colors hover:bg-surface-muted"
                onClick={() => {
                  onSelect(emoji);
                  setOpen(false);
                }}
              >
                <span aria-hidden>{emoji}</span>
                <span className="sr-only">{emoji}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
