import { UserDevicePublic } from "@/core/domain/entities/user-device-public.entity";
import { UserDevice } from "@/core/domain/entities/user-device.entity";
import type {
  UserDevicePublicResponseDto,
  UserDeviceResponseDto,
} from "@/infrastructure/api/dto/device-response.dto";

export class DeviceMapper {
  static fromApi(dto: UserDeviceResponseDto): UserDevice {
    return new UserDevice(
      dto.id,
      dto.userId,
      dto.deviceId,
      dto.identityKeyPub,
      dto.signedPreKeyPub,
      dto.signedPreKeyId,
      new Date(dto.createdAt),
      new Date(dto.lastSeenAt),
    );
  }

  static publicFromApi(dto: UserDevicePublicResponseDto): UserDevicePublic {
    return new UserDevicePublic(
      dto.id,
      dto.userId,
      dto.deviceId,
      dto.identityKeyPub,
      dto.signedPreKeyPub,
      dto.signedPreKeyId,
    );
  }
}
