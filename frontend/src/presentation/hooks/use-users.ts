"use client";

import { useQuery } from "@tanstack/react-query";
import { appContainer } from "@/modules/app.container";
import { useAuthStore } from "@/presentation/stores/auth.store";

export const usersQueryKey = ["users"] as const;

export function useUsers() {
  const isAdmin = useAuthStore((s) => s.isAdmin());

  return useQuery({
    queryKey: usersQueryKey,
    queryFn: () => appContainer.userService.getAll(),
    enabled: isAdmin,
  });
}

export function useUserById(id: string | null) {
  const isAdmin = useAuthStore((s) => s.isAdmin());

  return useQuery({
    queryKey: [...usersQueryKey, id],
    queryFn: () => appContainer.userService.getById(id!),
    enabled: isAdmin && Boolean(id),
  });
}
