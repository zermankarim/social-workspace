"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MessageSquare } from "lucide-react";
import { useTranslations } from "next-intl";
import { ApiError } from "@/core/application/errors/api.error";
import { Button } from "@/presentation/components/ui/button";
import { useOpenDirectConversation } from "@/presentation/hooks/use-conversations";
import { useEnsureMessagingDevice } from "@/presentation/hooks/use-devices";

type MessageUserButtonProps = {
  userId: string;
  variant?: "default" | "compact" | "secondary";
  className?: string;
};

export function MessageUserButton({
  userId,
  variant = "default",
  className = "",
}: MessageUserButtonProps) {
  const t = useTranslations("messaging");
  const router = useRouter();
  const openDirect = useOpenDirectConversation();
  useEnsureMessagingDevice(true);
  const [error, setError] = useState<unknown>(null);

  const compact = variant === "compact";
  const buttonVariant = variant === "secondary" ? "secondary" : "primary";

  async function handleClick() {
    setError(null);
    try {
      const conversation = await openDirect.mutateAsync(userId);
      router.push(`/messaging/${conversation.id}`);
    } catch (err) {
      setError(err);
    }
  }

  return (
    <div className="flex flex-col items-stretch gap-1 sm:items-end">
      <Button
        type="button"
        variant={buttonVariant === "primary" ? "primary" : "secondary"}
        disabled={openDirect.isPending}
        className={
          compact
            ? `h-8 shrink-0 gap-1 px-3 text-xs ${className}`
            : `gap-1.5 ${className}`
        }
        onClick={() => void handleClick()}
      >
        {openDirect.isPending ? (
          <Loader2
            className={
              compact ? "h-3.5 w-3.5 animate-spin" : "h-4 w-4 animate-spin"
            }
            aria-hidden
          />
        ) : (
          <MessageSquare
            className={compact ? "h-3.5 w-3.5" : "h-4 w-4"}
            aria-hidden
          />
        )}
        {t("message")}
      </Button>
      {error ? (
        <p
          className="max-w-[12rem] text-right text-xs text-danger"
          role="alert"
        >
          {error instanceof ApiError ? error.message : t("openFailed")}
        </p>
      ) : null}
    </div>
  );
}
