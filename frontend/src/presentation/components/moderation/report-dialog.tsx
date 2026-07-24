"use client";

import { useId, useState } from "react";
import { Loader2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { ApiError } from "@/core/application/errors/api.error";
import type { ReportTargetType } from "@/core/domain/enums/report-target-type.enum";
import { Button } from "@/presentation/components/ui/button";
import { Textarea } from "@/presentation/components/ui/textarea";
import { useCreateReport } from "@/presentation/hooks/use-reports";

const REASON_MAX_LENGTH = 500;

type ReportDialogProps = {
  targetType: ReportTargetType;
  targetId: string;
  onClose: () => void;
};

export function ReportDialog({
  targetType,
  targetId,
  onClose,
}: ReportDialogProps) {
  const t = useTranslations("moderation");
  const tCommon = useTranslations("common");
  const titleId = useId();
  const createReport = useCreateReport();
  const [reason, setReason] = useState("");
  const [error, setError] = useState<unknown>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!reason.trim()) return;
    setError(null);
    try {
      await createReport.mutateAsync({
        targetType,
        targetId,
        reason: reason.trim(),
      });
      setSubmitted(true);
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-xl bg-surface shadow-card"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 id={titleId} className="text-sm font-semibold text-foreground">
            {t("reportTitle")}
          </h2>
          <button
            type="button"
            className="inline-flex size-8 items-center justify-center rounded-full text-muted hover:bg-surface-muted hover:text-foreground"
            onClick={onClose}
            aria-label={tCommon("close")}
          >
            <X className="size-4" strokeWidth={2} />
          </button>
        </div>

        <div className="space-y-3 p-4">
          {submitted ? (
            <p className="text-sm text-foreground">{t("reportSuccess")}</p>
          ) : (
            <>
              <Textarea
                label={t("reportReasonLabel")}
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                maxLength={REASON_MAX_LENGTH}
                rows={3}
                placeholder={t("reportReasonPlaceholder")}
                disabled={createReport.isPending}
              />
              {error ? (
                <p className="text-xs text-danger" role="alert">
                  {error instanceof ApiError
                    ? error.message
                    : t("reportFailed")}
                </p>
              ) : null}
            </>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-border px-4 py-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            {submitted ? tCommon("close") : tCommon("cancel")}
          </Button>
          {submitted ? null : (
            <Button
              type="button"
              disabled={createReport.isPending || !reason.trim()}
              onClick={() => void handleSubmit()}
            >
              {createReport.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                t("reportSubmit")
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
