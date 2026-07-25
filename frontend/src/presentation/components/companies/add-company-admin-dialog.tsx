"use client";

import { useState } from "react";
import { Loader2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { ApiError } from "@/core/application/errors/api.error";
import { Button } from "@/presentation/components/ui/button";
import { useAddCompanyAdmin } from "@/presentation/hooks/use-company";
import { useUserSearch } from "@/presentation/hooks/use-user-search";

type AddCompanyAdminDialogProps = {
  companyId: string;
  companyName: string;
  onClose: () => void;
};

export function AddCompanyAdminDialog({
  companyId,
  companyName,
  onClose,
}: AddCompanyAdminDialogProps) {
  const t = useTranslations("companies");
  const tCommon = useTranslations("common");
  const [query, setQuery] = useState("");
  const { data, isFetching } = useUserSearch(query);
  const addAdmin = useAddCompanyAdmin();
  const [error, setError] = useState<unknown>(null);

  const handleAdd = async (userId: string) => {
    setError(null);
    try {
      await addAdmin.mutateAsync({ companyId, userId, companyName });
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
        className="relative z-10 w-full max-w-md overflow-hidden rounded-xl bg-surface shadow-[0_8px_28px_rgba(0,0,0,0.28)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-lg font-semibold text-foreground">
            {t("addAdmin")}
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
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("searchPeoplePlaceholder")}
            className="w-full rounded-lg border border-border-strong bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />

          {isFetching ? (
            <div className="flex justify-center py-3">
              <Loader2
                className="h-4 w-4 animate-spin text-primary"
                aria-hidden
              />
            </div>
          ) : data && data.data.length > 0 ? (
            <ul className="max-h-60 space-y-1 overflow-y-auto">
              {data.data.map((person) => (
                <li key={person.id}>
                  <button
                    type="button"
                    disabled={addAdmin.isPending}
                    onClick={() => void handleAdd(person.id)}
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm hover:bg-surface-muted disabled:opacity-50"
                  >
                    {person.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={person.avatarUrl}
                        alt=""
                        className="h-8 w-8 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
                        {person.initials}
                      </span>
                    )}
                    <span className="min-w-0 flex-1 truncate text-foreground">
                      {person.displayName}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : query.trim() ? (
            <p className="py-3 text-center text-sm text-muted">
              {t("noPeopleFound")}
            </p>
          ) : null}

          {error ? (
            <p className="text-sm text-danger">
              {error instanceof ApiError ? error.message : t("saveFailed")}
            </p>
          ) : null}
        </div>

        <div className="flex justify-end gap-2 border-t border-border px-4 py-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            {tCommon("close")}
          </Button>
        </div>
      </div>
    </div>
  );
}
