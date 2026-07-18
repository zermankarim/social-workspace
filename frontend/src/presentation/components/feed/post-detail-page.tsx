"use client";

import { AlertCircle, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { ApiError } from "@/core/application/errors/api.error";
import { FeedCard } from "@/presentation/components/feed/feed-card";
import { FeedPostCard } from "@/presentation/components/feed/feed-post-card";
import { usePost } from "@/presentation/hooks/use-posts";
import { useAuthStore } from "@/presentation/stores/auth.store";

type PostDetailPageProps = {
  postId: string;
};

export function PostDetailPage({ postId }: PostDetailPageProps) {
  const t = useTranslations("feed");
  const user = useAuthStore((state) => state.user);
  const { data: post, isLoading, error } = usePost(postId);

  if (!user) return null;

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden />
      </div>
    );
  }

  if (error || !post) {
    return (
      <FeedCard className="mx-auto max-w-[600px] px-4 py-8 text-center">
        <p className="inline-flex items-center gap-2 text-sm text-danger">
          <AlertCircle className="h-4 w-4" aria-hidden />
          {error instanceof ApiError ? error.message : t("loadFailed")}
        </p>
      </FeedCard>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[600px]">
      <FeedPostCard post={post} currentUser={user} />
    </div>
  );
}
