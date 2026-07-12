"use client";

import { useState } from "react";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { WorkExperience } from "@/core/domain/entities/work-experience.entity";
import type { WorkExperienceInput } from "@/core/domain/repositories/profile.repository";
import { EmploymentType } from "@/core/domain/enums/employment-type.enum";
import { WorkplaceType } from "@/core/domain/enums/workplace-type.enum";
import { ProfileModal } from "@/presentation/components/profile/profile-modal";
import { ProfileSection } from "@/presentation/components/profile/profile-section";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { MonthYearPicker } from "@/presentation/components/ui/month-year-picker";
import { Select } from "@/presentation/components/ui/select";
import { Textarea } from "@/presentation/components/ui/textarea";
import {
  useCreateExperience,
  useDeleteExperience,
  useUpdateExperience,
} from "@/presentation/hooks/use-profile";
import {
  formatProfileDateRange,
  monthInputToIsoDate,
  toMonthInputValue,
} from "@/presentation/lib/format-profile-date";

type ProfileExperienceSectionProps = {
  experiences: WorkExperience[];
  canEdit: boolean;
};

type ExperienceFormState = {
  title: string;
  companyName: string;
  employmentType: EmploymentType;
  workplaceType: WorkplaceType;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
};

const EMPLOYMENT_TYPES = Object.values(EmploymentType);
const WORKPLACE_TYPES = Object.values(WorkplaceType);

function emptyFormState(): ExperienceFormState {
  return {
    title: "",
    companyName: "",
    employmentType: EmploymentType.FULL_TIME,
    workplaceType: WorkplaceType.ON_SITE,
    startDate: "",
    endDate: "",
    isCurrent: false,
    description: "",
  };
}

function formFromExperience(experience: WorkExperience): ExperienceFormState {
  return {
    title: experience.title,
    companyName: experience.companyName,
    employmentType: experience.employmentType,
    workplaceType: experience.workplaceType,
    startDate: toMonthInputValue(experience.startDate),
    endDate: toMonthInputValue(experience.endDate),
    isCurrent: experience.endDate === null,
    description: experience.description ?? "",
  };
}

function formToInput(form: ExperienceFormState): WorkExperienceInput {
  return {
    title: form.title.trim(),
    companyName: form.companyName.trim(),
    employmentType: form.employmentType,
    workplaceType: form.workplaceType,
    startDate: monthInputToIsoDate(form.startDate),
    endDate: form.isCurrent
      ? null
      : form.endDate
        ? monthInputToIsoDate(form.endDate)
        : null,
    description: form.description.trim() || null,
  };
}

type ExperienceFormModalProps = {
  open: boolean;
  experience: WorkExperience | null;
  onClose: () => void;
};

