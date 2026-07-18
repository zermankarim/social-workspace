import { RequireAuth } from "@/presentation/components/auth/auth-guards";
import { AppShell } from "@/presentation/components/layout/app-shell";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <AppShell>{children}</AppShell>
    </RequireAuth>
  );
}
