"use client";

import { useState } from "react";
import { Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ApiError } from "@/core/application/errors/api.error";
import { CompanyImageUploadField } from "@/presentation/components/companies/company-image-upload-field";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Textarea } from "@/presentation/components/ui/textarea";
import { useCreateCompany } from "@/presentation/hooks/use-company";

type CreateCompanyDialogProps = {
  onClose: () => void;
};

export function CreateCompanyDialog({ onClose }: CreateCompanyDialogProps) {
  const t = useTranslations("companies");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const createCompany = useCreateCompany();

  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [tagline, setTagline] = useState("");
  const [industry, setIndustry] = useState("");
  const [headquarters, setHeadquarters] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<unknown>(null);

  const canSubmit = name.trim().length > 0;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setError(null);
    try {
      const company = await createCompany.mutateAsync({
        name: name.trim(),
        logoUrl: logoUrl.trim() || undefined,
        tagline: tagline.trim() || undefined,
        industry: industry.trim() || undefined,
        headquarters: headquarters.trim() || undefined,
        websiteUrl: websiteUrl.trim() || undefined,
        description: description.trim() || undefined,
      });
      onClose();
      router.push(`/companies/${encodeURIComponent(company.name)}`);
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
            {t("registerCompany")}
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
            label={t("companyNameLabel")}
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={150}
            disabled={createCompany.isPending}
          />
          <CompanyImageUploadField
            label={t("logo")}
            uploadLabel={t("uploadLogo")}
            shape="square"
            value={logoUrl}
            onChange={setLogoUrl}
            disabled={createCompany.isPending}
          />
          <Input
            label={t("tagline")}
            value={tagline}
            onChange={(event) => setTagline(event.target.value)}
            maxLength={220}
            disabled={createCompany.isPending}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input
              label={t("industry")}
              value={industry}
              onChange={(event) => setIndustry(event.target.value)}
              maxLength={150}
              disabled={createCompany.isPending}
            />
            <Input
              label={t("headquarters")}
              value={headquarters}
              onChange={(event) => setHeadquarters(event.target.value)}
              maxLength={150}
              disabled={createCompany.isPending}
            />
          </div>
          <Input
            label={t("website")}
            type="url"
            placeholder="https://…"
            value={websiteUrl}
            onChange={(event) => setWebsiteUrl(event.target.value)}
            disabled={createCompany.isPending}
          />
          <Textarea
            label={t("about")}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
            maxLength={5000}
            disabled={createCompany.isPending}
          />

          {error ? (
            <p className="text-sm text-danger">
              {error instanceof ApiError ? error.message : t("saveFailed")}
            </p>
          ) : null}
        </div>

        <div className="flex justify-end gap-2 border-t border-border px-4 py-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            {tCommon("cancel")}
          </Button>
          <Button
            type="button"
            disabled={!canSubmit || createCompany.isPending}
            onClick={() => void handleSubmit()}
          >
            {createCompany.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              t("registerCompany")
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
