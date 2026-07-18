"use client";

import { useParams } from "next/navigation";
import { NewsDetailPage } from "@/presentation/components/news/news-detail-page";

export default function NewsDetailRoutePage() {
  const params = useParams<{ id: string }>();
  const storyId = typeof params.id === "string" ? params.id : "";

  return <NewsDetailPage storyId={storyId} />;
}
