"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AuthCredentials } from "@/core/domain/value-objects/auth-credentials.vo";
import { LocationInput } from "@/core/domain/value-objects/location-input.vo";
import { SignupData } from "@/core/domain/value-objects/signup-data.vo";
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

export function useSignin() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { email: string; password: string }) =>
      appContainer.authService.signin(toCredentials(input)),
    onSuccess: (user) => {
      setUser(user);
      queryClient.clear();
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
    onSuccess: (user) => {
      setUser(user);
      queryClient.clear();
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

export function useRefreshSession() {
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: () => appContainer.authService.refresh(),
    onSuccess: (user) => setUser(user),
    onError: () => setUser(null),
  });
}
