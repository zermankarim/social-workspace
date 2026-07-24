"use client";

import { useGamificationState } from "@/presentation/hooks/use-gamification";
import { useAuthStore } from "@/presentation/stores/auth.store";

/** Records today's visit (streak) and syncs points/badges once per session. */
export function GamificationBootstrap() {
  const user = useAuthStore((state) => state.user);
  useGamificationState(Boolean(user));
  return null;
}
