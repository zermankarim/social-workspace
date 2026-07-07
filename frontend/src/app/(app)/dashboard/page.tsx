"use client";

import { AdminNotice } from "@/presentation/components/dashboard/admin-notice";
import { ProfileCard } from "@/presentation/components/dashboard/profile-card";
import { TodoList } from "@/presentation/components/todos/todo-list";
import { useAuthStore } from "@/presentation/stores/auth.store";

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const isAdmin = useAuthStore((s) => s.isAdmin());

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Manage your tasks and account settings.
        </p>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[17.5rem_1fr] xl:grid-cols-[18rem_1fr]">
        <aside className="space-y-4 lg:sticky lg:top-8">
          <ProfileCard user={user} />
          {isAdmin ? <AdminNotice /> : null}
        </aside>

        <TodoList />
      </div>
    </div>
  );
}
