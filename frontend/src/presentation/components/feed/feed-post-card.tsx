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
  ThumbsUp,
  Trash2,
} from "lucide-react";
import { ApiError } from "@/core/application/errors/api.error";
import type { Post } from "@/core/domain/entities/post.entity";
import { appContainer } from "@/modules/app.container";
import { FeedCard } from "@/presentation/components/feed/feed-card";
import { PostAttachmentsEditor } from "@/presentation/components/feed/post-attachments-editor";
import { PostAttachmentsGallery } from "@/presentation/components/feed/post-attachments-gallery";
import { Button } from "@/presentation/components/ui/button";
import {
  useDeletePost,
  useUpdatePost,
  type PostAttachmentInput,
} from "@/presentation/hooks/use-posts";
import { moveArrayItem } from "@/presentation/lib/array-move";
import { formatRelativeTime } from "@/presentation/lib/format-relative-time";
import {
  POST_ATTACHMENTS_MAX_COUNT,
  POST_TEXT_MAX_LENGTH,
  hasPostContent,
} from "@/presentation/validations/post.validation";

type FeedPostCardProps = {
  post: Post;
  currentUserId: string;
};

type EditableAttachment = PostAttachmentInput & {
  previewUrl: string;
  localPreview?: boolean;
};

export function FeedPostCard({ post, currentUserId }: FeedPostCardProps) {
  const updatePost = useUpdatePost();
  const deletePost = useDeletePost();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const isAuthor = post.isAuthoredBy(currentUserId);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
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

  const isBusy = updatePost.isPending || deletePost.isPending || isUploading;

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
          localPreview: true,
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

  const handleSave = async () => {
    if (!hasPostContent(text, attachments.length)) {
      setError("Post must include text or at least one image.");
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
        saveError instanceof ApiError
          ? saveError.message
          : "Failed to update post",
      );
    }
  };

  const handleDelete = async () => {
    setMenuOpen(false);
    if (!window.confirm("Delete this post?")) return;

    try {
      await deletePost.mutateAsync(post.id);
    } catch (deleteError) {
      setError(
        deleteError instanceof ApiError
          ? deleteError.message
          : "Failed to delete post",
      );
    }
  };

  return (
    <FeedCard className="px-4 pt-3 pb-1">
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
              <p className="truncate text-sm font-semibold text-foreground">
                {post.author.displayName}
              </p>
              <p className="truncate text-xs text-muted">
                {post.author.bio ?? "Member"}
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
                  aria-label="Post actions"
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
                      Edit
                    </button>
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-danger hover:bg-surface-muted"
                      onClick={() => void handleDelete()}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                      Delete
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
            <div>
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
                Media
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                disabled={isBusy}
                onClick={cancelEditing}
              >
                Cancel
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
                Save
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
              className="mt-3"
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

      <div className="mt-3 flex items-center justify-between border-b border-border pb-2 text-xs text-muted">
        <span>{post.likesCount} reactions</span>
        <span>{post.commentsCount} comments</span>
      </div>

      <div className="grid grid-cols-4 gap-1 py-1">
        {(
          [
            { icon: ThumbsUp, label: "Like" },
            { icon: MessageCircle, label: "Comment" },
            { icon: Repeat2, label: "Repost" },
            { icon: Send, label: "Send" },
          ] as const
        ).map(({ icon: Icon, label }) => (
          <Button
            key={label}
            variant="ghost"
            disabled
            className="gap-1.5 rounded-md px-1 text-xs font-semibold"
          >
            <Icon className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">{label}</span>
          </Button>
        ))}
      </div>
    </FeedCard>
  );
}
