"use client";

import { Loader2, UserPlus } from "lucide-react";
import Link from "next/link";
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
          label="First name"
          autoComplete="given-name"
          error={errors.firstName?.message}
          {...register("firstName")}
        />
        <Input
          label="Last name"
          autoComplete="family-name"
          error={errors.lastName?.message}
          {...register("lastName")}
        />
      </div>

      <Input
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />

      <Textarea
        label="Bio (optional)"
        placeholder="A short intro about you"
        error={errors.bio?.message}
        {...register("bio")}
      />

      <Controller
        name="locationLabel"
        control={control}
        render={({ field }) => (
          <AddressAutocomplete
            label="Location (optional)"
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
        label="Password"
        type="password"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register("password")}
      />
      <Input
        label="Confirm password"
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
        {signup.isPending ? "Creating account…" : "Create account"}
      </Button>

      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
