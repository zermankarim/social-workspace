"use client";

import { Globe2 } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import type { Post } from "@/core/domain/entities/post.entity";
import { PostAttachmentsGallery } from "@/presentation/components/feed/post-attachments-gallery";
import { ExpandableText } from "@/presentation/components/ui/expandable-text";
import { MentionText } from "@/presentation/components/ui/mention-text";
import { UserNameWithBadge } from "@/presentation/components/ui/user-name-with-badge";
import { formatRelativeTime } from "@/presentation/lib/format-relative-time";
import { formatMentionsForPreview } from "@/presentation/lib/mentions";

type PostRepostEmbedProps = {
  post: Post;
};

/** Read-only preview of the original post shown inside a repost.
 *  Intentionally avoids wrapping the whole card in a Link so hashtag/mention
 *  links inside the body never nest inside another <a>. Timestamp links to
 *  the original post detail instead.
 */
export function PostRepostEmbed({ post }: PostRepostEmbedProps) {
  const t = useTranslations("feed");

  return (
    <div className="mt-3 overflow-hidden rounded-lg border border-border transition-colors hover:bg-surface-muted/60">
      <div className="flex items-start gap-2 px-3 pt-3">
        <Link
          href={`/users/${post.author.id}`}
          className="shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        >
          {post.author.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.author.avatarUrl}
              alt=""
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
              {post.author.initials}
            </div>
          )}
        </Link>
        <div className="min-w-0">
          <Link
            href={`/users/${post.author.id}`}
            className="inline-flex max-w-full outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            <UserNameWithBadge
              name={post.author.displayName}
              showAdminBadge={post.author.isAdmin()}
              nameClassName="text-sm font-semibold text-foreground hover:underline"
            />
          </Link>
          <p className="truncate text-xs text-muted">
            {post.author.headline?.trim() || t("member")}
          </p>
          <Link
            href={`/feed/posts/${post.id}`}
            className="flex items-center gap-1 text-xs text-muted hover:underline"
          >
            {formatRelativeTime(post.createdAt)}
            <Globe2 className="h-3 w-3" aria-hidden />
          </Link>
        </div>
      </div>

      {post.textContent ? (
        <div className="px-3 pt-2 text-sm text-foreground">
          <ExpandableText
            text={formatMentionsForPreview(post.textContent)}
            collapseAfter={180}
            collapsedClassName="line-clamp-3"
          >
            <MentionText text={post.textContent} />
          </ExpandableText>
        </div>
      ) : null}

      {post.attachments.length > 0 ? (
        <PostAttachmentsGallery
          className="mt-2"
          attachments={post.attachments.map((attachment) => ({
            id: attachment.id,
            url: attachment.url,
            fileName: attachment.fileName,
          }))}
        />
      ) : (
        <div className="pb-3" />
      )}
    </div>
  );
}
