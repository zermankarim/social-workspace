"use client";

import { useState } from "react";
import { Loader2, Pencil, Trash2, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { ApiError } from "@/core/application/errors/api.error";
import type { Education } from "@/core/domain/entities/education.entity";
import type { EducationInput } from "@/core/domain/repositories/profile.repository";
import { EducationDegree } from "@/core/domain/enums/education-degree.enum";
import { ProfileModal } from "@/presentation/components/profile/profile-modal";
import { ProfileSection } from "@/presentation/components/profile/profile-section";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { MonthYearPicker } from "@/presentation/components/ui/month-year-picker";
import { Select } from "@/presentation/components/ui/select";
import { Textarea } from "@/presentation/components/ui/textarea";
import {
  useCreateEducation,
  useDeleteEducation,
  useUpdateEducation,
} from "@/presentation/hooks/use-profile";
import {
  formatProfileDateRange,
  monthInputToIsoDate,
  toMonthInputValue,
} from "@/presentation/lib/format-profile-date";

const GRADE_POINT_MIN = 0;
const GRADE_POINT_MAX = 5;
const GRADE_POINT_STEP = 0.1;

const GRADE_POINT_OPTIONS = Array.from(
  {
    length:
      Math.round((GRADE_POINT_MAX - GRADE_POINT_MIN) / GRADE_POINT_STEP) + 1,
  },
  (_, index) => {
    const value = (GRADE_POINT_MIN + index * GRADE_POINT_STEP).toFixed(1);
    return { value, label: value };
  },
);

function toGradePointSelectValue(gradePoint: number | null): string {
  if (gradePoint === null) return "";
  const rounded = Math.round(gradePoint / GRADE_POINT_STEP) * GRADE_POINT_STEP;
  const clamped = Math.min(GRADE_POINT_MAX, Math.max(GRADE_POINT_MIN, rounded));
  return clamped.toFixed(1);
}

type ProfileEducationSectionProps = {
  educations: Education[];
  canEdit: boolean;
};

type EducationFormState = {
  schoolName: string;
  degree: EducationDegree;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  gradePoint: string;
  skillNames: string[];
};

const DEGREE_TYPES = Object.values(EducationDegree);

function emptyFormState(): EducationFormState {
  return {
    schoolName: "",
    degree: EducationDegree.BACHELOR,
    startDate: "",
    endDate: "",
    isCurrent: false,
    description: "",
    gradePoint: "",
    skillNames: [],
  };
}

function formFromEducation(education: Education): EducationFormState {
  return {
    schoolName: education.schoolName,
    degree: education.degree,
    startDate: toMonthInputValue(education.startDate),
    endDate: toMonthInputValue(education.endDate),
    isCurrent: education.endDate === null,
    description: education.description ?? "",
    gradePoint: toGradePointSelectValue(education.gradePoint),
    skillNames: education.skills.map((skill) => skill.name),
  };
}

function formToInput(form: EducationFormState): EducationInput {
  return {
    schoolName: form.schoolName.trim(),
    degree: form.degree,
    startDate: monthInputToIsoDate(form.startDate),
    endDate: form.isCurrent
      ? null
      : form.endDate
        ? monthInputToIsoDate(form.endDate)
        : null,
    description: form.description.trim() || null,
    gradePoint: form.gradePoint ? Number.parseFloat(form.gradePoint) : null,
    skillNames: form.skillNames,
  };
}

type EducationFormModalProps = {
  open: boolean;
  education: Education | null;
  onClose: () => void;
};

function EducationFormModal({
  open,
  education,
  onClose,
}: EducationFormModalProps) {
  const t = useTranslations("profile");
  const tCommon = useTranslations("common");
  const createEducation = useCreateEducation();
  const updateEducation = useUpdateEducation();
  const [form, setForm] = useState<EducationFormState>(() =>
    education ? formFromEducation(education) : emptyFormState(),
  );
  const [skillInput, setSkillInput] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const isEditing = education !== null;
  const isPending = createEducation.isPending || updateEducation.isPending;

  function updateField<K extends keyof EducationFormState>(
    key: K,
    value: EducationFormState[K],
  ) {
    setFormError(null);
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function addSkillName(name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;
    setForm((prev) => {
      if (
        prev.skillNames.some((s) => s.toLowerCase() === trimmed.toLowerCase())
      ) {
        return prev;
      }
      return { ...prev, skillNames: [...prev.skillNames, trimmed] };
    });
    setSkillInput("");
  }

  function removeSkillName(name: string) {
    setForm((prev) => ({
      ...prev,
      skillNames: prev.skillNames.filter((s) => s !== name),
    }));
  }

  async function handleSave() {
    const input = formToInput(form);
    try {
      if (isEditing && education) {
        await updateEducation.mutateAsync({ id: education.id, data: input });
      } else {
        await createEducation.mutateAsync(input);
      }
      onClose();
    } catch (error) {
      setFormError(error instanceof ApiError ? error.message : t("saveFailed"));
    }
  }

  return (
    <ProfileModal
      title={isEditing ? t("editEducation") : t("addEducation")}
      open={open}
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="ghost" onClick={onClose}>
            {tCommon("cancel")}
          </Button>
          <Button
            type="button"
            disabled={isPending || !form.schoolName.trim() || !form.startDate}
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
          label={t("school")}
          value={form.schoolName}
          onChange={(event) => updateField("schoolName", event.target.value)}
        />
        <Select
          id="degree-type"
          label={t("degree")}
          value={form.degree}
          onChange={(value) => updateField("degree", value as EducationDegree)}
          options={DEGREE_TYPES.map((type) => ({
            value: type,
            label: t(`educationDegree.${type}`),
          }))}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <MonthYearPicker
            id="education-start"
            label={t("startDate")}
            value={form.startDate}
            onChange={(value) => updateField("startDate", value)}
          />
          <MonthYearPicker
            id="education-end"
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
          {t("currentlyStudying")}
        </label>
        <Select
          id="education-grade-point"
          label={t("gradePoint")}
          value={form.gradePoint}
          placeholder={t("gradePointNone")}
          onChange={(value) => updateField("gradePoint", value)}
          options={GRADE_POINT_OPTIONS}
        />
        <Textarea
          label={t("description")}
          value={form.description}
          onChange={(event) => updateField("description", event.target.value)}
        />
        {formError ? (
          <p className="text-sm text-danger" role="alert">
            {formError}
          </p>
        ) : null}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="education-skills"
            className="text-sm font-medium text-foreground"
          >
            {t("skills")}
          </label>
          <div className="flex gap-2">
            <input
              id="education-skills"
              type="text"
              value={skillInput}
              placeholder={t("skillsPlaceholder")}
              onChange={(event) => setSkillInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === ",") {
                  event.preventDefault();
                  addSkillName(skillInput);
                }
              }}
              onBlur={() => addSkillName(skillInput)}
              className="flex-1 rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => addSkillName(skillInput)}
            >
              {t("addSkill")}
            </Button>
          </div>
          {form.skillNames.length > 0 ? (
            <ul className="mt-1 flex flex-wrap gap-2">
              {form.skillNames.map((name) => (
                <li key={name}>
                  <span className="inline-flex items-center gap-1 rounded-full bg-surface-muted px-3 py-1 text-sm text-foreground">
                    {name}
                    <button
                      type="button"
                      onClick={() => removeSkillName(name)}
                      className="rounded-full p-0.5 text-muted hover:text-foreground"
                      aria-label={t("removeSkill")}
                    >
                      <X className="h-3 w-3" aria-hidden />
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </ProfileModal>
  );
}

export function ProfileEducationSection({
  educations,
  canEdit,
}: ProfileEducationSectionProps) {
  const t = useTranslations("profile");
  const locale = useLocale();
  const deleteEducation = useDeleteEducation();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(
    null,
  );

  function openAdd() {
    setEditingEducation(null);
    setModalOpen(true);
  }

  function openEdit(education: Education) {
    setEditingEducation(education);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingEducation(null);
  }

  async function handleDelete(education: Education) {
    if (!window.confirm(t("deleteEducationConfirm"))) return;
    await deleteEducation.mutateAsync(education.id);
  }

  return (
    <>
      <ProfileSection
        title={t("education")}
        canEdit={canEdit}
        onAdd={canEdit ? openAdd : undefined}
        isEmpty={educations.length === 0}
        emptyText={t("educationEmpty")}
      >
        <ul className="space-y-6">
          {educations.map((education) => (
            <li key={education.id} className="group">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-foreground">
                    {education.schoolName}
                  </h3>
                  <p className="text-sm text-foreground">
                    {t(`educationDegree.${education.degree}`)}
                  </p>
                  <p className="text-sm text-muted">
                    {formatProfileDateRange(
                      education.startDate,
                      education.endDate,
                      t("present"),
                      locale,
                    )}
                    {education.gradePoint !== null
                      ? ` · ${t("gradePoint")}: ${education.gradePoint}`
                      : null}
                  </p>
                  {education.description ? (
                    <p className="mt-2 whitespace-pre-wrap text-sm text-foreground">
                      {education.description}
                    </p>
                  ) : null}
                  {education.skills.length > 0 ? (
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {education.skills.map((skill) => (
                        <li key={skill.id}>
                          <span className="rounded-full bg-surface-muted px-3 py-1 text-xs text-foreground">
                            {skill.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
                {canEdit ? (
                  <div className="flex shrink-0 items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => openEdit(education)}
                      className="rounded-full p-2 text-muted hover:bg-surface-muted hover:text-foreground"
                      aria-label={t("editEducation")}
                    >
                      <Pencil className="h-4 w-4" aria-hidden />
                    </button>
                    <button
                      type="button"
                      disabled={deleteEducation.isPending}
                      onClick={() => void handleDelete(education)}
                      className="rounded-full p-2 text-muted hover:bg-surface-muted hover:text-danger"
                      aria-label={t("deleteEducation")}
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
        <EducationFormModal
          key={editingEducation?.id ?? "new"}
          open={modalOpen}
          education={editingEducation}
          onClose={closeModal}
        />
      ) : null}
    </>
  );
}
