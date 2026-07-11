"use client";

import { Calendar, MapPin } from "lucide-react";
import type { User } from "@/core/domain/entities/user.entity";
import { AdminBadge } from "@/presentation/components/ui/admin-badge";
import { RoleBadge } from "@/presentation/components/ui/role-badge";
import { UserNameWithBadge } from "@/presentation/components/ui/user-name-with-badge";

interface ProfileCardProps {
  user: User;
}

function getInitials(user: User): string {
  const fromName = `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`;
  if (fromName.trim()) return fromName.toUpperCase();
  const name = user.email.split("@")[0] ?? user.email;
  return name.slice(0, 2).toUpperCase();
}

export function ProfileCard({ user }: ProfileCardProps) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center gap-3">
        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900">
          {getInitials(user)}
          {user.isAdmin() ? (
            <AdminBadge className="absolute -right-0.5 -bottom-0.5" />
          ) : null}
        </div>
        <div className="min-w-0">
          <UserNameWithBadge
            name={user.displayName}
            showAdminBadge={user.isAdmin()}
            nameClassName="text-sm font-semibold text-zinc-900 dark:text-zinc-100"
          />
          <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
            {user.email}
          </p>
          <div className="mt-1">
            <RoleBadge role={user.role} />
          </div>
        </div>
      </div>

      {user.bio ? (
        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-300">
          {user.bio}
        </p>
      ) : null}

      <dl className="mt-5 space-y-3 border-t border-zinc-100 pt-4 dark:border-zinc-800">
        {user.location?.label || user.location?.city ? (
          <div>
            <dt className="flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-zinc-400">
              <MapPin className="h-3 w-3" aria-hidden />
              Location
            </dt>
            <dd className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
              {user.location.label ??
                [user.location.city, user.location.country]
                  .filter(Boolean)
                  .join(", ")}
            </dd>
          </div>
        ) : null}
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
