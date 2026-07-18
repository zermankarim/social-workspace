"use client";

import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { appContainer } from "@/modules/app.container";

export const impressionsSummaryQueryKey = [
  "posts",
  "impressions-summary",
] as const;

const impressionSessionKey = (postId: string) => `post-impression:${postId}`;

function hasRecordedImpression(postId: string): boolean {
  try {
    return sessionStorage.getItem(impressionSessionKey(postId)) === "1";
  } catch {
    return false;
  }
}

function markImpressionRecorded(postId: string): void {
  try {
    sessionStorage.setItem(impressionSessionKey(postId), "1");
  } catch {
    // Private mode / quota — server-side uniqueness still applies.
  }
}

export function useImpressionsSummary(enabled = true) {
  return useQuery({
    queryKey: impressionsSummaryQueryKey,
    queryFn: () => appContainer.postService.getImpressionsSummary(),
    enabled,
    staleTime: 60_000,
  });
}

/** Registers an impression once when the element becomes sufficiently visible. */
export function usePostImpression(postId: string, enabled = true) {
  const recordedRef = useRef(false);
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    recordedRef.current = hasRecordedImpression(postId);
  }, [postId]);

  useEffect(() => {
    if (!enabled || recordedRef.current) return;
    const node = elementRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting || recordedRef.current) return;
        recordedRef.current = true;
        markImpressionRecorded(postId);
        void appContainer.postService
          .registerImpressions([postId])
          .catch(() => {
            recordedRef.current = false;
            try {
              sessionStorage.removeItem(impressionSessionKey(postId));
            } catch {
              // ignore
            }
          });
        observer.disconnect();
      },
      { threshold: 0.55 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [enabled, postId]);

  return elementRef;
}
