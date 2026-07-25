"use client";

import { useState } from "react";
import { Loader2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { ApiError } from "@/core/application/errors/api.error";
import type { Company } from "@/core/domain/entities/company.entity";
import { CompanyImageUploadField } from "@/presentation/components/companies/company-image-upload-field";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Textarea } from "@/presentation/components/ui/textarea";
import { useUpdateCompany } from "@/presentation/hooks/use-company";

type UpdateCompanyDialogProps = {
  company: Company;
  onClose: () => void;
};

export function UpdateCompanyDialog({
  company,
  onClose,
}: UpdateCompanyDialogProps) {
  const t = useTranslations("companies");
  const tCommon = useTranslations("common");
  const updateCompany = useUpdateCompany();

  const [tagline, setTagline] = useState(company.tagline ?? "");
  const [industry, setIndustry] = useState(company.industry ?? "");
  const [headquarters, setHeadquarters] = useState(company.headquarters ?? "");
  const [websiteUrl, setWebsiteUrl] = useState(company.websiteUrl ?? "");
  const [logoUrl, setLogoUrl] = useState(company.logoUrl ?? "");
  const [coverUrl, setCoverUrl] = useState(company.coverUrl ?? "");
  const [description, setDescription] = useState(company.description ?? "");
  const [error, setError] = useState<unknown>(null);

  const handleSubmit = async () => {
    setError(null);
    try {
      await updateCompany.mutateAsync({
        id: company.id,
        name: company.name,
        data: {
          tagline: tagline.trim() || undefined,
          industry: industry.trim() || undefined,
          headquarters: headquarters.trim() || undefined,
          websiteUrl: websiteUrl.trim() || undefined,
          logoUrl: logoUrl.trim() || undefined,
          coverUrl: coverUrl.trim() || undefined,
          description: description.trim() || undefined,
        },
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
            {t("editCompany")}
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
          <CompanyImageUploadField
            label={t("logo")}
            uploadLabel={t("uploadLogo")}
            shape="square"
            value={logoUrl}
            onChange={setLogoUrl}
            disabled={updateCompany.isPending}
          />
          <CompanyImageUploadField
            label={t("cover")}
            uploadLabel={t("uploadCover")}
            shape="wide"
            value={coverUrl}
            onChange={setCoverUrl}
            disabled={updateCompany.isPending}
          />
          <Input
            label={t("tagline")}
            value={tagline}
            onChange={(event) => setTagline(event.target.value)}
            maxLength={220}
            disabled={updateCompany.isPending}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input
              label={t("industry")}
              value={industry}
              onChange={(event) => setIndustry(event.target.value)}
              maxLength={150}
              disabled={updateCompany.isPending}
            />
            <Input
              label={t("headquarters")}
              value={headquarters}
              onChange={(event) => setHeadquarters(event.target.value)}
              maxLength={150}
              disabled={updateCompany.isPending}
            />
          </div>
          <Input
            label={t("website")}
            type="url"
            value={websiteUrl}
            onChange={(event) => setWebsiteUrl(event.target.value)}
            disabled={updateCompany.isPending}
          />
          <Textarea
            label={t("about")}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
            maxLength={5000}
            disabled={updateCompany.isPending}
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
            disabled={updateCompany.isPending}
            onClick={() => void handleSubmit()}
          >
            {updateCompany.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              tCommon("save")
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
