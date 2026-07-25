"use client";

import { useRef, useState } from "react";
import { FileText, Loader2, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { ApiError } from "@/core/application/errors/api.error";
import { ProfileSection } from "@/presentation/components/profile/profile-section";
import { formatRelativeTime } from "@/presentation/lib/format-relative-time";
import {
  useDeleteResume,
  useMyResumes,
  useUploadResume,
} from "@/presentation/hooks/use-resumes";

const RESUMES_MAX_COUNT = 3;

export function ProfileResumesSection() {
  const t = useTranslations("profile");
  const { data: resumes = [], isLoading } = useMyResumes();
  const uploadResume = useUploadResume();
  const deleteResume = useDeleteResume();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelected = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    try {
      await uploadResume.mutateAsync(file);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("saveFailed"));
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const atLimit = resumes.length >= RESUMES_MAX_COUNT;

  return (
    <ProfileSection title={t("resumes")}>
      {isLoading ? (
        <div className="flex justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-primary" aria-hidden />
        </div>
      ) : resumes.length === 0 ? (
        <p className="text-sm text-muted">{t("resumesEmpty")}</p>
      ) : (
        <ul className="space-y-2">
          {resumes.map((resume) => (
            <li
              key={resume.id}
              className="flex items-center gap-2 rounded-lg border border-border px-3 py-2"
            >
              <FileText className="h-4 w-4 shrink-0 text-muted" aria-hidden />
              <a
                href={resume.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-w-0 flex-1 truncate text-sm text-foreground hover:text-primary hover:underline"
              >
                {resume.fileName}
              </a>
              <span className="shrink-0 text-xs text-muted">
                {resume.sizeLabel} · {formatRelativeTime(resume.uploadedAt)}
              </span>
              <button
                type="button"
                onClick={() => deleteResume.mutate(resume.id)}
                disabled={deleteResume.isPending}
                aria-label={t("deleteResume")}
                className="shrink-0 rounded-full p-1.5 text-muted hover:bg-surface-muted hover:text-danger disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}

      {!atLimit ? (
        <div className="mt-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="hidden"
            onChange={(event) =>
              void handleFileSelected(event.target.files?.[0])
            }
          />
          <button
            type="button"
            disabled={uploadResume.isPending}
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline disabled:opacity-50"
          >
            {uploadResume.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
            ) : (
              <Plus className="h-3.5 w-3.5" aria-hidden />
            )}
            {t("uploadResume")}
          </button>
          <p className="mt-1 text-[11px] text-muted">
            {t("resumesLimitHint", { max: RESUMES_MAX_COUNT })}
          </p>
        </div>
      ) : null}

      {error ? (
        <p className="mt-1.5 text-xs text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </ProfileSection>
  );
}
