"use client";

import Link from "next/link";
import { parseMentionSegments } from "@/presentation/lib/mentions";

type MentionTextProps = {
  text: string;
  className?: string;
  mentionClassName?: string;
};

export function MentionText({
  text,
  className = "",
  mentionClassName = "font-semibold text-primary hover:underline",
}: MentionTextProps) {
  const segments = parseMentionSegments(text);

  return (
    <span className={className}>
      {segments.map((segment, index) => {
        if (segment.type === "text") {
          return <span key={`t-${index}`}>{segment.value}</span>;
        }

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
      })}
    </span>
  );
}
