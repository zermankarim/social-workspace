import { RequireAuth } from "@/presentation/components/auth/auth-guards";
import { AppHeader } from "@/presentation/components/layout/app-header";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAuth>
      <div className="flex min-h-dvh flex-col bg-zinc-50 dark:bg-zinc-950">
        <AppHeader />
        <main className="mx-auto flex w-full min-h-0 max-w-6xl flex-1 flex-col px-4 py-8 sm:px-6">
          {children}
        </main>
      </div>
    </RequireAuth>
  );
}
