"use client";

import { useState } from "react";
import { Loader2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { ApiError } from "@/core/application/errors/api.error";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Textarea } from "@/presentation/components/ui/textarea";
import { useCreateJob } from "@/presentation/hooks/use-jobs";

type CreateJobDialogProps = {
  onClose: () => void;
};

export function CreateJobDialog({ onClose }: CreateJobDialogProps) {
  const t = useTranslations("jobs");
  const tCommon = useTranslations("common");
  const createJob = useCreateJob();

  const [title, setTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [applyUrl, setApplyUrl] = useState("");
  const [error, setError] = useState<unknown>(null);

  const canSubmit =
    title.trim().length > 0 &&
    companyName.trim().length > 0 &&
    description.trim().length > 0 &&
    applyUrl.trim().length > 0;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setError(null);
    try {
      await createJob.mutateAsync({
        title: title.trim(),
        companyName: companyName.trim(),
        location: location.trim() || undefined,
        description: description.trim(),
        applyUrl: applyUrl.trim(),
      });
      onClose();
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 px-3 py-8 sm:items-center sm:py-10"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-xl bg-surface shadow-[0_8px_28px_rgba(0,0,0,0.28)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-lg font-semibold text-foreground">
            {t("postJob")}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
            aria-label={tCommon("close")}
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <div className="space-y-3 px-4 py-4">
          <Input
            label={t("jobTitle")}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={150}
            disabled={createJob.isPending}
          />
          <Input
            label={t("companyName")}
            value={companyName}
            onChange={(event) => setCompanyName(event.target.value)}
            maxLength={150}
            disabled={createJob.isPending}
          />
          <Input
            label={t("location")}
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            maxLength={150}
            disabled={createJob.isPending}
          />
          <Textarea
            label={t("description")}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
            maxLength={5000}
            disabled={createJob.isPending}
          />
          <Input
            label={t("applyUrl")}
            type="url"
            placeholder="https://…"
            value={applyUrl}
            onChange={(event) => setApplyUrl(event.target.value)}
            disabled={createJob.isPending}
          />

          {error ? (
            <p className="text-sm text-danger">
              {error instanceof ApiError ? error.message : t("postJobFailed")}
            </p>
          ) : null}
        </div>

        <div className="flex justify-end gap-2 border-t border-border px-4 py-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            {tCommon("cancel")}
          </Button>
          <Button
            type="button"
            disabled={!canSubmit || createJob.isPending}
            onClick={() => void handleSubmit()}
          >
            {createJob.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              t("postJob")
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
