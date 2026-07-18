"use client";

import { usePathname } from "next/navigation";
import { AppBottomNav } from "@/presentation/components/layout/app-bottom-nav";
import { AppHeader } from "@/presentation/components/layout/app-header";

type AppShellProps = {
  children: React.ReactNode;
};

function isMessagingConversation(pathname: string): boolean {
  return /^\/messaging\/[^/]+\/?$/.test(pathname);
}

/**
 * Authenticated chrome: sticky header + content + LinkedIn-style bottom tabs
 * on phones/tablets. Bottom tabs hide inside an open conversation for more room.
 */
export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const hideBottomNav = isMessagingConversation(pathname);

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <AppHeader />
      <main
        className={`mx-auto w-full max-w-[1128px] flex-1 px-2 py-2 sm:px-4 sm:py-4 lg:py-6 ${
          hideBottomNav
            ? "pb-2 lg:pb-6"
            : "pb-[calc(3.75rem+env(safe-area-inset-bottom))] lg:pb-6"
        }`}
      >
        {children}
      </main>
      {hideBottomNav ? null : <AppBottomNav />}
    </div>
  );
}
