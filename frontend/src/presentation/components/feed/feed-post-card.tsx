"use client";

import {
  MessageCircle,
  Repeat2,
  Send,
  ThumbsUp,
  MoreHorizontal,
  Globe2,
} from "lucide-react";
import type { MockFeedPost } from "@/presentation/mocks/feed.mock";
import { FeedCard } from "@/presentation/components/feed/feed-card";
import { Button } from "@/presentation/components/ui/button";

type FeedPostCardProps = {
  post: MockFeedPost;
};

export function FeedPostCard({ post }: FeedPostCardProps) {
  return (
    <FeedCard className="px-4 pt-3 pb-1">
      <div className="flex items-start gap-2">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-soft text-sm font-semibold text-primary">
          {post.author.avatarInitials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                {post.author.name}
              </p>
              <p className="truncate text-xs text-muted">
                {post.author.headline}
              </p>
              <p className="flex items-center gap-1 text-xs text-muted">
                {post.createdAtLabel}
                <Globe2 className="h-3 w-3" aria-hidden />
              </p>
            </div>
            <button
              type="button"
              className="rounded-full p-1 text-muted hover:bg-surface-muted"
              aria-label="More"
              disabled
            >
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
        {post.body}
      </p>

      <div className="mt-3 flex items-center justify-between border-b border-border pb-2 text-xs text-muted">
        <span>{post.likes} reactions</span>
        <span>
          {post.comments} comments · {post.reposts} reposts
        </span>
      </div>

      <div className="grid grid-cols-4 gap-1 py-1">
        {(
          [
            { icon: ThumbsUp, label: "Like" },
            { icon: MessageCircle, label: "Comment" },
            { icon: Repeat2, label: "Repost" },
            { icon: Send, label: "Send" },
          ] as const
        ).map(({ icon: Icon, label }) => (
          <Button
            key={label}
            variant="ghost"
            disabled
            className="gap-1.5 rounded-md px-1 text-xs font-semibold"
          >
            <Icon className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">{label}</span>
          </Button>
        ))}
      </div>
    </FeedCard>
  );
}
