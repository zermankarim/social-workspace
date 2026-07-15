import { Injectable, NotFoundException } from '@nestjs/common';
import { DevicesRepository } from '../repositories/devices.repository';
import {
  RegisterDeviceDto,
  UserDevicePublicDto,
  UserDeviceResponseDto,
} from '../dto/device.dto';
import { DevicesMapper } from '../mappers/devices.mapper';

@Injectable()
export class DevicesService {
  constructor(private readonly devicesRepository: DevicesRepository) {}

  register(
    userId: string,
    dto: RegisterDeviceDto,
  ): Promise<UserDeviceResponseDto> {
    return this.devicesRepository
      .upsertForUser(userId, dto)
      .then((device) => DevicesMapper.toResponse(device));
  }

  listMine(userId: string): Promise<UserDeviceResponseDto[]> {
    return this.devicesRepository
      .listByUserId(userId)
      .then((devices) =>
        devices.map((device) => DevicesMapper.toResponse(device)),
      );
  }

  async listPublicByUserId(userId: string): Promise<UserDevicePublicDto[]> {
    const exists = await this.devicesRepository.userExists(userId);
    if (!exists) {
      throw new NotFoundException('User not found');
    }
    const devices = await this.devicesRepository.listByUserId(userId);
    return devices.map((device) => DevicesMapper.toPublic(device));
  }

  async remove(userId: string, devicePkId: string): Promise<void> {
    const removed = await this.devicesRepository.deleteOwned(
      devicePkId,
      userId,
    );
    if (!removed) {
      throw new NotFoundException('Device not found');
    }
  }
}
