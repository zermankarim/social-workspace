import type { RegisterDeviceInput } from "@/core/domain/entities/register-device-input.entity";
import type { UserDevice } from "@/core/domain/entities/user-device.entity";
import type { UserDevicePublic } from "@/core/domain/entities/user-device-public.entity";
import type { DeviceRepository } from "@/core/domain/repositories/device.repository";

export class DeviceService {
  constructor(private readonly deviceRepository: DeviceRepository) {}

  register(input: RegisterDeviceInput): Promise<UserDevice> {
    return this.deviceRepository.register(input);
  }

  getMine(): Promise<UserDevice[]> {
    return this.deviceRepository.findMine();
  }

  getPublicByUserId(userId: string): Promise<UserDevicePublic[]> {
    return this.deviceRepository.findPublicByUserId(userId);
  }

  remove(id: string): Promise<void> {
    return this.deviceRepository.remove(id);
  }
}
