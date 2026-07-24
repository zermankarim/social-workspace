"use client";

import { useState } from "react";
import { Loader2, UserCheck, UserPlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { ApiError } from "@/core/application/errors/api.error";
import { Button } from "@/presentation/components/ui/button";
import {
  useFollowUser,
  useIsFollowing,
  useUnfollowUser,
} from "@/presentation/hooks/use-follows";

type FollowButtonProps = {
  userId: string;
  /** Compact control for post headers / dense rows. */
  variant?: "default" | "compact";
};

export function FollowButton({
  userId,
  variant = "default",
}: FollowButtonProps) {
  const t = useTranslations("network");
  const statusQuery = useIsFollowing(userId);
  const follow = useFollowUser();
  const unfollow = useUnfollowUser();
  const [error, setError] = useState<unknown>(null);

  const compact = variant === "compact";
  const busy = follow.isPending || unfollow.isPending;
  const isFollowing = statusQuery.data ?? false;
  const buttonClass = compact
    ? "h-8 shrink-0 gap-1 px-3 text-xs"
    : "gap-1.5 self-start sm:self-auto";
  const iconClass = compact ? "h-3.5 w-3.5" : "h-4 w-4";

  async function handleClick() {
    setError(null);
    try {
      if (isFollowing) {
        await unfollow.mutateAsync(userId);
      } else {
        await follow.mutateAsync(userId);
      }
    } catch (err) {
      setError(err);
    }
  }

  if (statusQuery.isLoading) {
    return (
      <Button
        type="button"
        variant="secondary"
        disabled
        className={buttonClass}
      >
        <Loader2 className={`${iconClass} animate-spin`} aria-hidden />
      </Button>
    );
  }

  return (
    <div className={compact ? "shrink-0" : "flex flex-col items-end gap-1"}>
      <Button
        type="button"
        variant={isFollowing ? "secondary" : "primary"}
        disabled={busy}
        className={buttonClass}
        onClick={() => void handleClick()}
      >
        {busy ? (
          <Loader2 className={`${iconClass} animate-spin`} aria-hidden />
        ) : isFollowing ? (
          <UserCheck className={iconClass} aria-hidden />
        ) : (
          <UserPlus className={iconClass} aria-hidden />
        )}
        {isFollowing ? t("following") : t("follow")}
      </Button>
      {error ? (
        <p
          className="max-w-[12rem] text-right text-xs text-danger"
          role="alert"
        >
          {error instanceof ApiError ? error.message : t("actionFailed")}
        </p>
      ) : null}
    </div>
  );
}
