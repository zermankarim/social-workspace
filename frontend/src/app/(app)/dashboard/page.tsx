"use client";

import { RoleBadge } from "@/components/ui/role-badge";
import { TodoList } from "@/components/todos/todo-list";
import { useAuthStore } from "@/stores/auth-store";

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const isAdmin = useAuthStore((s) => s.isAdmin());

  if (!user) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Welcome back, {user.email}.
        </p>
      </div>

      <TodoList />

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500">
          Profile
        </h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-xs text-zinc-500">Email</dt>
            <dd className="mt-1 text-sm font-medium text-zinc-900">{user.email}</dd>
          </div>
          <div>
            <dt className="text-xs text-zinc-500">Role</dt>
            <dd className="mt-1">
              <RoleBadge role={user.role} />
            </dd>
          </div>
          <div>
            <dt className="text-xs text-zinc-500">Member since</dt>
            <dd className="mt-1 text-sm text-zinc-900">
              {new Date(user.createdAt).toLocaleDateString()}
            </dd>
          </div>
        </dl>
      </section>

      {isAdmin ? (
        <section className="rounded-2xl border border-violet-200 bg-violet-50 p-6">
          <h2 className="text-sm font-semibold text-violet-900">Admin area</h2>
          <p className="mt-2 text-sm text-violet-800">
            You have administrator access. Use the Users tab to manage accounts.
          </p>
        </section>
      ) : null}
    </div>
  );
}
