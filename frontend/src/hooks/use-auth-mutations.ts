"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/stores/auth-store";
import type { AuthCredentials } from "@/types/api";

export function useSignin() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: AuthCredentials) => authApi.signin(credentials),
    onSuccess: ({ user }) => {
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
    mutationFn: async (credentials: AuthCredentials) => {
      await authApi.signup(credentials);
      return authApi.signin(credentials);
    },
    onSuccess: ({ user }) => {
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
    mutationFn: () => authApi.signout(),
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
    mutationFn: () => authApi.refresh(),
    onSuccess: ({ user }) => setUser(user),
    onError: () => setUser(null),
  });
}
