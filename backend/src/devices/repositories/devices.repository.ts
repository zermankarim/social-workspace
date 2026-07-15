import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  userDeviceSelect,
  UserDeviceSelected,
} from '../../conversations/conversations.select';
import { RegisterDeviceDto } from '../dto/device.dto';

@Injectable()
export class DevicesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string): Promise<UserDeviceSelected | null> {
    return this.prisma.userDevice.findUnique({
      where: { id },
      select: userDeviceSelect,
    });
  }

  findOwnedByDeviceId(
    userId: string,
    deviceId: string,
  ): Promise<UserDeviceSelected | null> {
    return this.prisma.userDevice.findUnique({
      where: {
        userId_deviceId: { userId, deviceId },
      },
      select: userDeviceSelect,
    });
  }

  listByUserId(userId: string): Promise<UserDeviceSelected[]> {
    return this.prisma.userDevice.findMany({
      where: { userId },
      select: userDeviceSelect,
      orderBy: { lastSeenAt: 'desc' },
    });
  }

  upsertForUser(
    userId: string,
    dto: RegisterDeviceDto,
  ): Promise<UserDeviceSelected> {
    return this.prisma.userDevice.upsert({
      where: {
        userId_deviceId: { userId, deviceId: dto.deviceId },
      },
      create: {
        userId,
        deviceId: dto.deviceId,
        identityKeyPub: dto.identityKeyPub,
        signedPreKeyPub: dto.signedPreKeyPub,
        signedPreKeyId: dto.signedPreKeyId,
      },
      update: {
        identityKeyPub: dto.identityKeyPub,
        signedPreKeyPub: dto.signedPreKeyPub,
        signedPreKeyId: dto.signedPreKeyId,
        lastSeenAt: new Date(),
      },
      select: userDeviceSelect,
    });
  }

  deleteOwned(id: string, userId: string): Promise<boolean> {
    return this.prisma.userDevice
      .deleteMany({
        where: { id, userId },
      })
      .then((result) => result.count > 0);
  }

  userExists(userId: string): Promise<boolean> {
    return this.prisma.user
      .findUnique({ where: { id: userId }, select: { id: true } })
      .then((user) => user !== null);
  }
}
