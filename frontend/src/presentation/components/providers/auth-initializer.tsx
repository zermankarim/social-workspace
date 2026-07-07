"use client";

import { useEffect } from "react";
import { useRefreshSession } from "@/presentation/hooks/use-auth";
import { useAuthStore } from "@/presentation/stores/auth.store";

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const setInitialized = useAuthStore((s) => s.setInitialized);
  const refresh = useRefreshSession();

  useEffect(() => {
    refresh.mutate(undefined, {
      onSettled: () => setInitialized(true),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900" />
          <p className="text-sm text-zinc-500">Loading session…</p>
        </div>
      </div>
    );
  }

  return children;
}
