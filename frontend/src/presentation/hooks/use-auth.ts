"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AuthCredentials } from "@/core/domain/value-objects/auth-credentials.vo";
import { appContainer } from "@/modules/app.container";
import { useAuthStore } from "@/presentation/stores/auth.store";

function toCredentials(input: { email: string; password: string }) {
  return new AuthCredentials(input.email, input.password);
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
      router.replace("/dashboard");
    },
  });
}

export function useSignup() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { email: string; password: string }) =>
      appContainer.authService.register(toCredentials(input)),
    onSuccess: (user) => {
      setUser(user);
      queryClient.clear();
      router.replace("/dashboard");
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
