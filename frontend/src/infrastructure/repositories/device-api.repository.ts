import type { RegisterDeviceInput } from "@/core/domain/entities/register-device-input.entity";
import type { UserDevice } from "@/core/domain/entities/user-device.entity";
import type { UserDevicePublic } from "@/core/domain/entities/user-device-public.entity";
import { DeviceRepository } from "@/core/domain/repositories/device.repository";
import type {
  RegisterDeviceRequestDto,
  UserDevicePublicResponseDto,
  UserDeviceResponseDto,
} from "@/infrastructure/api/dto/device-response.dto";
import type { HttpClient } from "@/infrastructure/http/http-client";
import { DeviceMapper } from "@/infrastructure/mappers/device.mapper";

export class DeviceApiRepository extends DeviceRepository {
  constructor(private readonly httpClient: HttpClient) {
    super();
  }

  async register(input: RegisterDeviceInput): Promise<UserDevice> {
    const body: RegisterDeviceRequestDto = {
      deviceId: input.deviceId,
      identityKeyPub: input.identityKeyPub,
      signedPreKeyPub: input.signedPreKeyPub,
      signedPreKeyId: input.signedPreKeyId,
    };
    const response = await this.httpClient.request<UserDeviceResponseDto>(
      "/devices",
      { method: "POST", body },
    );
    return DeviceMapper.fromApi(response);
  }

  async findMine(): Promise<UserDevice[]> {
    const response =
      await this.httpClient.request<UserDeviceResponseDto[]>("/devices/me");
    return response.map((item) => DeviceMapper.fromApi(item));
  }

  async findPublicByUserId(userId: string): Promise<UserDevicePublic[]> {
    const response = await this.httpClient.request<
      UserDevicePublicResponseDto[]
    >(`/devices/by-user/${userId}`);
    return response.map((item) => DeviceMapper.publicFromApi(item));
  }

  async remove(id: string): Promise<void> {
    await this.httpClient.request<void>(`/devices/${id}`, { method: "DELETE" });
  }
}
