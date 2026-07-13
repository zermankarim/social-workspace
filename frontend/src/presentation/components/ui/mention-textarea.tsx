"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  type TextareaHTMLAttributes,
} from "react";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import type { UserSearchResult } from "@/core/domain/entities/paginated-user-search.entity";
import { useUserSearch } from "@/presentation/hooks/use-user-search";
import { restoreTextareaCaret } from "@/presentation/lib/insert-text-at-cursor";
import {
  getActiveMentionQuery,
  insertMentionToken,
} from "@/presentation/lib/mentions";

type MentionTextareaProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "value" | "onChange"
> & {
  value: string;
  onChange: (value: string) => void;
};

export const MentionTextarea = forwardRef<
  HTMLTextAreaElement,
  MentionTextareaProps
>(function MentionTextarea(
  {
    value,
    onChange,
    onKeyDown,
    onSelect,
    onClick,
    onBlur,
    className = "",
    ...props
  },
  ref,
) {
  const t = useTranslations("mentions");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useImperativeHandle(ref, () => textareaRef.current!);

  const [caret, setCaret] = useState(0);
  const [highlight, setHighlight] = useState(0);
  const [suppressedStart, setSuppressedStart] = useState<number | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const active = getActiveMentionQuery(value, caret);
  const searchQuery = active?.query ?? "";
  const { data, isFetching } = useUserSearch(searchQuery, Boolean(active));
  const suggestions = data?.data ?? [];
  const showMenu = Boolean(active) && active!.start !== suppressedStart;

  useEffect(() => {
    setHighlight(0);
  }, [searchQuery]);

  useEffect(() => {
    if (!active) {
      setSuppressedStart(null);
      return;
    }
    if (suppressedStart !== null && active.start !== suppressedStart) {
      setSuppressedStart(null);
    }
  }, [active, suppressedStart]);

  useLayoutEffect(() => {
    const item = listRef.current?.querySelector<HTMLElement>(
      `[data-mention-index="${highlight}"]`,
    );
    item?.scrollIntoView({ block: "nearest" });
  }, [highlight]);

  function syncCaretFromElement() {
    const el = textareaRef.current;
    if (!el) return;
    setCaret(el.selectionStart ?? value.length);
  }

  function applyMention(user: UserSearchResult) {
    if (!active) return;
    const { nextValue, nextCaret } = insertMentionToken(
      value,
      caret,
      active.start,
      user.displayName,
      user.id,
    );
    onChange(nextValue);
    setSuppressedStart(null);
    requestAnimationFrame(() => {
      restoreTextareaCaret(textareaRef.current, nextCaret);
      setCaret(nextCaret);
    });
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (showMenu && suggestions.length > 0) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setHighlight((index) => (index + 1) % suggestions.length);
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setHighlight(
          (index) => (index - 1 + suggestions.length) % suggestions.length,
        );
        return;
      }
      if (event.key === "Enter" || event.key === "Tab") {
        event.preventDefault();
        const selected = suggestions[highlight];
        if (selected) applyMention(selected);
        return;
      }
    }

    if (showMenu && event.key === "Escape") {
      event.preventDefault();
      if (active) setSuppressedStart(active.start);
      return;
    }

    onKeyDown?.(event);
  }

  return (
    <div className="relative flex min-h-0 w-full flex-1 flex-col">
      <textarea
        {...props}
        ref={textareaRef}
        value={value}
        className={className}
        onChange={(event) => {
          onChange(event.target.value);
          setCaret(event.target.selectionStart ?? event.target.value.length);
        }}
        onKeyUp={syncCaretFromElement}
        onClick={(event) => {
          syncCaretFromElement();
          onClick?.(event);
        }}
        onSelect={(event) => {
          syncCaretFromElement();
          onSelect?.(event);
        }}
        onKeyDown={handleKeyDown}
        onBlur={(event) => {
          window.setTimeout(() => {
            setSuppressedStart(active?.start ?? null);
          }, 150);
          onBlur?.(event);
        }}
      />

      {showMenu ? (
        <div className="absolute bottom-full left-0 z-30 mb-1 w-full max-w-sm overflow-hidden rounded-md border border-border bg-surface shadow-card">
          {isFetching && suggestions.length === 0 ? (
            <div className="flex justify-center px-3 py-3">
              <Loader2
                className="h-4 w-4 animate-spin text-primary"
                aria-hidden
              />
            </div>
          ) : suggestions.length === 0 ? (
            <p className="px-3 py-2 text-xs text-muted">
              {searchQuery.trim() ? t("noResults") : t("typeToSearch")}
            </p>
          ) : (
            <ul
              ref={listRef}
              className="max-h-48 overflow-y-auto py-1"
              role="listbox"
            >
              {suggestions.map((user, index) => {
                const isActive = index === highlight;
                return (
                  <li key={user.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={isActive}
                      data-mention-index={index}
                      className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm ${
                        isActive
                          ? "bg-primary-soft text-foreground"
                          : "text-foreground hover:bg-surface-muted"
                      }`}
                      onMouseDown={(event) => {
                        event.preventDefault();
                        applyMention(user);
                      }}
                      onMouseEnter={() => setHighlight(index)}
                    >
                      {user.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={user.avatarUrl}
                          alt=""
                          className="h-8 w-8 shrink-0 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-[10px] font-semibold text-primary">
                          {user.initials}
                        </div>
                      )}
                      <span className="min-w-0">
                        <span className="block truncate font-semibold">
                          {user.displayName}
                        </span>
                        {user.headline ? (
                          <span className="block truncate text-xs text-muted">
                            {user.headline}
                          </span>
                        ) : null}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
});
