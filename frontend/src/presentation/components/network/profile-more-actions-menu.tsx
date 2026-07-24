"use client";

import { useEffect, useRef, useState } from "react";
import { Flag, MoreHorizontal, ShieldOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { ApiError } from "@/core/application/errors/api.error";
import { ReportTargetType } from "@/core/domain/enums/report-target-type.enum";
import { ReportDialog } from "@/presentation/components/moderation/report-dialog";
import { appContainer } from "@/modules/app.container";

type ProfileMoreActionsMenuProps = {
  userId: string;
};

/** Report/block a user — kept out of ConnectActions' main flow since these are destructive/rare actions. */
export function ProfileMoreActionsMenu({
  userId,
}: ProfileMoreActionsMenuProps) {
  const t = useTranslations("moderation");
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [blocking, setBlocking] = useState(false);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [menuOpen]);

  async function handleBlock() {
    setMenuOpen(false);
    if (!window.confirm(t("blockConfirm"))) return;
    setError(null);
    setBlocking(true);
    try {
      await appContainer.connectionService.block(userId);
    } catch (err) {
      setError(err);
    } finally {
      setBlocking(false);
    }
  }

  return (
    <div className="relative shrink-0" ref={menuRef}>
      <button
        type="button"
        className="rounded-full p-1.5 text-muted hover:bg-surface-muted hover:text-foreground"
        aria-label={t("moreActions")}
        disabled={blocking}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {menuOpen ? (
        <div className="absolute right-0 z-10 mt-1 w-40 overflow-hidden rounded-md border border-border bg-surface shadow-card">
          <button
            type="button"
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-foreground hover:bg-surface-muted"
            onClick={() => {
              setMenuOpen(false);
              setReportOpen(true);
            }}
          >
            <Flag className="h-3.5 w-3.5" aria-hidden />
            {t("report")}
          </button>
          <button
            type="button"
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-danger hover:bg-surface-muted"
            onClick={() => void handleBlock()}
          >
            <ShieldOff className="h-3.5 w-3.5" aria-hidden />
            {t("block")}
          </button>
        </div>
      ) : null}
      {error ? (
        <p className="absolute right-0 mt-1 w-40 text-right text-[11px] text-danger">
          {error instanceof ApiError ? error.message : t("blockFailed")}
        </p>
      ) : null}
      {reportOpen ? (
        <ReportDialog
          targetType={ReportTargetType.USER}
          targetId={userId}
          onClose={() => setReportOpen(false)}
        />
      ) : null}
    </div>
  );
}
