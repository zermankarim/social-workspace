"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMessagingUiStore } from "@/presentation/stores/messaging-ui.store";

const TOAST_TTL_MS = 6000;

export function MessagingToastHost() {
  const t = useTranslations("messaging");
  const router = useRouter();
  const toasts = useMessagingUiStore((state) => state.toasts);
  const dismissToast = useMessagingUiStore((state) => state.dismissToast);

  useEffect(() => {
    if (toasts.length === 0) return;
    const latest = toasts[toasts.length - 1];
    if (!latest) return;
    const timer = window.setTimeout(() => {
      dismissToast(latest.id);
    }, TOAST_TTL_MS);
    return () => window.clearTimeout(timer);
  }, [toasts, dismissToast]);

  if (toasts.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed right-3 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-60 flex w-[min(22rem,calc(100vw-1.5rem))] flex-col gap-2 lg:bottom-3"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <button
          key={toast.id}
          type="button"
          className="pointer-events-auto flex items-start gap-3 rounded-xl border border-border bg-surface px-3.5 py-3 text-left shadow-card transition hover:bg-surface-muted"
          onClick={() => {
            dismissToast(toast.id);
            router.push(`/messaging/${toast.conversationId}`);
          }}
        >
          <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
            <MessageSquare className="size-4" strokeWidth={2} aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">
              {toast.title}
            </p>
            <p className="mt-0.5 line-clamp-2 text-xs text-muted">
              {toast.body}
            </p>
            <p className="mt-1 text-[11px] font-medium text-primary">
              {t("toastOpen")}
            </p>
          </span>
        </button>
      ))}
    </div>
  );
}
