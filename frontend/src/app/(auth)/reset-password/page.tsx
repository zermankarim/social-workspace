import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { ResetPasswordForm } from "@/presentation/components/auth/reset-password-form";

export async function generateMetadata() {
  const t = await getTranslations("auth");
  return { title: t("resetPasswordTitle") };
}

export default async function ResetPasswordPage() {
  const t = await getTranslations("auth");

  return (
    <div>
      <h2 className="mb-6 text-lg font-semibold text-foreground">
        {t("resetPasswordTitle")}
      </h2>
      <Suspense fallback={null}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
