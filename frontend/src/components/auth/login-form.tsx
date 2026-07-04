"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSignin } from "@/hooks/use-auth-mutations";
import { authSchema, type AuthFormValues } from "@/lib/validations/auth";
import { ApiError } from "@/types/api";

export function LoginForm() {
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
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <Input
        label="Password"
        type="password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register("password")}
      />

      {errorMessage ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMessage}
        </p>
      ) : null}

      <Button type="submit" disabled={signin.isPending} className="mt-2 w-full">
        {signin.isPending ? "Signing in…" : "Sign in"}
      </Button>

      <p className="text-center text-sm text-zinc-500">
        No account?{" "}
        <Link href="/register" className="font-medium text-zinc-900 hover:underline">
          Create one
        </Link>
      </p>
    </form>
  );
}
