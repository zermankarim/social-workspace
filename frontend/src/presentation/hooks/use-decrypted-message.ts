"use client";

import { useEffect, useState } from "react";
import type { Message } from "@/core/domain/entities/message.entity";
import type { UserDevicePublic } from "@/core/domain/entities/user-device-public.entity";
import { MessagingCrypto } from "@/infrastructure/messaging/messaging-crypto";

export type DecryptedMessageBody =
  | { status: "loading" }
  | { status: "ready"; text: string }
  | { status: "error"; reason: "missing-keys" | "decrypt-failed" };

/**
 * Decrypt a message client-side once peer device keys are available.
 */
export function useDecryptedMessageBody(
  message: Message,
  currentUserId: string,
  peerDevices: UserDevicePublic[] | undefined,
): DecryptedMessageBody {
  const [body, setBody] = useState<DecryptedMessageBody>({ status: "loading" });

  const messageId = message.id;
  const ciphertext = message.ciphertext;
  const nonce = message.nonce;
  const senderDeviceId = message.senderDeviceId;
  const isDeleted = message.isDeleted;
  const isOwn = message.isFrom(currentUserId);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (isDeleted) {
        if (!cancelled) setBody({ status: "ready", text: "" });
        return;
      }

      if (peerDevices === undefined) {
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
        (senderDeviceId
          ? peerDevices.find((device) => device.id === senderDeviceId)
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
  }, [
    messageId,
    ciphertext,
    nonce,
    senderDeviceId,
    isDeleted,
    isOwn,
    peerDevices,
  ]);

  return body;
}
