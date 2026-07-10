"use client";

import { FeedLeftRail } from "@/presentation/components/feed/feed-left-rail";
import { FeedPostCard } from "@/presentation/components/feed/feed-post-card";
import { FeedRightRail } from "@/presentation/components/feed/feed-right-rail";
import { PostComposer } from "@/presentation/components/feed/post-composer";
import { MOCK_FEED_POSTS } from "@/presentation/mocks/feed.mock";
import { useAuthStore } from "@/presentation/stores/auth.store";

export function FeedPage() {
  const user = useAuthStore((s) => s.user);

  if (!user) return null;

  return (
    <div className="grid items-start gap-2 lg:grid-cols-[225px_minmax(0,1fr)] xl:grid-cols-[225px_minmax(0,1fr)_300px]">
      <div className="hidden lg:block">
        <FeedLeftRail user={user} />
      </div>

      <div className="mx-auto w-full max-w-[552px] space-y-2 lg:mx-0 lg:max-w-none">
        <div className="lg:hidden">
          <FeedLeftRail user={user} />
        </div>
        <PostComposer user={user} />
        <div className="flex items-center gap-2 px-1 py-1 text-xs text-muted">
          <span className="h-px flex-1 bg-border" />
          Sort by: Top
          <span className="h-px flex-1 bg-border" />
        </div>
        {MOCK_FEED_POSTS.map((post) => (
          <FeedPostCard key={post.id} post={post} />
        ))}
      </div>

      <div className="hidden xl:block">
        <FeedRightRail />
      </div>
    </div>
  );
}
