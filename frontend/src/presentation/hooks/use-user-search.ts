"use client";

import { useQuery } from "@tanstack/react-query";
import { appContainer } from "@/modules/app.container";
import { useDebouncedValue } from "@/presentation/hooks/use-debounced-value";

export function useUserSearch(query: string, enabled = true) {
  const debounced = useDebouncedValue(query, 250);

  return useQuery({
    queryKey: ["users", "search", debounced],
    queryFn: () => appContainer.profileService.searchUsers(debounced, 1, 8),
    enabled: enabled && debounced.trim().length >= 1,
  });
}
