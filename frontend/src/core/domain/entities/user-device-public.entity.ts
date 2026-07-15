export class UserDevicePublic {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly deviceId: string,
    public readonly identityKeyPub: string,
    public readonly signedPreKeyPub: string,
    public readonly signedPreKeyId: number,
  ) {}
}
