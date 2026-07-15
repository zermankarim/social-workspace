import {
  exportPrivateKeyPkcs8Base64,
  exportPublicKeySpkiBase64,
  generateEcdhKeyPair,
  importPrivateKeyPkcs8Base64,
} from "@/infrastructure/messaging/web-crypto";

const CLIENT_DEVICE_ID_KEY = "messaging.clientDeviceId";
const SERVER_DEVICE_ID_KEY = "messaging.serverDeviceId";
const IDENTITY_PRIVATE_KEY = "messaging.identity.private";
const IDENTITY_PUBLIC_KEY = "messaging.identity.public";
const SIGNED_PREKEY_PRIVATE_KEY = "messaging.signedPreKey.private";
const SIGNED_PREKEY_PUBLIC_KEY = "messaging.signedPreKey.public";
const SIGNED_PREKEY_ID_KEY = "messaging.signedPreKey.id";
/** Legacy stub from pre-WebCrypto builds — cleared on upgrade. */
const LEGACY_PRIVATE_STUB_KEY = "messaging.privateKeyStub";

export const MESSAGING_KEY_VERSION = 1;
/** HKDF info string — must match decrypt path. */
export const MESSAGING_HKDF_INFO = "social-workspace-dm-v1";

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function randomId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `device-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export type LocalMessagingKeys = {
  identityPrivatePkcs8: string;
  identityPublicSpki: string;
  signedPreKeyPrivatePkcs8: string;
  signedPreKeyPublicSpki: string;
  signedPreKeyId: number;
};

export class MessagingDeviceStorage {
  static getOrCreateClientDeviceId(): string {
    if (!canUseStorage()) {
      return randomId();
    }
    const existing = localStorage.getItem(CLIENT_DEVICE_ID_KEY);
    if (existing) return existing;
    const created = `browser-${randomId()}`;
    localStorage.setItem(CLIENT_DEVICE_ID_KEY, created);
    return created;
  }

  static getServerDeviceId(): string | null {
    if (!canUseStorage()) return null;
    return localStorage.getItem(SERVER_DEVICE_ID_KEY);
  }

  static setServerDeviceId(id: string): void {
    if (!canUseStorage()) return;
    localStorage.setItem(SERVER_DEVICE_ID_KEY, id);
  }

  static getLocalKeys(): LocalMessagingKeys | null {
    if (!canUseStorage()) return null;
    const identityPrivatePkcs8 = localStorage.getItem(IDENTITY_PRIVATE_KEY);
    const identityPublicSpki = localStorage.getItem(IDENTITY_PUBLIC_KEY);
    const signedPreKeyPrivatePkcs8 = localStorage.getItem(
      SIGNED_PREKEY_PRIVATE_KEY,
    );
    const signedPreKeyPublicSpki = localStorage.getItem(
      SIGNED_PREKEY_PUBLIC_KEY,
    );
    const signedPreKeyIdRaw = localStorage.getItem(SIGNED_PREKEY_ID_KEY);
    if (
      !identityPrivatePkcs8 ||
      !identityPublicSpki ||
      !signedPreKeyPrivatePkcs8 ||
      !signedPreKeyPublicSpki ||
      !signedPreKeyIdRaw
    ) {
      return null;
    }
    const signedPreKeyId = Number(signedPreKeyIdRaw);
    if (!Number.isFinite(signedPreKeyId) || signedPreKeyId < 1) {
      return null;
    }
    return {
      identityPrivatePkcs8,
      identityPublicSpki,
      signedPreKeyPrivatePkcs8,
      signedPreKeyPublicSpki,
      signedPreKeyId,
    };
  }

  static setLocalKeys(keys: LocalMessagingKeys): void {
    if (!canUseStorage()) return;
    localStorage.setItem(IDENTITY_PRIVATE_KEY, keys.identityPrivatePkcs8);
    localStorage.setItem(IDENTITY_PUBLIC_KEY, keys.identityPublicSpki);
    localStorage.setItem(
      SIGNED_PREKEY_PRIVATE_KEY,
      keys.signedPreKeyPrivatePkcs8,
    );
    localStorage.setItem(SIGNED_PREKEY_PUBLIC_KEY, keys.signedPreKeyPublicSpki);
    localStorage.setItem(SIGNED_PREKEY_ID_KEY, String(keys.signedPreKeyId));
    localStorage.removeItem(LEGACY_PRIVATE_STUB_KEY);
  }

  static async ensureLocalKeys(): Promise<LocalMessagingKeys> {
    const existing = this.getLocalKeys();
    if (existing) {
      // Validate imports once (catches corrupt storage).
      try {
        await importPrivateKeyPkcs8Base64(existing.identityPrivatePkcs8);
        await importPrivateKeyPkcs8Base64(existing.signedPreKeyPrivatePkcs8);
        return existing;
      } catch {
        // regenerate below
      }
    }

    const identity = await generateEcdhKeyPair();
    const signedPreKey = await generateEcdhKeyPair();
    const keys: LocalMessagingKeys = {
      identityPrivatePkcs8: await exportPrivateKeyPkcs8Base64(
        identity.privateKey,
      ),
      identityPublicSpki: await exportPublicKeySpkiBase64(identity.publicKey),
      signedPreKeyPrivatePkcs8: await exportPrivateKeyPkcs8Base64(
        signedPreKey.privateKey,
      ),
      signedPreKeyPublicSpki: await exportPublicKeySpkiBase64(
        signedPreKey.publicKey,
      ),
      signedPreKeyId: 1,
    };
    this.setLocalKeys(keys);
    return keys;
  }
}
