"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { CreateJobDto } from "@/core/application/dtos/create-job.dto";
import type { JobExperienceLevel } from "@/core/domain/entities/job.entity";
import type { JobFilters } from "@/core/domain/repositories/job.repository";
import type { EmploymentType } from "@/core/domain/enums/employment-type.enum";
import type { WorkplaceType } from "@/core/domain/enums/workplace-type.enum";
import { appContainer } from "@/modules/app.container";

export const jobsQueryKey = ["jobs"] as const;

export const DEFAULT_JOBS_PAGE_SIZE = 20;

export function useJobsFeed(
  filters: JobFilters = {},
  limit = DEFAULT_JOBS_PAGE_SIZE,
) {
  return useInfiniteQuery({
    queryKey: [...jobsQueryKey, filters, limit],
    queryFn: ({ pageParam }) =>
      appContainer.jobService.getFeed(filters, pageParam, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
  });
}

/** Page-number pagination (not infinite scroll) — used by the master/detail Jobs page. */
export function useJobsPage(
  filters: JobFilters = {},
  page = 1,
  limit = DEFAULT_JOBS_PAGE_SIZE,
) {
  return useQuery({
    queryKey: [...jobsQueryKey, "page", filters, page, limit],
    queryFn: () => appContainer.jobService.getFeed(filters, page, limit),
  });
}

export type CreateJobInput = {
  title: string;
  description: string;
  companyId?: string;
  companyName?: string;
  location?: string;
  applyUrl?: string;
  employmentType?: EmploymentType;
  workplaceType?: WorkplaceType;
  experienceLevel?: JobExperienceLevel;
};

export function useCreateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateJobInput) =>
      appContainer.jobService.create(
        new CreateJobDto(
          input.title,
          input.description,
          input.companyId,
          input.companyName,
          input.location,
          input.applyUrl,
          input.employmentType,
          input.workplaceType,
          input.experienceLevel,
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
