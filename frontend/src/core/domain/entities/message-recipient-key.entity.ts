export class MessageRecipientKey {
  constructor(
    public readonly deviceId: string,
    public readonly ciphertext: string,
    public readonly nonce: string,
    public readonly keyVersion: number,
  ) {}
}
