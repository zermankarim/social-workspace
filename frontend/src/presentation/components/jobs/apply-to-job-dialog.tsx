"use client";

import { useRef, useState } from "react";
import { Check, FileText, Loader2, Pencil, Plus, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { ApiError } from "@/core/application/errors/api.error";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Textarea } from "@/presentation/components/ui/textarea";
import {
  useApplyToJob,
  useLastContactInfo,
} from "@/presentation/hooks/use-job-applications";
import {
  useMyResumes,
  useUploadResume,
} from "@/presentation/hooks/use-resumes";
import { useAuthStore } from "@/presentation/stores/auth.store";

type ApplyToJobDialogProps = {
  jobId: string;
  jobTitle: string;
  onClose: () => void;
  onApplied: () => void;
};

const RESUMES_MAX_COUNT = 3;
const STEPS = ["contact", "resume", "review"] as const;
type Step = (typeof STEPS)[number];

function ProgressBar({ step }: { step: Step }) {
  const percent = Math.round(((STEPS.indexOf(step) + 1) / STEPS.length) * 100);
  return (
    <div className="px-4 pt-3">
      <div className="h-1.5 overflow-hidden rounded-full bg-surface-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export function ApplyToJobDialog({
  jobId,
  jobTitle,
  onClose,
  onApplied,
}: ApplyToJobDialogProps) {
  const t = useTranslations("jobs");
  const tCommon = useTranslations("common");
  const user = useAuthStore((state) => state.user);
  const { data: resumes, isLoading: resumesLoading } = useMyResumes();
  const { data: lastContact } = useLastContactInfo();
  const uploadResume = useUploadResume();
  const applyToJob = useApplyToJob();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>("contact");
  const [contactEmail, setContactEmail] = useState<string | null>(null);
  const [contactPhone, setContactPhone] = useState<string | null>(null);
  const [selectedResumeId, setSelectedResumeId] = useState<string | undefined>(
    undefined,
  );
  const [coverNote, setCoverNote] = useState("");
  const [error, setError] = useState<unknown>(null);

  const effectiveEmail =
    contactEmail ?? lastContact?.contactEmail ?? user?.email ?? "";
  const effectivePhone = contactPhone ?? lastContact?.contactPhone ?? "";
  const resumeId = selectedResumeId ?? resumes?.[0]?.id;
  const selectedResume = resumes?.find((resume) => resume.id === resumeId);

  const handleUpload = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    try {
      const uploaded = await uploadResume.mutateAsync(file);
      setSelectedResumeId(uploaded.id);
    } catch (err) {
      setError(err);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    setError(null);
    try {
      await applyToJob.mutateAsync({
        jobId,
        resumeId,
        contactEmail: effectiveEmail.trim() || undefined,
        contactPhone: effectivePhone.trim() || undefined,
        coverNote: coverNote.trim() || undefined,
      });
      onApplied();
    } catch (err) {
      setError(err);
    }
  };

  const atResumeLimit = (resumes?.length ?? 0) >= RESUMES_MAX_COUNT;
  const busy = applyToJob.isPending || uploadResume.isPending;

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
          <h2 className="truncate text-lg font-semibold text-foreground">
            {t("applyTo", { title: jobTitle })}
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

        <ProgressBar step={step} />

        <div className="max-h-[65vh] space-y-4 overflow-y-auto px-4 py-4">
          {step === "contact" ? (
            <>
              <h3 className="text-sm font-semibold text-foreground">
                {t("contactInfo")}
              </h3>
              {user ? (
                <div className="flex items-center gap-2.5 rounded-lg bg-surface-muted px-3 py-2">
                  {user.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.avatarUrl}
                      alt=""
                      className="h-9 w-9 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
                      {user.initials}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {user.displayName}
                    </p>
                    {user.headline ? (
                      <p className="truncate text-xs text-muted">
                        {user.headline}
                      </p>
                    ) : null}
                  </div>
                </div>
              ) : null}
              <Input
                label={t("contactEmail")}
                type="email"
                value={effectiveEmail}
                onChange={(event) => setContactEmail(event.target.value)}
                disabled={busy}
              />
              <Input
                label={t("contactPhone")}
                type="tel"
                placeholder={t("contactPhonePlaceholder")}
                value={effectivePhone}
                onChange={(event) => setContactPhone(event.target.value)}
                disabled={busy}
              />
            </>
          ) : null}

          {step === "resume" ? (
            <>
              <h3 className="text-sm font-semibold text-foreground">
                {t("chooseResume")}
              </h3>
              {resumesLoading ? (
                <div className="flex justify-center py-3">
                  <Loader2
                    className="h-4 w-4 animate-spin text-primary"
                    aria-hidden
                  />
                </div>
              ) : (
                <ul className="space-y-1.5">
                  {resumes?.map((resume) => {
                    const selected = resumeId === resume.id;
                    return (
                      <li key={resume.id}>
                        <button
                          type="button"
                          onClick={() => setSelectedResumeId(resume.id)}
                          className={`flex w-full items-center gap-2.5 rounded-lg border px-3 py-2 text-left transition-colors ${
                            selected
                              ? "border-primary bg-primary-soft"
                              : "border-border-strong hover:bg-surface-muted"
                          }`}
                        >
                          <span
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${
                              selected
                                ? "bg-primary text-white"
                                : "bg-surface-muted text-muted"
                            }`}
                          >
                            {selected ? (
                              <Check className="h-4 w-4" aria-hidden />
                            ) : (
                              <FileText className="h-4 w-4" aria-hidden />
                            )}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium text-foreground">
                              {resume.fileName}
                            </span>
                            <span className="block text-xs text-muted">
                              {resume.sizeLabel}
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}

                  {!atResumeLimit ? (
                    <li>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        className="sr-only"
                        onChange={(event) =>
                          void handleUpload(event.target.files?.[0])
                        }
                      />
                      <button
                        type="button"
                        disabled={uploadResume.isPending}
                        onClick={() => fileInputRef.current?.click()}
                        className="flex w-full items-center gap-2.5 rounded-lg border border-dashed border-border-strong px-3 py-2 text-left text-sm text-muted transition-colors hover:bg-surface-muted disabled:opacity-50"
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-surface-muted">
                          {uploadResume.isPending ? (
                            <Loader2
                              className="h-4 w-4 animate-spin"
                              aria-hidden
                            />
                          ) : (
                            <Plus className="h-4 w-4" aria-hidden />
                          )}
                        </span>
                        {t("uploadNewResume")}
                      </button>
                    </li>
                  ) : null}
                </ul>
              )}

              <Textarea
                label={t("coverNote")}
                placeholder={t("coverNotePlaceholder")}
                value={coverNote}
                onChange={(event) => setCoverNote(event.target.value)}
                rows={4}
                maxLength={2000}
                disabled={busy}
              />
            </>
          ) : null}

          {step === "review" ? (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">
                  {t("contactInfo")}
                </h3>
                <button
                  type="button"
                  onClick={() => setStep("contact")}
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  <Pencil className="h-3 w-3" aria-hidden />
                  {tCommon("edit")}
                </button>
              </div>
              <p className="text-sm text-foreground">{effectiveEmail}</p>
              {effectivePhone ? (
                <p className="text-sm text-foreground">{effectivePhone}</p>
              ) : null}

              <div className="mt-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">
                  {t("chooseResume")}
                </h3>
                <button
                  type="button"
                  onClick={() => setStep("resume")}
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  <Pencil className="h-3 w-3" aria-hidden />
                  {tCommon("edit")}
                </button>
              </div>
              {selectedResume ? (
                <p className="flex items-center gap-1.5 text-sm text-foreground">
                  <FileText
                    className="h-4 w-4 shrink-0 text-muted"
                    aria-hidden
                  />
                  {selectedResume.fileName}
                </p>
              ) : (
                <p className="text-sm text-muted">{t("noResumeSelected")}</p>
              )}
              {coverNote ? (
                <p className="mt-2 text-sm whitespace-pre-wrap text-muted">
                  {coverNote}
                </p>
              ) : null}
            </>
          ) : null}

          {error ? (
            <p className="text-sm text-danger">
              {error instanceof ApiError ? error.message : t("applyFailed")}
            </p>
          ) : null}
        </div>

        <div className="flex justify-between gap-2 border-t border-border px-4 py-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() =>
              step === "contact"
                ? onClose()
                : setStep(STEPS[STEPS.indexOf(step) - 1])
            }
          >
            {step === "contact" ? tCommon("cancel") : tCommon("back")}
          </Button>
          {step === "review" ? (
            <Button
              type="button"
              disabled={busy}
              onClick={() => void handleSubmit()}
            >
              {applyToJob.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                t("submitApplication")
              )}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={() => setStep(STEPS[STEPS.indexOf(step) + 1])}
            >
              {tCommon("next")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
