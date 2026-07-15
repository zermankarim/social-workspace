import { Module } from '@nestjs/common';
import { DevicesController } from './controllers/devices.controller';
import { DevicesService } from './services/devices.service';
import { DevicesRepository } from './repositories/devices.repository';

@Module({
  controllers: [DevicesController],
  providers: [DevicesService, DevicesRepository],
  exports: [DevicesService],
})
export class DevicesModule {}
