"use client";

import { useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { Camera, ExternalLink, Globe, MapPin, Pencil } from "lucide-react";
import { useTranslations } from "next-intl";
import type { UserProfile } from "@/core/domain/entities/user-profile.entity";
import { appContainer } from "@/modules/app.container";
import { FeedCard } from "@/presentation/components/feed/feed-card";
import { Button } from "@/presentation/components/ui/button";
import {
  ImageLightbox,
  type LightboxImage,
} from "@/presentation/components/ui/image-lightbox";
import { UserNameWithBadge } from "@/presentation/components/ui/user-name-with-badge";
import { useFollowCounts } from "@/presentation/hooks/use-follows";

type ProfileHeroProps = {
  profile: UserProfile;
  canEdit: boolean;
  onEditIntro: () => void;
  onAvatarUploaded: (url: string) => void;
  onCoverUploaded: (url: string) => void;
  connectActions?: ReactNode;
};

function formatLocation(profile: UserProfile): string | null {
  const { location } = profile;
  if (!location) return null;
  return (
    location.label ??
    [location.city, location.country].filter(Boolean).join(", ") ??
    null
  );
}

export function ProfileHero({
  profile,
  canEdit,
  onEditIntro,
  onAvatarUploaded,
  onCoverUploaded,
  connectActions,
}: ProfileHeroProps) {
  const t = useTranslations("profile");
  const tNetwork = useTranslations("network");
  const followCountsQuery = useFollowCounts(profile.id);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [lightbox, setLightbox] = useState<{
    images: LightboxImage[];
    index: number;
  } | null>(null);

  const locationLabel = formatLocation(profile);

  async function handleFileUpload(
    file: File,
    onUploaded: (url: string) => void,
    setUploading: (value: boolean) => void,
  ) {
    setUploading(true);
    try {
      const result = await appContainer.uploadService.upload(file);
      onUploaded(result.url);
    } finally {
      setUploading(false);
    }
  }

  function openLightbox(src: string, alt: string) {
    setLightbox({ images: [{ src, alt }], index: 0 });
  }

  return (
    <FeedCard className="overflow-hidden">
      <div className="relative">
        <div
          className={`relative h-36 overflow-hidden sm:h-44 ${
            profile.coverUrl
              ? "bg-surface-muted"
              : "bg-gradient-to-r from-primary to-primary-hover"
          }`}
        >
          {profile.coverUrl ? (
            <button
              type="button"
              className="group absolute inset-0 cursor-zoom-in"
              onClick={() => openLightbox(profile.coverUrl!, t("viewCover"))}
              aria-label={t("viewCover")}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.coverUrl}
                alt=""
                className="h-full w-full object-cover transition duration-200 group-hover:brightness-95"
              />
            </button>
          ) : null}

          {canEdit ? (
            <>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    void handleFileUpload(
                      file,
                      onCoverUploaded,
                      setUploadingCover,
                    );
                  }
                  event.target.value = "";
                }}
              />
              <button
                type="button"
                disabled={uploadingCover}
                onClick={() => coverInputRef.current?.click()}
                className="absolute top-3 right-3 z-10 rounded-full bg-surface/90 p-2 text-muted shadow-sm hover:bg-surface hover:text-foreground"
                aria-label={t("changeCover")}
              >
                <Camera className="h-5 w-5" aria-hidden />
              </button>
            </>
          ) : null}
        </div>

        <div className="px-4 pb-4 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="relative -mt-16 shrink-0">
              {profile.avatarUrl ? (
                <button
                  type="button"
                  onClick={() =>
                    openLightbox(profile.avatarUrl!, t("viewPhoto"))
                  }
                  className="group block cursor-zoom-in rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                  aria-label={t("viewPhoto")}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={profile.avatarUrl}
                    alt=""
                    className="h-28 w-28 rounded-full border-4 border-surface object-cover transition duration-200 group-hover:brightness-95"
                  />
                </button>
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-surface bg-primary-soft text-2xl font-semibold text-primary">
                  {profile.initials}
                </div>
              )}
              {canEdit ? (
                <>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) {
                        void handleFileUpload(
                          file,
                          onAvatarUploaded,
                          setUploadingAvatar,
                        );
                      }
                      event.target.value = "";
                    }}
                  />
                  <button
                    type="button"
                    disabled={uploadingAvatar}
                    onClick={() => avatarInputRef.current?.click()}
                    className="absolute right-1 bottom-1 z-10 rounded-full bg-surface p-2 text-muted shadow-sm hover:bg-surface-muted hover:text-foreground"
                    aria-label={t("changePhoto")}
                  >
                    <Camera className="h-4 w-4" aria-hidden />
                  </button>
                </>
              ) : null}
            </div>

            {canEdit ? (
              <Button
                type="button"
                variant="secondary"
                onClick={onEditIntro}
                className="shrink-0 gap-1.5 self-start sm:self-auto"
              >
                <Pencil className="h-4 w-4" aria-hidden />
                {t("editIntro")}
              </Button>
            ) : (
              connectActions
            )}
          </div>

          <div className="mt-3 space-y-1">
            <div>
              <UserNameWithBadge
                name={profile.displayName}
                showAdminBadge={profile.isAdmin()}
                badgeSize="md"
                nameClassName="text-2xl font-semibold text-foreground"
              />
            </div>
            {profile.headline ? (
              <p className="text-base text-foreground">{profile.headline}</p>
            ) : null}
            {locationLabel ? (
              <p className="flex items-center gap-1 text-sm text-muted">
                <MapPin className="h-4 w-4 shrink-0" aria-hidden />
                {locationLabel}
              </p>
            ) : null}
            <p className="pt-1">
              <Link
                href={
                  canEdit
                    ? "/profile/connections"
                    : `/users/${profile.id}/connections`
                }
                className="text-sm font-semibold text-primary hover:underline"
              >
                {t("connectionsCount", { count: profile.connectionsCount })}
              </Link>
            </p>
            {followCountsQuery.data ? (
              <p className="flex gap-3 text-sm text-muted">
                <span>
                  {tNetwork("followersCount", {
                    count: followCountsQuery.data.followersCount,
                  })}
                </span>
                <span>
                  {tNetwork("followingCount", {
                    count: followCountsQuery.data.followingCount,
                  })}
                </span>
              </p>
            ) : null}
          </div>

          {(profile.website ||
            profile.github ||
            profile.linkedin ||
            profile.twitter) && (
            <ul className="mt-3 flex flex-wrap gap-3">
              {profile.website ? (
                <li>
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                  >
                    <Globe className="h-4 w-4" aria-hidden />
                    {t("website")}
                  </a>
                </li>
              ) : null}
              {profile.github ? (
                <li>
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" aria-hidden />
                    GitHub
                  </a>
                </li>
              ) : null}
              {profile.linkedin ? (
                <li>
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" aria-hidden />
                    LinkedIn
                  </a>
                </li>
              ) : null}
              {profile.twitter ? (
                <li>
                  <a
                    href={profile.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                  >
                    <span className="text-sm font-bold" aria-hidden>
                      𝕏
                    </span>
                    {t("twitter")}
                  </a>
                </li>
              ) : null}
            </ul>
          )}
        </div>
      </div>

      {lightbox ? (
        <ImageLightbox
          images={lightbox.images}
          initialIndex={lightbox.index}
          onClose={() => setLightbox(null)}
        />
      ) : null}
    </FeedCard>
  );
}
