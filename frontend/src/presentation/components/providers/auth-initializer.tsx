"use client";

import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { ThemeToggle } from "@/presentation/components/ui/theme-toggle";
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
      <div className="relative flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
          <ThemeToggle />
        </div>
        <div className="flex flex-col items-center gap-3">
          <Loader2
            className="h-8 w-8 animate-spin text-zinc-900 dark:text-zinc-100"
            aria-hidden
          />
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Loading session…
          </p>
        </div>
      </div>
    );
  }

  return children;
}
