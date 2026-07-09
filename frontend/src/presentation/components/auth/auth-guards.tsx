'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/presentation/stores/auth.store';

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isInitialized = useAuthStore(s => s.isInitialized);
  const isAuthenticated = useAuthStore(s => s.isAuthenticated());

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isInitialized, isAuthenticated, router]);

  if (!isInitialized || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900" />
      </div>
    );
  }

  return children;
}

export function RequireGuest({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isInitialized = useAuthStore(s => s.isInitialized);
  const isAuthenticated = useAuthStore(s => s.isAuthenticated());

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isInitialized, isAuthenticated, router]);

  if (!isInitialized || isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900" />
      </div>
    );
  }

  return children;
}

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isInitialized = useAuthStore(s => s.isInitialized);
  const isAuthenticated = useAuthStore(s => s.isAuthenticated());
  const isAdmin = useAuthStore(s => s.isAdmin());

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.replace('/login');
      return;
    }
    if (isInitialized && isAuthenticated && !isAdmin) {
      router.replace('/dashboard');
    }
  }, [isInitialized, isAuthenticated, isAdmin, router]);

  if (!isInitialized || !isAuthenticated || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900" />
      </div>
    );
  }

  return children;
}
