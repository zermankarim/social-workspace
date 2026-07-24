"use client";

import { useEffect, useRef, useState } from "react";
import { Hash, Loader2, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useHashtagSearch } from "@/presentation/hooks/use-hashtags";
import { useUserSearch } from "@/presentation/hooks/use-user-search";

type HeaderSearchProps = {
  className?: string;
};

export function HeaderSearch({
  className = "relative hidden min-w-0 flex-1 md:block md:max-w-[280px]",
}: HeaderSearchProps) {
  const t = useTranslations("common");
  const tSearch = useTranslations("search");
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const trimmed = query.trim();
  const peopleQuery = useUserSearch(query, open);
  const hashtagsQuery = useHashtagSearch(query, open);

  const people = peopleQuery.data?.data ?? [];
  const hashtags = hashtagsQuery.data?.data ?? [];
  const isLoading = peopleQuery.isFetching || hashtagsQuery.isFetching;
  const hasResults = people.length > 0 || hashtags.length > 0;

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  const goToResults = () => {
    if (!trimmed) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const navigate = (href: string) => {
    setOpen(false);
    setQuery("");
    router.push(href);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          goToResults();
        }}
      >
        <label className="relative block">
          <span className="sr-only">{t("search")}</span>
          <Search
            className="pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            placeholder={t("search")}
            onChange={(event) => {
              setQuery(event.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            className="h-9 w-full rounded border-0 bg-surface-muted py-1.5 pr-3 pl-8 text-base text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </label>
      </form>

      {open && trimmed.length >= 1 ? (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-[70vh] overflow-y-auto rounded-md border border-border bg-surface py-1 shadow-card">
          {isLoading && !hasResults ? (
            <div className="flex justify-center py-4">
              <Loader2
                className="h-5 w-5 animate-spin text-primary"
                aria-hidden
              />
            </div>
          ) : null}

          {hashtags.length > 0 ? (
            <ul>
              {hashtags.map((hashtag) => (
                <li key={hashtag.id}>
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/feed/hashtags/${encodeURIComponent(hashtag.tag)}`,
                      )
                    }
                    className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-surface-muted"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-primary">
                      <Hash className="h-4 w-4" aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-foreground">
                        #{hashtag.tag}
                      </span>
                      <span className="block text-xs text-muted">
                        {tSearch("postsCount", { count: hashtag.postsCount })}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}

          {people.length > 0 ? (
            <ul>
              {people.map((person) => (
                <li key={person.id}>
                  <button
                    type="button"
                    onClick={() => navigate(`/users/${person.id}`)}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-surface-muted"
                  >
                    {person.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={person.avatarUrl}
                        alt=""
                        className="h-8 w-8 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
                        {person.initials}
                      </span>
                    )}
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-foreground">
                        {person.displayName}
                      </span>
                      {person.headline ? (
                        <span className="block truncate text-xs text-muted">
                          {person.headline}
                        </span>
                      ) : null}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}

          {!isLoading && !hasResults ? (
            <p className="px-3 py-4 text-center text-sm text-muted">
              {tSearch("noResults")}
            </p>
          ) : (
            <button
              type="button"
              onClick={goToResults}
              className="mt-1 flex w-full items-center gap-2 border-t border-border px-3 py-2 text-left text-sm font-semibold text-primary hover:bg-surface-muted"
            >
              <Search className="h-4 w-4" aria-hidden />
              {tSearch("seeAllResults", { query: trimmed })}
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
}
