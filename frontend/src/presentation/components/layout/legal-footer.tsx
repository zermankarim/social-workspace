import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { BRAND } from "@/presentation/config/brand";

const LAUNCH_YEAR = 2026;

export async function LegalFooter() {
  const t = await getTranslations("legal");

  return (
    <footer className="mx-auto w-full max-w-[1128px] px-4 py-6 text-center text-xs text-muted">
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
        <span>
          © {LAUNCH_YEAR} {BRAND.name}
        </span>
        <Link href="/terms" className="hover:text-foreground hover:underline">
          {t("termsOfUse")}
        </Link>
        <Link href="/privacy" className="hover:text-foreground hover:underline">
          {t("privacyPolicy")}
        </Link>
      </div>
      <p className="mx-auto mt-2 max-w-xl">{t("copyright")}</p>
    </footer>
  );
}
