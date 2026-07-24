"use client";

import { Laptop, Loader2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { MessagingDeviceStorage } from "@/infrastructure/messaging/messaging-device.storage";
import {
  useMyDevices,
  useRemoveDevice,
} from "@/presentation/hooks/use-devices";
import { formatRelativeTime } from "@/presentation/lib/format-relative-time";

/**
 * Lets a user see and revoke their registered E2EE devices — the only place
 * a stale/lost device can be pruned so it stops being a fan-out target.
 */
export function ProfileDevicesSection() {
  const t = useTranslations("profile");
  const devicesQuery = useMyDevices();
  const removeDevice = useRemoveDevice();
  const currentDeviceId = MessagingDeviceStorage.getServerDeviceId();

  const devices = devicesQuery.data ?? [];

  const handleRemove = (id: string) => {
    if (!window.confirm(t("deviceRemoveConfirm"))) return;
    removeDevice.mutate(id);
  };

  return (
    <div>
      <h2 className="text-sm font-semibold text-foreground">{t("devices")}</h2>
      <p className="mt-1 text-xs text-muted">{t("devicesHint")}</p>

      {devicesQuery.isLoading ? (
        <div className="mt-3 flex justify-center py-2">
          <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden />
        </div>
      ) : devices.length === 0 ? (
        <p className="mt-3 text-xs text-muted">{t("devicesEmpty")}</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {devices.map((device) => {
            const isCurrent = device.id === currentDeviceId;
            return (
              <li
                key={device.id}
                className="flex items-center gap-2 rounded-md border border-border px-2.5 py-2"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                  <Laptop className="h-3.5 w-3.5" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-medium text-foreground">
                    {isCurrent
                      ? t("deviceThisDevice")
                      : formatRelativeTime(device.lastSeenAt)}
                  </span>
                </span>
                {isCurrent ? null : (
                  <button
                    type="button"
                    aria-label={t("deviceRemove")}
                    disabled={removeDevice.isPending}
                    onClick={() => handleRemove(device.id)}
                    className="rounded-full p-1 text-muted transition-colors hover:bg-surface-muted hover:text-danger disabled:opacity-50"
                  >
                    <X className="h-3.5 w-3.5" aria-hidden />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
