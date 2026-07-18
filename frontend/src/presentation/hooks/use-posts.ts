"use client";

import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { CreatePostAttachmentDto } from "@/core/application/dtos/create-post-attachment.dto";
import { CreatePostDto } from "@/core/application/dtos/create-post.dto";
import { PostFeedQueryDto } from "@/core/application/dtos/post-feed-query.dto";
import { PostsByAuthorQueryDto } from "@/core/application/dtos/posts-by-author-query.dto";
import { UpdatePostDto } from "@/core/application/dtos/update-post.dto";
import { appContainer } from "@/modules/app.container";

export const postsQueryKey = ["posts"] as const;
export const postsFeedQueryKey = [...postsQueryKey, "feed"] as const;

export const DEFAULT_POST_PAGE_SIZE = 20;

export function useFeedPosts(limit = DEFAULT_POST_PAGE_SIZE) {
  return useInfiniteQuery({
    queryKey: [...postsFeedQueryKey, limit],
    queryFn: ({ pageParam }) =>
      appContainer.postService.getFeed(new PostFeedQueryDto(pageParam, limit)),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
  });
}

export function usePostsByAuthor(
  authorId: string | null,
  page = 1,
  limit = DEFAULT_POST_PAGE_SIZE,
) {
  return useQuery({
    queryKey: [...postsQueryKey, "by-author", authorId, page, limit],
    queryFn: () =>
      appContainer.postService.getByAuthor(
        new PostsByAuthorQueryDto(authorId!, page, limit),
      ),
    enabled: Boolean(authorId),
    placeholderData: keepPreviousData,
  });
}

export function usePost(id: string | null) {
  return useQuery({
    queryKey: [...postsQueryKey, "detail", id],
    queryFn: () => appContainer.postService.getById(id!),
    enabled: Boolean(id),
  });
}

export type PostAttachmentInput = {
  url: string;
  fileName: string;
  mimeType?: string | null;
  sizeBytes?: number | null;
};

type CreatePostInput = {
  textContent?: string;
  attachments?: PostAttachmentInput[];
};

type UpdatePostInput = {
  id: string;
  textContent?: string;
  attachments?: PostAttachmentInput[];
};

function toAttachmentDtos(attachments?: PostAttachmentInput[]) {
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

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreatePostInput) =>
      appContainer.postService.create(
        new CreatePostDto(
          input.textContent,
          toAttachmentDtos(input.attachments),
        ),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postsQueryKey });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, textContent, attachments }: UpdatePostInput) =>
      appContainer.postService.update(
        id,
        new UpdatePostDto(textContent, toAttachmentDtos(attachments)),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postsQueryKey });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => appContainer.postService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postsQueryKey });
    },
  });
}

export function useRepostPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, textContent }: { id: string; textContent?: string }) =>
      appContainer.postService.repost(id, textContent),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postsQueryKey });
    },
  });
}

export const savedPostsQueryKey = [...postsQueryKey, "saved"] as const;

export function useSavedPosts(limit = DEFAULT_POST_PAGE_SIZE) {
  return useInfiniteQuery({
    queryKey: [...savedPostsQueryKey, limit],
    queryFn: ({ pageParam }) =>
      appContainer.postService.getSaved(new PostFeedQueryDto(pageParam, limit)),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
  });
}

export function useSavePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, saved }: { id: string; saved: boolean }) =>
      saved
        ? appContainer.postService.unsave(id)
        : appContainer.postService.save(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: savedPostsQueryKey });
    },
  });
}
