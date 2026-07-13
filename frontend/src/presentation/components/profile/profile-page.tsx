"use client";

import { useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { ApiError } from "@/core/application/errors/api.error";
import { EditIntroModal } from "@/presentation/components/profile/edit-intro-modal";
import { ProfileAboutSection } from "@/presentation/components/profile/profile-about-section";
import { ProfileEducationSection } from "@/presentation/components/profile/profile-education-section";
import { ProfileExperienceSection } from "@/presentation/components/profile/profile-experience-section";
import { ProfileHero } from "@/presentation/components/profile/profile-hero";
import { ProfileLanguagesSection } from "@/presentation/components/profile/profile-languages-section";
import { ProfileSkillsSection } from "@/presentation/components/profile/profile-skills-section";
import { FeedCard } from "@/presentation/components/feed/feed-card";
import { ProfileConnectActions } from "@/presentation/components/network/profile-connect-actions";
import { LocaleSwitcher } from "@/presentation/components/ui/locale-switcher";
import {
  useMyProfile,
  useUpdateProfile,
  useUserProfile,
} from "@/presentation/hooks/use-profile";
import { useAuthStore } from "@/presentation/stores/auth.store";

type ProfilePageProps = {
  userId?: string;
};

export function ProfilePage({ userId }: ProfilePageProps) {
  const t = useTranslations("profile");
  const authUser = useAuthStore((state) => state.user);
  const isOwnProfile = userId === undefined;

  const myProfileQuery = useMyProfile(isOwnProfile);
  const userProfileQuery = useUserProfile(isOwnProfile ? undefined : userId);

  const query = isOwnProfile ? myProfileQuery : userProfileQuery;
  const { data: profile, isLoading, error } = query;

  const updateProfile = useUpdateProfile();
  const [introModalOpen, setIntroModalOpen] = useState(false);

  const canEdit = Boolean(
    profile && authUser && profile.isOwnedBy(authUser.id),
  );

  async function handleAvatarUploaded(url: string) {
    await updateProfile.mutateAsync({ avatarUrl: url });
  }

  async function handleCoverUploaded(url: string) {
    await updateProfile.mutateAsync({ coverUrl: url });
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden />
      </div>
    );
  }

  if (error) {
    return (
      <FeedCard className="px-4 py-8 text-center">
        <p className="inline-flex items-center gap-2 text-sm text-danger">
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
          {error instanceof ApiError ? error.message : t("loadFailed")}
        </p>
      </FeedCard>
    );
  }

  if (!profile) return null;

  return (
    <>
      <div className="grid items-start gap-2 lg:grid-cols-[minmax(0,780px)_minmax(0,300px)]">
        <div className="mx-auto w-full max-w-[780px] space-y-2 lg:mx-0">
          <ProfileHero
            profile={profile}
            canEdit={canEdit}
            onEditIntro={() => setIntroModalOpen(true)}
            onAvatarUploaded={(url) => void handleAvatarUploaded(url)}
            onCoverUploaded={(url) => void handleCoverUploaded(url)}
            connectActions={
              !canEdit && authUser ? (
                <ProfileConnectActions otherUserId={profile.id} />
              ) : undefined
            }
          />
          <ProfileAboutSection
            profile={profile}
            canEdit={canEdit}
            onEdit={() => setIntroModalOpen(true)}
          />
          <ProfileExperienceSection
            experiences={profile.experiences}
            canEdit={canEdit}
          />
          <ProfileEducationSection
            educations={profile.educations}
            canEdit={canEdit}
          />
          <ProfileSkillsSection skills={profile.skills} canEdit={canEdit} />
          <ProfileLanguagesSection
            languages={profile.languages}
            canEdit={canEdit}
          />
        </div>

        <aside className="space-y-2">
          {canEdit ? (
            <FeedCard className="px-4 py-4">
              <h2 className="text-sm font-semibold text-foreground">
                {t("languageSettings")}
              </h2>
              <p className="mt-1 text-xs text-muted">
                {t("languageSettingsHint")}
              </p>
              <div className="mt-3">
                <LocaleSwitcher variant="full" />
              </div>
            </FeedCard>
          ) : null}
          <FeedCard className="hidden px-4 py-4 lg:block">
            <h2 className="text-sm font-semibold text-foreground">
              {t("profileInsights")}
            </h2>
            <p className="mt-2 text-xs text-muted">{t("insightsComingSoon")}</p>
          </FeedCard>
        </aside>
      </div>

      {canEdit && introModalOpen ? (
        <EditIntroModal
          profile={profile}
          open={introModalOpen}
          onClose={() => setIntroModalOpen(false)}
        />
      ) : null}
    </>
  );
}
