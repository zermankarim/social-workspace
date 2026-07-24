"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { CreateCommentDto } from "@/core/application/dtos/create-comment.dto";
import { CreatePostAttachmentDto } from "@/core/application/dtos/create-post-attachment.dto";
import { UpdateCommentDto } from "@/core/application/dtos/update-comment.dto";
import { appContainer } from "@/modules/app.container";
import { postsQueryKey } from "@/presentation/hooks/use-posts";

export const commentsQueryKey = ["comments"] as const;

/** Page size for comment lists — keeps payloads small even on viral posts. */
export const COMMENTS_PAGE_SIZE = 10;

export function usePostComments(postId: string, enabled = false) {
  return useInfiniteQuery({
    queryKey: [...commentsQueryKey, postId],
    queryFn: ({ pageParam }) =>
      appContainer.commentService.getByPost(
        postId,
        pageParam,
        COMMENTS_PAGE_SIZE,
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
    enabled,
    staleTime: 30_000,
    // Do not prefetch every post’s comments while scrolling the feed.
    refetchOnWindowFocus: false,
  });
}

type CommentAttachmentInput = {
  url: string;
  fileName: string;
  mimeType?: string | null;
  sizeBytes?: number | null;
};

export type { CommentAttachmentInput };

function toAttachmentDtos(attachments?: CommentAttachmentInput[]) {
  return attachments?.map(
    (attachment) =>
      new CreatePostAttachmentDto(
        attachment.url,
        attachment.fileName,
        attachment.mimeType,
        attachment.sizeBytes,
      ),
  );
}

export function useCreateComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: {
      textContent?: string;
      attachments?: CommentAttachmentInput[];
      parentId?: string;
    }) =>
      appContainer.commentService.create(
        postId,
        new CreateCommentDto(
          input.textContent,
          toAttachmentDtos(input.attachments),
          input.parentId,
        ),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postsQueryKey });
      queryClient.invalidateQueries({
        queryKey: [...commentsQueryKey, postId],
      });
    },
  });
}

export function useUpdateComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: {
      id: string;
      textContent?: string;
      attachments?: CommentAttachmentInput[];
    }) =>
      appContainer.commentService.update(
        input.id,
        new UpdateCommentDto(
          input.textContent,
          toAttachmentDtos(input.attachments),
        ),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postsQueryKey });
      queryClient.invalidateQueries({
        queryKey: [...commentsQueryKey, postId],
      });
    },
  });
}

export function useDeleteComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => appContainer.commentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postsQueryKey });
      queryClient.invalidateQueries({
        queryKey: [...commentsQueryKey, postId],
      });
    },
  });
}
