export interface RegisterDeviceRequestDto {
  deviceId: string;
  identityKeyPub: string;
  signedPreKeyPub: string;
  signedPreKeyId: number;
}

export interface UserDeviceResponseDto {
  id: string;
  userId: string;
  deviceId: string;
  identityKeyPub: string;
  signedPreKeyPub: string;
  signedPreKeyId: number;
  createdAt: string;
  lastSeenAt: string;
}

export interface UserDevicePublicResponseDto {
  id: string;
  userId: string;
  deviceId: string;
  identityKeyPub: string;
  signedPreKeyPub: string;
  signedPreKeyId: number;
}
