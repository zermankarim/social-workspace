"use client";

import { Image as ImageIcon, CalendarDays, Newspaper } from "lucide-react";
import type { User } from "@/core/domain/entities/user.entity";
import { FeedCard } from "@/presentation/components/feed/feed-card";
import { Button } from "@/presentation/components/ui/button";

type PostComposerProps = {
  user: User;
};

function getInitials(user: User): string {
  const fromName = `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`;
  if (fromName.trim()) return fromName.toUpperCase();
  return (user.email.split("@")[0] ?? "U").slice(0, 2).toUpperCase();
}

export function PostComposer({ user }: PostComposerProps) {
  return (
    <FeedCard className="px-4 py-3">
      <div className="flex items-center gap-2">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-soft text-sm font-semibold text-primary">
          {getInitials(user)}
        </div>
        <button
          type="button"
          disabled
          className="h-12 flex-1 rounded-full border border-border-strong px-4 text-left text-sm text-muted hover:bg-surface-muted disabled:cursor-not-allowed"
        >
          Start a post
        </button>
      </div>
      <div className="mt-2 flex items-center justify-around gap-1">
        <Button
          variant="ghost"
          disabled
          className="gap-1.5 text-xs font-semibold"
        >
          <ImageIcon className="h-5 w-5 text-accent" aria-hidden />
          Media
        </Button>
        <Button
          variant="ghost"
          disabled
          className="gap-1.5 text-xs font-semibold"
        >
          <CalendarDays className="h-5 w-5 text-primary" aria-hidden />
          Event
        </Button>
        <Button
          variant="ghost"
          disabled
          className="gap-1.5 text-xs font-semibold"
        >
          <Newspaper className="h-5 w-5 text-[#e06847]" aria-hidden />
          Write article
        </Button>
      </div>
      <p className="mt-1 text-center text-[10px] text-muted">
        Posting will be available when the posts API ships.
      </p>
    </FeedCard>
  );
}
