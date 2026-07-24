"use client";

import { useEffect, useState } from "react";
import type { Message } from "@/core/domain/entities/message.entity";
import type { UserDevice } from "@/core/domain/entities/user-device.entity";
import type { UserDevicePublic } from "@/core/domain/entities/user-device-public.entity";
import { MessagingCrypto } from "@/infrastructure/messaging/messaging-crypto";
import { MessagingDeviceStorage } from "@/infrastructure/messaging/messaging-device.storage";

export type DecryptedMessageBody =
  | { status: "loading" }
  | { status: "ready"; text: string }
  | { status: "error"; reason: "missing-keys" | "decrypt-failed" };

type DeviceLike = UserDevicePublic | UserDevice;

/**
 * Decrypt a message client-side once device keys are available.
 *
 * Every message (own or inbound) now carries one `recipientKeys` row per
 * fan-out target — every device of both conversation members. Decryption is
 * therefore the same for everyone: find the row addressed to *my* registered
 * device, then pair it with the sender device's public identity key (looked
 * up in my own devices if I was the sender, otherwise in the peer's devices).
 *
 * Messages sent before this fan-out existed have an empty `recipientKeys` and
 * fall back to the legacy single-target `ciphertext`/`nonce` columns.
 */
export function useDecryptedMessageBody(
  message: Message,
  currentUserId: string,
  peerDevices: UserDevicePublic[] | undefined,
  myDevices: UserDevice[] | undefined,
): DecryptedMessageBody {
  const [body, setBody] = useState<DecryptedMessageBody>({ status: "loading" });

  const messageId = message.id;
  const isDeleted = message.isDeleted;
  const isOwn = message.isFrom(currentUserId);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (isDeleted) {
        if (!cancelled) setBody({ status: "ready", text: "" });
        return;
      }

      if (peerDevices === undefined || myDevices === undefined) {
        return;
      }

      if (message.recipientKeys.length > 0) {
        const myDeviceId = MessagingDeviceStorage.getServerDeviceId();
        const myKey = myDeviceId ? message.recipientKeyFor(myDeviceId) : null;
        if (!myKey) {
          if (!cancelled) setBody({ status: "error", reason: "missing-keys" });
          return;
        }

        const senderPool: DeviceLike[] = isOwn ? myDevices : peerDevices;
        const senderDevice =
          (message.senderDeviceId
            ? senderPool.find((device) => device.id === message.senderDeviceId)
            : undefined) ?? senderPool[0];

        if (!senderDevice) {
          if (!cancelled) setBody({ status: "error", reason: "missing-keys" });
          return;
        }

        const result = await MessagingCrypto.decryptInbound(
          myKey.ciphertext,
          myKey.nonce,
          senderDevice.identityKeyPub,
        );
        if (cancelled) return;
        if (result.ok) {
          setBody({ status: "ready", text: result.plaintext });
        } else {
          setBody({
            status: "error",
            reason:
              result.reason === "legacy" ? "decrypt-failed" : result.reason,
          });
        }
        return;
      }

      // Legacy pre-fan-out message.
      const ciphertext = message.ciphertext;
      const nonce = message.nonce;
      if (!ciphertext || !nonce) {
        if (!cancelled) setBody({ status: "error", reason: "missing-keys" });
        return;
      }

      if (isOwn) {
        const peerDevice = peerDevices[0];
        if (!peerDevice) {
          if (!cancelled) setBody({ status: "error", reason: "missing-keys" });
          return;
        }
        const result = await MessagingCrypto.decryptOwn(
          ciphertext,
          nonce,
          peerDevice.signedPreKeyPub,
        );
        if (cancelled) return;
        if (result.ok) {
          setBody({ status: "ready", text: result.plaintext });
        } else {
          setBody({
            status: "error",
            reason:
              result.reason === "legacy" ? "decrypt-failed" : result.reason,
          });
        }
        return;
      }

      const senderDevice =
        (message.senderDeviceId
          ? peerDevices.find((device) => device.id === message.senderDeviceId)
          : undefined) ?? peerDevices[0];

      if (!senderDevice) {
        if (!cancelled) setBody({ status: "error", reason: "missing-keys" });
        return;
      }

      const result = await MessagingCrypto.decryptInbound(
        ciphertext,
        nonce,
        senderDevice.identityKeyPub,
      );
      if (cancelled) return;
      if (result.ok) {
        setBody({ status: "ready", text: result.plaintext });
      } else {
        setBody({
          status: "error",
          reason: result.reason === "legacy" ? "decrypt-failed" : result.reason,
        });
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [messageId, message, isDeleted, isOwn, peerDevices, myDevices]);

  return body;
}
