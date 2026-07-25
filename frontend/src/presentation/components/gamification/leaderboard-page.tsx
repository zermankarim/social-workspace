"use client";

import { useState } from "react";
import { Loader2, Trophy } from "lucide-react";
import { useTranslations } from "next-intl";
import type {
  LeaderboardPeriod,
  LeaderboardScope,
} from "@/core/domain/entities/leaderboard.entity";
import { FeedCard } from "@/presentation/components/feed/feed-card";
import { useLeaderboard } from "@/presentation/hooks/use-gamification";

const SCOPES: LeaderboardScope[] = ["network", "global"];
const PERIODS: LeaderboardPeriod[] = ["week", "month", "all"];

function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  labelFor,
}: {
  options: T[];
  value: T;
  onChange: (value: T) => void;
  labelFor: (option: T) => string;
}) {
  return (
    <div className="inline-flex rounded-lg border border-border bg-surface-muted p-0.5">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
            option === value
              ? "bg-surface text-foreground shadow-sm"
              : "text-muted hover:text-foreground"
          }`}
        >
          {labelFor(option)}
        </button>
      ))}
    </div>
  );
}

const RANK_MEDAL: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

export function LeaderboardPage() {
  const t = useTranslations("achievements");
  const [scope, setScope] = useState<LeaderboardScope>("network");
  const [period, setPeriod] = useState<LeaderboardPeriod>("week");
  const { data, isLoading } = useLeaderboard(scope, period);

  return (
    <div className="mx-auto max-w-2xl space-y-3 px-4 py-6">
      <FeedCard className="px-4 py-4">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" aria-hidden />
          <h1 className="text-lg font-semibold text-foreground">
            {t("leaderboardTitle")}
          </h1>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <SegmentedControl
            options={SCOPES}
            value={scope}
            onChange={setScope}
            labelFor={(option) => t(`leaderboardScope.${option}`)}
          />
          <SegmentedControl
            options={PERIODS}
            value={period}
            onChange={setPeriod}
            labelFor={(option) => t(`leaderboardPeriod.${option}`)}
          />
        </div>
      </FeedCard>

      <FeedCard className="px-2 py-2">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2
              className="h-5 w-5 animate-spin text-primary"
              aria-hidden
            />
          </div>
        ) : !data || data.entries.length === 0 ? (
          <p className="px-2 py-6 text-center text-sm text-muted">
            {t("leaderboardEmpty")}
          </p>
        ) : (
          <ul>
            {data.entries.map((entry) => (
              <li
                key={entry.userId}
                className={`flex items-center gap-3 rounded-lg px-2 py-2 ${
                  entry.isCurrentUser ? "bg-primary-soft" : ""
                }`}
              >
                <span className="w-6 shrink-0 text-center text-sm font-semibold text-muted">
                  {RANK_MEDAL[entry.rank] ?? entry.rank}
                </span>
                {entry.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={entry.avatarUrl}
                    alt=""
                    className="h-9 w-9 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
                    {entry.initials}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {entry.displayName}
                  </p>
                  {entry.headline ? (
                    <p className="truncate text-xs text-muted">
                      {entry.headline}
                    </p>
                  ) : null}
                </div>
                <span className="shrink-0 text-sm font-semibold text-primary">
                  {t("pointsValue", { points: entry.points })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </FeedCard>
    </div>
  );
}
