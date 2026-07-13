"use client";

import { useEffect, useRef, useState } from "react";
import {
  Image as ImageIcon,
  Loader2,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ApiError } from "@/core/application/errors/api.error";
import type { PostAttachment } from "@/core/domain/entities/post-attachment.entity";
import type { PostComment } from "@/core/domain/entities/post-comment.entity";
import type { User } from "@/core/domain/entities/user.entity";
import { appContainer } from "@/modules/app.container";
import { Button } from "@/presentation/components/ui/button";
import { EmojiPickerButton } from "@/presentation/components/ui/emoji-picker-button";
import { UserNameWithBadge } from "@/presentation/components/ui/user-name-with-badge";
import { MentionText } from "@/presentation/components/ui/mention-text";
import { MentionTextarea } from "@/presentation/components/ui/mention-textarea";
import {
  ImageLightbox,
  type LightboxImage,
} from "@/presentation/components/ui/image-lightbox";
import {
  useCreateComment,
  useDeleteComment,
  usePostComments,
  useUpdateComment,
  type CommentAttachmentInput,
} from "@/presentation/hooks/use-comments";
import { useEmojiInsert } from "@/presentation/hooks/use-emoji-insert";
import { getPastedImageFiles } from "@/presentation/lib/clipboard-images";
import { formatRelativeTime } from "@/presentation/lib/format-relative-time";
import {
  COMMENT_ATTACHMENTS_MAX_COUNT,
  COMMENT_TEXT_MAX_LENGTH,
  hasCommentContent,
} from "@/presentation/validations/comment.validation";

type PendingAttachment = CommentAttachmentInput & {
  previewUrl: string;
  localPreview?: boolean;
};

type PostCommentsPanelProps = {
  postId: string;
  currentUser: User;
  previewComments: PostComment[];
  commentsCount: number;
  showComposer?: boolean;
  onCommentsCountDelta: (delta: number) => void;
  onRequestComposer?: () => void;
};

function AuthorAvatar({
  avatarUrl,
  initials,
  sizeClass = "h-8 w-8",
}: {
  avatarUrl: string | null;
  initials: string;
  sizeClass?: string;
}) {
  if (avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt=""
        className={`${sizeClass} shrink-0 rounded-full object-cover`}
      />
    );
  }

  return (
    <div
      className={`flex ${sizeClass} shrink-0 items-center justify-center rounded-full bg-primary-soft text-[10px] font-semibold text-primary`}
    >
      {initials}
    </div>
  );
}

