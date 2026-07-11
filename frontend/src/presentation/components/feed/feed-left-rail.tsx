"use client";

import Link from "next/link";
import { Bookmark, MapPin } from "lucide-react";
import type { User } from "@/core/domain/entities/user.entity";
import { FeedCard } from "@/presentation/components/feed/feed-card";
import { UserNameWithBadge } from "@/presentation/components/ui/user-name-with-badge";

type FeedLeftRailProps = {
  user: User;
};

function getInitials(user: User): string {
  const fromName = `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`;
  if (fromName.trim()) return fromName.toUpperCase();
  return (user.email.split("@")[0] ?? "U").slice(0, 2).toUpperCase();
}

export function FeedLeftRail({ user }: FeedLeftRailProps) {
  return (
    <aside className="space-y-2">
      <FeedCard className="overflow-hidden">
        <div className="h-14 bg-gradient-to-r from-primary to-primary-hover" />
        <div className="-mt-8 px-3 pb-3 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-surface bg-primary-soft text-lg font-semibold text-primary">
            {getInitials(user)}
          </div>
          <Link
            href="/feed"
            className="mt-2 inline-flex max-w-full items-center justify-center gap-1 text-sm font-semibold text-foreground hover:underline"
          >
            <UserNameWithBadge
              name={user.displayName}
              showAdminBadge={user.isAdmin()}
              nameClassName="text-sm font-semibold text-foreground"
            />
          </Link>
          <p className="mt-0.5 line-clamp-2 text-xs text-muted">
            {user.bio?.trim() || "Add a bio to complete your profile"}
          </p>
          {user.location?.label || user.location?.city ? (
            <p className="mt-2 inline-flex items-center justify-center gap-1 text-xs text-muted">
              <MapPin className="h-3 w-3" aria-hidden />
              {user.location.label ??
                [user.location.city, user.location.country]
                  .filter(Boolean)
                  .join(", ")}
            </p>
          ) : null}
        </div>
        <div className="border-t border-border px-3 py-2 text-xs">
          <div className="flex items-center justify-between py-1">
            <span className="text-muted">Profile viewers</span>
            <span className="font-semibold text-primary">12</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-muted">Post impressions</span>
            <span className="font-semibold text-primary">48</span>
          </div>
          <p className="pt-1 text-[10px] text-muted">Mock analytics</p>
        </div>
      </FeedCard>

      <FeedCard className="px-3 py-2">
        <button
          type="button"
          disabled
          className="flex w-full items-center gap-2 py-1.5 text-left text-xs font-semibold text-muted"
        >
          <Bookmark className="h-4 w-4" aria-hidden />
          Saved items
        </button>
        <p className="pb-1 text-[10px] text-muted">Coming soon</p>
      </FeedCard>
    </aside>
  );
}
