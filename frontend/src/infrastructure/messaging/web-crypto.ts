function assertBrowserCrypto(): SubtleCrypto {
  if (typeof crypto === "undefined" || !crypto.subtle) {
    throw new Error("WebCrypto is not available in this environment");
  }
  return crypto.subtle;
}

export function bytesToBase64(bytes: ArrayBuffer | Uint8Array): string {
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = "";
  for (let i = 0; i < view.length; i += 1) {
    binary += String.fromCharCode(view[i]!);
  }
  return btoa(binary);
}

export function base64ToBytes(value: string): Uint8Array {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export async function exportPublicKeySpkiBase64(
  publicKey: CryptoKey,
): Promise<string> {
  const subtle = assertBrowserCrypto();
  const spki = await subtle.exportKey("spki", publicKey);
  return bytesToBase64(spki);
}

export async function exportPrivateKeyPkcs8Base64(
  privateKey: CryptoKey,
): Promise<string> {
  const subtle = assertBrowserCrypto();
  const pkcs8 = await subtle.exportKey("pkcs8", privateKey);
  return bytesToBase64(pkcs8);
}

export function importPublicKeySpkiBase64(
  spkiBase64: string,
): Promise<CryptoKey> {
  const subtle = assertBrowserCrypto();
  const keyData = Uint8Array.from(base64ToBytes(spkiBase64));
  return subtle.importKey(
    "spki",
    keyData,
    { name: "ECDH", namedCurve: "P-256" },
    true,
    [],
  );
}

export function importPrivateKeyPkcs8Base64(
  pkcs8Base64: string,
): Promise<CryptoKey> {
  const subtle = assertBrowserCrypto();
  const keyData = Uint8Array.from(base64ToBytes(pkcs8Base64));
  return subtle.importKey(
    "pkcs8",
    keyData,
    { name: "ECDH", namedCurve: "P-256" },
    true,
    ["deriveBits"],
  );
}

export async function generateEcdhKeyPair(): Promise<CryptoKeyPair> {
  const subtle = assertBrowserCrypto();
  return subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, [
    "deriveBits",
  ]);
}

/**
 * Derive AES-GCM key from ECDH shared secret (HKDF, info = protocol id).
 */
export async function deriveAesGcmKey(
  privateKey: CryptoKey,
  peerPublicKey: CryptoKey,
  info: string,
): Promise<CryptoKey> {
  const subtle = assertBrowserCrypto();
  const shared = await subtle.deriveBits(
    { name: "ECDH", public: peerPublicKey },
    privateKey,
    256,
  );
  const baseKey = await subtle.importKey("raw", shared, "HKDF", false, [
    "deriveKey",
  ]);
  return subtle.deriveKey(
    {
      name: "HKDF",
      hash: "SHA-256",
      salt: new Uint8Array(32),
      info: new TextEncoder().encode(info),
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

export async function aesGcmEncrypt(
  key: CryptoKey,
  plaintext: string,
): Promise<{ ciphertextBase64: string; nonceBase64: string }> {
  const subtle = assertBrowserCrypto();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(plaintext);
  const cipher = await subtle.encrypt({ name: "AES-GCM", iv }, key, encoded);
  return {
    ciphertextBase64: bytesToBase64(cipher),
    nonceBase64: bytesToBase64(iv),
  };
}

export async function aesGcmDecrypt(
  key: CryptoKey,
  ciphertextBase64: string,
  nonceBase64: string,
): Promise<string> {
  const subtle = assertBrowserCrypto();
  const plain = await subtle.decrypt(
    { name: "AES-GCM", iv: Uint8Array.from(base64ToBytes(nonceBase64)) },
    key,
    Uint8Array.from(base64ToBytes(ciphertextBase64)),
  );
  return new TextDecoder().decode(plain);
}

export { assertBrowserCrypto };
