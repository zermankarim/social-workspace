import type { RegisterDeviceInput } from "@/core/domain/entities/register-device-input.entity";
import type { UserDevice } from "@/core/domain/entities/user-device.entity";
import type { UserDevicePublic } from "@/core/domain/entities/user-device-public.entity";

export abstract class DeviceRepository {
  abstract register(input: RegisterDeviceInput): Promise<UserDevice>;
  abstract findMine(): Promise<UserDevice[]>;
  abstract findPublicByUserId(userId: string): Promise<UserDevicePublic[]>;
  abstract remove(id: string): Promise<void>;
}
