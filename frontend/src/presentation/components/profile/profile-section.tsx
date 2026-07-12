"use client";

import type { ReactNode } from "react";
import { Pencil, Plus } from "lucide-react";
import { FeedCard } from "@/presentation/components/feed/feed-card";

type ProfileSectionProps = {
  title: string;
  children: ReactNode;
  canEdit?: boolean;
  onAdd?: () => void;
  onEdit?: () => void;
  emptyText?: string;
  isEmpty?: boolean;
};

export function ProfileSection({
  title,
  children,
  canEdit = false,
  onAdd,
  onEdit,
  emptyText,
  isEmpty = false,
}: ProfileSectionProps) {
  return (
    <FeedCard className="px-4 py-4 sm:px-6">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        {canEdit ? (
          <div className="flex items-center gap-1">
            {onAdd ? (
              <button
                type="button"
                onClick={onAdd}
                className="rounded-full p-2 text-muted hover:bg-surface-muted hover:text-foreground"
                aria-label="Add"
              >
                <Plus className="h-5 w-5" aria-hidden />
              </button>
            ) : null}
            {onEdit ? (
              <button
                type="button"
                onClick={onEdit}
                className="rounded-full p-2 text-muted hover:bg-surface-muted hover:text-foreground"
                aria-label="Edit"
              >
                <Pencil className="h-5 w-5" aria-hidden />
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
      {isEmpty ? <p className="text-sm text-muted">{emptyText}</p> : children}
    </FeedCard>
  );
}
