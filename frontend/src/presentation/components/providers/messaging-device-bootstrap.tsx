"use client";

import { useEnsureMessagingDevice } from "@/presentation/hooks/use-devices";
import { useAuthStore } from "@/presentation/stores/auth.store";

/**
 * Registers E2EE device public keys as soon as the user is signed in —
 * same model as Telegram/Signal: peers can encrypt before the recipient
 * opens a specific chat (they only need to have logged into the app once).
 */
export function MessagingDeviceBootstrap() {
  const user = useAuthStore((state) => state.user);
  useEnsureMessagingDevice(Boolean(user));
  return null;
}
