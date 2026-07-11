"use client";

import { useEffect, useRef, useState } from "react";
import { ThumbsUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { PostLikeType } from "@/core/domain/enums/post-like-type.enum";
import {
  getReactionOption,
  REACTION_OPTIONS,
} from "@/presentation/lib/reactions";
import { formatEngagementCount } from "@/presentation/lib/format-engagement-count";

type PostReactionButtonProps = {
  myReaction: PostLikeType | null;
  count?: number;
  disabled?: boolean;
  onToggleDefault: () => void;
  onSelect: (type: PostLikeType) => void;
};

export function PostReactionButton({
  myReaction,
  count = 0,
  disabled = false,
  onToggleDefault,
  onSelect,
}: PostReactionButtonProps) {
  const t = useTranslations("feed.reactions");
  const [pickerOpen, setPickerOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const active = myReaction ? getReactionOption(myReaction) : null;
  const ActiveIcon = active?.icon ?? ThumbsUp;
  const label = active ? t(active.labelKey) : t("like");

  const clearTimers = () => {
    if (openTimerRef.current) clearTimeout(openTimerRef.current);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    openTimerRef.current = null;
    closeTimerRef.current = null;
  };

  const openPicker = () => {
    clearTimers();
    openTimerRef.current = setTimeout(() => setPickerOpen(true), 400);
  };

  const scheduleClose = () => {
    clearTimers();
    closeTimerRef.current = setTimeout(() => setPickerOpen(false), 200);
  };

  useEffect(() => {
    if (!pickerOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setPickerOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [pickerOpen]);

  useEffect(() => () => clearTimers(), []);

  return (
    <div
      ref={rootRef}
      className="relative flex-1"
      onMouseEnter={openPicker}
      onMouseLeave={scheduleClose}
    >
      {pickerOpen ? (
        <div
          role="listbox"
          aria-label={t("pickerLabel")}
          className="absolute bottom-full left-1/2 z-20 mb-2 flex -translate-x-1/2 gap-0.5 rounded-full border border-border bg-surface px-1.5 py-1 shadow-card"
          onMouseEnter={() => {
            clearTimers();
            setPickerOpen(true);
          }}
          onMouseLeave={scheduleClose}
        >
          {REACTION_OPTIONS.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.type}
                type="button"
                role="option"
                aria-selected={myReaction === option.type}
                disabled={disabled}
                title={t(option.labelKey)}
                className={`rounded-full p-1.5 transition-transform hover:scale-125 hover:bg-surface-muted ${
                  myReaction === option.type ? "bg-surface-muted" : ""
                }`}
                onClick={() => {
                  onSelect(option.type);
                  setPickerOpen(false);
                }}
              >
                <Icon className={`h-5 w-5 ${option.colorClass}`} aria-hidden />
                <span className="sr-only">{t(option.labelKey)}</span>
              </button>
            );
          })}
        </div>
      ) : null}

      <button
        type="button"
        disabled={disabled}
        aria-label={label}
        aria-pressed={myReaction !== null}
        title={label}
        className={`inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-md px-2 py-2.5 text-sm font-semibold tabular-nums transition-colors hover:bg-surface-muted disabled:pointer-events-none disabled:opacity-50 ${
          active ? active.colorClass : "text-muted hover:text-foreground"
        }`}
        onClick={onToggleDefault}
      >
        <ActiveIcon
          className={`h-[18px] w-[18px] ${active?.colorClass ?? ""}`}
          aria-hidden
          fill={
            myReaction === PostLikeType.SUPER ||
            myReaction === PostLikeType.LIKE
              ? "currentColor"
              : "none"
          }
        />
        {count > 0 ? <span>{formatEngagementCount(count)}</span> : null}
      </button>
    </div>
  );
}
