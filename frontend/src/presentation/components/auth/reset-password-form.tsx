"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { useResetPassword } from "@/presentation/hooks/use-auth";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/presentation/validations/auth.validation";
import { ApiError } from "@/core/application/errors/api.error";

export function ResetPasswordForm() {
  const t = useTranslations("auth");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const resetPassword = useResetPassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = handleSubmit((values) => {
    if (!token) return;
    resetPassword.mutate({ token, newPassword: values.newPassword });
  });

  const errorMessage =
    resetPassword.error instanceof ApiError
      ? resetPassword.error.message
      : null;

  if (!token) {
    return (
      <p className="text-center text-sm text-danger">
        {t("resetPasswordInvalidLink")}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-4">
      <Input
        label={t("newPassword")}
        type="password"
        autoComplete="new-password"
        error={errors.newPassword?.message}
        {...register("newPassword")}
      />
      <Input
        label={t("confirmPassword")}
        type="password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      {errorMessage ? (
        <p className="rounded-md bg-danger/10 px-3 py-2 text-sm text-danger">
          {errorMessage}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={resetPassword.isPending}
        className="mt-2 w-full gap-2"
      >
        {resetPassword.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        ) : null}
        {t("resetPasswordSubmit")}
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
