"use client";

import { useTranslations } from "next-intl";
import type { UserProfile } from "@/core/domain/entities/user-profile.entity";
import { ProfileSection } from "@/presentation/components/profile/profile-section";

type ProfileAboutSectionProps = {
  profile: UserProfile;
  canEdit: boolean;
  onEdit: () => void;
};

export function ProfileAboutSection({
  profile,
  canEdit,
  onEdit,
}: ProfileAboutSectionProps) {
  const t = useTranslations("profile");
  const bio = profile.bio?.trim() ?? "";

  return (
    <ProfileSection
      title={t("about")}
      canEdit={canEdit}
      onEdit={onEdit}
      isEmpty={!bio}
      emptyText={t("aboutEmpty")}
    >
      {bio ? (
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
          {bio}
        </p>
      ) : null}
    </ProfileSection>
  );
}
