"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { CreateJobDto } from "@/core/application/dtos/create-job.dto";
import { appContainer } from "@/modules/app.container";

export const jobsQueryKey = ["jobs"] as const;

export const DEFAULT_JOBS_PAGE_SIZE = 20;

export function useJobsFeed(limit = DEFAULT_JOBS_PAGE_SIZE) {
  return useInfiniteQuery({
    queryKey: [...jobsQueryKey, limit],
    queryFn: ({ pageParam }) =>
      appContainer.jobService.getFeed(pageParam, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
  });
}

export type CreateJobInput = {
  title: string;
  companyName: string;
  location?: string;
  description: string;
  applyUrl: string;
};

export function useCreateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateJobInput) =>
      appContainer.jobService.create(
        new CreateJobDto(
          input.title,
          input.companyName,
          input.description,
          input.applyUrl,
          input.location,
        ),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobsQueryKey });
    },
  });
}

export function useDeleteJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => appContainer.jobService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobsQueryKey });
    },
  });
}
