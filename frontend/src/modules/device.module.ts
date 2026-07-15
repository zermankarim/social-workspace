import { DeviceService } from "@/core/application/services/device.service";
import type { HttpClient } from "@/infrastructure/http/http-client";
import { DeviceApiRepository } from "@/infrastructure/repositories/device-api.repository";

export class DeviceModule {
  static create(httpClient: HttpClient): DeviceService {
    return new DeviceService(new DeviceApiRepository(httpClient));
  }
}
