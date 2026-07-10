"use client";

import { AlertCircle, Loader2, Users } from "lucide-react";
import { useState } from "react";
import { ApiError } from "@/core/application/errors/api.error";
import { SortBy } from "@/core/domain/enums/sort-by.enum";
import { SortOrder } from "@/core/domain/enums/sort-order.enum";
import { RoleBadge } from "@/presentation/components/ui/role-badge";
import { ListFilterBar } from "@/presentation/components/ui/list-filter-bar";
import { ListPagination } from "@/presentation/components/ui/list-pagination";
import { useDebouncedValue } from "@/presentation/hooks/use-debounced-value";
import { useUserById, useUsers } from "@/presentation/hooks/use-users";

function UsersAdminContent() {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState(SortBy.CREATED_AT);
  const [orderBy, setOrderBy] = useState(SortOrder.DESC);
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebouncedValue(searchInput.trim(), 300);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data, isLoading, isFetching, error } = useUsers({
    page,
    sortBy,
    orderBy,
    search: debouncedSearch || undefined,
  });

  const selectedUser = useUserById(selectedId);
  const users = data?.data ?? [];
  const meta = data?.meta;
  const isSearching = debouncedSearch.length > 0;

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    setPage(1);
  };

  const handleSortByChange = (value: SortBy) => {
    setSortBy(value);
    setPage(1);
  };

  const handleOrderByChange = (value: SortOrder) => {
    setOrderBy(value);
    setPage(1);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          <Users className="h-7 w-7" aria-hidden />
          Users
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <section className="flex flex-col rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 lg:col-span-3">
          <div className="space-y-3 border-b border-zinc-100 px-5 py-4 dark:border-zinc-800">
            <div>
              <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                All users
              </h2>
              <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
                {meta
                  ? isSearching
                    ? `${meta.total} match${meta.total === 1 ? "" : "es"} for "${debouncedSearch}"`
                    : `${meta.total} user${meta.total === 1 ? "" : "s"} total`
                  : "Loading users…"}
                {isFetching && !isLoading ? (
                  <span className="ml-2 text-xs text-zinc-400">Updating…</span>
                ) : null}
              </p>
            </div>

            <ListFilterBar
              search={searchInput}
              onSearchChange={handleSearchChange}
              sortBy={sortBy}
              orderBy={orderBy}
              onSortByChange={handleSortByChange}
              onOrderByChange={handleOrderByChange}
              disabled={isLoading && !data}
              searchPlaceholder="Search users…"
              searchLabel="Search users"
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2
                className="h-8 w-8 animate-spin text-violet-700 dark:text-violet-400"
                aria-hidden
              />
            </div>
          ) : error ? (
            <p className="flex items-center gap-2 px-5 py-8 text-sm text-red-600">
              <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
              {error instanceof ApiError
                ? error.message
                : "Failed to load users"}
            </p>
          ) : users.length > 0 ? (
            <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {users.map((user) => (
                <li key={user.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(user.id)}
                    className={`flex w-full items-center justify-between px-5 py-3 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800 ${
                      selectedId === user.id
                        ? "bg-zinc-50 dark:bg-zinc-800"
                        : ""
                    }`}
                  >
                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {user.email}
                    </span>
                    <RoleBadge role={user.role} />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-5 py-8 text-sm text-zinc-500 dark:text-zinc-400">
              {isSearching ? "No matching users." : "No users found."}
            </p>
          )}

          {meta ? (
            <ListPagination
              meta={meta}
              onPageChange={setPage}
              itemLabel="user"
            />
          ) : null}
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 lg:col-span-2">
          <div className="border-b border-zinc-100 px-5 py-4 dark:border-zinc-800">
            <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              User details
            </h2>
          </div>

          {!selectedId ? (
            <p className="px-5 py-8 text-sm text-zinc-500 dark:text-zinc-400">
              Select a user to load details.
            </p>
          ) : selectedUser.isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2
                className="h-6 w-6 animate-spin text-zinc-500"
                aria-hidden
              />
            </div>
          ) : selectedUser.error ? (
            <p className="flex items-center gap-2 px-5 py-8 text-sm text-red-600">
              <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
              {selectedUser.error instanceof ApiError
                ? selectedUser.error.message
                : "Failed to load user"}
            </p>
          ) : selectedUser.data ? (
            <dl className="space-y-4 px-5 py-5">
              <div>
                <dt className="text-xs text-zinc-500">ID</dt>
                <dd className="mt-1 break-all font-mono text-xs text-zinc-800 dark:text-zinc-200">
                  {selectedUser.data.id}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-zinc-500">Email</dt>
                <dd className="mt-1 text-sm text-zinc-900 dark:text-zinc-100">
                  {selectedUser.data.email}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-zinc-500">Role</dt>
                <dd className="mt-1">
                  <RoleBadge role={selectedUser.data.role} />
                </dd>
              </div>
              <div>
                <dt className="text-xs text-zinc-500">Created</dt>
                <dd className="mt-1 text-sm text-zinc-900 dark:text-zinc-100">
                  {selectedUser.data.createdAt.toLocaleString()}
                </dd>
              </div>
            </dl>
          ) : null}
        </section>
      </div>
    </div>
  );
}

export default function AdminUsersPage() {
  return <UsersAdminContent />;
}
