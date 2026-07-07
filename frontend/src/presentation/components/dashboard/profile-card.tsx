"use client";

import { Calendar } from "lucide-react";
import type { User } from "@/core/domain/entities/user.entity";
import { RoleBadge } from "@/presentation/components/ui/role-badge";

interface ProfileCardProps {
  user: User;
}

function getInitials(email: string): string {
  const name = email.split("@")[0] ?? email;
  return name.slice(0, 2).toUpperCase();
}

export function ProfileCard({ user }: ProfileCardProps) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900">
          {getInitials(user.email)}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {user.email}
          </p>
          <div className="mt-1">
            <RoleBadge role={user.role} />
          </div>
        </div>
      </div>

      <dl className="mt-5 space-y-3 border-t border-zinc-100 pt-4 dark:border-zinc-800">
        <div>
          <dt className="flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-zinc-400">
            <Calendar className="h-3 w-3" aria-hidden />
            Member since
          </dt>
          <dd className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
            {user.createdAt.toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </dd>
        </div>
      </dl>
    </section>
  );
}
