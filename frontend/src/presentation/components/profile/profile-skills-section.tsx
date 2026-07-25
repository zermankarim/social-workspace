"use client";

import { useState } from "react";
import { Check, ChevronDown, Loader2, Plus, ThumbsUp, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { ApiError } from "@/core/application/errors/api.error";
import type { Skill } from "@/core/domain/entities/skill.entity";
import { ProfileModal } from "@/presentation/components/profile/profile-modal";
import { ProfileSection } from "@/presentation/components/profile/profile-section";
import { Button } from "@/presentation/components/ui/button";
import {
  useEndorseSkill,
  useSkillEndorsers,
  useSkillSearch,
  useSyncUserSkills,
} from "@/presentation/hooks/use-profile";

const SKILLS_MAX_COUNT = 50;

type ProfileSkillsSectionProps = {
  skills: Skill[];
  canEdit: boolean;
  profileUserId: string;
};

function SkillEndorsersList({
  profileUserId,
  skillId,
}: {
  profileUserId: string;
  skillId: string;
}) {
  const t = useTranslations("profile");
  const { data: endorsers, isLoading } = useSkillEndorsers(
    profileUserId,
    skillId,
  );

  if (isLoading) {
    return (
      <div className="flex justify-center py-2">
        <Loader2
          className="h-3.5 w-3.5 animate-spin text-primary"
          aria-hidden
        />
      </div>
    );
  }

  if (!endorsers || endorsers.length === 0) {
    return <p className="py-1 text-xs text-muted">{t("noEndorsersYet")}</p>;
  }

  return (
    <ul className="space-y-1 py-1">
      {endorsers.map((endorser) => (
        <li key={endorser.id} className="flex items-center gap-2">
          {endorser.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={endorser.avatarUrl}
              alt=""
              className="h-5 w-5 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-soft text-[9px] font-semibold text-primary">
              {endorser.initials}
            </span>
          )}
          <span className="truncate text-xs text-foreground">
            {endorser.displayName}
          </span>
        </li>
      ))}
    </ul>
  );
}

function SkillPill({
  skill,
  canEndorse,
  profileUserId,
}: {
  skill: Skill;
  canEndorse: boolean;
  profileUserId: string;
}) {
  const t = useTranslations("profile");
  const [expanded, setExpanded] = useState(false);
  const [endorsedThisSession, setEndorsedThisSession] = useState(false);
  const endorseSkill = useEndorseSkill();

  const handleEndorse = () => {
    if (endorsedThisSession) return;
    setEndorsedThisSession(true);
    endorseSkill.mutate({ userId: profileUserId, skillId: skill.id });
  };

  return (
    <div className="rounded-lg bg-surface-muted">
      <div className="flex items-center gap-1.5 px-3 py-1.5">
        <span className="text-sm text-foreground">{skill.name}</span>
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="inline-flex items-center gap-0.5 text-xs text-muted hover:text-foreground"
        >
          {skill.endorsementsCount + (endorsedThisSession ? 1 : 0)}
          <ChevronDown
            className={`h-3 w-3 transition-transform ${expanded ? "rotate-180" : ""}`}
            aria-hidden
          />
        </button>
        {canEndorse ? (
          <button
            type="button"
            onClick={handleEndorse}
            disabled={endorsedThisSession || endorseSkill.isPending}
            aria-label={t("endorseSkill")}
            title={t("endorseSkill")}
            className={`ml-1 inline-flex h-6 w-6 items-center justify-center rounded-full transition-colors ${
              endorsedThisSession
                ? "bg-primary text-white"
                : "text-muted hover:bg-surface hover:text-primary"
            }`}
          >
            {endorsedThisSession ? (
              <Check className="h-3.5 w-3.5" aria-hidden />
            ) : (
              <ThumbsUp className="h-3.5 w-3.5" aria-hidden />
            )}
          </button>
        ) : null}
      </div>
      {expanded ? (
        <div className="border-t border-border px-3">
          <SkillEndorsersList
            profileUserId={profileUserId}
            skillId={skill.id}
          />
        </div>
      ) : null}
    </div>
  );
}

type DraftSkill = {
  key: string;
  skillId?: string;
  name: string;
};

function toDraftSkills(skills: Skill[]): DraftSkill[] {
  return skills.map((skill) => ({
    key: skill.id,
    skillId: skill.id,
    name: skill.name,
  }));
}

function hasDraftSkill(draft: DraftSkill[], name: string, skillId?: string) {
  const normalized = name.toLowerCase();
  return draft.some(
    (item) =>
      (skillId != null && item.skillId === skillId) ||
      item.name.toLowerCase() === normalized,
  );
}

type SkillsEditorModalProps = {
  open: boolean;
  skills: Skill[];
  onClose: () => void;
};

