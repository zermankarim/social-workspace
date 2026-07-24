"use client";

import { Loader2, LogIn } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { useSignin } from "@/presentation/hooks/use-auth";
import {
  authSchema,
  type AuthFormValues,
} from "@/presentation/validations/auth.validation";
import { ApiError } from "@/core/application/errors/api.error";

export function LoginForm() {
  const t = useTranslations("auth");
  const tCommon = useTranslations("common");
  const signin = useSignin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
  });

  const onSubmit = handleSubmit((values) => {
    signin.mutate(values);
  });

  const errorMessage =
    signin.error instanceof ApiError ? signin.error.message : null;

  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-4">
      <Input
        label={t("email")}
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <Input
        label={t("password")}
        type="password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register("password")}
      />

      <p className="-mt-2 text-right text-sm">
        <Link
          href="/forgot-password"
          className="font-medium text-primary hover:underline"
        >
          {t("forgotPasswordLink")}
        </Link>
      </p>

      {errorMessage ? (
        <p className="rounded-md bg-danger/10 px-3 py-2 text-sm text-danger">
          {errorMessage}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={signin.isPending}
        className="mt-2 w-full gap-2"
      >
        {signin.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        ) : (
          <LogIn className="h-4 w-4" aria-hidden />
        )}
        {signin.isPending ? t("signingIn") : tCommon("signIn")}
      </Button>

      <p className="text-center text-sm text-muted">
        {t("noAccount")}{" "}
        <Link
          href="/register"
          className="font-semibold text-primary hover:underline"
        >
          {t("createOne")}
        </Link>
      </p>
    </form>
  );
}
