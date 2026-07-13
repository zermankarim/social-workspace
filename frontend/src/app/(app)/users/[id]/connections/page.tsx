"use client";

import { useParams } from "next/navigation";
import { ProfileConnectionsPage } from "@/presentation/components/profile/profile-connections-page";

export default function UserConnectionsRoutePage() {
  const params = useParams<{ id: string }>();
  const userId = typeof params.id === "string" ? params.id : undefined;

  return <ProfileConnectionsPage userId={userId} />;
}
