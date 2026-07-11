"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Image as ImageIcon, Loader2, X } from "lucide-react";
import { ApiError } from "@/core/application/errors/api.error";
import type { User } from "@/core/domain/entities/user.entity";
import { appContainer } from "@/modules/app.container";
import { FeedCard } from "@/presentation/components/feed/feed-card";
import { PostAttachmentsEditor } from "@/presentation/components/feed/post-attachments-editor";
import { Button } from "@/presentation/components/ui/button";
import { useCreatePost } from "@/presentation/hooks/use-posts";
import { moveArrayItem } from "@/presentation/lib/array-move";
import {
  POST_ATTACHMENTS_MAX_COUNT,
  POST_TEXT_MAX_LENGTH,
  hasPostContent,
} from "@/presentation/validations/post.validation";

type PostComposerProps = {
  user: User;
};

type PendingAttachment = {
  url: string;
  fileName: string;
  mimeType: string | null;
  sizeBytes: number | null;
  previewUrl: string;
};

function getInitials(user: User): string {
  const fromName = `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`;
  if (fromName.trim()) return fromName.toUpperCase();
  return (user.email.split("@")[0] ?? "U").slice(0, 2).toUpperCase();
}

function UserAvatar({ user, size = "md" }: { user: User; size?: "sm" | "md" }) {
  const sizeClass = size === "sm" ? "h-10 w-10 text-xs" : "h-12 w-12 text-sm";

  if (user.avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={user.avatarUrl}
        alt=""
        className={`${sizeClass} shrink-0 rounded-full object-cover`}
      />
    );
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-primary-soft font-semibold text-primary ${sizeClass}`}
    >
      {getInitials(user)}
    </div>
  );
}

export function PostComposer({ user }: PostComposerProps) {
  const createPost = useCreatePost();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const titleId = useId();

  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");
  const [attachments, setAttachments] = useState<PendingAttachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const openWithMediaRef = useRef(false);

  const isBusy = createPost.isPending || isUploading;
  const canSubmit = hasPostContent(text, attachments.length) && !isBusy;
  const isDirty = text.trim().length > 0 || attachments.length > 0;
  const showCharCount = text.length >= POST_TEXT_MAX_LENGTH - 500;

  const clearAttachments = () => {
    setAttachments((current) => {
      current.forEach((attachment) =>
        URL.revokeObjectURL(attachment.previewUrl),
      );
      return [];
    });
  };

  const reset = () => {
    setText("");
    clearAttachments();
    setError(null);
    setIsOpen(false);
    openWithMediaRef.current = false;
  };

  const requestClose = () => {
    if (isBusy) return;
    if (isDirty && !window.confirm("Discard this post?")) return;
    reset();
  };

  const openComposer = (withMedia = false) => {
    openWithMediaRef.current = withMedia;
    setIsOpen(true);
  };

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      textareaRef.current?.focus();
      if (openWithMediaRef.current) {
        openWithMediaRef.current = false;
        fileInputRef.current?.click();
      }
    }, 0);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || isBusy) return;
      event.preventDefault();
      if (isDirty && !window.confirm("Discard this post?")) return;
      setText("");
      setAttachments((current) => {
        current.forEach((attachment) =>
          URL.revokeObjectURL(attachment.previewUrl),
        );
        return [];
      });
      setError(null);
      setIsOpen(false);
      openWithMediaRef.current = false;
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, isBusy, isDirty]);

  const handleFilesSelected = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length === 0) return;

    const remainingSlots = POST_ATTACHMENTS_MAX_COUNT - attachments.length;
    if (remainingSlots <= 0) {
      setError(`You can attach up to ${POST_ATTACHMENTS_MAX_COUNT} images.`);
      return;
    }

    const selected = files.slice(0, remainingSlots);
    setError(null);
    setIsUploading(true);

    try {
      const uploaded = await appContainer.uploadService.uploadMany(selected);
      setAttachments((current) => [
        ...current,
        ...uploaded.map((result, index) => ({
          url: result.url,
          fileName: result.fileName,
          mimeType: result.mimeType,
          sizeBytes: result.sizeBytes,
          previewUrl: URL.createObjectURL(selected[index]!),
        })),
      ]);
    } catch (uploadError) {
      setError(
        uploadError instanceof ApiError
          ? uploadError.message
          : "Failed to upload images",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const removeAttachment = (url: string) => {
    setAttachments((current) => {
      const target = current.find((attachment) => attachment.url === url);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return current.filter((attachment) => attachment.url !== url);
    });
  };

  const reorderAttachments = (fromIndex: number, toIndex: number) => {
    setAttachments((current) => moveArrayItem(current, fromIndex, toIndex));
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setError(null);
    try {
      await createPost.mutateAsync({
        textContent: text.trim() || undefined,
        attachments:
          attachments.length > 0
            ? attachments.map((attachment) => ({
                url: attachment.url,
                fileName: attachment.fileName,
                mimeType: attachment.mimeType,
                sizeBytes: attachment.sizeBytes,
              }))
            : undefined,
      });
      reset();
    } catch (submitError) {
      setError(
        submitError instanceof ApiError
          ? submitError.message
          : "Failed to create post",
      );
    }
  };

  return (
    <>
      <FeedCard className="px-4 py-3">
        <div className="flex items-center gap-2">
          <UserAvatar user={user} />
          <button
            type="button"
            onClick={() => openComposer(false)}
            className="h-12 flex-1 rounded-full border border-border-strong px-4 text-left text-sm text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
          >
            Start a post
          </button>
        </div>

        <div className="mt-1 flex items-center pt-1">
          <Button
            type="button"
            variant="ghost"
            onClick={() => openComposer(true)}
            className="gap-1.5 text-xs font-semibold"
          >
            <ImageIcon className="h-5 w-5 text-accent" aria-hidden />
            Media
          </Button>
        </div>
      </FeedCard>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 px-3 py-8 sm:items-center sm:py-10">
          <button
            type="button"
            aria-label="Close composer"
            className="absolute inset-0 cursor-default"
            onClick={requestClose}
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative z-10 flex w-full max-w-[552px] flex-col overflow-hidden rounded-xl bg-surface shadow-[0_8px_28px_rgba(0,0,0,0.28)]"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h2
                id={titleId}
                className="text-lg font-semibold text-foreground"
              >
                Create a post
              </h2>
              <button
                type="button"
                onClick={requestClose}
                disabled={isBusy}
                className="rounded-full p-2 text-muted transition-colors hover:bg-surface-muted hover:text-foreground disabled:opacity-50"
                aria-label="Close"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>

            <div className="flex items-center gap-3 px-4 pt-4">
              <UserAvatar user={user} size="sm" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">
                  {user.displayName}
                </p>
                <p className="truncate text-xs text-muted">
                  {user.bio?.trim() || "Post to anyone"}
                </p>
              </div>
            </div>

            <div className="flex min-h-[220px] flex-1 flex-col px-4 pt-3">
              <textarea
                ref={textareaRef}
                value={text}
                onChange={(event) => setText(event.target.value)}
                maxLength={POST_TEXT_MAX_LENGTH}
                placeholder="What do you want to talk about?"
                disabled={isBusy}
                className="min-h-[160px] w-full flex-1 resize-none border-0 bg-transparent text-base leading-relaxed text-foreground placeholder:text-muted focus:outline-none disabled:opacity-60"
              />

              {attachments.length > 0 ? (
                <div className="mt-3">
                  <PostAttachmentsEditor
                    attachments={attachments.map((attachment) => ({
                      id: attachment.url,
                      previewUrl: attachment.previewUrl,
                      fileName: attachment.fileName,
                    }))}
                    disabled={isBusy}
                    onReorder={reorderAttachments}
                    onRemove={removeAttachment}
                  />
                </div>
              ) : null}

              {error ? (
                <p className="mt-3 text-sm text-danger">{error}</p>
              ) : null}
            </div>

            <div className="mt-2 flex items-center justify-between gap-3 border-t border-border px-4 py-3">
              <div className="flex items-center gap-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  multiple
                  className="sr-only"
                  onChange={handleFilesSelected}
                  disabled={
                    isBusy || attachments.length >= POST_ATTACHMENTS_MAX_COUNT
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  disabled={
                    isBusy || attachments.length >= POST_ATTACHMENTS_MAX_COUNT
                  }
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-1.5 px-3 text-xs font-semibold"
                  aria-label="Add media"
                >
                  {isUploading ? (
                    <Loader2
                      className="h-5 w-5 animate-spin text-accent"
                      aria-hidden
                    />
                  ) : (
                    <ImageIcon className="h-5 w-5 text-accent" aria-hidden />
                  )}
                  Media
                </Button>
                {showCharCount ? (
                  <span className="ml-1 text-xs text-muted">
                    {text.length}/{POST_TEXT_MAX_LENGTH}
                  </span>
                ) : null}
              </div>

              <Button
                type="button"
                disabled={!canSubmit}
                onClick={() => void handleSubmit()}
                className="min-w-[88px] gap-1.5"
              >
                {createPost.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : null}
                Post
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
