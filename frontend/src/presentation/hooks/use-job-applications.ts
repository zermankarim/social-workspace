"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type {
  ApplyToJobInput,
  DecideJobApplicationInput,
} from "@/core/domain/repositories/job-application.repository";
import { appContainer } from "@/modules/app.container";

export const jobApplicationsQueryKey = ["job-applications"] as const;
export const sentApplicationsKey = [
  ...jobApplicationsQueryKey,
  "sent",
] as const;
export const receivedApplicationsKey = [
  ...jobApplicationsQueryKey,
  "received",
] as const;

const DEFAULT_PAGE_SIZE = 20;

function invalidateApplications(
  queryClient: ReturnType<typeof useQueryClient>,
) {
  void queryClient.invalidateQueries({ queryKey: jobApplicationsQueryKey });
  void queryClient.invalidateQueries({ queryKey: ["jobs"] });
}

export function useApplyToJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ jobId, ...input }: { jobId: string } & ApplyToJobInput) =>
      appContainer.jobApplicationService.apply(jobId, input),
    onSuccess: () => invalidateApplications(queryClient),
  });
}

export function useJobApplicationsForJob(
  jobId: string | undefined,
  limit = DEFAULT_PAGE_SIZE,
) {
  return useInfiniteQuery({
    queryKey: [...jobApplicationsQueryKey, "for-job", jobId, limit],
    queryFn: ({ pageParam }) =>
      appContainer.jobApplicationService.listForJob(jobId!, pageParam, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
    enabled: Boolean(jobId),
  });
}

export function useSentApplications(limit = DEFAULT_PAGE_SIZE) {
  return useInfiniteQuery({
    queryKey: [...sentApplicationsKey, limit],
    queryFn: ({ pageParam }) =>
      appContainer.jobApplicationService.listSent(pageParam, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
  });
}

export function useReceivedApplications(limit = DEFAULT_PAGE_SIZE) {
  return useInfiniteQuery({
    queryKey: [...receivedApplicationsKey, limit],
    queryFn: ({ pageParam }) =>
      appContainer.jobApplicationService.listReceived(pageParam, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
  });
}

export function useWithdrawApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => appContainer.jobApplicationService.withdraw(id),
    onSuccess: () => invalidateApplications(queryClient),
  });
}

export function useDecideApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...input
    }: { id: string } & DecideJobApplicationInput) =>
      appContainer.jobApplicationService.decide(id, input),
    onSuccess: () => invalidateApplications(queryClient),
  });
}

export function useLastContactInfo(enabled = true) {
  return useQuery({
    queryKey: [...jobApplicationsQueryKey, "last-contact"],
    queryFn: () => appContainer.jobApplicationService.getLastContactInfo(),
    enabled,
  });
}
