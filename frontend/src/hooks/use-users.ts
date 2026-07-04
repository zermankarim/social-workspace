"use client";

import { useQuery } from "@tanstack/react-query";
import { usersApi } from "@/lib/api/users";
import { useAuthStore } from "@/stores/auth-store";

export function useUsers() {
  const isAdmin = useAuthStore((s) => s.isAdmin());

  return useQuery({
    queryKey: ["users"],
    queryFn: () => usersApi.getAll(),
    enabled: isAdmin,
  });
}

export function useUserById(id: string | null) {
  const isAdmin = useAuthStore((s) => s.isAdmin());

  return useQuery({
    queryKey: ["users", id],
    queryFn: () => usersApi.getById(id!),
    enabled: isAdmin && Boolean(id),
  });
}
