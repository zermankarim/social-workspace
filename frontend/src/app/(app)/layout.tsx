import { RequireAuth } from "@/presentation/components/auth/auth-guards";
import { AppHeader } from "@/presentation/components/layout/app-header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <div className="flex min-h-dvh flex-col bg-background">
        <AppHeader />
        <main className="mx-auto w-full max-w-[1128px] flex-1 px-2 py-6 sm:px-4">
          {children}
        </main>
      </div>
    </RequireAuth>
  );
}
