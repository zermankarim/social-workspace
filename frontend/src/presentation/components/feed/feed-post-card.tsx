"use client";

import { useEffect, useRef, useState } from "react";
import {
  Image as ImageIcon,
  Loader2,
  MessageCircle,
  MoreHorizontal,
  Globe2,
  Pencil,
  Repeat2,
  Send,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ApiError } from "@/core/application/errors/api.error";
import type { Post } from "@/core/domain/entities/post.entity";
import type { User } from "@/core/domain/entities/user.entity";
import { PostLikeType } from "@/core/domain/enums/post-like-type.enum";
import { appContainer } from "@/modules/app.container";
import { FeedCard } from "@/presentation/components/feed/feed-card";
import { PostAttachmentsEditor } from "@/presentation/components/feed/post-attachments-editor";
import { PostAttachmentsGallery } from "@/presentation/components/feed/post-attachments-gallery";
import { PostCommentsPanel } from "@/presentation/components/feed/post-comments-panel";
import { PostEngagementSummary } from "@/presentation/components/feed/post-engagement-summary";
import { PostReactionButton } from "@/presentation/components/feed/post-reaction-button";
import { Button } from "@/presentation/components/ui/button";
import { EmojiPickerButton } from "@/presentation/components/ui/emoji-picker-button";
import { UserNameWithBadge } from "@/presentation/components/ui/user-name-with-badge";
import { useEmojiInsert } from "@/presentation/hooks/use-emoji-insert";
import { useRemoveLike, useUpsertLike } from "@/presentation/hooks/use-likes";
import {
  useDeletePost,
  useUpdatePost,
  type PostAttachmentInput,
} from "@/presentation/hooks/use-posts";
import { moveArrayItem } from "@/presentation/lib/array-move";
import { formatEngagementCount } from "@/presentation/lib/format-engagement-count";
import { formatRelativeTime } from "@/presentation/lib/format-relative-time";
import {
  POST_ATTACHMENTS_MAX_COUNT,
  POST_TEXT_MAX_LENGTH,
  hasPostContent,
} from "@/presentation/validations/post.validation";

type FeedPostCardProps = {
  post: Post;
  currentUser: User;
};

type EditableAttachment = PostAttachmentInput & {
  previewUrl: string;
  localPreview?: boolean;
};

