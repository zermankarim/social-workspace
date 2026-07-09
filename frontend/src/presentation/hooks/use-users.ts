"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { UserQueryDto } from "@/core/application/dtos/user-query.dto";
import { TodoOrderBy } from "@/core/domain/enums/todo-order-by.enum";
import { TodoSortBy } from "@/core/domain/enums/todo-sort-by.enum";
import { appContainer } from "@/modules/app.container";
import { useAuthStore } from "@/presentation/stores/auth.store";

export const usersQueryKey = ["users"] as const;

export const DEFAULT_USER_PAGE_SIZE = 20;

export type UserListParams = {
  page: number;
  limit?: number;
  sortBy: TodoSortBy;
  orderBy: TodoOrderBy;
  search?: string;
};

export function useUsers({
  page,
  limit = DEFAULT_USER_PAGE_SIZE,
  sortBy,
  orderBy,
  search,
}: UserListParams) {
  const isAdmin = useAuthStore((s) => s.isAdmin());

  return useQuery({
    queryKey: [...usersQueryKey, page, limit, sortBy, orderBy, search ?? ""],
    queryFn: () =>
      appContainer.userService.getPaginated(
        new UserQueryDto(page, limit, sortBy, orderBy, search),
      ),
    enabled: isAdmin,
    placeholderData: keepPreviousData,
  });
}

export function useUserById(id: string | null) {
  const isAdmin = useAuthStore((s) => s.isAdmin());

  return useQuery({
    queryKey: [...usersQueryKey, "detail", id],
    queryFn: () => appContainer.userService.getById(id!),
    enabled: isAdmin && Boolean(id),
  });
}
