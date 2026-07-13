"use client";

import { useState } from "react";
import { Loader2, UserMinus, UserPlus, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { ApiError } from "@/core/application/errors/api.error";
import { Button } from "@/presentation/components/ui/button";
import {
  useAcceptConnection,
  useConnectionRelation,
  useCreateConnection,
  useRejectConnection,
  useRemoveConnection,
} from "@/presentation/hooks/use-connections";

type ConnectActionsProps = {
  otherUserId: string;
  /** Compact control for post headers; hides when already connected. */
  variant?: "default" | "compact";
};

export function ConnectActions({
  otherUserId,
  variant = "default",
}: ConnectActionsProps) {
  const t = useTranslations("network");
  const { relation, isLoading } = useConnectionRelation(otherUserId);
  const create = useCreateConnection();
  const accept = useAcceptConnection();
  const reject = useRejectConnection();
  const remove = useRemoveConnection();
  const [error, setError] = useState<unknown>(null);

  const compact = variant === "compact";
  const busy =
    create.isPending ||
    accept.isPending ||
    reject.isPending ||
    remove.isPending;

  async function run(action: () => Promise<unknown>) {
    setError(null);
    try {
      await action();
    } catch (err) {
      setError(err);
    }
  }

  if (isLoading) {
    if (compact) {
      return (
        <Button
          type="button"
          variant="secondary"
          disabled
          className="h-8 shrink-0 gap-1 px-3 text-xs"
        >
          <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
        </Button>
      );
    }
    return (
      <Button type="button" variant="secondary" disabled className="gap-1.5">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        {t("connect")}
      </Button>
    );
  }

  if (compact && relation.kind === "connected") {
    return null;
  }

  const buttonClass = compact
    ? "h-8 shrink-0 gap-1 px-3 text-xs"
    : "gap-1.5 self-start sm:self-auto";

  return (
    <div
      className={
        compact
          ? "flex shrink-0 flex-col items-end gap-1"
          : "flex flex-col items-stretch gap-1 sm:items-end"
      }
    >
      {relation.kind === "none" ? (
        <Button
          type="button"
          variant={compact ? "secondary" : "primary"}
          disabled={busy}
          className={buttonClass}
          onClick={() => void run(() => create.mutateAsync(otherUserId))}
        >
          {busy ? (
            <Loader2
              className={
                compact ? "h-3.5 w-3.5 animate-spin" : "h-4 w-4 animate-spin"
              }
              aria-hidden
            />
          ) : (
            <UserPlus
              className={compact ? "h-3.5 w-3.5" : "h-4 w-4"}
              aria-hidden
            />
          )}
          {t("connect")}
        </Button>
      ) : null}

      {relation.kind === "pendingOutgoing" && relation.connection ? (
        <Button
          type="button"
          variant="secondary"
          disabled={busy}
          className={buttonClass}
          onClick={() =>
            void run(() => remove.mutateAsync(relation.connection!.id))
          }
        >
          {busy ? (
            <Loader2
              className={
                compact ? "h-3.5 w-3.5 animate-spin" : "h-4 w-4 animate-spin"
              }
              aria-hidden
            />
          ) : (
            <X className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} aria-hidden />
          )}
          {t("pending")}
        </Button>
      ) : null}

      {relation.kind === "pendingIncoming" && relation.connection ? (
        <div className="flex flex-wrap justify-end gap-1.5">
          <Button
            type="button"
            variant="secondary"
            disabled={busy}
            className={compact ? "h-8 px-3 text-xs" : undefined}
            onClick={() =>
              void run(() => reject.mutateAsync(relation.connection!.id))
            }
          >
            {t("ignore")}
          </Button>
          <Button
            type="button"
            disabled={busy}
            className={compact ? "h-8 px-3 text-xs" : undefined}
            onClick={() =>
              void run(() => accept.mutateAsync(relation.connection!.id))
            }
          >
            {t("accept")}
          </Button>
        </div>
      ) : null}

      {!compact && relation.kind === "connected" && relation.connection ? (
        <Button
          type="button"
          variant="secondary"
          disabled={busy}
          className={buttonClass}
          onClick={() => {
            if (!window.confirm(t("removeConfirm"))) return;
            void run(() => remove.mutateAsync(relation.connection!.id));
          }}
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <UserMinus className="h-4 w-4" aria-hidden />
          )}
          {t("remove")}
        </Button>
      ) : null}

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