export function FeedPostCard({ post, currentUser }: FeedPostCardProps) {
  const t = useTranslations("feed");
  const tCommon = useTranslations("common");
  const updatePost = useUpdatePost();
  const deletePost = useDeletePost();
  const upsertLike = useUpsertLike(post.id);
  const removeLike = useRemoveLike(post.id);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);

  const isAuthor = post.isAuthoredBy(currentUser.id);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [text, setText] = useState(post.textContent ?? "");
  const [attachments, setAttachments] = useState<EditableAttachment[]>(() =>
    post.attachments.map((attachment) => ({
      url: attachment.url,
      fileName: attachment.fileName,
      mimeType: attachment.mimeType,
      sizeBytes: attachment.sizeBytes,
      previewUrl: attachment.url,
    })),
  );
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const insertEmoji = useEmojiInsert(
    editTextareaRef,
    text,
    setText,
    POST_TEXT_MAX_LENGTH,
  );

  const [reactionOverride, setReactionOverride] = useState<
    PostLikeType | null | undefined
  >(undefined);
  const [likesBaseline, setLikesBaseline] = useState(post.likesCount);
  const [likesDelta, setLikesDelta] = useState(0);
  const [commentsBaseline, setCommentsBaseline] = useState(post.commentsCount);
  const [commentsDelta, setCommentsDelta] = useState(0);

  const previewReaction =
    post.findLikeByAuthor(currentUser.id)?.likeType ?? null;

  if (post.likesCount !== likesBaseline) {
    setLikesBaseline(post.likesCount);
    setLikesDelta(0);
  }

  if (post.commentsCount !== commentsBaseline) {
    setCommentsBaseline(post.commentsCount);
    setCommentsDelta(0);
  }

  if (reactionOverride !== undefined && reactionOverride === previewReaction) {
    setReactionOverride(undefined);
  }

  const myReaction =
    reactionOverride !== undefined ? reactionOverride : previewReaction;
  const likesCount = post.likesCount + likesDelta;
  const commentsCount = post.commentsCount + commentsDelta;

  const isBusy =
    updatePost.isPending ||
    deletePost.isPending ||
    isUploading ||
    upsertLike.isPending ||
    removeLike.isPending;

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

  const applyReaction = async (next: PostLikeType | null) => {
    const previous = myReaction;
    setReactionOverride(next);

    let delta = 0;
    if (previous === null && next !== null) delta = 1;
    else if (previous !== null && next === null) delta = -1;
    if (delta !== 0) setLikesDelta((current) => current + delta);

    try {
      if (next === null) {
        await removeLike.mutateAsync();
      } else {
        await upsertLike.mutateAsync(next);
      }
    } catch (reactionError) {
      setReactionOverride(previous);
      if (delta !== 0) setLikesDelta((current) => current - delta);
      setError(
        reactionError instanceof ApiError
          ? reactionError.message
          : t("reactions.failed"),
      );
    }
  };

  const handleToggleDefaultReaction = () => {
    void applyReaction(myReaction ? null : PostLikeType.LIKE);
  };

  const handleSelectReaction = (type: PostLikeType) => {
    void applyReaction(myReaction === type ? null : type);
  };

  const startEditing = () => {
    setMenuOpen(false);
    setError(null);
    setText(post.textContent ?? "");
    setAttachments(
      post.attachments.map((attachment) => ({
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
    attachments.forEach((attachment) => {
      if (attachment.localPreview) URL.revokeObjectURL(attachment.previewUrl);
    });
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

  const reorderAttachments = (fromIndex: number, toIndex: number) => {
    setAttachments((current) => moveArrayItem(current, fromIndex, toIndex));
  };

  const handleFilesSelected = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length === 0) return;

    const remainingSlots = POST_ATTACHMENTS_MAX_COUNT - attachments.length;
    if (remainingSlots <= 0) {
      setError(t("attachmentsLimit", { count: POST_ATTACHMENTS_MAX_COUNT }));
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
          localPreview: true,
        })),
      ]);
    } catch (uploadError) {
      setError(
        uploadError instanceof ApiError
          ? uploadError.message
          : t("uploadFailed"),
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!hasPostContent(text, attachments.length)) {
      setError(t("postNeedsContent"));
      return;
    }

    setError(null);
    try {
      await updatePost.mutateAsync({
        id: post.id,
        textContent: text.trim(),
        attachments: attachments.map((attachment) => ({
          url: attachment.url,
          fileName: attachment.fileName,
          mimeType: attachment.mimeType,
          sizeBytes: attachment.sizeBytes,
        })),
      });
      attachments.forEach((attachment) => {
        if (attachment.localPreview) URL.revokeObjectURL(attachment.previewUrl);
      });
      setIsEditing(false);
    } catch (saveError) {
      setError(
        saveError instanceof ApiError ? saveError.message : t("updateFailed"),
      );
    }
  };

  const handleDelete = async () => {
    setMenuOpen(false);
    if (!window.confirm(t("deleteConfirm"))) return;

    try {
      await deletePost.mutateAsync(post.id);
    } catch (deleteError) {
      setError(
        deleteError instanceof ApiError
          ? deleteError.message
          : t("deleteFailed"),
      );
    }
  };

  return (
    <FeedCard className="px-4 pt-3 pb-2">
      <div className="flex items-start gap-2">
        {post.author.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.author.avatarUrl}
            alt=""
            className="h-12 w-12 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-soft text-sm font-semibold text-primary">
            {post.author.initials}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <Link
                href={`/users/${post.author.id}`}
                className="hover:underline"
              >
                <UserNameWithBadge
                  name={post.author.displayName}
                  showAdminBadge={post.author.isAdmin()}
                  nameClassName="text-sm font-semibold text-foreground"
                />
              </Link>
              <p className="truncate text-xs text-muted">
                {post.author.bio ?? t("member")}
              </p>
              <p className="flex items-center gap-1 text-xs text-muted">
                {formatRelativeTime(post.createdAt)}
                <Globe2 className="h-3 w-3" aria-hidden />
              </p>
            </div>

            {isAuthor ? (
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  className="rounded-full p-1 text-muted hover:bg-surface-muted"
                  aria-label={t("postActions")}
                  aria-expanded={menuOpen}
                  disabled={isBusy}
                  onClick={() => setMenuOpen((open) => !open)}
                >
                  <MoreHorizontal className="h-5 w-5" />
                </button>
                {menuOpen ? (
                  <div className="absolute right-0 z-10 mt-1 w-36 overflow-hidden rounded-md border border-border bg-surface shadow-card">
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-foreground hover:bg-surface-muted"
                      onClick={startEditing}
                    >
                      <Pencil className="h-4 w-4" aria-hidden />
                      {t("edit")}
                    </button>
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-danger hover:bg-surface-muted"
                      onClick={() => void handleDelete()}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                      {t("delete")}
                    </button>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {isEditing ? (
        <div className="mt-3 space-y-3">
          <textarea
            ref={editTextareaRef}
            value={text}
            onChange={(event) => setText(event.target.value)}
            maxLength={POST_TEXT_MAX_LENGTH}
            rows={4}
            className="w-full resize-y rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            disabled={isBusy}
          />

          {attachments.length > 0 ? (
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
          ) : null}

          {error ? <p className="text-sm text-danger">{error}</p> : null}

          <div className="flex flex-wrap items-center justify-between gap-2">
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
                className="gap-1.5 text-xs font-semibold"
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  <ImageIcon className="h-4 w-4 text-accent" aria-hidden />
                )}
                {tCommon("media")}
              </Button>
              <EmojiPickerButton disabled={isBusy} onSelect={insertEmoji} />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                disabled={isBusy}
                onClick={cancelEditing}
              >
                {tCommon("cancel")}
              </Button>
              <Button
                type="button"
                disabled={isBusy || !hasPostContent(text, attachments.length)}
                onClick={() => void handleSave()}
                className="gap-1.5"
              >
                {updatePost.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : null}
                {tCommon("save")}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {post.textContent ? (
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
              {post.textContent}
            </p>
          ) : null}

          {post.attachments.length > 0 ? (
            <PostAttachmentsGallery
              className="mt-3 -mx-4"
              fullBleed
              attachments={post.attachments.map((attachment) => ({
                id: attachment.id,
                url: attachment.url,
                fileName: attachment.fileName,
              }))}
            />
          ) : null}

          {error ? <p className="mt-2 text-sm text-danger">{error}</p> : null}
        </>
      )}

      <div className={likesCount > 0 ? "pt-1" : "pt-2"}>
        <PostEngagementSummary
          likesCount={likesCount}
          previewLikes={post.previewLikes}
        />

        <div className="-mx-1 flex items-center py-0.5">
          <PostReactionButton
            myReaction={myReaction}
            count={likesCount}
            disabled={isBusy || isEditing}
            onToggleDefault={handleToggleDefaultReaction}
            onSelect={handleSelectReaction}
          />
          <button
            type="button"
            disabled={isEditing}
            aria-label={t("comments.action")}
            aria-pressed={commentsOpen}
            title={t("comments.action")}
            className={`inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md px-2 py-2 text-sm font-semibold tabular-nums transition-colors hover:bg-surface-muted disabled:pointer-events-none disabled:opacity-50 ${
              commentsOpen ? "text-primary" : "text-muted hover:text-foreground"
            }`}
            onClick={() => setCommentsOpen((open) => !open)}
          >
            <MessageCircle
              className="h-[18px] w-[18px]"
              aria-hidden
              fill={commentsOpen ? "currentColor" : "none"}
            />
            {commentsCount > 0 ? (
              <span>{formatEngagementCount(commentsCount)}</span>
            ) : null}
          </button>
          <button
            type="button"
            disabled
            aria-label={t("repost")}
            title={t("repost")}
            className="inline-flex flex-1 items-center justify-center rounded-md px-2 py-2 text-muted opacity-40"
          >
            <Repeat2 className="h-[18px] w-[18px]" aria-hidden />
          </button>
          <button
            type="button"
            disabled
            aria-label={t("send")}
            title={t("send")}
            className="inline-flex flex-1 items-center justify-center rounded-md px-2 py-2 text-muted opacity-40"
          >
            <Send className="h-[18px] w-[18px]" aria-hidden />
          </button>
        </div>
      </div>

      {post.previewComments.length > 0 || commentsOpen ? (
        <div className="pb-3">
          <PostCommentsPanel
            postId={post.id}
            currentUser={currentUser}
            previewComments={post.previewComments}
            commentsCount={commentsCount}
            showComposer={commentsOpen}
            onRequestComposer={() => setCommentsOpen(true)}
            onCommentsCountDelta={(delta) =>
              setCommentsDelta((current) => current + delta)
            }
          />
        </div>
      ) : null}
    </FeedCard>
  );
}
