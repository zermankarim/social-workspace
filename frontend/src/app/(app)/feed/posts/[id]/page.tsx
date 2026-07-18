"use client";

import { useParams } from "next/navigation";
import { PostDetailPage } from "@/presentation/components/feed/post-detail-page";

export default function PostDetailRoutePage() {
  const params = useParams<{ id: string }>();
  const postId = typeof params.id === "string" ? params.id : "";

  return <PostDetailPage postId={postId} />;
}
