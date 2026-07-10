"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/presentation/stores/auth.store";

function AuthSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
    </div>
  );
}

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isInitialized, isAuthenticated, router]);

  if (!isInitialized || !isAuthenticated) {
    return <AuthSpinner />;
  }

  return children;
}

export function RequireGuest({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      router.replace("/feed");
    }
  }, [isInitialized, isAuthenticated, router]);

  if (!isInitialized || isAuthenticated) {
    return <AuthSpinner />;
  }

  return children;
}

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  const isAdmin = useAuthStore((s) => s.isAdmin());

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (isInitialized && isAuthenticated && !isAdmin) {
      router.replace("/feed");
    }
  }, [isInitialized, isAuthenticated, isAdmin, router]);

  if (!isInitialized || !isAuthenticated || !isAdmin) {
    return <AuthSpinner />;
  }

  return children;
}
