import { getTranslations } from "next-intl/server";
import { LoginForm } from "@/presentation/components/auth/login-form";

export async function generateMetadata() {
  const t = await getTranslations("auth");
  return { title: t("signInTitle") };
}

export default async function LoginPage() {
  const t = await getTranslations("auth");

  return (
    <div>
      <h2 className="mb-6 text-lg font-semibold text-foreground">
        {t("signInTitle")}
      </h2>
      <LoginForm />
    </div>
  );
}
