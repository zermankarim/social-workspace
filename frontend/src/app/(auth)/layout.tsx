import { BrandLogo } from "@/presentation/components/brand/brand-logo";
import { RequireGuest } from "@/presentation/components/auth/auth-guards";
import { ThemeToggle } from "@/presentation/components/ui/theme-toggle";
import { BRAND } from "@/presentation/config/brand";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireGuest>
      <div className="relative flex min-h-screen items-center justify-center bg-background px-4 py-12">
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-lg">
          <div className="mb-8 flex flex-col items-center text-center">
            <BrandLogo
              variant="mark"
              href={null}
              priority
              className="h-16 w-16 rounded-2xl sm:h-20 sm:w-20"
            />
            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
              {BRAND.name}
            </h1>
            <p className="mt-2 text-sm text-muted">{BRAND.tagline}</p>
          </div>
          <div className="rounded-lg bg-surface p-6 shadow-card sm:p-8">
            {children}
          </div>
        </div>
      </div>
    </RequireGuest>
  );
}
