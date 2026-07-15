import type { UserDevicePublic } from "@/core/domain/entities/user-device-public.entity";
import { PeerDeviceMissingError } from "@/core/application/errors/peer-device-missing.error";
import {
  MESSAGING_HKDF_INFO,
  MESSAGING_KEY_VERSION,
  MessagingDeviceStorage,
} from "@/infrastructure/messaging/messaging-device.storage";
import {
  aesGcmDecrypt,
  aesGcmEncrypt,
  deriveAesGcmKey,
  importPrivateKeyPkcs8Base64,
  importPublicKeySpkiBase64,
} from "@/infrastructure/messaging/web-crypto";

export type EncryptedPayload = {
  ciphertext: string;
  nonce: string;
  keyVersion: number;
};

export type DecryptResult =
  | { ok: true; plaintext: string }
  | { ok: false; reason: "missing-keys" | "decrypt-failed" | "legacy" };

function looksLikeLegacyPlaintext(ciphertext: string, nonce: string): boolean {
  if (nonce === "stub-nonce-v1") return true;
  // Heuristic: real ciphertext is base64 binary; short printable strings may be legacy.
  if (ciphertext.length > 0 && !/^[A-Za-z0-9+/]+=*$/.test(ciphertext)) {
    return true;
  }
  return false;
}

/**
 * Protocol v1:
 * - Encrypt: ECDH(sender identity private, recipient signed-prekey public) → AES-GCM
 * - Decrypt inbound: ECDH(recipient signed-prekey private, sender identity public)
 * - Decrypt own: ECDH(sender identity private, recipient signed-prekey public)
 */
export class MessagingCrypto {
  static async encryptForPeerDevice(
    plaintext: string,
    peerDevice: UserDevicePublic,
  ): Promise<EncryptedPayload> {
    const local = await MessagingDeviceStorage.ensureLocalKeys();
    const myIdentityPrivate = await importPrivateKeyPkcs8Base64(
      local.identityPrivatePkcs8,
    );

    let peerSignedPreKey: CryptoKey;
    try {
      peerSignedPreKey = await importPublicKeySpkiBase64(
        peerDevice.signedPreKeyPub,
      );
    } catch {
      // Pre-WebCrypto stub keys are not valid SPKI — peer must re-open Messaging.
      throw new PeerDeviceMissingError();
    }

    const aesKey = await deriveAesGcmKey(
      myIdentityPrivate,
      peerSignedPreKey,
      MESSAGING_HKDF_INFO,
    );
    const { ciphertextBase64, nonceBase64 } = await aesGcmEncrypt(
      aesKey,
      plaintext,
    );
    return {
      ciphertext: ciphertextBase64,
      nonce: nonceBase64,
      keyVersion: MESSAGING_KEY_VERSION,
    };
  }

  static async decryptInbound(
    ciphertext: string,
    nonce: string,
    senderIdentityKeyPub: string,
  ): Promise<DecryptResult> {
    if (looksLikeLegacyPlaintext(ciphertext, nonce)) {
      return { ok: true, plaintext: ciphertext };
    }
    try {
      const local = MessagingDeviceStorage.getLocalKeys();
      if (!local) return { ok: false, reason: "missing-keys" };
      const mySignedPreKeyPrivate = await importPrivateKeyPkcs8Base64(
        local.signedPreKeyPrivatePkcs8,
      );
      const senderIdentity =
        await importPublicKeySpkiBase64(senderIdentityKeyPub);
      const aesKey = await deriveAesGcmKey(
        mySignedPreKeyPrivate,
        senderIdentity,
        MESSAGING_HKDF_INFO,
      );
      const plaintext = await aesGcmDecrypt(aesKey, ciphertext, nonce);
      return { ok: true, plaintext };
    } catch {
      if (looksLikeLegacyPlaintext(ciphertext, nonce)) {
        return { ok: true, plaintext: ciphertext };
      }
      return { ok: false, reason: "decrypt-failed" };
    }
  }

  static async decryptOwn(
    ciphertext: string,
    nonce: string,
    peerSignedPreKeyPub: string,
  ): Promise<DecryptResult> {
    if (looksLikeLegacyPlaintext(ciphertext, nonce)) {
      return { ok: true, plaintext: ciphertext };
    }
    try {
      const local = MessagingDeviceStorage.getLocalKeys();
      if (!local) return { ok: false, reason: "missing-keys" };
      const myIdentityPrivate = await importPrivateKeyPkcs8Base64(
        local.identityPrivatePkcs8,
      );
      const peerSignedPreKey =
        await importPublicKeySpkiBase64(peerSignedPreKeyPub);
      const aesKey = await deriveAesGcmKey(
        myIdentityPrivate,
        peerSignedPreKey,
        MESSAGING_HKDF_INFO,
      );
      const plaintext = await aesGcmDecrypt(aesKey, ciphertext, nonce);
      return { ok: true, plaintext };
    } catch {
      return { ok: false, reason: "decrypt-failed" };
    }
  }
}