function ExperienceFormModal({
  open,
  experience,
  onClose,
}: ExperienceFormModalProps) {
  const t = useTranslations("profile");
  const tCommon = useTranslations("common");
  const createExperience = useCreateExperience();
  const updateExperience = useUpdateExperience();
  const [form, setForm] = useState<ExperienceFormState>(() =>
    experience ? formFromExperience(experience) : emptyFormState(),
  );

  const isEditing = experience !== null;
  const isPending = createExperience.isPending || updateExperience.isPending;

  function updateField<K extends keyof ExperienceFormState>(
    key: K,
    value: ExperienceFormState[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    const input = formToInput(form);
    if (isEditing && experience) {
      await updateExperience.mutateAsync({ id: experience.id, data: input });
    } else {
      await createExperience.mutateAsync(input);
    }
    onClose();
  }

  return (
    <ProfileModal
      title={isEditing ? t("editExperience") : t("addExperience")}
      open={open}
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="ghost" onClick={onClose}>
            {tCommon("cancel")}
          </Button>
          <Button
            type="button"
            disabled={
              isPending ||
              !form.title.trim() ||
              !form.companyName.trim() ||
              !form.startDate
            }
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
        <Input
          label={t("jobTitle")}
          value={form.title}
          onChange={(event) => updateField("title", event.target.value)}
        />
        <Input
          label={t("company")}
          value={form.companyName}
          onChange={(event) => updateField("companyName", event.target.value)}
        />
        <Select
          id="employment-type"
          label={t("employmentTypeLabel")}
          value={form.employmentType}
          onChange={(value) =>
            updateField("employmentType", value as EmploymentType)
          }
          options={EMPLOYMENT_TYPES.map((type) => ({
            value: type,
            label: t(`employmentType.${type}`),
          }))}
        />
        <Select
          id="workplace-type"
          label={t("workplaceTypeLabel")}
          value={form.workplaceType}
          onChange={(value) =>
            updateField("workplaceType", value as WorkplaceType)
          }
          options={WORKPLACE_TYPES.map((type) => ({
            value: type,
            label: t(`workplaceType.${type}`),
          }))}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <MonthYearPicker
            id="experience-start"
            label={t("startDate")}
            value={form.startDate}
            onChange={(value) => updateField("startDate", value)}
          />
          <MonthYearPicker
            id="experience-end"
            label={t("endDate")}
            value={form.endDate}
            disabled={form.isCurrent}
            onChange={(value) => updateField("endDate", value)}
          />
        </div>
        <label className="inline-flex items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            checked={form.isCurrent}
            onChange={(event) => updateField("isCurrent", event.target.checked)}
            className="rounded border-border-strong"
          />
          {t("currentlyWorking")}
        </label>
        <Textarea
          label={t("description")}
          value={form.description}
          onChange={(event) => updateField("description", event.target.value)}
        />
      </div>
    </ProfileModal>
  );
}

export function ProfileExperienceSection({
  experiences,
  canEdit,
}: ProfileExperienceSectionProps) {
  const t = useTranslations("profile");
  const locale = useLocale();
  const deleteExperience = useDeleteExperience();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] =
    useState<WorkExperience | null>(null);

  function openAdd() {
    setEditingExperience(null);
    setModalOpen(true);
  }

  function openEdit(experience: WorkExperience) {
    setEditingExperience(experience);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingExperience(null);
  }

  async function handleDelete(experience: WorkExperience) {
    if (!window.confirm(t("deleteExperienceConfirm"))) return;
    await deleteExperience.mutateAsync(experience.id);
  }

  return (
    <>
      <ProfileSection
        title={t("experience")}
        canEdit={canEdit}
        onAdd={canEdit ? openAdd : undefined}
        isEmpty={experiences.length === 0}
        emptyText={t("experienceEmpty")}
      >
        <ul className="space-y-6">
          {experiences.map((experience) => (
            <li key={experience.id} className="group">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-foreground">
                    {experience.title}
                  </h3>
                  <p className="text-sm text-foreground">
                    {experience.companyName}
                  </p>
                  <p className="text-sm text-muted">
                    {formatProfileDateRange(
                      experience.startDate,
                      experience.endDate,
                      t("present"),
                      locale,
                    )}
                    {" · "}
                    {t(`employmentType.${experience.employmentType}`)}
                    {" · "}
                    {t(`workplaceType.${experience.workplaceType}`)}
                  </p>
                  {experience.description ? (
                    <p className="mt-2 whitespace-pre-wrap text-sm text-foreground">
                      {experience.description}
                    </p>
                  ) : null}
                </div>
                {canEdit ? (
                  <div className="flex shrink-0 items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => openEdit(experience)}
                      className="rounded-full p-2 text-muted hover:bg-surface-muted hover:text-foreground"
                      aria-label={t("editExperience")}
                    >
                      <Pencil className="h-4 w-4" aria-hidden />
                    </button>
                    <button
                      type="button"
                      disabled={deleteExperience.isPending}
                      onClick={() => void handleDelete(experience)}
                      className="rounded-full p-2 text-muted hover:bg-surface-muted hover:text-danger"
                      aria-label={t("deleteExperience")}
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
        <ExperienceFormModal
          key={editingExperience?.id ?? "new"}
          open={modalOpen}
          experience={editingExperience}
          onClose={closeModal}
        />
      ) : null}
    </>
  );
}
