"use client";

import { useState } from "react";
import { Hash, Loader2, Search } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import type { ConnectionUser } from "@/core/domain/entities/connection-user.entity";
import type { Hashtag } from "@/core/domain/entities/hashtag.entity";
import { FeedCard } from "@/presentation/components/feed/feed-card";
import { FeedPostCard } from "@/presentation/components/feed/feed-post-card";
import { UserNameWithBadge } from "@/presentation/components/ui/user-name-with-badge";
import {
  useHashtagResults,
  usePeopleSearch,
  usePostSearch,
} from "@/presentation/hooks/use-search";
import { useAuthStore } from "@/presentation/stores/auth.store";

type SearchTab = "all" | "people" | "posts" | "hashtags";
const TABS: SearchTab[] = ["all", "people", "posts", "hashtags"];

function PersonRow({ person }: { person: ConnectionUser }) {
  return (
    <Link
      href={`/users/${person.id}`}
      className="flex items-center gap-3 px-4 py-3 hover:bg-surface-muted"
    >
      {person.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={person.avatarUrl}
          alt=""
          className="h-12 w-12 shrink-0 rounded-full object-cover"
        />
      ) : (
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-soft text-sm font-semibold text-primary">
          {person.initials}
        </span>
      )}
      <span className="min-w-0">
        <UserNameWithBadge
          name={person.displayName}
          nameClassName="text-sm font-semibold text-foreground"
        />
        {person.headline ? (
          <span className="block truncate text-xs text-muted">
            {person.headline}
          </span>
        ) : null}
      </span>
    </Link>
  );
}

function HashtagRow({ hashtag }: { hashtag: Hashtag }) {
  const t = useTranslations("search");
  return (
    <Link
      href={`/feed/hashtags/${encodeURIComponent(hashtag.tag)}`}
      className="flex items-center gap-3 px-4 py-3 hover:bg-surface-muted"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
        <Hash className="h-5 w-5" aria-hidden />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold text-foreground">
          #{hashtag.tag}
        </span>
        <span className="block text-xs text-muted">
          {t("postsCount", { count: hashtag.postsCount })}
        </span>
      </span>
    </Link>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <FeedCard className="overflow-hidden">
      <h2 className="border-b border-border px-4 py-2.5 text-sm font-semibold text-foreground">
        {title}
      </h2>
      {children}
    </FeedCard>
  );
}

export function SearchResultsPage({ query }: { query: string }) {
  const t = useTranslations("search");
  const user = useAuthStore((s) => s.user);
  const [tab, setTab] = useState<SearchTab>("all");

  const peopleQuery = usePeopleSearch(query);
  const postsQuery = usePostSearch(query);
  const hashtagsQuery = useHashtagResults(query);

  const people = peopleQuery.data?.data ?? [];
  const posts = postsQuery.data?.data ?? [];
  const hashtags = hashtagsQuery.data?.data ?? [];

  const isLoading =
    peopleQuery.isLoading || postsQuery.isLoading || hashtagsQuery.isLoading;
  const showPeople = tab === "all" || tab === "people";
  const showPosts = tab === "all" || tab === "posts";
  const showHashtags = tab === "all" || tab === "hashtags";
  const hasAny = people.length > 0 || posts.length > 0 || hashtags.length > 0;

  if (!user) return null;

  return (
    <div className="mx-auto w-full max-w-[680px] space-y-2">
      <FeedCard className="px-4 py-3">
        <p className="text-sm text-muted">
          {t("resultsFor")}{" "}
          <span className="font-semibold text-foreground">
            “{query.trim()}”
          </span>
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {TABS.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setTab(value)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                tab === value
                  ? "border-primary bg-primary-soft text-primary"
                  : "border-border-strong text-muted hover:bg-surface-muted hover:text-foreground"
              }`}
            >
              {t(`tabs.${value}`)}
            </button>
          ))}
        </div>
      </FeedCard>

      {!query.trim() ? (
        <FeedCard className="px-4 py-10 text-center text-sm text-muted">
          {t("emptyQuery")}
        </FeedCard>
      ) : isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden />
        </div>
      ) : !hasAny ? (
        <FeedCard className="px-4 py-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-primary">
            <Search className="h-7 w-7" aria-hidden />
          </div>
          <p className="mt-4 text-sm font-medium text-foreground">
            {t("noResultsTitle")}
          </p>
          <p className="mt-1 text-sm text-muted">{t("noResultsHint")}</p>
        </FeedCard>
      ) : (
        <>
          {showHashtags && hashtags.length > 0 ? (
            <SectionCard title={t("tabs.hashtags")}>
              <ul className="divide-y divide-border">
                {hashtags.map((hashtag) => (
                  <li key={hashtag.id}>
                    <HashtagRow hashtag={hashtag} />
                  </li>
                ))}
              </ul>
            </SectionCard>
          ) : null}

          {showPeople && people.length > 0 ? (
            <SectionCard title={t("tabs.people")}>
              <ul className="divide-y divide-border">
                {people.map((person) => (
                  <li key={person.id}>
                    <PersonRow person={person} />
                  </li>
                ))}
              </ul>
            </SectionCard>
          ) : null}

          {showPosts && posts.length > 0 ? (
            <div className="space-y-2">
              {tab === "all" ? (
                <h2 className="px-1 pt-2 text-sm font-semibold text-foreground">
                  {t("tabs.posts")}
                </h2>
              ) : null}
              {posts.map((post) => (
                <FeedPostCard key={post.id} post={post} currentUser={user} />
              ))}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
