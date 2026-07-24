"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AuthCredentials } from "@/core/domain/value-objects/auth-credentials.vo";
import { LocationInput } from "@/core/domain/value-objects/location-input.vo";
import { SignupData } from "@/core/domain/value-objects/signup-data.vo";
import { applyUserLocaleAfterAuth } from "@/i18n/change-app-locale";
import { appContainer } from "@/modules/app.container";
import { useAuthStore } from "@/presentation/stores/auth.store";
import type { LocationInputValues } from "@/presentation/validations/auth.validation";

function toCredentials(input: { email: string; password: string }) {
  return new AuthCredentials(input.email, input.password);
}

function toSignupData(input: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  bio?: string;
  location?: LocationInputValues;
}) {
  return new SignupData(
    input.email,
    input.password,
    input.firstName,
    input.lastName,
    input.bio?.trim() ? input.bio.trim() : undefined,
    input.location
      ? new LocationInput(
          input.location.lat,
          input.location.lng,
          input.location.label,
          input.location.city,
          input.location.country,
          input.location.placeId,
        )
      : undefined,
  );
}

async function hydrateSessionLocale(
  preferredLocale: string,
  router: ReturnType<typeof useRouter>,
) {
  const changed = await applyUserLocaleAfterAuth(preferredLocale);
  if (changed) router.refresh();
}

export function useSignin() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { email: string; password: string }) =>
      appContainer.authService.signin(toCredentials(input)),
    onSuccess: async (user) => {
      setUser(user);
      queryClient.clear();
      await hydrateSessionLocale(user.preferredLocale, router);
      router.replace("/feed");
    },
  });
}

export function useSignup() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      bio?: string;
      location?: LocationInputValues;
    }) => appContainer.authService.register(toSignupData(input)),
    onSuccess: async (user) => {
      setUser(user);
      queryClient.clear();
      await hydrateSessionLocale(user.preferredLocale, router);
      router.replace("/feed");
    },
  });
}

export function useSignout() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => appContainer.authService.signout(),
    onSettled: () => {
      setUser(null);
      queryClient.clear();
      router.replace("/login");
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) =>
      appContainer.authService.forgotPassword(email),
  });
}

export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: ({
      token,
      newPassword,
    }: {
      token: string;
      newPassword: string;
    }) => appContainer.authService.resetPassword(token, newPassword),
    onSuccess: () => {
      router.replace("/login");
    },
  });
}

export function useRefreshSession() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: () => appContainer.authService.refresh(),
    onSuccess: async (user) => {
      setUser(user);
      await hydrateSessionLocale(user.preferredLocale, router);
    },
    onError: () => setUser(null),
  });
}
