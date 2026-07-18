"use client";

import { useParams } from "next/navigation";
import { HashtagFeedPage } from "@/presentation/components/feed/hashtag-feed-page";

export default function HashtagRoutePage() {
  const params = useParams<{ tag: string }>();
  const tag =
    typeof params.tag === "string" ? decodeURIComponent(params.tag) : "";

  return <HashtagFeedPage tag={tag} />;
}
