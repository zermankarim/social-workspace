"use client";

import { useParams } from "next/navigation";
import { ProfilePage } from "@/presentation/components/profile/profile-page";

export function ProfileByIdPage() {
  const params = useParams<{ id: string }>();
  const userId = typeof params.id === "string" ? params.id : undefined;

  return <ProfilePage userId={userId} />;
}

export default function UserProfileRoutePage() {
  return <ProfileByIdPage />;
}
