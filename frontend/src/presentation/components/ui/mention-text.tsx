"use client";

import { Fragment } from "react";
import Link from "next/link";
import { parseMentionSegments } from "@/presentation/lib/mentions";
import { parseHashtagSegments } from "@/presentation/lib/hashtags";

type MentionTextProps = {
  text: string;
  className?: string;
  mentionClassName?: string;
  hashtagClassName?: string;
};

export function MentionText({
  text,
  className = "",
  mentionClassName = "font-semibold text-primary hover:underline",
  hashtagClassName = "font-semibold text-primary hover:underline",
}: MentionTextProps) {
  const segments = parseMentionSegments(text);

  return (
    <span className={className}>
      {segments.map((segment, index) => {
        if (segment.type === "mention") {
          return (
            <Link
              key={`m-${segment.userId}-${index}`}
              href={`/users/${segment.userId}`}
              className={mentionClassName}
              onClick={(event) => event.stopPropagation()}
            >
              @{segment.displayName}
            </Link>
          );
        }

        const parts = parseHashtagSegments(segment.value);
        return (
          <Fragment key={`t-${index}`}>
            {parts.map((part, partIndex) => {
              if (part.type === "hashtag") {
                return (
                  <Link
                    key={`h-${index}-${partIndex}`}
                    href={`/feed/hashtags/${encodeURIComponent(part.tag)}`}
                    className={hashtagClassName}
                    onClick={(event) => event.stopPropagation()}
                  >
                    {part.value}
                  </Link>
                );
              }
              return <span key={`s-${index}-${partIndex}`}>{part.value}</span>;
            })}
          </Fragment>
        );
      })}
    </span>
  );
}
