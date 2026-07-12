"use client";

import { useState } from "react";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { Language } from "@/core/domain/entities/language.entity";
import type { UserLanguage } from "@/core/domain/entities/user-language.entity";
import { LanguageProficiency } from "@/core/domain/enums/language-proficiency.enum";
import type { AppLocale } from "@/i18n/config";
import { ProfileModal } from "@/presentation/components/profile/profile-modal";
import { ProfileSection } from "@/presentation/components/profile/profile-section";
import { Button } from "@/presentation/components/ui/button";
import { Select } from "@/presentation/components/ui/select";
import {
  useCreateUserLanguage,
  useDeleteUserLanguage,
  useLanguageSearch,
  useUpdateUserLanguage,
} from "@/presentation/hooks/use-profile";

type ProfileLanguagesSectionProps = {
  languages: UserLanguage[];
  canEdit: boolean;
};

const PROFICIENCY_LEVELS = Object.values(LanguageProficiency);

type LanguageFormModalProps = {
  open: boolean;
  userLanguage: UserLanguage | null;
  existingLanguageIds: Set<string>;
  onClose: () => void;
};

function LanguageFormModal({
  open,
  userLanguage,
  existingLanguageIds,
  onClose,
}: LanguageFormModalProps) {
  const t = useTranslations("profile");
  const tCommon = useTranslations("common");
  const locale = useLocale() as AppLocale;
  const createLanguage = useCreateUserLanguage();
  const updateLanguage = useUpdateUserLanguage();
  const [query, setQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(
    () => userLanguage?.language ?? null,
  );
  const [proficiency, setProficiency] = useState<LanguageProficiency>(
    () => userLanguage?.proficiency ?? LanguageProficiency.PROFESSIONAL,
  );

  const isEditing = userLanguage !== null;
  const isPending = createLanguage.isPending || updateLanguage.isPending;
  const { data: searchResults, isFetching } = useLanguageSearch(
    query,
    open && !isEditing,
  );

  const suggestions =
    searchResults?.data.filter(
      (language) => !existingLanguageIds.has(language.id),
    ) ?? [];

  async function handleSave() {
    if (isEditing && userLanguage) {
      await updateLanguage.mutateAsync({
        id: userLanguage.id,
        proficiency,
      });
    } else if (selectedLanguage) {
      await createLanguage.mutateAsync({
        languageId: selectedLanguage.id,
        proficiency,
      });
    }
    onClose();
  }

  return (
    <ProfileModal
      title={isEditing ? t("editLanguage") : t("addLanguage")}
      open={open}
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="ghost" onClick={onClose}>
            {tCommon("cancel")}
          </Button>
          <Button
            type="button"
            disabled={isPending || (!isEditing && !selectedLanguage)}
            onClick={() => void handleSave()}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : null}
            {tCommon("save")}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        {isEditing ? (
          <p className="text-sm font-medium text-foreground">
            {userLanguage?.language.displayName(locale)}
          </p>
        ) : (
          <>
            <input
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setSelectedLanguage(null);
              }}
              placeholder={t("searchLanguages")}
              className="w-full rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            {selectedLanguage ? (
              <p className="text-sm text-foreground">
                {selectedLanguage.displayName(locale)}
              </p>
            ) : null}
            {isFetching ? (
              <div className="flex justify-center py-2">
                <Loader2
                  className="h-5 w-5 animate-spin text-primary"
                  aria-hidden
                />
              </div>
            ) : null}
            {!selectedLanguage && suggestions.length > 0 ? (
              <ul className="max-h-40 overflow-y-auto">
                {suggestions.map((language) => (
                  <li key={language.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedLanguage(language);
                        setQuery(language.displayName(locale));
                      }}
                      className="w-full rounded-md px-2 py-2 text-left text-sm text-foreground hover:bg-surface-muted"
                    >
                      {language.displayName(locale)}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </>
        )}
        <Select
          id="language-proficiency"
          label={t("proficiency")}
          value={proficiency}
          onChange={(value) => setProficiency(value as LanguageProficiency)}
          options={PROFICIENCY_LEVELS.map((level) => ({
            value: level,
            label: t(`languageProficiency.${level}`),
          }))}
        />
      </div>
    </ProfileModal>
  );
}

export function ProfileLanguagesSection({
  languages,
  canEdit,
}: ProfileLanguagesSectionProps) {
  const t = useTranslations("profile");
  const locale = useLocale() as AppLocale;
  const deleteLanguage = useDeleteUserLanguage();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLanguage, setEditingLanguage] = useState<UserLanguage | null>(
    null,
  );

  const existingLanguageIds = new Set(
    languages.map((item) => item.language.id),
  );

  function openAdd() {
    setEditingLanguage(null);
    setModalOpen(true);
  }

  function openEdit(userLanguage: UserLanguage) {
    setEditingLanguage(userLanguage);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingLanguage(null);
  }

  async function handleDelete(userLanguage: UserLanguage) {
    if (!window.confirm(t("deleteLanguageConfirm"))) return;
    await deleteLanguage.mutateAsync(userLanguage.id);
  }

  return (
    <>
      <ProfileSection
        title={t("languages")}
        canEdit={canEdit}
        onAdd={canEdit ? openAdd : undefined}
        isEmpty={languages.length === 0}
        emptyText={t("languagesEmpty")}
      >
        <ul className="space-y-4">
          {languages.map((userLanguage) => (
            <li key={userLanguage.id} className="group">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-foreground">
                    {userLanguage.language.displayName(locale)}
                  </h3>
                  <p className="text-sm text-muted">
                    {t(`languageProficiency.${userLanguage.proficiency}`)}
                  </p>
                </div>
                {canEdit ? (
                  <div className="flex shrink-0 items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => openEdit(userLanguage)}
                      className="rounded-full p-2 text-muted hover:bg-surface-muted hover:text-foreground"
                      aria-label={t("editLanguage")}
                    >
                      <Pencil className="h-4 w-4" aria-hidden />
                    </button>
                    <button
                      type="button"
                      disabled={deleteLanguage.isPending}
                      onClick={() => void handleDelete(userLanguage)}
                      className="rounded-full p-2 text-muted hover:bg-surface-muted hover:text-danger"
                      aria-label={t("deleteLanguage")}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </button>
                  </div>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </ProfileSection>

      {canEdit && modalOpen ? (
        <LanguageFormModal
          key={editingLanguage?.id ?? "new"}
          open={modalOpen}
          userLanguage={editingLanguage}
          existingLanguageIds={existingLanguageIds}
          onClose={closeModal}
        />
      ) : null}
    </>
  );
}
