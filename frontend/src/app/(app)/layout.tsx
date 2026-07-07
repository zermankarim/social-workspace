import { RequireAuth } from "@/presentation/components/auth/auth-guards";
import { AppHeader } from "@/presentation/components/layout/app-header";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAuth>
      <div className="min-h-screen bg-zinc-50">
        <AppHeader />
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
      </div>
    </RequireAuth>
  );
}
