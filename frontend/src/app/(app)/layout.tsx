import { RequireAuth } from "@/presentation/components/auth/auth-guards";
import { AppShell } from "@/presentation/components/layout/app-shell";
import { LegalFooter } from "@/presentation/components/layout/legal-footer";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <AppShell footer={<LegalFooter />}>{children}</AppShell>
    </RequireAuth>
  );
}
