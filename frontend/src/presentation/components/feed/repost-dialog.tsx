"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Loader2, Repeat2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { ApiError } from "@/core/application/errors/api.error";
import type { Post } from "@/core/domain/entities/post.entity";
import type { User } from "@/core/domain/entities/user.entity";
import { PostRepostEmbed } from "@/presentation/components/feed/post-repost-embed";
import { Button } from "@/presentation/components/ui/button";
import { MentionTextarea } from "@/presentation/components/ui/mention-textarea";
import { UserNameWithBadge } from "@/presentation/components/ui/user-name-with-badge";
import { useRepostPost } from "@/presentation/hooks/use-posts";
import { POST_TEXT_MAX_LENGTH } from "@/presentation/validations/post.validation";

type RepostDialogProps = {
  targetPostId: string;
  original: Post;
  user: User;
  onClose: () => void;
  onReposted?: () => void;
};

export function RepostDialog({
  targetPostId,
  original,
  user,
  onClose,
  onReposted,
}: RepostDialogProps) {
  const t = useTranslations("feed");
  const tCommon = useTranslations("common");
  const repost = useRepostPost();
  const titleId = useId();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => textareaRef.current?.focus(), 0);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !repost.isPending) onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, repost.isPending]);

  const handleSubmit = async () => {
    setError(null);
    try {
      await repost.mutateAsync({ id: targetPostId, textContent: text.trim() });
      onReposted?.();
      onClose();
    } catch (submitError) {
      setError(
        submitError instanceof ApiError
          ? submitError.message
          : t("repostFailed"),
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 px-3 py-8 sm:items-center sm:py-10">
      <button
        type="button"
        aria-label={tCommon("close")}
        className="absolute inset-0 cursor-default"
        onClick={() => !repost.isPending && onClose()}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 flex w-full max-w-[552px] flex-col overflow-hidden rounded-xl bg-surface shadow-[0_8px_28px_rgba(0,0,0,0.28)]"
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 id={titleId} className="text-lg font-semibold text-foreground">
            {t("quoteRepost")}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={repost.isPending}
            className="rounded-full p-2 text-muted transition-colors hover:bg-surface-muted hover:text-foreground disabled:opacity-50"
            aria-label={tCommon("close")}
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <div className="flex items-center gap-3 px-4 pt-4">
          {user.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatarUrl}
              alt=""
              className="h-10 w-10 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
              {user.initials}
            </div>
          )}
          <UserNameWithBadge
            name={user.displayName}
            showAdminBadge={user.isAdmin()}
            nameClassName="text-sm font-semibold text-foreground"
          />
        </div>

        <div className="px-4 pt-3">
          <MentionTextarea
            ref={textareaRef}
            value={text}
            onChange={setText}
            maxLength={POST_TEXT_MAX_LENGTH}
            placeholder={t("quotePlaceholder")}
            disabled={repost.isPending}
            className="min-h-[96px] w-full resize-none border-0 bg-transparent text-base leading-relaxed text-foreground placeholder:text-muted focus:outline-none disabled:opacity-60"
          />

          <div className="pointer-events-none">
            <PostRepostEmbed post={original} />
          </div>

          {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}
        </div>

        <div className="mt-3 flex items-center justify-end border-t border-border px-4 py-3">
          <Button
            type="button"
            disabled={repost.isPending}
            onClick={() => void handleSubmit()}
            className="min-w-[110px] gap-1.5"
          >
            {repost.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <Repeat2 className="h-4 w-4" aria-hidden />
            )}
            {t("repost")}
          </Button>
        </div>
      </div>
    </div>
  );
}
