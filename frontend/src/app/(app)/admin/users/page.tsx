"use client";

import { useState } from "react";
import { ApiError } from "@/core/application/errors/api.error";
import { RequireAdmin } from "@/presentation/components/auth/auth-guards";
import { RoleBadge } from "@/presentation/components/ui/role-badge";
import { useUserById, useUsers } from "@/presentation/hooks/use-users";

function UsersAdminContent() {
  const { data: users, isLoading, error } = useUsers();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedUser = useUserById(selectedId);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Users
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Admin-only view backed by{" "}
          <code className="rounded bg-zinc-100 px-1">GET /users</code> and{" "}
          <code className="rounded bg-zinc-100 px-1">GET /users/:id</code>.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm lg:col-span-3">
          <div className="border-b border-zinc-100 px-5 py-4">
            <h2 className="text-sm font-medium text-zinc-900">All users</h2>
          </div>

          {isLoading ? (
            <p className="px-5 py-8 text-sm text-zinc-500">Loading users…</p>
          ) : error ? (
            <p className="px-5 py-8 text-sm text-red-600">
              {error instanceof ApiError ? error.message : "Failed to load users"}
            </p>
          ) : (
            <ul className="divide-y divide-zinc-100">
              {users?.map((user) => (
                <li key={user.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(user.id)}
                    className={`flex w-full items-center justify-between px-5 py-3 text-left transition-colors hover:bg-zinc-50 ${
                      selectedId === user.id ? "bg-zinc-50" : ""
                    }`}
                  >
                    <span className="text-sm font-medium text-zinc-900">
                      {user.email}
                    </span>
                    <RoleBadge role={user.role} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm lg:col-span-2">
          <div className="border-b border-zinc-100 px-5 py-4">
            <h2 className="text-sm font-medium text-zinc-900">User details</h2>
          </div>

          {!selectedId ? (
            <p className="px-5 py-8 text-sm text-zinc-500">
              Select a user to load details.
            </p>
          ) : selectedUser.isLoading ? (
            <p className="px-5 py-8 text-sm text-zinc-500">Loading…</p>
          ) : selectedUser.error ? (
            <p className="px-5 py-8 text-sm text-red-600">
              {selectedUser.error instanceof ApiError
                ? selectedUser.error.message
                : "Failed to load user"}
            </p>
          ) : selectedUser.data ? (
            <dl className="space-y-4 px-5 py-5">
              <div>
                <dt className="text-xs text-zinc-500">ID</dt>
                <dd className="mt-1 break-all font-mono text-xs text-zinc-800">
                  {selectedUser.data.id}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-zinc-500">Email</dt>
                <dd className="mt-1 text-sm text-zinc-900">
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
                <dd className="mt-1 text-sm text-zinc-900">
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
  return (
    <RequireAdmin>
      <UsersAdminContent />
    </RequireAdmin>
  );
}
