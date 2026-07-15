"use client";

import { useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";

type ExpandableTextProps = {
  text: string;
  className?: string;
  /** Approx. length before collapse control is offered. */
  collapseAfter?: number;
  collapsedClassName?: string;
  /** Custom body (e.g. MentionText). Length still uses `text`. */
  children?: ReactNode;
};

/**
 * Long copy with Show more / Show less (LinkedIn-style).
 * Collapsed state uses CSS line-clamp; the toggle appears when copy is long.
 */
export function ExpandableText({
  text,
  className = "",
  collapseAfter = 220,
  collapsedClassName = "line-clamp-4",
  children,
}: ExpandableTextProps) {
  const t = useTranslations("common");
  const [expanded, setExpanded] = useState(false);
  const lineBreaks = (text.match(/\n/g) ?? []).length;
  const needsToggle = text.length > collapseAfter || lineBreaks >= 3;

  return (
    <div>
      <p
        className={`whitespace-pre-wrap break-words text-sm leading-relaxed text-foreground ${className} ${
          needsToggle && !expanded ? collapsedClassName : ""
        }`}
      >
        {children ?? text}
      </p>
      {needsToggle ? (
        <button
          type="button"
          className="mt-1 text-sm font-semibold text-muted hover:text-primary hover:underline"
          onClick={() => setExpanded((current) => !current)}
          aria-expanded={expanded}
        >
          {expanded ? t("showLess") : t("showMore")}
        </button>
      ) : null}
    </div>
  );
}
