"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { appContainer } from "@/modules/app.container";
import type { NewsStory } from "@/core/domain/entities/news-story.entity";

export const newsQueryKey = ["news"] as const;
export const newsListQueryKey = [...newsQueryKey, "list"] as const;
export const newsDetailQueryKey = (id: string) =>
  [...newsQueryKey, "detail", id] as const;

export function useNewsStories(limit = 8) {
  return useQuery({
    queryKey: [...newsListQueryKey, limit],
    queryFn: () => appContainer.newsService.list(limit),
    staleTime: 60_000,
  });
}

export function useNewsStory(id: string) {
  return useQuery({
    queryKey: newsDetailQueryKey(id),
    queryFn: () => appContainer.newsService.getById(id),
    enabled: Boolean(id),
    staleTime: 60_000,
  });
}

export function useCreateNewsStory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      title: string;
      summary?: string;
      body?: string;
      url?: string;
    }) => appContainer.newsService.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: newsListQueryKey });
    },
  });
}

export function useRegisterNewsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => appContainer.newsService.registerRead(id),
    onSuccess: (story) => {
      queryClient.setQueriesData<NewsStory[]>(
        { queryKey: newsListQueryKey },
        (current) => {
          if (!current) return current;
          return current.map((item) =>
            item.id === story.id
              ? item.withReadersCount(story.readersCount)
              : item,
          );
        },
      );
      queryClient.setQueryData<NewsStory>(
        newsDetailQueryKey(story.id),
        (current) => current?.withReadersCount(story.readersCount),
      );
    },
  });
}
