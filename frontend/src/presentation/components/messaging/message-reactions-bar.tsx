"use client";

import { useMemo, useState } from "react";
import { SmilePlus } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Message } from "@/core/domain/entities/message.entity";
import { useSetMessageReaction } from "@/presentation/hooks/use-conversations";

const QUICK_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🎉"] as const;

type MessageReactionsProps = {
  message: Message;
  conversationId: string;
  currentUserId: string;
  isOwn: boolean;
};

export function MessageReactionsBar({
  message,
  conversationId,
  currentUserId,
  isOwn,
}: MessageReactionsProps) {
  const t = useTranslations("messaging");
  const setReaction = useSetMessageReaction(conversationId);
  const [pickerOpen, setPickerOpen] = useState(false);
  const myReaction = message.myReaction(currentUserId);

  const grouped = useMemo(() => {
    const map = new Map<
      string,
      { emoji: string; count: number; mine: boolean }
    >();
    for (const reaction of message.reactions) {
      const current = map.get(reaction.emoji) ?? {
        emoji: reaction.emoji,
        count: 0,
        mine: false,
      };
      current.count += 1;
      if (reaction.userId === currentUserId) current.mine = true;
      map.set(reaction.emoji, current);
    }
    return [...map.values()];
  }, [message.reactions, currentUserId]);

  if (message.isDeleted) return null;

  const toggle = (emoji: string) => {
    setPickerOpen(false);
    if (myReaction?.emoji === emoji) {
      setReaction.mutate({ messageId: message.id, emoji: null });
      return;
    }
    setReaction.mutate({ messageId: message.id, emoji });
  };

  return (
    <div
      className={`mt-1 flex flex-wrap items-center gap-1 ${
        isOwn ? "justify-end" : "justify-start"
      }`}
    >
      {grouped.map((group) => (
        <button
          key={group.emoji}
          type="button"
          disabled={setReaction.isPending}
          onClick={() => toggle(group.emoji)}
          className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[11px] transition-colors ${
            group.mine
              ? "border-primary bg-primary-soft text-primary"
              : "border-border bg-surface text-foreground hover:bg-surface-muted"
          }`}
          aria-label={t("reactionCount", {
            emoji: group.emoji,
            count: group.count,
          })}
        >
          <span>{group.emoji}</span>
          <span className="tabular-nums">{group.count}</span>
        </button>
      ))}

      <div className="relative">
        <button
          type="button"
          disabled={setReaction.isPending}
          onClick={() => setPickerOpen((open) => !open)}
          className="inline-flex h-6 w-6 items-center justify-center rounded-full text-muted hover:bg-surface-muted hover:text-foreground"
          aria-label={t("addReaction")}
          aria-expanded={pickerOpen}
        >
          <SmilePlus className="h-3.5 w-3.5" aria-hidden />
        </button>
        {pickerOpen ? (
          <div
            className={`absolute bottom-full z-10 mb-1 flex gap-0.5 rounded-full border border-border bg-surface p-1 shadow-card ${
              isOwn ? "right-0" : "left-0"
            }`}
          >
            {QUICK_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                className="rounded-full px-1.5 py-0.5 text-sm hover:bg-surface-muted"
                onClick={() => toggle(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
