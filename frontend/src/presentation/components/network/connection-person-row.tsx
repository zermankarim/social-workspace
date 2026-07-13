"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import type { ConnectionUser } from "@/core/domain/entities/connection-user.entity";

type ConnectionPersonRowProps = {
  person: ConnectionUser;
  actions?: ReactNode;
  subtitle?: string | null;
};

export function ConnectionPersonAvatar({
  person,
  size = "md",
}: {
  person: ConnectionUser;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClass =
    size === "sm"
      ? "h-10 w-10 text-xs"
      : size === "lg"
        ? "h-16 w-16 text-lg"
        : "h-12 w-12 text-sm";

  if (person.avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={person.avatarUrl}
        alt=""
        className={`${sizeClass} shrink-0 rounded-full object-cover`}
      />
    );
  }

  return (
    <div
      className={`flex ${sizeClass} shrink-0 items-center justify-center rounded-full bg-primary-soft font-semibold text-primary`}
    >
      {person.initials}
    </div>
  );
}

export function ConnectionPersonRow({
  person,
  actions,
  subtitle,
}: ConnectionPersonRowProps) {
  const line = subtitle ?? person.headline;

  return (
    <div className="flex items-start gap-3">
      <Link href={`/users/${person.id}`} className="shrink-0">
        <ConnectionPersonAvatar person={person} />
      </Link>
      <div className="min-w-0 flex-1">
        <Link
          href={`/users/${person.id}`}
          className="block truncate text-sm font-semibold text-foreground hover:underline"
        >
          {person.displayName}
        </Link>
        <p className="mt-0.5 line-clamp-2 min-h-8 text-xs text-muted">
          {line?.trim() ? line : "\u00A0"}
        </p>
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
          {actions}
        </div>
      ) : null}
    </div>
  );
}
