import { getTranslations } from "next-intl/server";
import { ForgotPasswordForm } from "@/presentation/components/auth/forgot-password-form";

export async function generateMetadata() {
  const t = await getTranslations("auth");
  return { title: t("forgotPasswordTitle") };
}

export default async function ForgotPasswordPage() {
  const t = await getTranslations("auth");

  return (
    <div>
      <h2 className="mb-6 text-lg font-semibold text-foreground">
        {t("forgotPasswordTitle")}
      </h2>
      <ForgotPasswordForm />
    </div>
  );
}
