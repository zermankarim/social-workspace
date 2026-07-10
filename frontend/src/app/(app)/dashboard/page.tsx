"use client";

import { LayoutDashboard } from "lucide-react";
import { AdminNotice } from "@/presentation/components/dashboard/admin-notice";
import { ProfileCard } from "@/presentation/components/dashboard/profile-card";
import { useAuthStore } from "@/presentation/stores/auth.store";

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const isAdmin = useAuthStore((s) => s.isAdmin());

  if (!user) return null;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6">
      <div className="shrink-0">
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          <LayoutDashboard className="h-7 w-7" aria-hidden />
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Your account hub. Posts and chats will live here soon.
        </p>
      </div>

      <div className="grid min-h-0 flex-1 items-start gap-6 lg:grid-cols-[17.5rem_1fr] xl:grid-cols-[18rem_1fr]">
        <aside className="shrink-0 space-y-4 lg:sticky lg:top-8">
          <ProfileCard user={user} />
          {isAdmin ? <AdminNotice /> : null}
        </aside>

        <section className="flex min-h-[12rem] flex-col justify-center rounded-2xl border border-dashed border-zinc-200 bg-white/60 px-6 py-10 text-center dark:border-zinc-800 dark:bg-zinc-900/40">
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            Nothing here yet
          </p>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Feed, posts, and chats are coming next.
          </p>
        </section>
      </div>
    </div>
  );
}
