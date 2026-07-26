"use client";

import { Loader2, UserPlus } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiError } from "@/core/application/errors/api.error";
import { AddressAutocomplete } from "@/presentation/components/shared/address-autocomplete";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Textarea } from "@/presentation/components/ui/textarea";
import { useSignup } from "@/presentation/hooks/use-auth";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/presentation/validations/auth.validation";

export function RegisterForm() {
  const t = useTranslations("auth");
  const tCommon = useTranslations("common");
  const signup = useSignup();
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      bio: "",
      locationLabel: "",
      location: undefined,
    },
  });

  const onSubmit = handleSubmit(
    ({ email, password, firstName, lastName, bio, location }) => {
      signup.mutate({
        email,
        password,
        firstName,
        lastName,
        bio: bio?.trim() ? bio : undefined,
        location,
      });
    },
  );

  const errorMessage =
    signup.error instanceof ApiError ? signup.error.message : null;

  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label={t("firstName")}
          autoComplete="given-name"
          error={errors.firstName?.message}
          {...register("firstName")}
        />
        <Input
          label={t("lastName")}
          autoComplete="family-name"
          error={errors.lastName?.message}
          {...register("lastName")}
        />
      </div>

      <Input
        label={t("email")}
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />

      <Textarea
        label={t("bio")}
        placeholder={t("bioPlaceholder")}
        error={errors.bio?.message}
        {...register("bio")}
      />

      <Controller
        name="locationLabel"
        control={control}
        render={({ field }) => (
          <AddressAutocomplete
            label={t("location")}
            value={field.value ?? ""}
            onChange={(nextValue) => {
              field.onChange(nextValue);
              setValue("location", undefined, { shouldValidate: true });
            }}
            onSelect={(result) => {
              field.onChange(result.formattedAddress);
              setValue(
                "location",
                {
                  lat: result.lat,
                  lng: result.lng,
                  label: result.formattedAddress,
                  city: result.city,
                  country: result.country,
                  placeId: result.placeId,
                },
                { shouldValidate: true },
              );
            }}
            error={errors.locationLabel?.message}
          />
        )}
      />

      <Input
        label={t("password")}
        type="password"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register("password")}
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
        disabled={signup.isPending}
        className="mt-2 w-full gap-2"
      >
        {signup.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        ) : (
          <UserPlus className="h-4 w-4" aria-hidden />
        )}
        {signup.isPending ? t("creatingAccount") : t("createAccountTitle")}
      </Button>

      <p className="text-center text-xs text-muted">
        {t("termsAgreementPrefix")}{" "}
        <Link href="/terms" className="underline hover:text-foreground">
          {t("termsOfUse")}
        </Link>{" "}
        {t("and")}{" "}
        <Link href="/privacy" className="underline hover:text-foreground">
          {t("privacyPolicy")}
        </Link>
        .
      </p>

      <p className="text-center text-sm text-muted">
        {t("haveAccount")}{" "}
        <Link
          href="/login"
          className="font-semibold text-primary hover:underline"
        >
          {tCommon("signIn")}
        </Link>
      </p>
    </form>
  );
}
