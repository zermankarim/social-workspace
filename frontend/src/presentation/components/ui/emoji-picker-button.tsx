"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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

type PanelCoords = {
  left: number;
  bottom: number;
  width: number;
};

function getPanelCoords(button: HTMLElement): PanelCoords {
  const rect = button.getBoundingClientRect();
  const width = Math.min(window.innerWidth - 16, 288);
  const gap = 8;
  let left = rect.left;
  left = Math.max(8, Math.min(left, window.innerWidth - width - 8));
  return {
    left,
    bottom: window.innerHeight - rect.top + gap,
    width,
  };
}

export function EmojiPickerButton({
  disabled = false,
  onSelect,
  className = "",
}: EmojiPickerButtonProps) {
  const t = useTranslations("emoji");
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] =
    useState<EmojiCategoryLabelKey>("smileys");
  const [coords, setCoords] = useState<PanelCoords | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useLayoutEffect(() => {
    if (!open) return;

    function updatePosition() {
      const button = buttonRef.current;
      if (!button) return;
      setCoords(getPanelCoords(button));
    }

    window.addEventListener("resize", updatePosition);
    // Capture scroll from nested overflow containers (chat list, etc.)
    window.addEventListener("scroll", updatePosition, true);
    // On-screen keyboard opening shrinks the visual viewport without firing `resize`.
    window.visualViewport?.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      window.visualViewport?.removeEventListener("resize", updatePosition);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        buttonRef.current?.contains(target) ||
        panelRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
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

  const panel =
    open && coords ? (
      <div
        ref={panelRef}
        id={panelId}
        role="dialog"
        aria-label={t("title")}
        className="fixed z-[80] overflow-hidden rounded-xl border border-border bg-surface shadow-card"
        style={{
          left: coords.left,
          bottom: coords.bottom,
          width: coords.width,
        }}
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
    ) : null;

  return (
    <div className={className}>
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        aria-label={t("open")}
        aria-expanded={open}
        aria-controls={panelId}
        title={t("open")}
        className="inline-flex cursor-pointer items-center justify-center rounded-md p-2 text-muted transition-colors hover:bg-surface-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
        onClick={() => {
          if (open) {
            setOpen(false);
            return;
          }
          const button = buttonRef.current;
          if (button) setCoords(getPanelCoords(button));
          setOpen(true);
        }}
      >
        <Smile className="h-5 w-5" aria-hidden />
      </button>

      {typeof document !== "undefined" && panel
        ? createPortal(panel, document.body)
        : null}
    </div>
  );
}