function CommentAttachmentThumbs({
  attachments,
  onRemove,
  disabled,
}: {
  attachments: { id: string; previewUrl: string; fileName: string }[];
  onRemove?: (id: string) => void;
  disabled?: boolean;
}) {
  if (attachments.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {attachments.map((attachment) => (
        <div
          key={attachment.id}
          className="relative h-16 w-16 overflow-hidden rounded-md bg-surface-muted"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={attachment.previewUrl}
            alt={attachment.fileName}
            className="h-full w-full object-cover"
          />
          {onRemove ? (
            <button
              type="button"
              disabled={disabled}
              aria-label="Remove"
              className="absolute top-0.5 right-0.5 rounded-full bg-black/65 p-0.5 text-white hover:bg-black/80 disabled:opacity-50"
              onClick={() => onRemove(attachment.id)}
            >
              <X className="h-3 w-3" aria-hidden />
            </button>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function CommentAttachmentsView({
  attachments,
}: {
  attachments: PostAttachment[];
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (attachments.length === 0) return null;

  const images: LightboxImage[] = attachments.map((attachment) => ({
    src: attachment.url,
    alt: attachment.fileName,
  }));

  return (
    <>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {attachments.map((attachment, index) => (
          <button
            key={attachment.id}
            type="button"
            className="h-20 w-20 overflow-hidden rounded-md bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            onClick={() => setLightboxIndex(index)}
            aria-label={attachment.fileName}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={attachment.url}
              alt={attachment.fileName}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>
      {lightboxIndex !== null ? (
        <ImageLightbox
          key={lightboxIndex}
          images={images}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      ) : null}
    </>
  );
}

async function uploadFiles(
  files: File[],
  currentCount: number,
): Promise<PendingAttachment[]> {
  const remaining = COMMENT_ATTACHMENTS_MAX_COUNT - currentCount;
  if (remaining <= 0) return [];

  const selected = files.slice(0, remaining);
  const uploaded = await appContainer.uploadService.uploadMany(selected);

  return uploaded.map((result, index) => ({
    url: result.url,
    fileName: result.fileName,
    mimeType: result.mimeType,
    sizeBytes: result.sizeBytes,
    previewUrl: URL.createObjectURL(selected[index]!),
    localPreview: true,
  }));
}

function revokeLocalPreviews(attachments: PendingAttachment[]) {
  attachments.forEach((attachment) => {
    if (attachment.localPreview) URL.revokeObjectURL(attachment.previewUrl);
  });
}

function CommentItem({
  comment,
  currentUser,
  disabled,
  onEdit,
  onDelete,
}: {
  comment: PostComment;
  currentUser: User;
  disabled: boolean;
  onEdit: (
    comment: PostComment,
    input: { textContent?: string; attachments?: CommentAttachmentInput[] },
  ) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const t = useTranslations("feed.comments");
  const tCommon = useTranslations("common");
  const tFeed = useTranslations("feed");
  const isAuthor = comment.isAuthoredBy(currentUser.id);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(comment.textContent ?? "");
  const [attachments, setAttachments] = useState<PendingAttachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const insertEmoji = useEmojiInsert(
    textareaRef,
    text,
    setText,
    COMMENT_TEXT_MAX_LENGTH,
  );

  useEffect(() => {
    if (!menuOpen) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [menuOpen]);

  const startEditing = () => {
    setMenuOpen(false);
    setError(null);
    setText(comment.textContent ?? "");
    setAttachments(
      comment.attachments.map((attachment) => ({
        url: attachment.url,
        fileName: attachment.fileName,
        mimeType: attachment.mimeType,
        sizeBytes: attachment.sizeBytes,
        previewUrl: attachment.url,
      })),
    );
    setIsEditing(true);
  };

  const cancelEditing = () => {
    revokeLocalPreviews(attachments);
    setIsEditing(false);
    setError(null);
  };

  const removeAttachment = (url: string) => {
    setAttachments((current) => {
      const target = current.find((attachment) => attachment.url === url);
      if (target?.localPreview) URL.revokeObjectURL(target.previewUrl);
      return current.filter((attachment) => attachment.url !== url);
    });
  };

  const addImageFiles = async (files: File[]) => {
    if (files.length === 0 || disabled || isUploading) return;

    if (attachments.length >= COMMENT_ATTACHMENTS_MAX_COUNT) {
      setError(t("attachmentsLimit", { count: COMMENT_ATTACHMENTS_MAX_COUNT }));
      return;
    }

    setError(null);
    setIsUploading(true);
    try {
      const uploaded = await uploadFiles(files, attachments.length);
      setAttachments((current) => [...current, ...uploaded]);
    } catch (uploadError) {
      setError(
        uploadError instanceof ApiError
          ? uploadError.message
          : tFeed("uploadFailed"),
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleFilesSelected = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    await addImageFiles(files);
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const files = getPastedImageFiles(event.clipboardData);
    if (!files) return;
    event.preventDefault();
    void addImageFiles(files);
  };

  const handleSave = async () => {
    if (!hasCommentContent(text, attachments.length)) {
      setError(t("empty"));
      return;
    }

    setError(null);
    try {
      await onEdit(comment, {
        textContent: text.trim(),
        attachments: attachments.map((attachment) => ({
          url: attachment.url,
          fileName: attachment.fileName,
          mimeType: attachment.mimeType,
          sizeBytes: attachment.sizeBytes,
        })),
      });
      revokeLocalPreviews(attachments);
      setIsEditing(false);
    } catch (saveError) {
      setError(
        saveError instanceof ApiError ? saveError.message : t("updateFailed"),
      );
    }
  };

  const editBusy = disabled || isUploading;

  return (
    <div className="flex gap-2">
      <AuthorAvatar
        avatarUrl={comment.author.avatarUrl}
        initials={comment.author.initials}
      />
      <div className="min-w-0 flex-1">
        <div className="rounded-2xl bg-surface-muted px-3 py-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex min-w-0 items-center gap-1.5">
              <Link
                href={`/users/${comment.author.id}`}
                className="min-w-0 hover:underline"
              >
                <UserNameWithBadge
                  name={comment.author.displayName}
                  showAdminBadge={comment.author.isAdmin()}
                  nameClassName="text-xs font-semibold text-foreground"
                />
              </Link>
              <span className="shrink-0 text-xs font-normal text-muted">
                · {formatRelativeTime(comment.createdAt)}
              </span>
            </div>
            {isAuthor && !isEditing ? (
              <div className="relative shrink-0" ref={menuRef}>
                <button
                  type="button"
                  className="rounded-full p-0.5 text-muted hover:bg-surface"
                  aria-label={t("actions")}
                  disabled={disabled}
                  onClick={() => setMenuOpen((open) => !open)}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
                {menuOpen ? (
                  <div className="absolute right-0 z-10 mt-1 w-32 overflow-hidden rounded-md border border-border bg-surface shadow-card">
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-foreground hover:bg-surface-muted"
                      onClick={startEditing}
                    >
                      <Pencil className="h-3.5 w-3.5" aria-hidden />
                      {t("edit")}
                    </button>
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-danger hover:bg-surface-muted"
                      onClick={() => {
                        setMenuOpen(false);
                        void onDelete(comment.id);
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden />
                      {t("delete")}
                    </button>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          {isEditing ? (
            <div className="mt-2 space-y-2">
              <MentionTextarea
                ref={textareaRef}
                value={text}
                onChange={setText}
                onPaste={handlePaste}
                maxLength={COMMENT_TEXT_MAX_LENGTH}
                rows={2}
                disabled={editBusy}
                className="w-full resize-y rounded-md border border-border-strong bg-surface px-2 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <CommentAttachmentThumbs
                attachments={attachments.map((attachment) => ({
                  id: attachment.url,
                  previewUrl: attachment.previewUrl,
                  fileName: attachment.fileName,
                }))}
                disabled={editBusy}
                onRemove={removeAttachment}
              />
              {error ? <p className="text-xs text-danger">{error}</p> : null}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    multiple
                    className="sr-only"
                    onChange={handleFilesSelected}
                    disabled={
                      editBusy ||
                      attachments.length >= COMMENT_ATTACHMENTS_MAX_COUNT
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    className="gap-1 px-2 py-1 text-xs"
                    disabled={
                      editBusy ||
                      attachments.length >= COMMENT_ATTACHMENTS_MAX_COUNT
                    }
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {isUploading ? (
                      <Loader2
                        className="h-3.5 w-3.5 animate-spin"
                        aria-hidden
                      />
                    ) : (
                      <ImageIcon className="h-3.5 w-3.5" aria-hidden />
                    )}
                    {tCommon("media")}
                  </Button>
                  <EmojiPickerButton
                    disabled={editBusy}
                    onSelect={insertEmoji}
                    className="[&_button]:p-1.5 [&_svg]:h-3.5 [&_svg]:w-3.5"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    className="px-2 py-1 text-xs"
                    disabled={editBusy}
                    onClick={cancelEditing}
                  >
                    {tCommon("cancel")}
                  </Button>
                  <Button
                    type="button"
                    className="px-2 py-1 text-xs"
                    disabled={
                      editBusy || !hasCommentContent(text, attachments.length)
                    }
                    onClick={() => void handleSave()}
                  >
                    {tCommon("save")}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {comment.textContent ? (
                <p className="mt-0.5 whitespace-pre-wrap text-sm leading-snug text-foreground">
                  <MentionText text={comment.textContent} />
                </p>
              ) : null}
              <CommentAttachmentsView attachments={comment.attachments} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function PostCommentsPanel({
  postId,
  currentUser,
  previewComments,
  commentsCount,
  showComposer = true,
  onCommentsCountDelta,
  onRequestComposer,
}: PostCommentsPanelProps) {
  const t = useTranslations("feed.comments");
  const tCommon = useTranslations("common");
  const tFeed = useTranslations("feed");
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [draft, setDraft] = useState("");
  const [attachments, setAttachments] = useState<PendingAttachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadMore, setLoadMore] = useState(false);
  const insertEmoji = useEmojiInsert(
    composerRef,
    draft,
    setDraft,
    COMMENT_TEXT_MAX_LENGTH,
  );

  const commentsQuery = usePostComments(postId, loadMore);
  const createComment = useCreateComment(postId);
  const updateComment = useUpdateComment(postId);
  const deleteComment = useDeleteComment(postId);

  const isBusy =
    createComment.isPending ||
    updateComment.isPending ||
    deleteComment.isPending ||
    isUploading;

  const loadedComments =
    commentsQuery.data?.pages.flatMap((page) => page.data) ?? [];
  const comments =
    loadMore && loadedComments.length > 0 ? loadedComments : previewComments;

  useEffect(() => {
    if (!showComposer) return;
    composerRef.current?.focus();
  }, [showComposer]);

  useEffect(() => {
    return () => revokeLocalPreviews(attachments);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- revoke only on unmount
  }, []);

  const addImageFiles = async (files: File[]) => {
    if (files.length === 0 || isBusy) return;

    if (attachments.length >= COMMENT_ATTACHMENTS_MAX_COUNT) {
      setError(t("attachmentsLimit", { count: COMMENT_ATTACHMENTS_MAX_COUNT }));
      return;
    }

    setError(null);
    setIsUploading(true);
    try {
      const uploaded = await uploadFiles(files, attachments.length);
      setAttachments((current) => [...current, ...uploaded]);
    } catch (uploadError) {
      setError(
        uploadError instanceof ApiError
          ? uploadError.message
          : tFeed("uploadFailed"),
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleFilesSelected = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    await addImageFiles(files);
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const files = getPastedImageFiles(event.clipboardData);
    if (!files) return;
    event.preventDefault();
    void addImageFiles(files);
  };

  const removeAttachment = (url: string) => {
    setAttachments((current) => {
      const target = current.find((attachment) => attachment.url === url);
      if (target?.localPreview) URL.revokeObjectURL(target.previewUrl);
      return current.filter((attachment) => attachment.url !== url);
    });
  };

  const handleSubmit = async () => {
    if (!hasCommentContent(draft, attachments.length)) {
      setError(t("empty"));
      return;
    }

    setError(null);
    try {
      await createComment.mutateAsync({
        textContent: draft.trim() || undefined,
        attachments: attachments.map((attachment) => ({
          url: attachment.url,
          fileName: attachment.fileName,
          mimeType: attachment.mimeType,
          sizeBytes: attachment.sizeBytes,
        })),
      });
      revokeLocalPreviews(attachments);
      setDraft("");
      setAttachments([]);
      onCommentsCountDelta(1);
      setLoadMore(true);
    } catch (createError) {
      setError(
        createError instanceof ApiError
          ? createError.message
          : t("createFailed"),
      );
    }
  };

  const handleEdit = async (
    comment: PostComment,
    input: { textContent?: string; attachments?: CommentAttachmentInput[] },
  ) => {
    await updateComment.mutateAsync({ id: comment.id, ...input });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t("deleteConfirm"))) return;
    try {
      await deleteComment.mutateAsync(id);
      onCommentsCountDelta(-1);
    } catch (deleteError) {
      setError(
        deleteError instanceof ApiError
          ? deleteError.message
          : t("deleteFailed"),
      );
    }
  };

  const handleStartLoadMore = () => {
    setLoadMore(true);
    onRequestComposer?.();
  };

  const userInitials =
    `${currentUser.firstName[0] ?? ""}${currentUser.lastName[0] ?? ""}`
      .trim()
      .toUpperCase() || "?";

  const canSubmit = hasCommentContent(draft, attachments.length) && !isBusy;

  return (
    <div className="space-y-3 border-t border-border pt-3">
      {showComposer ? (
        <div className="flex gap-2">
          <AuthorAvatar
            avatarUrl={currentUser.avatarUrl}
            initials={userInitials}
          />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="rounded-2xl border border-border-strong bg-surface px-3 py-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
              <MentionTextarea
                ref={composerRef}
                value={draft}
                onChange={setDraft}
                onPaste={handlePaste}
                maxLength={COMMENT_TEXT_MAX_LENGTH}
                rows={1}
                placeholder={t("placeholder")}
                disabled={isBusy}
                className="w-full resize-none bg-transparent text-sm text-foreground placeholder:text-muted focus:outline-none"
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    if (canSubmit) void handleSubmit();
                  }
                }}
              />
              <CommentAttachmentThumbs
                attachments={attachments.map((attachment) => ({
                  id: attachment.url,
                  previewUrl: attachment.previewUrl,
                  fileName: attachment.fileName,
                }))}
                disabled={isBusy}
                onRemove={removeAttachment}
              />
              <div className="mt-1 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    multiple
                    className="sr-only"
                    onChange={handleFilesSelected}
                    disabled={
                      isBusy ||
                      attachments.length >= COMMENT_ATTACHMENTS_MAX_COUNT
                    }
                  />
                  <button
                    type="button"
                    disabled={
                      isBusy ||
                      attachments.length >= COMMENT_ATTACHMENTS_MAX_COUNT
                    }
                    className="inline-flex cursor-pointer items-center gap-1 rounded-md px-1.5 py-1 text-xs font-semibold text-muted hover:bg-surface-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {isUploading ? (
                      <Loader2
                        className="h-3.5 w-3.5 animate-spin"
                        aria-hidden
                      />
                    ) : (
                      <ImageIcon
                        className="h-3.5 w-3.5 text-accent"
                        aria-hidden
                      />
                    )}
                    {tCommon("media")}
                  </button>
                  <EmojiPickerButton
                    disabled={isBusy}
                    onSelect={insertEmoji}
                    className="[&_button]:p-1.5 [&_svg]:h-3.5 [&_svg]:w-3.5"
                  />
                </div>
                {canSubmit || createComment.isPending ? (
                  <Button
                    type="button"
                    className="px-3 py-1 text-xs"
                    disabled={!canSubmit}
                    onClick={() => void handleSubmit()}
                  >
                    {createComment.isPending ? (
                      <Loader2
                        className="h-3.5 w-3.5 animate-spin"
                        aria-hidden
                      />
                    ) : (
                      t("submit")
                    )}
                  </Button>
                ) : null}
              </div>
            </div>
            {error ? <p className="text-xs text-danger">{error}</p> : null}
          </div>
        </div>
      ) : null}

      {comments.length > 0 ? (
        <div className="space-y-3">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUser={currentUser}
              disabled={isBusy}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : null}

      {!loadMore && commentsCount > previewComments.length ? (
        <button
          type="button"
          className="text-xs font-semibold text-muted hover:text-primary hover:underline"
          onClick={handleStartLoadMore}
        >
          {t("loadMore")}
        </button>
      ) : null}

      {loadMore && commentsQuery.hasNextPage ? (
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-primary hover:underline"
          disabled={commentsQuery.isFetchingNextPage}
          onClick={() => void commentsQuery.fetchNextPage()}
        >
          {commentsQuery.isFetchingNextPage ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
          ) : null}
          {tCommon("loadMore")}
        </button>
      ) : null}

      {loadMore && commentsQuery.isLoading ? (
        <div className="flex justify-center py-2">
          <Loader2 className="h-5 w-5 animate-spin text-primary" aria-hidden />
        </div>
      ) : null}
    </div>
  );
}
