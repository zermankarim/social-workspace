import { getTranslations } from "next-intl/server";
import { RegisterForm } from "@/presentation/components/auth/register-form";

export async function generateMetadata() {
  const t = await getTranslations("auth");
  return { title: t("createAccountTitle") };
}

export default async function RegisterPage() {
  const t = await getTranslations("auth");

  return (
    <div>
      <h2 className="mb-6 text-lg font-semibold text-foreground">
        {t("createAccountTitle")}
      </h2>
      <RegisterForm />
    </div>
  );
}