function SkillsEditorModal({ open, skills, onClose }: SkillsEditorModalProps) {
  const t = useTranslations("profile");
  const tCommon = useTranslations("common");
  const syncSkills = useSyncUserSkills();
  const [draft, setDraft] = useState<DraftSkill[]>(() => toDraftSkills(skills));
  const [query, setQuery] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const { data: searchResults, isFetching } = useSkillSearch(query, open);

  const trimmedQuery = query.trim();
  const draftIds = new Set(
    draft.flatMap((item) => (item.skillId ? [item.skillId] : [])),
  );
  const suggestions =
    searchResults?.data.filter(
      (skill) =>
        !draftIds.has(skill.id) && !hasDraftSkill(draft, skill.name, skill.id),
    ) ?? [];

  const canCreateByName =
    trimmedQuery.length > 0 &&
    !hasDraftSkill(draft, trimmedQuery) &&
    !suggestions.some(
      (skill) => skill.name.toLowerCase() === trimmedQuery.toLowerCase(),
    ) &&
    draft.length < SKILLS_MAX_COUNT;

  function addDraftSkill(input: { skillId?: string; name: string }) {
    const name = input.name.trim();
    if (!name || draft.length >= SKILLS_MAX_COUNT) return;
    if (hasDraftSkill(draft, name, input.skillId)) return;

    setDraft((prev) => [
      ...prev,
      {
        key: input.skillId ?? `new:${name.toLowerCase()}`,
        skillId: input.skillId,
        name,
      },
    ]);
    setQuery("");
    setFormError(null);
  }

  function removeDraftSkill(key: string) {
    setDraft((prev) => prev.filter((item) => item.key !== key));
    setFormError(null);
  }

  async function handleSave() {
    try {
      await syncSkills.mutateAsync({
        current: skills,
        next: draft.map((item) => ({
          skillId: item.skillId,
          name: item.name,
        })),
      });
      onClose();
    } catch (error) {
      setFormError(error instanceof ApiError ? error.message : t("saveFailed"));
    }
  }

  return (
    <ProfileModal
      title={t("editSkills")}
      open={open}
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="ghost" onClick={onClose}>
            {tCommon("cancel")}
          </Button>
          <Button
            type="button"
            disabled={syncSkills.isPending}
            onClick={() => void handleSave()}
          >
            {syncSkills.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : null}
            {tCommon("save")}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-foreground">
            {t("selectedSkills")}
          </p>
          {draft.length === 0 ? (
            <p className="text-sm text-muted">{t("skillsEmpty")}</p>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {draft.map((skill) => (
                <li key={skill.key}>
                  <span className="inline-flex items-center gap-1 rounded-full bg-surface-muted px-3 py-1.5 text-sm text-foreground">
                    {skill.name}
                    <button
                      type="button"
                      onClick={() => removeDraftSkill(skill.key)}
                      className="rounded-full p-0.5 text-muted hover:text-foreground"
                      aria-label={t("removeSkill")}
                    >
                      <X className="h-3.5 w-3.5" aria-hidden />
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="profile-skills-search"
            className="text-sm font-medium text-foreground"
          >
            {t("addSkill")}
          </label>
          <input
            id="profile-skills-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && canCreateByName) {
                event.preventDefault();
                addDraftSkill({ name: trimmedQuery });
              }
            }}
            placeholder={t("searchSkills")}
            className="w-full rounded-lg border border-border-strong bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />

          {isFetching ? (
            <div className="flex justify-center py-3">
              <Loader2
                className="h-5 w-5 animate-spin text-primary"
                aria-hidden
              />
            </div>
          ) : null}

          {canCreateByName ? (
            <button
              type="button"
              onClick={() => addDraftSkill({ name: trimmedQuery })}
              className="flex items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-foreground hover:bg-surface-muted"
            >
              <Plus className="h-4 w-4 shrink-0 text-primary" aria-hidden />
              {t("createSkill", { name: trimmedQuery })}
            </button>
          ) : null}

          {suggestions.length > 0 ? (
            <ul className="max-h-40 overflow-y-auto rounded-lg border border-border">
              {suggestions.map((skill) => (
                <li
                  key={skill.id}
                  className="border-b border-border last:border-b-0"
                >
                  <button
                    type="button"
                    disabled={draft.length >= SKILLS_MAX_COUNT}
                    onClick={() =>
                      addDraftSkill({ skillId: skill.id, name: skill.name })
                    }
                    className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-surface-muted disabled:opacity-50"
                  >
                    {skill.name}
                  </button>
                </li>
              ))}
            </ul>
          ) : trimmedQuery && !isFetching && !canCreateByName ? (
            <p className="text-sm text-muted">{t("noSkillsFound")}</p>
          ) : null}
        </div>

        {formError ? (
          <p className="text-sm text-danger" role="alert">
            {formError}
          </p>
        ) : null}
      </div>
    </ProfileModal>
  );
}

export function ProfileSkillsSection({
  skills,
  canEdit,
  profileUserId,
}: ProfileSkillsSectionProps) {
  const t = useTranslations("profile");
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <ProfileSection
        title={t("skills")}
        canEdit={canEdit}
        onAdd={
          canEdit && skills.length === 0 ? () => setModalOpen(true) : undefined
        }
        onEdit={
          canEdit && skills.length > 0 ? () => setModalOpen(true) : undefined
        }
        isEmpty={skills.length === 0}
        emptyText={t("skillsEmpty")}
      >
        <ul className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <li key={skill.id}>
              <SkillPill
                skill={skill}
                canEndorse={!canEdit}
                profileUserId={profileUserId}
              />
            </li>
          ))}
        </ul>
      </ProfileSection>

      {canEdit && modalOpen ? (
        <SkillsEditorModal
          key={skills.map((skill) => skill.id).join("|")}
          open={modalOpen}
          skills={skills}
          onClose={() => setModalOpen(false)}
        />
      ) : null}
    </>
  );
}
