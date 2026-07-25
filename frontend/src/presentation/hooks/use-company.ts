"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CreateCompanyInput,
  UpdateCompanyInput,
} from "@/core/domain/repositories/company.repository";
import { useDebouncedValue } from "@/presentation/hooks/use-debounced-value";
import { appContainer } from "@/modules/app.container";

export const companyQueryKey = ["company"] as const;

export function useCompany(name: string | undefined) {
  return useQuery({
    queryKey: [...companyQueryKey, "by-name", name ?? ""],
    queryFn: () => appContainer.companyService.getByName(name!),
    enabled: Boolean(name),
  });
}

/**
 * `minLength` gates when a fetch fires: 0 (directory pages — browse everything
 * by default) vs 1 (autocomplete comboboxes — don't dump the full list before typing).
 */
export function useCompanySearch(query: string, enabled = true, minLength = 0) {
  const debounced = useDebouncedValue(query, 250);
  return useQuery({
    queryKey: [...companyQueryKey, "search", debounced],
    queryFn: () => appContainer.companyService.search(debounced),
    enabled: enabled && debounced.trim().length >= minLength,
  });
}

function invalidateCompany(
  queryClient: ReturnType<typeof useQueryClient>,
  name?: string,
) {
  void queryClient.invalidateQueries({ queryKey: companyQueryKey });
  if (name) {
    void queryClient.invalidateQueries({
      queryKey: [...companyQueryKey, "by-name", name],
    });
  }
}

export function useCreateCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateCompanyInput) =>
      appContainer.companyService.create(input),
    onSuccess: () => invalidateCompany(queryClient),
  });
}

export function useUpdateCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      id: string;
      name: string;
      data: UpdateCompanyInput;
    }) => appContainer.companyService.update(input.id, input.data),
    onSuccess: (_data, variables) =>
      invalidateCompany(queryClient, variables.name),
  });
}

export function useAddCompanyService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      companyId: string;
      name: string;
      companyName: string;
      description?: string;
    }) =>
      appContainer.companyService.addService(
        input.companyId,
        input.name,
        input.description,
      ),
    onSuccess: (_data, variables) =>
      invalidateCompany(queryClient, variables.companyName),
  });
}

export function useRemoveCompanyService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      companyId: string;
      serviceId: string;
      companyName: string;
    }) =>
      appContainer.companyService.removeService(
        input.companyId,
        input.serviceId,
      ),
    onSuccess: (_data, variables) =>
      invalidateCompany(queryClient, variables.companyName),
  });
}

export function useAddCompanyAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      companyId: string;
      userId: string;
      companyName: string;
    }) => appContainer.companyService.addAdmin(input.companyId, input.userId),
    onSuccess: (_data, variables) =>
      invalidateCompany(queryClient, variables.companyName),
  });
}

export function useRemoveCompanyAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      companyId: string;
      userId: string;
      companyName: string;
    }) =>
      appContainer.companyService.removeAdmin(input.companyId, input.userId),
    onSuccess: (_data, variables) =>
      invalidateCompany(queryClient, variables.companyName),
  });
}

export function useFollowCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { companyId: string; companyName: string }) =>
      appContainer.companyService.follow(input.companyId),
    onSuccess: (_data, variables) =>
      invalidateCompany(queryClient, variables.companyName),
  });
}

export function useUnfollowCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { companyId: string; companyName: string }) =>
      appContainer.companyService.unfollow(input.companyId),
    onSuccess: (_data, variables) =>
      invalidateCompany(queryClient, variables.companyName),
  });
}
