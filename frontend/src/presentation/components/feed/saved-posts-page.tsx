"use client";

import { AlertCircle, Bookmark, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { ApiError } from "@/core/application/errors/api.error";
import { FeedCard } from "@/presentation/components/feed/feed-card";
import { FeedPostCard } from "@/presentation/components/feed/feed-post-card";
import { Button } from "@/presentation/components/ui/button";
import { useSavedPosts } from "@/presentation/hooks/use-posts";
import { useAuthStore } from "@/presentation/stores/auth.store";

export function SavedPostsPage() {
  const t = useTranslations("saved");
  const tCommon = useTranslations("common");
  const user = useAuthStore((s) => s.user);
  const {
    data,
    isLoading,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useSavedPosts();

  if (!user) return null;

  const posts = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="mx-auto w-full max-w-[600px] space-y-2">
      <FeedCard className="flex items-center gap-2 px-4 py-3">
        <Bookmark className="h-5 w-5 text-primary" aria-hidden />
        <h1 className="text-lg font-semibold text-foreground">{t("title")}</h1>
      </FeedCard>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden />
        </div>
      ) : error ? (
        <FeedCard className="px-4 py-8 text-center">
          <p className="inline-flex items-center gap-2 text-sm text-danger">
            <AlertCircle className="h-4 w-4" aria-hidden />
            {error instanceof ApiError ? error.message : t("loadFailed")}
          </p>
        </FeedCard>
      ) : posts.length > 0 ? (
        <>
          {posts.map((post) => (
            <FeedPostCard
              key={post.id}
              post={post}
              currentUser={user}
              initialSaved
            />
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
        <FeedCard className="px-4 py-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-primary">
            <Bookmark className="h-7 w-7" aria-hidden />
          </div>
          <p className="mt-4 text-sm font-medium text-foreground">
            {t("emptyTitle")}
          </p>
          <p className="mt-1 text-sm text-muted">{t("emptyHint")}</p>
        </FeedCard>
      )}
    </div>
  );
}
