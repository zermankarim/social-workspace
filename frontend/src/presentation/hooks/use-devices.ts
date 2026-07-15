"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MessagingDeviceStorage } from "@/infrastructure/messaging/messaging-device.storage";
import { appContainer } from "@/modules/app.container";

export const devicesQueryKey = ["devices"] as const;
export const devicesMineKey = [...devicesQueryKey, "me"] as const;

export function peerDevicesKey(userId: string) {
  return [...devicesQueryKey, "by-user", userId] as const;
}

export function useMyDevices(enabled = true) {
  return useQuery({
    queryKey: devicesMineKey,
    queryFn: () => appContainer.deviceService.getMine(),
    enabled,
  });
}

export function usePeerDevices(userId: string | undefined) {
  return useQuery({
    queryKey: peerDevicesKey(userId ?? ""),
    queryFn: () => appContainer.deviceService.getPublicByUserId(userId!),
    enabled: Boolean(userId),
    staleTime: 60_000,
  });
}

/**
 * Generates ECDH keys locally and registers/refreshes public keys on the server.
 * Called on signed-in app bootstrap (not only Messaging) so peers can encrypt
 * before the recipient opens a specific chat.
 */
export function useEnsureMessagingDevice(enabled = true) {
  return useQuery({
    queryKey: [...devicesQueryKey, "ensure"],
    queryFn: async () => {
      const keys = await MessagingDeviceStorage.ensureLocalKeys();
      const clientDeviceId = MessagingDeviceStorage.getOrCreateClientDeviceId();
      const device = await appContainer.deviceService.register({
        deviceId: clientDeviceId,
        identityKeyPub: keys.identityPublicSpki,
        signedPreKeyPub: keys.signedPreKeyPublicSpki,
        signedPreKeyId: keys.signedPreKeyId,
      });
      MessagingDeviceStorage.setServerDeviceId(device.id);
      return device;
    },
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export function useRegisterDevice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const keys = await MessagingDeviceStorage.ensureLocalKeys();
      return appContainer.deviceService.register({
        deviceId: MessagingDeviceStorage.getOrCreateClientDeviceId(),
        identityKeyPub: keys.identityPublicSpki,
        signedPreKeyPub: keys.signedPreKeyPublicSpki,
        signedPreKeyId: keys.signedPreKeyId,
      });
    },
    onSuccess: (device) => {
      MessagingDeviceStorage.setServerDeviceId(device.id);
      void queryClient.invalidateQueries({ queryKey: devicesQueryKey });
    },
  });
}

export async function ensureRegisteredDeviceId(): Promise<string> {
  const existing = MessagingDeviceStorage.getServerDeviceId();
  if (existing) return existing;
  const keys = await MessagingDeviceStorage.ensureLocalKeys();
  const device = await appContainer.deviceService.register({
    deviceId: MessagingDeviceStorage.getOrCreateClientDeviceId(),
    identityKeyPub: keys.identityPublicSpki,
    signedPreKeyPub: keys.signedPreKeyPublicSpki,
    signedPreKeyId: keys.signedPreKeyId,
  });
  MessagingDeviceStorage.setServerDeviceId(device.id);
  return device.id;
}
