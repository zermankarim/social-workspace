"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { UserProfile } from "@/core/domain/entities/user-profile.entity";
import { ProfileModal } from "@/presentation/components/profile/profile-modal";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Textarea } from "@/presentation/components/ui/textarea";
import { useUpdateProfile } from "@/presentation/hooks/use-profile";

type EditIntroModalProps = {
  profile: UserProfile;
  open: boolean;
  onClose: () => void;
};

type IntroFormState = {
  firstName: string;
  lastName: string;
  headline: string;
  bio: string;
  website: string;
  github: string;
  linkedin: string;
  twitter: string;
};

function toFormState(profile: UserProfile): IntroFormState {
  return {
    firstName: profile.firstName,
    lastName: profile.lastName,
    headline: profile.headline ?? "",
    bio: profile.bio ?? "",
    website: profile.website ?? "",
    github: profile.github ?? "",
    linkedin: profile.linkedin ?? "",
    twitter: profile.twitter ?? "",
  };
}

export function EditIntroModal({
  profile,
  open,
  onClose,
}: EditIntroModalProps) {
  const t = useTranslations("profile");
  const tCommon = useTranslations("common");
  const updateProfile = useUpdateProfile();
  const [form, setForm] = useState<IntroFormState>(() => toFormState(profile));

  function updateField<K extends keyof IntroFormState>(
    key: K,
    value: IntroFormState[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    await updateProfile.mutateAsync({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      headline: form.headline.trim() || null,
      bio: form.bio.trim() || null,
      website: form.website.trim() || null,
      github: form.github.trim() || null,
      linkedin: form.linkedin.trim() || null,
      twitter: form.twitter.trim() || null,
    });
    onClose();
  }

  return (
    <ProfileModal
      title={t("editIntro")}
      open={open}
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="ghost" onClick={onClose}>
            {tCommon("cancel")}
          </Button>
          <Button
            type="button"
            disabled={updateProfile.isPending}
            onClick={() => void handleSave()}
          >
            {tCommon("save")}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label={t("firstName")}
            value={form.firstName}
            onChange={(event) => updateField("firstName", event.target.value)}
          />
          <Input
            label={t("lastName")}
            value={form.lastName}
            onChange={(event) => updateField("lastName", event.target.value)}
          />
        </div>
        <Input
          label={t("headline")}
          value={form.headline}
          onChange={(event) => updateField("headline", event.target.value)}
        />
        <Textarea
          label={t("bio")}
          value={form.bio}
          onChange={(event) => updateField("bio", event.target.value)}
        />
        <Input
          label={t("website")}
          type="url"
          value={form.website}
          onChange={(event) => updateField("website", event.target.value)}
        />
        <Input
          label="GitHub"
          type="url"
          value={form.github}
          onChange={(event) => updateField("github", event.target.value)}
        />
        <Input
          label="LinkedIn"
          type="url"
          value={form.linkedin}
          onChange={(event) => updateField("linkedin", event.target.value)}
        />
        <Input
          label={t("twitter")}
          type="url"
          value={form.twitter}
          onChange={(event) => updateField("twitter", event.target.value)}
        />
      </div>
    </ProfileModal>
  );
}
