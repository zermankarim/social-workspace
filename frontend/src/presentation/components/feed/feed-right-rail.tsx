"use client";

import { useState } from "react";
import { Check, Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ProfileRole } from "@/core/domain/enums/profile-role.enum";
import { FeedCard } from "@/presentation/components/feed/feed-card";
import { TrendingHashtagsCard } from "@/presentation/components/feed/trending-hashtags-card";
import { Button } from "@/presentation/components/ui/button";
import {
  useCreateConnection,
  useSuggestedConnections,
} from "@/presentation/hooks/use-connections";
import {
  useCreateNewsStory,
  useNewsStories,
} from "@/presentation/hooks/use-news";
import { formatEngagementCount } from "@/presentation/lib/format-engagement-count";
import { useAuthStore } from "@/presentation/stores/auth.store";

function NewsCard() {
  const t = useTranslations("news");
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === ProfileRole.ADMIN;
  const { data: stories = [], isLoading } = useNewsStories(8);
  const createStory = useCreateNewsStory();
  const [composerOpen, setComposerOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [body, setBody] = useState("");
  const [url, setUrl] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);

  const handleCreate = async () => {
    const trimmed = title.trim();
    const trimmedBody = body.trim();
    if (!trimmed || trimmedBody.length < 40) return;
    setCreateError(null);
    try {
      await createStory.mutateAsync({
        title: trimmed,
        summary: summary.trim() || undefined,
        body: trimmedBody,
        url: url.trim() || undefined,
      });
      setTitle("");
      setSummary("");
      setBody("");
      setUrl("");
      setComposerOpen(false);
    } catch {
      setCreateError(t("publishFailed"));
    }
  };

  return (
    <FeedCard className="px-3 py-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            {t("title")}
          </h2>
          <p className="mt-0.5 text-[11px] text-muted">{t("subtitle")}</p>
        </div>
        {isAdmin ? (
          <button
            type="button"
            onClick={() => setComposerOpen((open) => !open)}
            className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[11px] font-semibold text-primary hover:bg-primary-soft"
            aria-expanded={composerOpen}
          >
            <Plus className="h-3.5 w-3.5" aria-hidden />
            {t("add")}
          </button>
        ) : null}
      </div>

      {composerOpen && isAdmin ? (
        <div className="mt-3 space-y-2 rounded-md border border-border bg-surface-muted/40 p-2">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder={t("titlePlaceholder")}
            aria-label={t("titlePlaceholder")}
            maxLength={160}
            className="h-8 w-full rounded border border-border bg-surface px-2 text-xs text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder={t("bodyPlaceholder")}
            aria-label={t("bodyPlaceholder")}
            minLength={40}
            maxLength={20_000}
            rows={5}
            className="w-full resize-y rounded border border-border bg-surface px-2 py-1.5 text-xs text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            value={summary}
            onChange={(event) => setSummary(event.target.value)}
            placeholder={t("summaryPlaceholder")}
            aria-label={t("summaryPlaceholder")}
            maxLength={280}
            className="h-8 w-full rounded border border-border bg-surface px-2 text-xs text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder={t("urlPlaceholder")}
            aria-label={t("urlPlaceholder")}
            maxLength={500}
            className="h-8 w-full rounded border border-border bg-surface px-2 text-xs text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {createError ? (
            <p className="text-xs text-danger" role="alert">
              {createError}
            </p>
          ) : null}
          <div className="flex justify-end gap-1.5">
            <Button
              type="button"
              variant="ghost"
              className="h-7 px-2 text-xs"
              onClick={() => setComposerOpen(false)}
            >
              {t("cancel")}
            </Button>
            <Button
              type="button"
              className="h-7 px-2 text-xs"
              disabled={
                !title.trim() ||
                body.trim().length < 40 ||
                createStory.isPending
              }
              onClick={() => void handleCreate()}
            >
              {createStory.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
              ) : null}
              {t("publish")}
            </Button>
          </div>
        </div>
      ) : null}

      {isLoading ? (
        <div className="mt-4 flex justify-center py-2">
          <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden />
        </div>
      ) : stories.length > 0 ? (
        <ul className="mt-3 space-y-3">
          {stories.map((item) => (
            <li key={item.id}>
              <Link
                href={`/news/${item.id}`}
                className="block rounded-sm text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <p className="text-xs font-semibold text-foreground hover:text-primary">
                  {item.title}
                </p>
                {item.summary ? (
                  <p className="mt-0.5 line-clamp-2 text-[11px] text-muted">
                    {item.summary}
                  </p>
                ) : null}
                <p className="text-[11px] text-muted">
                  {t("readers", {
                    count: item.readersCount,
                    formatted: formatEngagementCount(item.readersCount),
                  })}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-[11px] text-muted">{t("empty")}</p>
      )}
    </FeedCard>
  );
}

function PeopleYouMayKnowCard() {
  const t = useTranslations("feed");
  const { data: suggestions, isLoading } = useSuggestedConnections(5);
  const createConnection = useCreateConnection();
  const [sentIds, setSentIds] = useState<Set<string>>(new Set());

  return (
    <FeedCard className="px-3 py-3">
      <h2 className="text-sm font-semibold text-foreground">
        {t("peopleYouMayKnow")}
      </h2>
      {isLoading ? (
        <div className="mt-3 flex justify-center py-2">
          <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden />
        </div>
      ) : !suggestions || suggestions.length === 0 ? (
        <p className="mt-3 text-[11px] text-muted">{t("noSuggestions")}</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {suggestions!.map((person) => {
            const sent = sentIds.has(person.userId);
            return (
              <li key={person.userId} className="flex items-start gap-2">
                <Link href={`/users/${person.userId}`} className="shrink-0">
                  {person.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={person.avatarUrl}
                      alt=""
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
                      {person.initials}
                    </div>
                  )}
                </Link>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/users/${person.userId}`}
                    className="truncate text-xs font-semibold text-foreground hover:underline"
                  >
                    {person.displayName}
                  </Link>
                  <p className="truncate text-[11px] text-muted">
                    {person.headline}
                  </p>
                  {person.mutualConnectionsCount > 0 ? (
                    <p className="truncate text-[10px] text-muted">
                      {t("mutualConnections", {
                        count: person.mutualConnectionsCount,
                      })}
                    </p>
                  ) : null}
                  <Button
                    variant="secondary"
                    disabled={sent || createConnection.isPending}
                    onClick={() => {
                      setSentIds((prev) => new Set(prev).add(person.userId));
                      createConnection.mutate(person.userId);
                    }}
                    className="mt-1.5 h-7 px-3 text-xs"
                  >
                    {sent ? (
                      <Check className="h-3.5 w-3.5" aria-hidden />
                    ) : (
                      <Plus className="h-3.5 w-3.5" aria-hidden />
                    )}
                    {sent ? t("requestSent") : t("connect")}
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </FeedCard>
  );
}

export function FeedRightRail() {
  return (
    <aside className="space-y-2">
      <TrendingHashtagsCard />
      <NewsCard />
      <PeopleYouMayKnowCard />
    </aside>
  );
}
