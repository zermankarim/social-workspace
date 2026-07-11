"use client";

import { AlertCircle, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { ApiError } from "@/core/application/errors/api.error";
import { FeedLeftRail } from "@/presentation/components/feed/feed-left-rail";
import { FeedPostCard } from "@/presentation/components/feed/feed-post-card";
import { FeedRightRail } from "@/presentation/components/feed/feed-right-rail";
import { PostComposer } from "@/presentation/components/feed/post-composer";
import { Button } from "@/presentation/components/ui/button";
import { useFeedPosts } from "@/presentation/hooks/use-posts";
import { useAuthStore } from "@/presentation/stores/auth.store";

export function FeedPage() {
  const t = useTranslations("feed");
  const tCommon = useTranslations("common");
  const user = useAuthStore((s) => s.user);
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
  } = useFeedPosts();

  if (!user) return null;

  const posts = data?.pages.flatMap((page) => page.data) ?? [];

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
          {t("sortNewest")}
          <span className="h-px flex-1 bg-border" />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2
              className="h-8 w-8 animate-spin text-primary"
              aria-hidden
            />
          </div>
        ) : error ? (
          <div className="rounded-lg bg-surface px-4 py-8 text-center shadow-card">
            <p className="inline-flex items-center gap-2 text-sm text-danger">
              <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
              {error instanceof ApiError ? error.message : t("loadFailed")}
            </p>
          </div>
        ) : posts.length > 0 ? (
          <>
            {posts.map((post) => (
              <FeedPostCard key={post.id} post={post} currentUserId={user.id} />
            ))}
            {hasNextPage ? (
              <div className="flex justify-center py-3">
                <Button
                  type="button"
                  variant="secondary"
                  disabled={isFetchingNextPage}
                  onClick={() => void fetchNextPage()}
                  className="gap-1.5"
                >
                  {isFetchingNextPage ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  ) : null}
                  {tCommon("loadMore")}
                </Button>
              </div>
            ) : null}
          </>
        ) : (
          <div className="rounded-lg bg-surface px-4 py-10 text-center shadow-card">
            <p className="text-sm font-medium text-foreground">
              {t("emptyTitle")}
            </p>
            <p className="mt-1 text-sm text-muted">{t("emptyHint")}</p>
          </div>
        )}
      </div>

      <div className="hidden xl:block">
        <FeedRightRail />
      </div>
    </div>
  );
}
