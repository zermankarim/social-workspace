"use client";

import { RequireAdmin } from "@/presentation/components/auth/auth-guards";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RequireAdmin>{children}</RequireAdmin>;
}
