"use client";

import { Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { useForgotPassword } from "@/presentation/hooks/use-auth";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/presentation/validations/auth.validation";
import { ApiError } from "@/core/application/errors/api.error";

export function ForgotPasswordForm() {
  const t = useTranslations("auth");
  const forgotPassword = useForgotPassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = handleSubmit((values) => {
    forgotPassword.mutate(values.email);
  });

  const errorMessage =
    forgotPassword.error instanceof ApiError
      ? forgotPassword.error.message
      : null;

  if (forgotPassword.isSuccess) {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-primary-soft text-primary">
          <Mail className="h-6 w-6" aria-hidden />
        </span>
        <p className="text-sm text-foreground">{forgotPassword.data}</p>
        <Link
          href="/login"
          className="text-sm font-semibold text-primary hover:underline"
        >
          {t("backToSignIn")}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-4">
      <p className="text-sm text-muted">{t("forgotPasswordHint")}</p>
      <Input
        label={t("email")}
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />

      {errorMessage ? (
        <p className="rounded-md bg-danger/10 px-3 py-2 text-sm text-danger">
          {errorMessage}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={forgotPassword.isPending}
        className="mt-2 w-full gap-2"
      >
        {forgotPassword.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        ) : null}
        {t("sendResetLink")}
      </Button>

      <p className="text-center text-sm text-muted">
        <Link
          href="/login"
          className="font-semibold text-primary hover:underline"
        >
          {t("backToSignIn")}
        </Link>
      </p>
    </form>
  );
}
