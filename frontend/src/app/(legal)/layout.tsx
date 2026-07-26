import Link from "next/link";
import { BrandLogo } from "@/presentation/components/brand/brand-logo";
import { LegalFooter } from "@/presentation/components/layout/legal-footer";
import { BRAND } from "@/presentation/config/brand";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-8 flex items-center gap-3">
          <BrandLogo variant="mark" href="/" className="h-10 w-10 rounded-xl" />
          <div>
            <Link
              href="/"
              className="text-lg font-semibold tracking-tight text-foreground"
            >
              {BRAND.name}
            </Link>
            <p className="text-sm text-muted">{BRAND.tagline}</p>
          </div>
        </div>
        <div className="rounded-xl bg-surface p-6 shadow-card sm:p-8">
          {children}
        </div>
        <LegalFooter />
      </div>
    </div>
  );
}
