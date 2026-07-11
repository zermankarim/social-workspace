"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { PostLikeType } from "@/core/domain/enums/post-like-type.enum";
import { appContainer } from "@/modules/app.container";
import { postsQueryKey } from "@/presentation/hooks/use-posts";

export const likesQueryKey = ["likes"] as const;

export function usePostLikes(postId: string, enabled = false) {
  return useQuery({
    queryKey: [...likesQueryKey, postId],
    queryFn: () => appContainer.likeService.getByPost(postId, 1, 50),
    enabled,
  });
}

export function useUpsertLike(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (likeType: PostLikeType) =>
      appContainer.likeService.upsert(postId, likeType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postsQueryKey });
      queryClient.invalidateQueries({ queryKey: [...likesQueryKey, postId] });
    },
  });
}

export function useRemoveLike(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => appContainer.likeService.remove(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postsQueryKey });
      queryClient.invalidateQueries({ queryKey: [...likesQueryKey, postId] });
    },
  });
}
