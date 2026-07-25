"use client";

import { useState } from "react";
import { Loader2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { ApiError } from "@/core/application/errors/api.error";
import type { CompanySummary } from "@/core/domain/entities/company-summary.entity";
import type { JobExperienceLevel } from "@/core/domain/entities/job.entity";
import { EmploymentType } from "@/core/domain/enums/employment-type.enum";
import { WorkplaceType } from "@/core/domain/enums/workplace-type.enum";
import { CompanyPicker } from "@/presentation/components/companies/company-picker";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Select } from "@/presentation/components/ui/select";
import { Textarea } from "@/presentation/components/ui/textarea";
import { useCreateJob } from "@/presentation/hooks/use-jobs";

const EXPERIENCE_LEVELS: JobExperienceLevel[] = [
  "NO_EXPERIENCE",
  "JUNIOR",
  "MIDDLE",
  "SENIOR",
  "LEAD",
];

type CreateJobDialogProps = {
  onClose: () => void;
};

export function CreateJobDialog({ onClose }: CreateJobDialogProps) {
  const t = useTranslations("jobs");
  const tCommon = useTranslations("common");
  const createJob = useCreateJob();

  const [company, setCompany] = useState<CompanySummary | null>(null);
  const [title, setTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [applyUrl, setApplyUrl] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [workplaceType, setWorkplaceType] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [error, setError] = useState<unknown>(null);

  const canSubmit =
    title.trim().length > 0 &&
    (Boolean(company) || companyName.trim().length > 0) &&
    description.trim().length > 0;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setError(null);
    try {
      await createJob.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        companyId: company?.id,
        companyName: company ? undefined : companyName.trim(),
        location: location.trim() || undefined,
        applyUrl: applyUrl.trim() || undefined,
        employmentType: (employmentType as EmploymentType) || undefined,
        workplaceType: (workplaceType as WorkplaceType) || undefined,
        experienceLevel: (experienceLevel as JobExperienceLevel) || undefined,
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

        <div className="max-h-[70vh] space-y-3 overflow-y-auto px-4 py-4">
          <Input
            label={t("jobTitle")}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={150}
            disabled={createJob.isPending}
          />

          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-foreground">
              {t("company")}
            </span>
            <CompanyPicker
              selected={company}
              onSelect={setCompany}
              disabled={createJob.isPending}
            />
            {!company ? (
              <Input
                label={t("companyNameFallback")}
                hideLabel
                placeholder={t("companyNameFallback")}
                value={companyName}
                onChange={(event) => setCompanyName(event.target.value)}
                maxLength={150}
                disabled={createJob.isPending}
              />
            ) : null}
          </div>

          <Input
            label={t("location")}
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            maxLength={150}
            disabled={createJob.isPending}
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Select
              label={t("employmentType")}
              value={employmentType}
              onChange={setEmploymentType}
              placeholder={tCommon("any")}
              disabled={createJob.isPending}
              options={Object.values(EmploymentType).map((value) => ({
                value,
                label: t(`employmentTypeValue.${value}`),
              }))}
            />
            <Select
              label={t("workplaceType")}
              value={workplaceType}
              onChange={setWorkplaceType}
              placeholder={tCommon("any")}
              disabled={createJob.isPending}
              options={Object.values(WorkplaceType).map((value) => ({
                value,
                label: t(`workplaceTypeValue.${value}`),
              }))}
            />
            <Select
              label={t("experienceLevel")}
              value={experienceLevel}
              onChange={setExperienceLevel}
              placeholder={tCommon("any")}
              disabled={createJob.isPending}
              options={EXPERIENCE_LEVELS.map((value) => ({
                value,
                label: t(`experienceLevelValue.${value}`),
              }))}
            />
          </div>

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
          <p className="text-xs text-muted">{t("applyUrlHint")}</p>

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
