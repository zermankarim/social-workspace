import { UserDevicePublicDto, UserDeviceResponseDto } from '../dto/device.dto';
import { UserDeviceSelected } from '../../conversations/conversations.select';

export class DevicesMapper {
  static toResponse(device: UserDeviceSelected): UserDeviceResponseDto {
    return {
      id: device.id,
      userId: device.userId,
      deviceId: device.deviceId,
      identityKeyPub: device.identityKeyPub,
      signedPreKeyPub: device.signedPreKeyPub,
      signedPreKeyId: device.signedPreKeyId,
      createdAt: device.createdAt,
      lastSeenAt: device.lastSeenAt,
    };
  }

  static toPublic(device: UserDeviceSelected): UserDevicePublicDto {
    return {
      id: device.id,
      userId: device.userId,
      deviceId: device.deviceId,
      identityKeyPub: device.identityKeyPub,
      signedPreKeyPub: device.signedPreKeyPub,
      signedPreKeyId: device.signedPreKeyId,
    };
  }
}
