"use client";

import { useState } from "react";
import { CheckCircle2, Circle, X } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { FeedCard } from "@/presentation/components/feed/feed-card";
import { useMyProfile } from "@/presentation/hooks/use-profile";

const DISMISS_KEY = "onboarding.dismissed";

function readDismissed(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(DISMISS_KEY) === "true";
}

/**
 * Lightweight "complete your profile" nudge for new users — reuses the existing
 * profile edit flow (links to /profile) rather than duplicating form UI here.
 */
export function OnboardingChecklist() {
  const t = useTranslations("onboarding");
  const profileQuery = useMyProfile(true);
  const [dismissed, setDismissed] = useState(readDismissed);

  const profile = profileQuery.data;
  if (!profile || dismissed) return null;

  const steps = [
    { key: "avatar" as const, done: Boolean(profile.avatarUrl) },
    { key: "headline" as const, done: Boolean(profile.headline?.trim()) },
    { key: "skills" as const, done: profile.skills.length >= 3 },
  ];

  if (steps.every((step) => step.done)) return null;

  const completedCount = steps.filter((step) => step.done).length;

  function handleDismiss() {
    localStorage.setItem(DISMISS_KEY, "true");
    setDismissed(true);
  }

  return (
    <FeedCard className="px-4 py-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            {t("title")}
          </h2>
          <p className="mt-0.5 text-xs text-muted">
            {t("progress", { done: completedCount, total: steps.length })}
          </p>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label={t("dismiss")}
          className="rounded-full p-1 text-muted hover:bg-surface-muted hover:text-foreground"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>

      <ul className="mt-3 space-y-1">
        {steps.map((step) => (
          <li key={step.key}>
            <Link
              href="/profile"
              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-surface-muted"
            >
              {step.done ? (
                <CheckCircle2
                  className="h-4 w-4 shrink-0 text-primary"
                  aria-hidden
                />
              ) : (
                <Circle className="h-4 w-4 shrink-0 text-muted" aria-hidden />
              )}
              <span
                className={
                  step.done ? "text-muted line-through" : "text-foreground"
                }
              >
                {t(`steps.${step.key}`)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </FeedCard>
  );
}
