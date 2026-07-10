"use client";

import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { BrandLogo } from "@/presentation/components/brand/brand-logo";
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
      <div className="relative flex min-h-screen items-center justify-center bg-background">
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
          <ThemeToggle />
        </div>
        <div className="flex flex-col items-center gap-4">
          <BrandLogo
            variant="mark"
            href={null}
            priority
            className="h-12 w-12"
          />
          <Loader2 className="h-6 w-6 animate-spin text-primary" aria-hidden />
          <p className="text-sm text-muted">Loading session…</p>
        </div>
      </div>
    );
  }

  return children;
}
